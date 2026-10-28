import React from 'react';
import {
  ShieldAlert,
  Sprout,
  Droplets,
  Calendar,
  AlertCircle,
  TrendingUp,
  CircleDollarSign,
  CheckCircle,
  Volume2
} from 'lucide-react';
import { CropAdvisory } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface CropPlanResultViewProps {
  advisory: CropAdvisory;
}

export const CropPlanResultView: React.FC<CropPlanResultViewProps> = ({ advisory }) => {
  const { speak, isSpeaking, stop } = useSpeechSynthesis();

  const handleReadAloud = () => {
    if (isSpeaking) {
      stop();
    } else {
      const narrative = `Agro-Climatic Assessment: ${advisory.agroClimaticAssessment}. Climate Risk score is ${advisory.climateRiskIndex} out of 10. Recommended crops include: ${advisory.recommendedCrops.map(c => c.cropName).join(', ')}. Water Budget Note: ${advisory.waterBudgetingNote}.`;
      speak(narrative);
    }
  };

  const riskScore = advisory.climateRiskIndex || advisory.climateRiskScore || 5;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Banner & Risk Score */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950/60 border border-emerald-800/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                Deterministic Agronomic Advisory
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Seasonal Climate-Adaptive Crop Portfolio
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {advisory.agroClimaticAssessment}
            </p>
          </div>

          {/* Audio Listen Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all self-start md:self-center ${
              isSpeaking
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-700/50'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Stop Audio' : 'Listen in Audio'}</span>
          </button>
        </div>

        {/* Risk & Water Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Climate Risk Index */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Climate & Drought Vulnerability</span>
              </span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                riskScore <= 3
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : riskScore <= 6
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-red-500/20 text-red-400'
              }`}>
                {riskScore} / 10 Risk Index
              </span>
            </div>
            {/* Visual Risk Bar */}
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${riskScore * 10}%` }}
                className={`h-full transition-all duration-500 ${
                  riskScore <= 3 ? 'bg-emerald-500' : riskScore <= 6 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {riskScore <= 4
                ? 'Safe moisture profile: Suitable for cash and food intercropping.'
                : 'Elevated dry-spell probability: Drought-hardy legumes & soil conservation recommended.'}
            </p>
          </div>

          {/* Water Budget Analysis */}
          <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/70">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 mb-1.5">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Hydrological & Water Budgeting Analysis</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {advisory.waterBudgetingNote}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Crops Cards */}
      <div className="space-y-4">
        <h4 className="text-base font-bold text-white flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-emerald-400" />
          <span>Recommended Crop Portfolios (Seed-to-Harvest Projections)</span>
        </h4>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {advisory.recommendedCrops.map((crop, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-700/60 rounded-3xl p-5 shadow-lg space-y-4 transition-all hover:scale-[1.01]"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    Portfolio Option {idx + 1}
                  </span>
                  <h5 className="text-lg font-bold text-white mt-1">
                    {crop.cropName}
                  </h5>
                  <p className="text-xs text-emerald-300 font-medium">
                    Variety: {crop.varietyRecommended}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 font-semibold shrink-0">
                  {crop.durationDays} Days
                </span>
              </div>

              {/* Agronomic Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Cropping Pattern</div>
                  <div className="font-semibold text-slate-200">{crop.croppingPattern}</div>
                </div>

                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Seed Requirement</div>
                  <div className="font-semibold text-slate-200">{crop.seedRequirementPerAcre}</div>
                </div>

                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Projected Yield</div>
                  <div className="font-semibold text-amber-300">{crop.projectedYieldQuintalsPerAcre} Quintals / Acre</div>
                </div>

                <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-[10px] text-slate-400">Irrigation Need</div>
                  <div className="font-semibold text-cyan-300">{crop.irrigationRequirementLevel} Demand</div>
                </div>
              </div>

              {/* Economics: Cost vs Net Margin Side-by-Side */}
              <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400">Est. Input Cost / Acre</div>
                  <div className="text-sm font-bold text-slate-200">
                    ₹{crop.estimatedCostPerAcreINR.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end space-x-1">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>Est. Net Margin / Acre</span>
                  </div>
                  <div className="text-lg font-black text-emerald-400">
                    ₹{crop.estimatedNetProfitINR.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Climate Resilience Note */}
              <div className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-white">Resilience Feature: </span>
                {crop.resilienceFeatures}
              </div>

              {/* Key Risks */}
              {crop.keyRisks && crop.keyRisks.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    Key Risks & Watchpoints:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {crop.keyRisks.map((risk, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded-md border border-slate-700"
                      >
                        • {risk}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Critical Farmer Advisories */}
      {advisory.criticalFarmerAdvisories && advisory.criticalFarmerAdvisories.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <h4 className="text-sm font-bold text-white flex items-center space-x-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Essential Agronomic Actions for Maximum Yield</span>
          </h4>
          <div className="space-y-2">
            {advisory.criticalFarmerAdvisories.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2 text-xs text-slate-300"
              >
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <p className="leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
