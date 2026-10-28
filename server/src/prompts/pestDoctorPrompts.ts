export const PEST_DIAGNOSIS_PROMPT = (data: {
  cropName: string;
  plantPart: string[];
  symptomsText: string;
}) => `
Perform a clinical plant pathology diagnosis for:
- Crop: ${data.cropName}
- Affected Organs: ${data.plantPart.join(", ")}
- Observed Symptoms: ${data.symptomsText}

Analyze the provided visual features (if image is attached) and textual indicators. Identify the most probable pathogen or physiological disorder. Specify the contagion risk, damage threshold, biological/organic remediation, and exact chemical rescue spray only if critical. Return the response in strict accordance with the provided JSON schema.
`;

export const pestDiagnosisResponseSchema = {
  type: "object",
  properties: {
    diagnosisName: { type: "string" },
    pathogenType: { 
      type: "string", 
      enum: ["Fungal", "Bacterial", "Viral", "Insect Pest", "Nutritional Deficiency", "Physiological Disorder"] 
    },
    confidenceScorePercent: { type: "integer" },
    severityLevel: { type: "string", enum: ["Low", "Moderate", "High", "Critical"] },
    symptomSummary: { type: "string" },
    organicRemedies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          method: { type: "string" },
          preparation: { type: "string" },
          applicationTiming: { type: "string" }
        },
        required: ["method", "preparation", "applicationTiming"]
      }
    },
    chemicalRemedies: {
      type: "array",
      items: {
        type: "object",
        properties: {
          activeChemicalName: { type: "string" },
          dosagePerLiterWater: { type: "string" },
          safetyWaitingPeriodDays: { type: "integer" },
          applicationCaution: { type: "string" }
        },
        required: ["activeChemicalName", "dosagePerLiterWater", "safetyWaitingPeriodDays", "applicationCaution"]
      }
    },
    preventativeMeasuresNextSeason: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: [
    "diagnosisName", "pathogenType", "confidenceScorePercent", "severityLevel",
    "symptomSummary", "organicRemedies", "chemicalRemedies", "preventativeMeasuresNextSeason"
  ]
};

// Deterministic Plant Pathology Diagnostic Engine
export function generateDeterministicPestDiagnosis(data: {
  cropName: string;
  plantPart: string[];
  symptomsText: string;
}) {
  const text = (data.symptomsText + ' ' + data.cropName).toLowerCase();

  // Pattern detection for common smallholder afflictions
  if (text.includes('yellow') || text.includes('mosaic') || text.includes('curl') || text.includes('whitefly')) {
    return {
      diagnosisName: 'Whitefly Infestation & Leaf Curl / Yellow Mosaic Complex',
      pathogenType: 'Viral',
      confidenceScorePercent: 91,
      severityLevel: 'High',
      symptomSummary: `Foliar chlorosis, upward curling of young tender leaves, stunted internodes, and sticky honeydew secretions indicating high sucking pest vector activity in ${data.cropName}.`,
      organicRemedies: [
        {
          method: 'Neem Seed Kernel Extract (NSKE 5%) / Neem Oil 10,000 PPM',
          preparation: 'Dilute 3ml Neem Oil (10,000 ppm) with 1ml liquid detergent in 1 Liter clean water.',
          applicationTiming: 'Foliar misting in evening hours every 5-7 days focusing on abaxial (underside) leaf surfaces.'
        },
        {
          method: 'Castor Oil Coated Yellow Sticky Traps',
          preparation: 'Affix yellow plastic cardboard sheets coated with tacky natural resin or castor oil at crop canopy height.',
          applicationTiming: 'Install 12-15 traps per acre immediately to disrupt adult whitefly reproduction.'
        }
      ],
      chemicalRemedies: [
        {
          activeChemicalName: 'Diafenthiuron 50% WP or Acetamiprid 20% SP',
          dosagePerLiterWater: 'Diafenthiuron: 1.2g/L or Acetamiprid: 0.3g/L',
          safetyWaitingPeriodDays: 14,
          applicationCaution: 'Do not spray during full bloom to safeguard honeybee pollinators; rotate molecule class to prevent insect resistance.'
        }
      ],
      preventativeMeasuresNextSeason: [
        'Plant 3-4 border rows of dense fodder Sorghum (Jowar) or Maize around perimeter 15 days before main crop.',
        'Use certified virus-resistant or tolerant hybrid seed varieties.'
      ]
    };
  } else if (text.includes('wilt') || text.includes('rot') || text.includes('droop') || text.includes('root')) {
    return {
      diagnosisName: 'Fusarium Vascular Wilt & Root Rot Complex',
      pathogenType: 'Fungal',
      confidenceScorePercent: 88,
      severityLevel: 'Critical',
      symptomSummary: `Vascular browning inside stem vascular bundles, partial or unilateral daytime wilting, root decay, and irreversible plant collapse observed in ${data.cropName}.`,
      organicRemedies: [
        {
          method: 'Trichoderma harzianum / viride Soil Drench',
          preparation: 'Blend 2.5 kg Trichoderma culture with 100 kg well-cured farmyard manure; broadcast or drench 10g/L around root zones.',
          applicationTiming: 'Apply immediately during moist soil conditions; avoid mixing with synthetic copper or fungicides.'
        },
        {
          method: 'Cow Dung-Cow Urine Bio-Enzyme (Jeevadhara)',
          preparation: 'Ferment 10L fresh cow urine, 10kg dung, 2kg jaggery, and 2kg pulse flour in 200L water for 4 days.',
          applicationTiming: 'Apply through irrigation or root drenching at 500ml per affected plant hill.'
        }
      ],
      chemicalRemedies: [
        {
          activeChemicalName: 'Carbendazim 12% + Mancozeb 63% WP (Saaf)',
          dosagePerLiterWater: '2.0 grams per Liter of water',
          safetyWaitingPeriodDays: 20,
          applicationCaution: 'Direct drenching to the collar region and root zone; foliar spraying has negligible systemic root reach.'
        }
      ],
      preventativeMeasuresNextSeason: [
        'Enforce 3-year crop rotation with non-host cereals or millets to starve soil-borne fungal inoculum.',
        'Ensure deep summer ploughing (subsoiling) to expose fungal sclerotia to solar ultraviolet radiation.'
      ]
    };
  } else if (text.includes('worm') || text.includes('caterpillar') || text.includes('hole') || text.includes('borer') || text.includes('tunnel')) {
    return {
      diagnosisName: 'Spodoptera / Helicoverpa Pod & Stem Borer Larval Attack',
      pathogenType: 'Insect Pest',
      confidenceScorePercent: 94,
      severityLevel: 'High',
      symptomSummary: `Circular boreholes, leaf skeletonization, droppings/frass accumulated near buds, and chewed fruit/pods in ${data.cropName}.`,
      organicRemedies: [
        {
          method: 'Bacillus thuringiensis (Bt) kurstaki bio-insecticide',
          preparation: 'Suspend 2g/L of Bt powder in water; ingestible biological toxin that lyses larval midguts without harming beneficial insects.',
          applicationTiming: 'Apply during twilight hours when 1st and 2nd instar larvae emerge to feed.'
        },
        {
          method: 'Helilure / Spodolure Pheromone Traps & Bird Perches',
          preparation: 'Install 5 funnel traps per acre with species-specific female sex pheromone septa; place T-shaped wooden bird perches (15/acre).',
          applicationTiming: 'Erect at flowering onset for continuous mating disruption and natural avian predation.'
        }
      ],
      chemicalRemedies: [
        {
          activeChemicalName: 'Chlorantraniliprole 18.5% SC (Coragen) or Emamectin Benzoate 5% SG',
          dosagePerLiterWater: 'Chlorantraniliprole: 0.3ml/L OR Emamectin Benzoate: 0.4g/L',
          safetyWaitingPeriodDays: 14,
          applicationCaution: 'Target small freshly hatched larvae before they bore internally into bolls or fruit cavities.'
        }
      ],
      preventativeMeasuresNextSeason: [
        'Pheromone trap monitoring for moth counts (action threshold: 8-10 moths/trap for 3 consecutive days).',
        'Intercrop with flowering Marigold to divert egg-laying female moths.'
      ]
    };
  } else {
    // Default Fungal Blight / Spot
    return {
      diagnosisName: 'Alternaria / Cercospora Fungal Leaf Spot & Blight',
      pathogenType: 'Fungal',
      confidenceScorePercent: 86,
      severityLevel: 'Moderate',
      symptomSummary: `Concentric ringed brown lesions ("target board" appearance), necrotic leaf margins, and premature leaf drop in lower canopies of ${data.cropName}.`,
      organicRemedies: [
        {
          method: 'Pseudomonas fluorescens 1% WP Microbial Spray',
          preparation: 'Mix 10g Pseudomonas powder with 1L water and 2ml botanical sticker.',
          applicationTiming: 'Early morning foliar spray; beneficial bacteria colonize leaf stomata preventing fungal germ tube entry.'
        },
        {
          method: 'Sour Buttermilk (Khatta Chhach) Spray',
          preparation: 'Ferment 5 liters buttermilk with 250g copper piece for 7 days; dilute with 100 liters water.',
          applicationTiming: 'Spray at 10-day intervals as a potent natural antifungal copper-lactic acid barrier.'
        }
      ],
      chemicalRemedies: [
        {
          activeChemicalName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
          dosagePerLiterWater: '1.0 ml per Liter of water',
          safetyWaitingPeriodDays: 15,
          applicationCaution: 'Ensure complete foliar coverage on both upper and lower canopy surfaces.'
        }
      ],
      preventativeMeasuresNextSeason: [
        'Destroy and compost infected crop residues rather than leaving them on soil surface.',
        'Adopt wider row-to-row spacing to promote air circulation and reduce leaf wetness duration.'
      ]
    };
  }
}
