import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  CalendarCheck,
  Bug,
  FlaskConical,
  TrendingUp,
  Award,
  PackageCheck,
  Bot,
  ArrowRight,
  PlusCircle,
  Sprout,
  ShieldAlert,
  Droplets,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useFarm } from '../context/FarmContext';
import { WeatherRiskBadge } from '../components/WeatherRiskBadge';
import { MandiTicker } from '../components/MandiTicker';
import { PlotModal } from '../components/PlotModal';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, plots, openDistressModal } = useFarm();
  const [isPlotModalOpen, setIsPlotModalOpen] = useState(false);

  const totalAcres = plots.reduce((sum, p) => sum + Number(p.size_acres || 0), 0);
  const rainfedAcres = plots
    .filter(p => p.irrigation_type === 'rainfed')
    .reduce((sum, p) => sum + Number(p.size_acres || 0), 0);
  const rainfedRatio = totalAcres > 0 ? Math.round((rainfedAcres / totalAcres) * 100) : 27;

  return (
    <div className="space-y-6">
      
      {/* Farmer Welcome Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-emerald-950/40 border border-emerald-800/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Smallholder Climate Resilience Co-Pilot
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Namaste, {user?.full_name || 'Rameshwar Patil'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Location: {user?.district || 'Ahmednagar'}, {user?.state || 'Maharashtra'} | Active Agricultural Year 2026-27
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPlotModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-green transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Plot</span>
            </button>
            <button
              onClick={openDistressModal}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Crisis Lifeline</span>
            </button>
          </div>
        </div>

        {/* Cumulative Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          
          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Total Farm Land</span>
            </div>
            <div className="text-2xl font-black text-white mt-2">
              {totalAcres > 0 ? totalAcres.toFixed(1) : '7.5'} <span className="text-xs font-normal text-slate-400">Acres</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              Across {plots.length || 3} registered parcels
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Monsoon Reliance</span>
            </div>
            <div className="text-2xl font-black text-cyan-300 mt-2">
              {rainfedRatio}% <span className="text-xs font-normal text-slate-400">Rainfed</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {(100 - rainfedRatio)}% Drip / Canal command
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
              <Sprout className="w-4 h-4 text-amber-400" />
              <span>Soil Vitality Score</span>
            </div>
            <div className="text-2xl font-black text-amber-300 mt-2">
              78 / 100
            </div>
            <div className="text-[11px] text-amber-400/90 mt-0.5">
              Organic carbon replenishment needed
            </div>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/60 rounded-2xl p-4">
            <div className="flex items-center space-x-2 text-slate-400 text-xs font-medium">
              <CalendarCheck className="w-4 h-4 text-purple-400" />
              <span>Season Phase</span>
            </div>
            <div className="text-xl font-bold text-white mt-2 truncate">
              Kharif Harvesting
            </div>
            <div className="text-[11px] text-purple-300 mt-0.5">
              Rabi Sowing Window Approaching
            </div>
          </div>

        </div>
      </div>

      {/* Weather Radar Bulletin */}
      <WeatherRiskBadge district={user?.district} state={user?.state} />

      {/* Live Mandi Ticker */}
      <MandiTicker />

      {/* Quick Action Navigation Grid */}
      <div>
        <h2 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span>Agronomic Decision Modules</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Crop Planner */}
          <Link
            to="/crop-planner"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Climate-Adaptive Crop Planner
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Generate optimized crop rotations, drought-hardy seed portfolios, water budgeting, and net margin forecasts.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-400 mt-4">
              <span>Launch Planner</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pest Doctor */}
          <Link
            to="/pest-doctor"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                Pest & Pathogen Diagnosis Studio
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Upload leaf damage photos or symptoms; receive instant pathology identification with tiered organic and rescue chemical sprays.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-rose-400 mt-4">
              <span>Diagnose Leaf Attack</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Soil Doctor & Fertilizer */}
          <Link
            to="/soil-fertility"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                <FlaskConical className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                Precision Soil Doctor & Fertilizer Calc
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Translate soil tests into exact bag quantities for Urea, DAP, MOP and organic carbon replenishment without over-spending.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-cyan-400 mt-4">
              <span>Calculate Fertilizer Bags</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Mandi Intelligence & Arbitrage */}
          <Link
            to="/mandi-prices"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Mandi Arbitrage & Market Connect
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Real-time APMC Mandi rates, transit margin calculators, and cold storage breakevens to prevent middleman distress selling.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-amber-400 mt-4">
              <span>Compare Mandi Margins</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Govt Schemes & Credit */}
          <Link
            to="/schemes-credit"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                Welfare Schemes & 4% KCC Credit
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Screen farm profile against PM-KISAN, PMFBY insurance, PM-KUSUM 60% Solar Pump subsidies, and pre-filled checklists.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-purple-400 mt-4">
              <span>Unlock Subsidies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Kisan Bandhu AI Assistant */}
          <Link
            to="/assistant"
            className="group bg-slate-900 border border-slate-800 hover:border-emerald-600/70 rounded-2xl p-5 shadow-lg transition-all hover:scale-[1.02] flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                Kisan Bandhu Voice AI Assistant
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Speak or type in your mother tongue. Instant voice answering for field emergencies, debt counseling, and agronomy queries.
              </p>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-blue-400 mt-4">
              <span>Talk with Kisan Bandhu</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* Plot Modal Dialog */}
      <PlotModal
        isOpen={isPlotModalOpen}
        onClose={() => setIsPlotModalOpen(false)}
      />
    </div>
  );
};
