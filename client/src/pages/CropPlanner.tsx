import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarCheck,
  Sparkles,
  Loader2,
  AlertCircle,
  History,
  TrendingUp,
  MapPin,
  CircleDollarSign,
  Users
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { generateCropPlanApi, fetchAdvisoryHistory } from '../api/advisories';
import { CropAdvisory } from '../types';
import { CropPlanResultView } from '../components/CropPlanResultView';

const cropPlanSchema = z.object({
  plotId: z.string().optional(),
  state: z.string().min(2, 'State is required'),
  district: z.string().min(2, 'District is required'),
  season: z.enum(['Kharif', 'Rabi', 'Zaid']),
  sizeAcres: z.coerce.number().positive(),
  soilType: z.string(),
  organicCarbon: z.string(),
  irrigation: z.string(),
  budgetInr: z.coerce.number().nonnegative(),
  laborAvailability: z.enum(['Family Only', 'Moderate Hired', 'Severe Shortage'])
});

type CropPlanFormData = z.infer<typeof cropPlanSchema>;

export const CropPlanner: React.FC = () => {
  const { user, plots, selectedPlot, setSelectedPlot } = useFarm();
  const [advisory, setAdvisory] = useState<CropAdvisory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<CropAdvisory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CropPlanFormData>({
    resolver: zodResolver(cropPlanSchema),
    defaultValues: {
      plotId: selectedPlot?.id || (plots[0]?.id ?? ''),
      state: user?.state || 'Maharashtra',
      district: user?.district || 'Ahmednagar',
      season: 'Kharif',
      sizeAcres: selectedPlot?.size_acres || 3.0,
      soilType: selectedPlot?.soil_type || 'black_cotton',
      organicCarbon: selectedPlot?.organic_carbon_status || 'low',
      irrigation: selectedPlot?.irrigation_type || 'drip',
      budgetInr: 35000,
      laborAvailability: 'Family Only'
    }
  });

  const handlePlotSelect = (plotId: string) => {
    const plot = plots.find(p => p.id === plotId);
    if (plot) {
      setSelectedPlot(plot);
      setValue('plotId', plot.id);
      setValue('sizeAcres', plot.size_acres);
      setValue('soilType', plot.soil_type);
      setValue('organicCarbon', plot.organic_carbon_status);
      setValue('irrigation', plot.irrigation_type);
    }
  };

  const onSubmit = async (data: CropPlanFormData) => {
    try {
      setIsGenerating(true);
      setErrorMessage(null);
      const res = await generateCropPlanApi(data);
      setAdvisory(res);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate crop plan. Please check parameters.');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadHistory = async () => {
    try {
      const hist = await fetchAdvisoryHistory();
      setHistoryList(hist);
      setShowHistory(true);
    } catch (e) {
      console.warn('Could not load history:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <CalendarCheck className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Agro-Climatic Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Dynamic Climate-Adaptive Crop Planner
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Simulate monsoon risk, drought vulnerability, and commodity prices to generate optimal seed portfolios with seed-to-harvest net profit projections.
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="flex items-center space-x-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <History className="w-4 h-4 text-emerald-400" />
          <span>Past Advisories</span>
        </button>
      </div>

      {/* Input Form Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Farm Planning Parameters</span>
        </h2>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-800 text-xs text-red-200 rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Plot Selector Strip */}
          {plots.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Farm Plot (Auto-populates soil & irrigation)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {plots.map((p) => {
                  const isCur = watch('plotId') === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => handlePlotSelect(p.id)}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        isCur
                          ? 'bg-emerald-950/40 border-emerald-500 shadow-glow-green ring-1 ring-emerald-500'
                          : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-white truncate">{p.plot_name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {p.size_acres} Acres • {p.irrigation_type}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Season, District, State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Season *
              </label>
              <select
                {...register('season')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Kharif">Kharif (Monsoon Season)</option>
                <option value="Rabi">Rabi (Winter Season)</option>
                <option value="Zaid">Zaid (Summer Season)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                District *
              </label>
              <input
                type="text"
                {...register('district')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.district && (
                <p className="text-[11px] text-red-400 mt-1">{errors.district.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                State *
              </label>
              <input
                type="text"
                {...register('state')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Size, Soil, Irrigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Plot Size (Acres) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('sizeAcres')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Soil Type
              </label>
              <select
                {...register('soilType')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="black_cotton">Black Cotton Soil</option>
                <option value="alluvial">Alluvial Loam</option>
                <option value="red_sandy">Red Sandy Loam</option>
                <option value="laterite">Laterite Soil</option>
                <option value="clay">Heavy Clay</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Irrigation Security
              </label>
              <select
                {...register('irrigation')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="drip">Drip / Micro-Sprinkler</option>
                <option value="canal">Canal Command</option>
                <option value="borewell">Borewell</option>
                <option value="open_well">Open Well / Pond</option>
                <option value="rainfed">Strictly Rainfed</option>
              </select>
            </div>
          </div>

          {/* Budget & Labor Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Working Capital Budget (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">₹</span>
                <input
                  type="number"
                  placeholder="35000"
                  {...register('budgetInr')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Farm Labor Availability *
              </label>
              <select
                {...register('laborAvailability')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Family Only">Family Only (0-2 persons)</option>
                <option value="Moderate Hired">Moderate (Hired during peak weeding/harvest)</option>
                <option value="Severe Shortage">Severe Shortage (Low labor dependency required)</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white rounded-2xl text-sm font-bold shadow-glow-green transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating Agro-Climatic Models with Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Climate-Adaptive Crop Plan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Result Display */}
      {advisory && (
        <CropPlanResultView advisory={advisory} />
      )}

      {/* Past Advisories Drawer */}
      {showHistory && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>Previously Generated Advisories</span>
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {historyList.map((hist, idx) => (
              <div
                key={idx}
                onClick={() => setAdvisory(hist)}
                className="bg-slate-800/60 hover:bg-slate-800 p-4 rounded-2xl border border-slate-700/80 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">
                    {hist.season} Season Advisory
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {hist.recommendedCrops?.map((c: any) => c.cropName).join(', ')}
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">
                  View Advisory →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
