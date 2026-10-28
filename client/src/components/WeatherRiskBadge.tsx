import React from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, ShieldCheck, Thermometer } from 'lucide-react';

interface WeatherRiskBadgeProps {
  district?: string;
  state?: string;
}

export const WeatherRiskBadge: React.FC<WeatherRiskBadgeProps> = ({
  district = 'Ahmednagar',
  state = 'Maharashtra'
}) => {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-emerald-950/40 rounded-2xl p-5 border border-emerald-800/40 shadow-xl relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Live Agro-Meteorological Radar
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mt-0.5">
            {district}, {state}
          </h3>
          <p className="text-xs text-slate-400">
            IMD Agro-Advisory Bulletin | Valid for next 7 days
          </p>
        </div>

        {/* Current Temperature & Sky */}
        <div className="flex items-center space-x-3 bg-slate-800/70 px-3.5 py-2 rounded-xl border border-slate-700/60 self-start sm:self-auto">
          <CloudSun className="w-8 h-8 text-amber-400" />
          <div>
            <div className="text-xl font-extrabold text-white leading-none">31°C</div>
            <div className="text-[11px] text-slate-300 font-medium">Partly Cloudy</div>
          </div>
        </div>
      </div>

      {/* Weather Parameters Grid */}
      <div className="grid grid-cols-3 gap-3 my-4">
        <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
          <Droplets className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Humidity</div>
            <div className="text-xs font-bold text-white">58% RH</div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
          <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Wind Velocity</div>
            <div className="text-xs font-bold text-white">12 km/h WNW</div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
          <Thermometer className="w-4 h-4 text-amber-400 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Soil Temp (10cm)</div>
            <div className="text-xs font-bold text-white">26.4°C</div>
          </div>
        </div>
      </div>

      {/* Climate Risk Alert Strip */}
      <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-3 flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <span className="font-bold text-amber-300">Dry Spell Alert: </span>
          Sub-normal rainfall projected for next 8-10 days in semi-arid tracts. Rainfed crops (Millets, Pulses) benefit from shallow intercultural hoeing to break soil capillary pores and reduce evaporation losses by 30%.
        </div>
      </div>
    </div>
  );
};
