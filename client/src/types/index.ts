export type Language = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'kn';

export interface UserProfile {
  id: string;
  full_name: string;
  phone_number: string;
  state: string;
  district: string;
  taluka_block?: string;
  preferred_language: Language;
  total_land_acres: number;
  created_at: string;
}

export interface Plot {
  id: string;
  user_id: string;
  plot_name: string;
  size_acres: number;
  irrigation_type: 'rainfed' | 'borewell' | 'canal' | 'drip' | 'open_well';
  soil_type: 'black_cotton' | 'alluvial' | 'red_sandy' | 'laterite' | 'clay' | 'saline';
  organic_carbon_status: 'low' | 'medium' | 'high';
  soil_ph: number;
  current_crop?: string;
  sowing_date?: string;
  created_at: string;
}

export interface RecommendedCrop {
  cropName: string;
  varietyRecommended: string;
  croppingPattern: string;
  durationDays: number;
  seedRequirementPerAcre: string;
  irrigationRequirementLevel: 'Low' | 'Medium' | 'High';
  estimatedCostPerAcreINR: number;
  projectedYieldQuintalsPerAcre: number;
  estimatedNetProfitINR: number;
  resilienceFeatures: string;
  keyRisks: string[];
}

export interface CropAdvisory {
  id?: string;
  advisoryId?: string;
  season?: string;
  agroClimaticAssessment: string;
  climateRiskIndex: number;
  waterBudgetingNote: string;
  recommendedCrops: RecommendedCrop[];
  criticalFarmerAdvisories: string[];
  totalEstimatedCost?: number;
  expectedNetMargin?: number;
  climateRiskScore?: number;
  created_at?: string;
}

export interface PestRemedy {
  method: string;
  preparation: string;
  applicationTiming: string;
}

export interface ChemicalRemedy {
  activeChemicalName: string;
  dosagePerLiterWater: string;
  safetyWaitingPeriodDays: number;
  applicationCaution: string;
}

export interface PestDiagnosis {
  diagnosisId?: string;
  cropName: string;
  diagnosisName: string;
  pathogenType: string;
  confidenceScorePercent: number;
  severityLevel: 'low' | 'moderate' | 'high' | 'critical' | 'Low' | 'Moderate' | 'High' | 'Critical';
  symptomSummary: string;
  organicRemedies: PestRemedy[];
  chemicalRemedies: ChemicalRemedy[];
  preventativeMeasuresNextSeason: string[];
  created_at?: string;
}

export interface FertilizerPlan {
  planId?: string;
  targetCrop: string;
  sizeAcres: number;
  totalChemicalBags: {
    dap50kg: number;
    urea45kg: number;
    mop50kg: number;
    zincSulphateKg: number;
  };
  splitSchedule: {
    stage: string;
    timingDays: string;
    dapBags: number;
    ureaBags: number;
    mopBags: number;
    zincKg: number;
    instructions: string;
  }[];
  organicCarbonAmendments: {
    currentStatus: string;
    targetLevel: string;
    soilPhAnalysis: string;
    remediationPractices: {
      item: string;
      recommendedDosage: string;
      benefit: string;
    }[];
  };
  estimatedInputCostINR: number;
}

export interface MandiPrice {
  id: string;
  market_name: string;
  district: string;
  state: string;
  commodity: string;
  variety?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  price_date: string;
}

export interface SchemeInfo {
  id: string;
  code: string;
  name: string;
  category: 'direct_benefit' | 'insurance' | 'credit' | 'subsidy' | 'soil_health';
  benefitSummary: string;
  estimatedAnnualBenefitINR: number;
  eligibilityConditions: string[];
  requiredDocuments: string[];
  matchScorePercent: number;
  applicationUrl: string;
  nodalContact: string;
  isEligible: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  messageText: string;
  distressFlag?: boolean;
  actionablePayload?: any;
  createdAt: string;
}
