# KisanSeva AI (किसानसेवा AI) 🌾
### AI-Powered Agriculture Advisory, Multimodal Pest Doctor & Climate-Resilient Farming Platform

**KisanSeva AI** is an agronomic co-pilot and climate-resilience platform engineered for smallholder farmers across India. It addresses erratic monsoon risks, post-harvest distress selling, crop diseases, and fertilizer imbalances through multimodal AI models, localized regional agronomy data, real-time APMC Mandi price tracking, and institutional welfare schemes.

---

## 🌟 Key Capabilities & Modules

1. **Climate-Adaptive Crop Planner** (`/crop-planner`):
   - Multi-plot agronomy portfolio planner.
   - Recommends drought-hardy seed varieties, biological intercropping patterns (e.g. Cotton + Pigeonpea 6:1), water budgeting, and net margin forecasts.

2. **Multimodal Pest & Pathogen Doctor** (`/pest-doctor`):
   - Visual diagnosis from leaf & damage photos or symptoms described via voice/text.
   - Three-tiered Integrated Pest Management (IPM): Biological bio-control (Neem NSKE 5%, Trichoderma), CIBRC registered chemical rescue sprays with waiting periods, and preventative soil measures.
   - Text-to-speech voice readout in regional mother tongues.

3. **Soil Doctor & Precision Fertilizer Bag Calculator** (`/soil-fertility`):
   - Translates Soil Health Card NPK and pH ratings into exact commercial bag requirements for DAP (50kg), Urea (45kg), MOP (50kg), and Zinc Sulphate (kg).
   - Generates stage-wise split application schedules (Basal, Vegetative, Flowering/Pod formation) to prevent nitrogen leaching and leaf burn.
   - Provides organic carbon remediation practices (FYM, green manuring, biofertilizers).

4. **Live Mandi Rates & Inter-Market Transit Arbitrage** (`/mandi-prices`):
   - Real-time modal price feeds across Indian APMC yards.
   - **Transit Arbitrage Calculator**: Computes whether transporting produce to a terminal APMC is profitable after deducting freight (₹3.20/q/km), handling & APMC cess (₹55/q), and 2% moisture shrinkage.
   - **Cold Storage Breakeven Calculator**: Analyzes storage rent and 7% KCC opportunity interest vs off-season price surges, with e-NWR warehouse receipt pledge financing (75% loan advance).

5. **Government Schemes & Concessional Credit** (`/schemes-credit`):
   - Direct benefits screening: PM-KISAN, Kisan Credit Card (KCC) 4% interest subvention, PMFBY crop insurance, PM-KUSUM 60% solar pump subsidies.
   - Pre-filled eligibility checklists and statutory RBI calamity debt restructuring protections.

6. **Post-Harvest Shield** (`/post-harvest`):
   - Hermetic storage (Pusa Bin, GrainPro, botanical neem oil barriers).
   - Fair Average Quality (FAQ) moisture benchmarks (<12% cereals, <9% oilseeds).
   - Minimum Support Price (MSP) registration & procurement centers (FCI, NAFED, CCI).

7. **Kisan Bandhu Voice AI Assistant** (`/assistant`):
   - Voice-enabled conversational assistant in English, Hindi, Marathi, Telugu, Tamil, and Kannada.
   - Automatic emotional/financial distress sentiment detection with immediate one-tap 24/7 crisis lifelines (Tele-MANAS: 14416 & Kisan Call Centre: 1800-180-1551).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, React Router v6, TanStack Query, Web Speech API (Voice input & Speech synthesis).
- **Backend**: Node.js, Express, TypeScript, Zod schema validation, Helmet, CORS.
- **AI Engine**: Google Gemini API (`@google/genai`) with fallback deterministic agronomic engines.
- **Database**: PostgreSQL (pg) with embedded local file store fallback for offline and low-resource environments.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/gaddeyaswanth855-lab/Farm-wed-site.git
cd Farm-wed-site
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Environment Setup
Configure the environment variables in `server/.env`:
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=
PGSSLMODE=disable
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_secret_key_here
CORS_ORIGIN=http://localhost:5173
```

### 4. Running the Development Server
Start both backend API and Vite client concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api/v1`
- Health check: `http://localhost:5000/health`

### 5. Production Build
```bash
npm run build
```

---

## 📄 License
This project is open-source and created for empowering smallholder farmers and agricultural communities.
