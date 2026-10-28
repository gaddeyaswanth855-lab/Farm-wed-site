export const CROP_PLANNER_PROMPT = (data: {
  district: string;
  state: string;
  season: string;
  sizeAcres: number;
  soilType: string;
  organicCarbon: string;
  irrigation: string;
  budgetInr: number;
  laborAvailability: string;
}) => `
Analyze the agro-climatic profile for a smallholder farm with the following parameters:
- Location: ${data.district}, ${data.state}
- Season: ${data.season}
- Plot Size: ${data.sizeAcres} Acres
- Soil Characteristics: ${data.soilType} soil with ${data.organicCarbon} organic carbon levels
- Irrigation Security: ${data.irrigation}
- Financial Working Capital: INR ${data.budgetInr}
- Labor Availability: ${data.laborAvailability}

Evaluate monsoon/weather reliability, drought vulnerability, and market price trends for this agro-ecological zone. Recommend an optimized crop portfolio comprising up to 3 viable options (ranging from low-risk resilient food crops to high-value intercropping). Calculate realistic input expenses, water budgeting, and conservative net profit margins in Indian Rupee (INR ₹) and Quintals.
`;

export const cropPlannerResponseSchema = {
  type: "object",
  properties: {
    agroClimaticAssessment: { type: "string" },
    climateRiskIndex: { type: "integer", description: "Risk rating from 1 (very safe) to 10 (extreme climate vulnerability)" },
    waterBudgetingNote: { type: "string" },
    recommendedCrops: {
      type: "array",
      items: {
        type: "object",
        properties: {
          cropName: { type: "string" },
          varietyRecommended: { type: "string" },
          croppingPattern: { type: "string", description: "e.g., Sole crop, Intercropping with Pigeonpea (4:2)" },
          durationDays: { type: "integer" },
          seedRequirementPerAcre: { type: "string" },
          irrigationRequirementLevel: { type: "string", enum: ["Low", "Medium", "High"] },
          estimatedCostPerAcreINR: { type: "number" },
          projectedYieldQuintalsPerAcre: { type: "number" },
          estimatedNetProfitINR: { type: "number" },
          resilienceFeatures: { type: "string" },
          keyRisks: { type: "array", items: { type: "string" } }
        },
        required: [
          "cropName", "varietyRecommended", "croppingPattern", "durationDays",
          "seedRequirementPerAcre", "irrigationRequirementLevel", "estimatedCostPerAcreINR",
          "projectedYieldQuintalsPerAcre", "estimatedNetProfitINR", "resilienceFeatures", "keyRisks"
        ]
      }
    },
    criticalFarmerAdvisories: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["agroClimaticAssessment", "climateRiskIndex", "waterBudgetingNote", "recommendedCrops", "criticalFarmerAdvisories"]
};

// Deterministic Agronomic Model for fallback
export function generateDeterministicCropPlan(data: {
  district: string;
  state: string;
  season: string;
  sizeAcres: number;
  soilType: string;
  organicCarbon: string;
  irrigation: string;
  budgetInr: number;
  laborAvailability: string;
}) {
  const isRainfed = data.irrigation.toLowerCase().includes('rainfed');
  const isKharif = data.season === 'Kharif';
  const isRabi = data.season === 'Rabi';

  const riskScore = isRainfed ? (data.organicCarbon === 'low' ? 7 : 6) : 3;

  let crops = [];

  if (isKharif) {
    crops = [
      {
        cropName: 'Soybean (JS-335 / NRC-37) + Pigeonpea (BDN-711)',
        varietyRecommended: 'JS-335 & BDN-711 (White Tur)',
        croppingPattern: 'Intercropping (4:2 row ratio)',
        durationDays: 125,
        seedRequirementPerAcre: '25 kg Soybean + 3 kg Pigeonpea',
        irrigationRequirementLevel: isRainfed ? 'Low' : 'Medium',
        estimatedCostPerAcreINR: 16500,
        projectedYieldQuintalsPerAcre: 8.5,
        estimatedNetProfitINR: 28500 * data.sizeAcres,
        resilienceFeatures: 'Legume intercropping provides biological nitrogen fixation, mitigating fertilizer cost by ₹2,200/acre and guarding against monsoon dry spells.',
        keyRisks: ['Excessive rains during pod-filling stage', 'Yellow Mosaic Virus (YMV) transmitted by whiteflies']
      },
      {
        cropName: 'Pearl Millet (Bajra - Hybrid GHB-538) + Green Gram',
        varietyRecommended: 'GHB-538 / ICTP-8203 (Drought Hardy)',
        croppingPattern: 'Intercropping (3:1 pattern)',
        durationDays: 85,
        seedRequirementPerAcre: '1.8 kg Bajra + 2 kg Moong',
        irrigationRequirementLevel: 'Low',
        estimatedCostPerAcreINR: 9800,
        projectedYieldQuintalsPerAcre: 11.0,
        estimatedNetProfitINR: 19800 * data.sizeAcres,
        resilienceFeatures: 'Extreme drought tolerance. Requires 40% less water than maize or paddy; excellent grain and dry fodder yield for livestock.',
        keyRisks: ['Downy Mildew in high humidity pockets', 'Grain mold if unseasonal showers hit harvest']
      },
      {
        cropName: 'Cotton (High-Density Bt Hybrid)',
        varietyRecommended: 'RCH-659 / PKV-081',
        croppingPattern: 'Sole crop with Trap Crop (Marigold/Okra border)',
        durationDays: 165,
        seedRequirementPerAcre: '2 packets (450g each)',
        irrigationRequirementLevel: isRainfed ? 'Medium' : 'High',
        estimatedCostPerAcreINR: 23500,
        projectedYieldQuintalsPerAcre: 9.0,
        estimatedNetProfitINR: 42000 * data.sizeAcres,
        resilienceFeatures: 'Deep taproot system accesses subsoil moisture in black soils; attractive cash margin when MSP is secured.',
        keyRisks: ['Pink Bollworm infestation post 60-70 days', 'Late season waterlogging causing boll shed']
      }
    ];
  } else if (isRabi) {
    crops = [
      {
        cropName: 'Bengal Gram / Chickpea (Desi Chana Digvijay)',
        varietyRecommended: 'Phule Vikram / Digvijay',
        croppingPattern: 'Sole Crop with Micro-furrows',
        durationDays: 105,
        seedRequirementPerAcre: '30 kg seed treated with Trichoderma',
        irrigationRequirementLevel: 'Low',
        estimatedCostPerAcreINR: 12500,
        projectedYieldQuintalsPerAcre: 7.8,
        estimatedNetProfitINR: 24500 * data.sizeAcres,
        resilienceFeatures: 'Thrives on residual moisture of Kharif rains; low fertilizer need with high market liquidity at APMC.',
        keyRisks: ['Pod Borer (Helicoverpa armigera)', 'Sudden heat stress in late February causing premature drying']
      },
      {
        cropName: 'Wheat (Bio-fortified Sharbati / HD-2967)',
        varietyRecommended: 'HD-2967 / GW-322',
        croppingPattern: 'Close row planting with Zinc seed priming',
        durationDays: 120,
        seedRequirementPerAcre: '40 kg per acre',
        irrigationRequirementLevel: 'High',
        estimatedCostPerAcreINR: 15200,
        projectedYieldQuintalsPerAcre: 16.5,
        estimatedNetProfitINR: 31000 * data.sizeAcres,
        resilienceFeatures: 'Guaranteed government MSP procurement and staple household food security.',
        keyRisks: ['Terminal heat waves during grain filling', 'Canal roster irregularities']
      }
    ];
  } else {
    crops = [
      {
        cropName: 'Summer Moong (Green Gram - SML-668)',
        varietyRecommended: 'SML-668 / IPM 205-7 (Virat)',
        croppingPattern: 'Short duration catch crop',
        durationDays: 60,
        seedRequirementPerAcre: '10 kg per acre',
        irrigationRequirementLevel: 'Low',
        estimatedCostPerAcreINR: 7500,
        projectedYieldQuintalsPerAcre: 5.5,
        estimatedNetProfitINR: 18500 * data.sizeAcres,
        resilienceFeatures: 'Rapid 60-day turnover adds 40 kg biological Nitrogen per hectare to the soil prior to Kharif sowing.',
        keyRisks: ['Whitefly and Yellow Mosaic Virus in hot dry weather']
      }
    ];
  }

  return {
    agroClimaticAssessment: `Comprehensive agro-meteorological review for ${data.district}, ${data.state} indicates ${isRainfed ? 'elevated dry-spell sensitivity requiring drought-resilient legumes and moisture-trapping cultural practices' : 'adequate irrigation security permitting high-value intercropping and precision nutrient placement'}. Soil carbon status (${data.organicCarbon}) necessitates mandatory organic amendment.`,
    climateRiskIndex: riskScore,
    waterBudgetingNote: isRainfed 
      ? 'Rainfed parcel requires conservation furrow creation every 4 rows and pre-monsoon broad bed furrow (BBF) shaping to harvest 70% runoff.'
      : 'Irrigated plot: deploy pressurized drip or alternate-furrow scheduling to conserve 35-45% canal/borewell energy costs.',
    recommendedCrops: crops,
    criticalFarmerAdvisories: [
      'Treat all seeds with Trichoderma viride (10g/kg) and Rhizobium/Azotobacter culture to prevent soil-borne seedling mortality.',
      'Incorporate 2-3 trolley loads of well-decomposed FYM or 1 tonne vermicompost prior to secondary tillage to raise critical organic carbon.',
      'Purchase crop insurance under PM Fasal Bima Yojana (PMFBY) before cutoff date (premium is only 1.5% to 2% of sum insured).'
    ]
  };
}
