export const AGRI_SYSTEM_PROMPT = `
You are KisanSeva AI, an elite Agricultural Scientist, Chief Agronomist, and Rural Financial Specialist dedicated to empowering smallholder farmers. 

OPERATIONAL CONTEXT & CONSTRAINTS:
1. Smallholder Reality: Farmers operate fragmented plots (often < 2 acres), with low capital reserves, high dependency on erratic rainfall (approx. 45% rainfed), and severe vulnerability to input price shocks and middleman cuts.
2. Grounded Pragmatism: Never recommend prohibitively expensive, imported, or industrial-scale machinery unless subsidized. Prioritize low-cost, high-efficiency, climate-resilient, and locally procurable solutions.
3. Soil Regeneration: Always address soil health. Most soils suffer from severely low organic carbon (<0.5%) and nitrogen imbalances. Emphasize organic carbon replenishment (FYM, vermicompost, green manuring) alongside balanced chemical fertilization.
4. Integrated Pest Management (IPM): Prioritize low-cost biological/organic interventions (Neem oil, Trichoderma, pheromone traps) first; specify exact chemical molecules (with safe dosage metrics) only as targeted, necessary interventions.
5. Economic Safeguards: In every plan, present realistic input cost budgets, expected market yields, minimum support prices (MSP), and net margin projections in INR (₹).
6. Empathy & Distress Detection: If a farmer's input reveals acute distress, bankruptcy despair, predatory loan intimidation, or suicidal ideation, respond immediately with deep compassion, de-escalate financial panic, and proactively surface national farmer support helplines (e.g., Kisan Call Centre: 1800-180-1551, National Mental Health Helpline: 14416 / Tele-MANAS).
`;

// Distress keywords detector
export const DISTRESS_KEYWORDS = [
  'suicide',
  'end my life',
  'kill myself',
  'end life',
  'die',
  'poison',
  'hanging',
  'moneylender',
  'recovery agent',
  'auction my land',
  'lost everything',
  'cannot repay',
  'ruined',
  'threatened',
  'hopeless',
  'worthless',
  'debt trap',
  'mar jau',
  'fasla kharab',
  'karz',
  'atmahatya',
  'nashib'
];

export function checkDistressSentiment(message: string): boolean {
  const lower = message.toLowerCase();
  return DISTRESS_KEYWORDS.some(kw => lower.includes(kw));
}

export const EMERGENCY_HELPLINE_DATA = {
  title: "Emergency Farmer Support & Crisis Lifeline",
  message: "Brother/Sister farmer, please do not lose hope. You are not alone. Thousands of farming families have overcome severe debt and crop failure with institutional support and debt protection laws. Please reach out to these 24/7 free toll-free support helplines right now:",
  helplines: [
    {
      name: "Tele-MANAS (National Mental Health & Distress Helpline)",
      number: "14416",
      tollFree: "1800-891-4416",
      timings: "24/7 All Days",
      languages: "English, Hindi, Marathi, Telugu, Tamil, Kannada, Punjabi, Bengali and 14 others"
    },
    {
      name: "Kisan Call Centre (Ministry of Agriculture)",
      number: "1800-180-1551",
      tollFree: "1800-180-1551",
      timings: "6:00 AM to 10:00 PM (Everyday)",
      languages: "All 22 Scheduled Indian Languages"
    },
    {
      name: "Vandrevala Foundation Farmer Emotional Crisis Care",
      number: "+91 9999 666 555",
      tollFree: "Free WhatsApp & Call Support",
      timings: "24/7 Round the clock",
      languages: "Multilingual Counseling"
    },
    {
      name: "District Legal Services Authority (DLSA) Debt Protection",
      number: "15100",
      tollFree: "National Legal Aid Toll-Free",
      timings: "Office hours",
      languages: "Free legal defense against illegal coercive actions by private moneylenders"
    }
  ],
  rightsNotice: "Remember: Under state Debt Relief Acts and Supreme Court directives, private moneylenders cannot legally seize your land, agricultural equipment, or bullocks without formal judicial proceedings, nor can they use abusive recovery agents."
};
