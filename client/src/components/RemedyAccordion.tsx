import React, { useState } from 'react';
import { Leaf, FlaskRound as Flask, AlertOctagon, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { PestRemedy, ChemicalRemedy } from '../types';

interface RemedyAccordionProps {
  organicRemedies: PestRemedy[];
  chemicalRemedies: ChemicalRemedy[];
  preventativeMeasures: string[];
}

export const RemedyAccordion: React.FC<RemedyAccordionProps> = ({
  organicRemedies = [],
  chemicalRemedies = [],
  preventativeMeasures = []
}) => {
  const [activeTab, setActiveTab] = useState<'organic' | 'chemical' | 'prevention'>('organic');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Tab Switcher */}
      <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1.5">
        <button
          onClick={() => setActiveTab('organic')}
          className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'organic'
              ? 'bg-emerald-600 text-white shadow-glow-green'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Leaf className="w-4 h-4 shrink-0" />
          <span>Biological & Organic</span>
        </button>

        <button
          onClick={() => setActiveTab('chemical')}
          className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'chemical'
              ? 'bg-rose-700 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Flask className="w-4 h-4 shrink-0" />
          <span>Chemical Rescue</span>
        </button>

        <button
          onClick={() => setActiveTab('prevention')}
          className={`flex items-center justify-center space-x-2 py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'prevention'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>Next Season Shield</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-5 sm:p-6">
        
        {/* Organic & Biological Remedies Tab */}
        {activeTab === 'organic' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-emerald-400 mb-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Eco-Friendly, Non-Toxic & Low Input Cost Solutions
              </span>
            </div>

            {organicRemedies.map((remedy, i) => (
              <div
                key={i}
                className="bg-emerald-950/20 border border-emerald-800/40 rounded-xl p-4 space-y-2 hover:border-emerald-700/60 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-emerald-300">
                    {remedy.method}
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                    Option {i + 1}
                  </span>
                </div>
                
                <div className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Preparation & Dosage: </span>
                  {remedy.preparation}
                </div>

                <div className="flex items-center space-x-2 text-xs text-emerald-400 pt-1 border-t border-emerald-900/30">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span><strong>Application Timing: </strong>{remedy.applicationTiming}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chemical Interventions Tab */}
        {activeTab === 'chemical' && (
          <div className="space-y-4">
            <div className="flex items-start space-x-2.5 bg-rose-950/40 border border-rose-800/40 rounded-xl p-3 text-xs text-rose-200 mb-4">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">Targeted Chemical Intervention Only: </span>
                Use synthetic chemical sprays strictly as a last resort when pest population surpasses the Economic Injury Level (EIL &gt; 10%). Always wear protective face covering and boots.
              </div>
            </div>

            {chemicalRemedies.map((chem, idx) => (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-bold text-white">
                    {chem.activeChemicalName}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
                      Waiting Period: {chem.safetyWaitingPeriodDays} Days
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-white">Exact Formulation Dosage: </span>
                  <span className="text-amber-300 font-bold">{chem.dosagePerLiterWater}</span>
                </div>

                <div className="text-xs text-rose-300/90 bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/40">
                  <strong>Safety & Pollinator Caution: </strong>{chem.applicationCaution}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preventative Measures Tab */}
        {activeTab === 'prevention' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 mb-3">
              Proactive cultural and agronomic interventions to break pest life cycles and eliminate pathogen inoculum:
            </p>
            {preventativeMeasures.map((measure, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 bg-slate-800/40 border border-slate-800 rounded-xl p-3"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {measure}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
