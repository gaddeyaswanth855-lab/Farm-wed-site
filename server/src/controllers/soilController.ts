import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { fertilizerPlanSchema } from '../validators/agriSchemas.js';

interface CropNutrientStandard {
  n: number;
  p: number;
  k: number;
  zincKg: number;
  durationDays: number;
}

const CROP_BENCHMARKS: Record<string, CropNutrientStandard> = {
  'cotton': { n: 48, p: 24, k: 24, zincKg: 10, durationDays: 160 },
  'soybean': { n: 12, p: 24, k: 16, zincKg: 8, durationDays: 100 },
  'paddy': { n: 40, p: 20, k: 20, zincKg: 10, durationDays: 130 },
  'wheat': { n: 48, p: 24, k: 16, zincKg: 10, durationDays: 120 },
  'maize': { n: 48, p: 24, k: 20, zincKg: 10, durationDays: 110 },
  'chickpea': { n: 10, p: 20, k: 10, zincKg: 5, durationDays: 105 },
  'onion': { n: 40, p: 20, k: 40, zincKg: 8, durationDays: 130 },
  'tomato': { n: 60, p: 40, k: 40, zincKg: 10, durationDays: 140 },
  'sugarcane': { n: 100, p: 40, k: 40, zincKg: 15, durationDays: 360 },
  'default': { n: 35, p: 20, k: 20, zincKg: 8, durationDays: 120 }
};

export async function calculateFertilizerPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const validated = fertilizerPlanSchema.parse(req.body);

    const cropKey = validated.targetCrop.toLowerCase();
    const benchmark = Object.entries(CROP_BENCHMARKS).find(([k]) => cropKey.includes(k))?.[1] || CROP_BENCHMARKS.default;

    // Adjust based on soil test ratings
    const adjustFactor = (rating: string) => {
      if (rating === 'Low') return 1.25; // +25%
      if (rating === 'High') return 0.80; // -20%
      return 1.0; // Medium
    };

    const targetNPerAcre = benchmark.n * adjustFactor(validated.nitrogenRating);
    const targetPPerAcre = benchmark.p * adjustFactor(validated.phosphorusRating);
    const targetKPerAcre = benchmark.k * adjustFactor(validated.potassiumRating);

    const totalN = targetNPerAcre * validated.sizeAcres;
    const totalP = targetPPerAcre * validated.sizeAcres;
    const totalK = targetKPerAcre * validated.sizeAcres;

    // Fertilizer Bag Mathematics
    // DAP (50kg bag) contains 18% N and 46% P2O5 = 9 kg N and 23 kg P2O5 per bag
    const dapBags = Math.ceil(totalP / 23);
    const nFromDap = dapBags * 9;

    // Remaining N supplied by Urea (45kg bag contains 46% N = 20.7 kg N)
    const remainingN = Math.max(0, totalN - nFromDap);
    const ureaBags = Math.ceil(remainingN / 20.7);

    // MOP (50kg bag contains 60% K2O = 30 kg K2O)
    const mopBags = Math.ceil(totalK / 30);

    // Micronutrient
    const zincSulphateKg = Math.ceil(benchmark.zincKg * validated.sizeAcres);

    // Cost estimation (Subsidized Central Indian Rates)
    // DAP ₹1350/bag, Urea ₹266.50/bag, MOP ₹1700/bag, Zinc ₹75/kg
    const estCostDAP = dapBags * 1350;
    const estCostUrea = ureaBags * 266.5;
    const estCostMOP = mopBags * 1700;
    const estCostZinc = zincSulphateKg * 75;
    const totalFertilizerCost = Math.round(estCostDAP + estCostUrea + estCostMOP + estCostZinc);

    // Split Dosage Schedule
    const basalSchedule = {
      stage: 'Basal Application (At Sowing / Final Land Preparation)',
      timingDays: 'Day 0',
      dapBags: dapBags,
      ureaBags: Math.round(ureaBags * 0.25 * 10) / 10,
      mopBags: Math.round(mopBags * 0.5 * 10) / 10,
      zincKg: zincSulphateKg,
      instructions: 'Broadcast and thoroughly incorporate into root zone 5cm below seed placement.'
    };

    const firstTopDressSchedule = {
      stage: '1st Top Dressing (Active Vegetative / Tillering Stage)',
      timingDays: 'Day 25 - 35',
      dapBags: 0,
      ureaBags: Math.round(ureaBags * 0.45 * 10) / 10,
      mopBags: 0,
      zincKg: 0,
      instructions: 'Top dress along crop rows after weeding during moist soil conditions; avoid waterlogged standing water.'
    };

    const secondTopDressSchedule = {
      stage: '2nd Top Dressing (Flowering & Panicle / Boll Initiation)',
      timingDays: 'Day 55 - 65',
      dapBags: 0,
      ureaBags: Math.round(ureaBags * 0.30 * 10) / 10,
      mopBags: Math.round(mopBags * 0.5 * 10) / 10,
      zincKg: 0,
      instructions: 'Apply before light irrigation to fuel grain/fruit formation and prevent premature leaf senescence.'
    };

    // Organic Carbon Restorative Plan
    const isLowCarbon = validated.organicCarbonStatus === 'low';
    const organicAmendments = {
      currentStatus: validated.organicCarbonStatus,
      targetLevel: '> 0.75% Organic Carbon',
      soilPhAnalysis: validated.soilPh > 8.0 
        ? 'Alkaline soil detected: Avoid excessive lime; apply Gypsum (200kg/acre) and elemental sulphur.'
        : validated.soilPh < 6.0 
          ? 'Acidic soil detected: Incorporate agricultural lime / dolomite (150kg/acre).'
          : 'Normal pH buffer range: Optimal nutrient absorption.',
      remediationPractices: [
        {
          item: 'Farmyard Manure (FYM) / Cow Dung Compost',
          recommendedDosage: `${(isLowCarbon ? 3.0 : 1.5) * validated.sizeAcres} Tonnes`,
          benefit: 'Essential microbial food source that re-establishes soil aggregate structure and humus moisture retention.'
        },
        {
          item: 'Vermicompost (Enriched with Trichoderma)',
          recommendedDosage: `${Math.round(400 * validated.sizeAcres)} kg`,
          benefit: 'Provides rich humic acid and worm castings with bio-available trace minerals.'
        },
        {
          item: 'Green Manuring (Sunnhemp / Dhaincha)',
          recommendedDosage: `${20 * validated.sizeAcres} kg seed rate`,
          benefit: 'Incorporate succulent biomass into soil at 45 days flowering stage to sequester 1.2% active carbon.'
        },
        {
          item: 'Bio-Fertilizer Consortium (Azotobacter + PSB + KMB)',
          recommendedDosage: '2 Litres / acre via drip or seed slurry',
          benefit: 'Mobilizes fixed insoluble phosphorus and atmospheric nitrogen, lowering synthetic fertilizer needs by 20%.'
        }
      ]
    };

    const planSummary = {
      targetCrop: validated.targetCrop,
      sizeAcres: validated.sizeAcres,
      totalChemicalBags: {
        dap50kg: dapBags,
        urea45kg: ureaBags,
        mop50kg: mopBags,
        zincSulphateKg: zincSulphateKg
      },
      splitSchedule: [basalSchedule, firstTopDressSchedule, secondTopDressSchedule],
      organicCarbonAmendments: organicAmendments,
      estimatedInputCostINR: totalFertilizerCost
    };

    // Persist to DB
    const insertQuery = `
      INSERT INTO fertilizer_plans (
        user_id, plot_id, target_crop, target_yield_quintals,
        fertilizer_schedule, organic_carbon_amendments, estimated_input_cost
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const result = await db.query(insertQuery, [
      userId,
      validated.plotId || '11111111-1111-4111-a111-111111111111',
      validated.targetCrop,
      validated.targetYieldQuintals || null,
      planSummary.splitSchedule,
      organicAmendments,
      totalFertilizerCost
    ]);

    return res.status(200).json({
      success: true,
      data: {
        planId: result.rows[0].id,
        ...planSummary
      }
    });
  } catch (err) {
    next(err);
  }
}
