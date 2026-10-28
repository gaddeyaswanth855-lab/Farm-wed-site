import React, { useState } from 'react';
import {
  FlaskConical,
  Scale,
  Sparkles,
  Layers,
  Sprout,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Volume2,
  VolumeX,
  Droplets
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useLanguage } from '../context/LanguageContext';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { calculateFertilizerPlanApi } from '../api/advisories';
import { FertilizerPlan, Plot } from '../types';

export const SoilDoctor: React.FC = () => {
  const { plots, selectedPlot, setSelectedPlot } = useFarm();
  const { t } = useLanguage();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const [sizeAcres, setSizeAcres] = useState<number>(selectedPlot ? selectedPlot.size_acres : 3.0);
  const [targetCrop, setTargetCrop] = useState<string>('Cotton');
  const [soilType, setSoilType] = useState<string>(selectedPlot ? selectedPlot.soil_type : 'black_cotton');
  const [nitrogenRating, setNitrogenRating] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [phosphorusRating, setPhosphorusRating] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [potassiumRating, setPotassiumRating] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [organicCarbonRating, setOrganicCarbonRating] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [soilPh, setSoilPh] = useState<number>(selectedPlot ? selectedPlot.soil_ph : 7.4);

  const [isLoading, setIsLoading] = useState(false);
  const [planResult, setPlanResult] = useState<FertilizerPlan | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const crops = [
    'Cotton',
    'Soybean',
    'Paddy (Rice)',
    'Wheat',
    'Maize',
    'Chickpea (Gram)',
    'Onion',
    'Tomato',
    'Sugarcane'
  ];

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const payload = {
        plotId: selectedPlot?.id,
        sizeAcres: Number(sizeAcres),
        targetCrop,
        soilType,
        nitrogenRating,
        phosphorusRating,
        potassiumRating,
        organicCarbonRating,
        soilPh: Number(soilPh)
      };

      const result = await calculateFertilizerPlanApi(payload);
      setPlanResult(result);
    } catch (err: any) {
      console.error('Fertilizer plan error:', err);
      setErrorMessage(err.message || 'Failed to calculate fertilizer recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceReadout = () => {
    if (!planResult) return;
    if (isSpeaking) {
      stop();
    } else {
      const b = planResult.totalChemicalBags;
      const text = `Fertilizer recommendation for ${planResult.sizeAcres} acres of ${planResult.targetCrop}: Total DAP ${b.dap50kg} bags, Urea ${b.urea45kg} bags, MOP ${b.mop50kg} bags, and Zinc Sulphate ${b.zincSulphateKg} kg. Estimated input cost is rupees ${planResult.estimatedInputCostINR}. Split nitrogen in two doses.`;
      speak(text);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-950 border border-cyan-900/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 rounded-full border border-cyan-500/30">
                Soil Health Card Diagnostic & Precision Nutrient Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Soil Doctor & Fertilizer Bag Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Convert soil test NPK values into exact commercial bags (DAP, Urea, MOP) and stage split schedules. Prevent fertilizer wastage and restore soil carbon.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters Form */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleCalculate}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5"
          >
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              <span>Soil Test & Farm Parameters</span>
            </h2>

            {/* Plot Selection */}
            {plots.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Plot to Auto-Fill Data
                </label>
                <select
                  value={selectedPlot?.id || ''}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const p = plots.find((plot: Plot) => plot.id === e.target.value) || null;
                    setSelectedPlot(p);
                    if (p) {
                      setSizeAcres(p.size_acres);
                      setSoilType(p.soil_type);
                      setSoilPh(p.soil_ph);
                      if (p.organic_carbon_status === 'high') setOrganicCarbonRating('High');
                      else if (p.organic_carbon_status === 'medium') setOrganicCarbonRating('Medium');
                      else setOrganicCarbonRating('Low');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Manual Parameter Entry --</option>
                  {plots.map((plot: Plot) => (
                    <option key={plot.id} value={plot.id}>
                      {plot.plot_name} ({plot.size_acres} acres, {plot.soil_type})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Crop & Acreage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Crop *
                </label>
                <select
                  value={targetCrop}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTargetCrop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  {crops.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Plot Size (Acres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={sizeAcres}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSizeAcres(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            {/* Soil Type & pH */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Soil Type
                </label>
                <select
                  value={soilType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSoilType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="black_cotton">Black Cotton</option>
                  <option value="alluvial">Alluvial Loam</option>
                  <option value="red_sandy">Red Sandy</option>
                  <option value="laterite">Laterite</option>
                  <option value="clay">Clay</option>
                  <option value="saline">Saline / Alkaline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Soil pH ({soilPh.toFixed(1)})
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="10.0"
                  value={soilPh}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSoilPh(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* NPK Ratings */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <span className="text-xs font-bold text-slate-300 block">
                Soil Health Card Ratings (Available Nutrients):
              </span>

              {/* Nitrogen */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Available Nitrogen (N):</span>
                <div className="flex space-x-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setNitrogenRating(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        nitrogenRating === lvl
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phosphorus */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Available Phosphorus (P):</span>
                <div className="flex space-x-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setPhosphorusRating(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        phosphorusRating === lvl
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Potassium */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Available Potassium (K):</span>
                <div className="flex space-x-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setPotassiumRating(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        potassiumRating === lvl
                          ? 'bg-cyan-600 text-white border-cyan-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Organic Carbon */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Organic Carbon (OC):</span>
                <div className="flex space-x-1">
                  {(['Low', 'Medium', 'High'] as const).map((lvl) => (
                    <button
                      type="button"
                      key={lvl}
                      onClick={() => setOrganicCarbonRating(lvl)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border transition-all ${
                        organicCarbonRating === lvl
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-950/60 border border-red-800 rounded-xl p-3 text-xs text-red-300 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-cyan-950/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Computing Agronomic Nutrient Dosages...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Calculate Fertilizer Bags</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Presentation */}
        <div className="lg:col-span-7 space-y-6">
          {planResult ? (
            <div className="space-y-6">
              {/* Bag Summary Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {planResult.targetCrop}
                      </span>
                      <span className="text-xs text-slate-400">
                        Acreage: {planResult.sizeAcres} Acres
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                      Required Commercial Fertilizer Bags
                    </h2>
                  </div>

                  <button
                    onClick={handleVoiceReadout}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                      isSpeaking
                        ? 'bg-cyan-600 text-white border-cyan-500 animate-pulse'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-4 h-4" />
                        <span>Stop Voice</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                        <span>Listen Dosage</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 4 Bag Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* DAP */}
                  <div className="bg-slate-950/80 border border-amber-900/40 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      DAP (18:46:0)
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      {planResult.totalChemicalBags?.dap50kg}
                    </div>
                    <span className="text-[10px] text-slate-400">Bags (50 kg each)</span>
                  </div>

                  {/* Urea */}
                  <div className="bg-slate-950/80 border border-emerald-900/40 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Urea (46% N)
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      {planResult.totalChemicalBags?.urea45kg}
                    </div>
                    <span className="text-[10px] text-slate-400">Bags (45 kg each)</span>
                  </div>

                  {/* MOP */}
                  <div className="bg-slate-950/80 border border-rose-900/40 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                      MOP (Potash)
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      {planResult.totalChemicalBags?.mop50kg}
                    </div>
                    <span className="text-[10px] text-slate-400">Bags (50 kg each)</span>
                  </div>

                  {/* Zinc Sulphate */}
                  <div className="bg-slate-950/80 border border-cyan-900/40 rounded-2xl p-4 text-center">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                      Zinc Sulphate
                    </span>
                    <div className="text-3xl font-black text-white mt-1">
                      {planResult.totalChemicalBags?.zincSulphateKg}
                    </div>
                    <span className="text-[10px] text-slate-400">Kg total</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Estimated Total Chemical Input Cost:</span>
                  <span className="text-base font-extrabold text-emerald-400">
                    ₹{planResult.estimatedInputCostINR?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Stage Split Schedule */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <span>Stage-Wise Split Application Schedule</span>
                </h3>

                <div className="space-y-3">
                  {planResult.splitSchedule?.map((stage, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-sm font-bold text-white">
                          Stage {idx + 1}: {stage.stage}
                        </span>
                        <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800/50 rounded-full w-fit">
                          {stage.timingDays}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 bg-slate-900/60 rounded-xl px-3 my-2">
                        <div>
                          <span className="text-slate-400 text-[10px]">DAP:</span>{' '}
                          <span className="font-bold text-amber-300">{stage.dapBags} Bags</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Urea:</span>{' '}
                          <span className="font-bold text-emerald-300">{stage.ureaBags} Bags</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">MOP:</span>{' '}
                          <span className="font-bold text-rose-300">{stage.mopBags} Bags</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px]">Zinc:</span>{' '}
                          <span className="font-bold text-cyan-300">{stage.zincKg} Kg</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-1">
                        {stage.instructions}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organic Carbon & Soil Health Restoration */}
              {planResult.organicCarbonAmendments && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Sprout className="w-5 h-5 text-emerald-400" />
                    <span>Organic Carbon & Microbial Regeneration Plan</span>
                  </h3>

                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-2xl text-xs text-emerald-200">
                    <span className="font-bold block mb-0.5">Soil pH & Carbon Analysis:</span>
                    {planResult.organicCarbonAmendments.soilPhAnalysis}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {planResult.organicCarbonAmendments.remediationPractices?.map((prac, i) => (
                      <div
                        key={i}
                        className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-xs font-bold text-emerald-300">{prac.item}</div>
                          <div className="text-[11px] text-amber-300 font-semibold mt-0.5">
                            Dosage: {prac.recommendedDosage}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {prac.benefit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
                <FlaskConical className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Enter Soil Health Ratings to Calculate
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Provide your target crop and soil test ratings on the left. The engine applies agronomic nutrient uptake equations to prevent nitrogen burning and calculate exact bag requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

