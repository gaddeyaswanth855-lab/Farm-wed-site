import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';

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

export async function matchFarmerSchemes(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [userId]);
    const plotsResult = await db.query(`SELECT * FROM plots WHERE user_id = $1`, [userId]);

    const user = userResult.rows[0] || { state: 'Maharashtra', total_land_acres: 7.5 };
    const plots = plotsResult.rows;
    const totalAcres = Number(user.total_land_acres) || plots.reduce((s: number, p: any) => s + Number(p.size_acres), 0);

    const isSmallholder = totalAcres <= 5.0; // <= 2 hectares (approx 5 acres)
    const hasRainfed = plots.some((p: any) => p.irrigation_type === 'rainfed');
    const hasDrip = plots.some((p: any) => p.irrigation_type === 'drip');

    const schemes: SchemeInfo[] = [
      {
        id: 'scheme-pm-kisan',
        code: 'PM-KISAN',
        name: 'Pradhan Mantri Kisan Samman Nidhi',
        category: 'direct_benefit',
        benefitSummary: '₹6,000 per year directly transferred to bank account in three 4-monthly instalments of ₹2,000.',
        estimatedAnnualBenefitINR: 6000,
        eligibilityConditions: [
          'All landholding farmer families with cultivable land in their names.',
          'Not paying income tax in last assessment year.',
          'Bank account must be Aadhaar-seeded with active e-KYC.'
        ],
        requiredDocuments: [
          'Aadhaar Card (Linked with Mobile number)',
          'Land Ownership Record (7/12 extract / Khasra / Khatoni)',
          'Bank Passbook showing active IFSC code',
          'Self-declaration of citizenship & tax status'
        ],
        matchScorePercent: 98,
        applicationUrl: 'https://pmkisan.gov.in',
        nodalContact: 'PM-KISAN Toll-Free: 155261 / 011-24300606',
        isEligible: true
      },
      {
        id: 'scheme-kcc',
        code: 'KCC-MISS',
        name: 'Kisan Credit Card & 4% Concessional Crop Loan',
        category: 'credit',
        benefitSummary: 'Short-term production credit up to ₹3,00,000 at an effective interest rate of only 4.0% p.a. (7% base minus 3% prompt repayment incentive).',
        estimatedAnnualBenefitINR: 18000,
        eligibilityConditions: [
          'Owner cultivators, tenant farmers, oral lessees & sharecroppers.',
          'Loan limit calculated based on scale of finance per acre for designated crops.',
          'Atm-enabled RuPay Kisan Credit Card for flexible cash withdrawal.'
        ],
        requiredDocuments: [
          'Duly completed Loan Application Form',
          'Two passport size photographs',
          'Proof of Identity & Address (Aadhaar / Voter ID)',
          'Land Record certificate / Patta / Revenue passbook certified by Revenue Patwari',
          'No Due Certificate (NDC) from local nationalized / cooperative banks'
        ],
        matchScorePercent: 95,
        applicationUrl: 'https://myscheme.gov.in/schemes/kcc',
        nodalContact: 'NABARD Rural Credit Cell: 1800-222-000',
        isEligible: true
      },
      {
        id: 'scheme-pmfby',
        code: 'PMFBY',
        name: 'Pradhan Mantri Fasal Bima Yojana (Crop Insurance)',
        category: 'insurance',
        benefitSummary: 'Comprehensive safety net against non-preventable natural risks (drought, flood, unseasonal hail, pest outbreak). Farmer premium capped at only 2.0% for Kharif and 1.5% for Rabi.',
        estimatedAnnualBenefitINR: 25000,
        eligibilityConditions: [
          'Notified crops in notified insurance units/villages.',
          'Coverage commences from prevented sowing to 14 days post-harvest localized losses.',
          'Mandatory intimation within 72 hours of localized calamity via Crop Insurance App.'
        ],
        requiredDocuments: [
          'Sowing Certificate / Sowing declaration issued by Village Officer / Patwari',
          'Land possession certificate / Record of Rights',
          'Bank Account details with bank branch seal',
          'Aadhaar Number'
        ],
        matchScorePercent: 92,
        applicationUrl: 'https://pmfby.gov.in',
        nodalContact: 'PMFBY Helpline: 14447 (Toll-Free)',
        isEligible: true
      },
      {
        id: 'scheme-kusum',
        code: 'PM-KUSUM',
        name: 'PM-KUSUM Solar Irrigation Pump Subsidy',
        category: 'subsidy',
        benefitSummary: 'Up to 60% capital subsidy (30% Central + 30% State Govt) plus 30% low-interest bank loan to install 3 HP to 10 HP solar water pumps, eliminating diesel generator expenses.',
        estimatedAnnualBenefitINR: 42000,
        eligibilityConditions: [
          'Farmers with groundwater borewell or surface pond lacking reliable grid electricity.',
          'Farmers with existing micro-irrigation (drip/sprinkler) receive priority sanction.',
          'Farmer contributes only 10% of total system cost upfront.'
        ],
        requiredDocuments: [
          'Aadhaar & Identity Verification',
          'Electricity department NOC confirming non-existence of agricultural grid connection',
          'Water source verification report (Borewell depth & yield certificate)',
          'Bank statement of margin money account'
        ],
        matchScorePercent: hasRainfed || !hasDrip ? 88 : 75,
        applicationUrl: 'https://pmkusum.mnre.gov.in',
        nodalContact: 'Ministry of New & Renewable Energy: 1800-180-3333',
        isEligible: true
      },
      {
        id: 'scheme-smam',
        code: 'SMAM',
        name: 'Sub-Mission on Agricultural Mechanization (Farm Machinery Subsidy)',
        category: 'subsidy',
        benefitSummary: '40% to 50% direct subsidy for purchase of modern agricultural implements (Tractors, Rotavators, Power Weeders, Multi-crop Threshers, Laser Levelers).',
        estimatedAnnualBenefitINR: 35000,
        eligibilityConditions: [
          'Priority given to Small & Marginal Farmers (holding < 5 acres), women farmers, and SC/ST farmers.',
          'Must purchase equipment from empanelled certified manufacturers.'
        ],
        requiredDocuments: [
          'Land Holding Certificate from Talathi / Tehsildar',
          'Caste certificate (if claiming affirmative category subsidy)',
          'Bank Passbook copy',
          'Valid Driving License (for tractor subsidy applications)'
        ],
        matchScorePercent: isSmallholder ? 90 : 70,
        applicationUrl: 'https://agrimachinery.nic.in',
        nodalContact: 'Directorate of Agricultural Engineering State Cell',
        isEligible: true
      },
      {
        id: 'scheme-pkvy',
        code: 'PKVY',
        name: 'Paramparagat Krishi Vikas Yojana (Organic Farming Subsidy)',
        category: 'soil_health',
        benefitSummary: 'Financial assistance of ₹50,000 per hectare over 3 years: ₹31,000 for on-farm organic inputs (vermicompost, bio-pesticides) and ₹8,800 for PGS-India organic certification & branding.',
        estimatedAnnualBenefitINR: 20000,
        eligibilityConditions: [
          'Cluster of 50 or more farmers forming 50 acres contiguous area.',
          'Willingness to transition away from synthetic chemical inputs over 36-month conversion window.'
        ],
        requiredDocuments: [
          'Aadhaar card copy',
          'Farmer Cluster Enrollment Form',
          'Soil Health Card before chemical disuse',
          'Village Panchayat Resolution of cluster formation'
        ],
        matchScorePercent: 82,
        applicationUrl: 'https://pgsindia-ncof.gov.in',
        nodalContact: 'Regional Centre of Organic Farming (NCOF)',
        isEligible: true
      }
    ];

    const totalPotentialBenefits = schemes
      .filter(s => s.isEligible)
      .reduce((sum, s) => sum + s.estimatedAnnualBenefitINR, 0);

    return res.status(200).json({
      success: true,
      data: {
        totalPotentialBenefitsINR: totalPotentialBenefits,
        matchedSchemesCount: schemes.length,
        farmerContext: {
          name: user.full_name,
          state: user.state,
          district: user.district,
          totalAcres,
          category: isSmallholder ? 'Small & Marginal Farmer (< 5 Acres)' : 'Medium Cultivator'
        },
        schemes
      }
    });
  } catch (err) {
    next(err);
  }
}
