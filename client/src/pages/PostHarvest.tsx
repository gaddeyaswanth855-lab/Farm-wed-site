import React from 'react';
import {
  PackageCheck,
  Warehouse,
  ShieldCheck,
  Scale,
  Thermometer,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PostHarvest: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 border border-emerald-900/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30">
                Post-Harvest Loss Prevention & Distress-Sale Elimination
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Post-Harvest Shield & Warehouse Financing
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Prevent up to 25% post-harvest loss through scientific hermetic storage, moisture management, WDRA accredited warehouse receipt financing (e-NWR), and MSP procurement.
            </p>
          </div>

          <Link
            to="/mandi-prices"
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-green transition-all shrink-0 w-fit"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Check Storage Breakeven</span>
          </Link>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: e-NWR Pledge Financing */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Warehouse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              e-NWR Warehouse Pledge Financing
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Deposit your harvested produce in Warehousing Development and Regulatory Authority (WDRA) registered warehouses. Receive an Electronic Negotiable Warehouse Receipt.
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Get up to 75% loan against pledge from commercial banks.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Interest subvention at 7% p.a. for up to 6 months.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero urgency to sell during harvest glut prices.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6">
            <span className="text-[11px] text-blue-400 font-semibold block">
              Portal: wdra.gov.in / e-NWR e-NAM portal
            </span>
          </div>
        </div>

        {/* Pillar 2: Scientific Hermetic Storage */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Hermetic & On-Farm Safe Storage
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Eliminate weevil, pulse beetle, and fungal rot without poisonous fumigants through oxygen-depletion hermetic bags and traditional botanical barriers.
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pusa Bin & Multi-layer hermetic bags (0% oxygen).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Neem Oil seed dressing (5ml / kg grain) against pulse beetle.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Elevated bamboo/wooden pallets to block ground moisture.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6">
            <span className="text-[11px] text-emerald-400 font-semibold block">
              Recommended: Grain moisture &lt; 12% before bagging
            </span>
          </div>
        </div>

        {/* Pillar 3: MSP Government Procurement */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              MSP Procurement Safety Net
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              When market prices dip below government Minimum Support Price (MSP), sell directly to FCI, NAFED, or Cotton Corporation of India (CCI) procurement centers.
            </p>

            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pre-registration on state procurement portal (e-Kharid / e-Uparjan).</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Direct DBT payment to Aadhaar-seeded bank accounts within 72 hrs.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Cotton CCI MSP, Soybean & Pulses NAFED Price Support Scheme.</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-6">
            <span className="text-[11px] text-amber-400 font-semibold block">
              National MSP Helpline: 1800-180-1551
            </span>
          </div>
        </div>

      </div>

      {/* Critical Moisture Guidelines Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Thermometer className="w-5 h-5 text-cyan-400" />
          <span>Fair Average Quality (FAQ) Moisture Standards for Safe Storage</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Crop / Commodity</th>
                <th className="px-4 py-3">Maximum Safe Moisture %</th>
                <th className="px-4 py-3">Sun-Drying Benchmark</th>
                <th className="px-4 py-3">Risk If Exceeded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Paddy (Rice)</td>
                <td className="px-4 py-3 text-cyan-400 font-bold">14.0%</td>
                <td className="px-4 py-3">2-3 days tarpaulin drying</td>
                <td className="px-4 py-3 text-rose-300">Aflatoxin mold & grain discoloration</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Wheat & Maize</td>
                <td className="px-4 py-3 text-cyan-400 font-bold">12.0%</td>
                <td className="px-4 py-3">3-4 days clear sun</td>
                <td className="px-4 py-3 text-rose-300">Weevil infestation & heating</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Soybean & Oilseeds</td>
                <td className="px-4 py-3 text-cyan-400 font-bold">9.0% - 10.0%</td>
                <td className="px-4 py-3">Avoid midday scorching heat</td>
                <td className="px-4 py-3 text-rose-300">Rancidity & seed coat breakage</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Pulses (Tur, Chana)</td>
                <td className="px-4 py-3 text-cyan-400 font-bold">10.0% - 11.0%</td>
                <td className="px-4 py-3">Thorough drying before oil coat</td>
                <td className="px-4 py-3 text-rose-300">Pulse beetle hollow kernel damage</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Onion (Rabi)</td>
                <td className="px-4 py-3 text-cyan-400 font-bold">Cured neck drying</td>
                <td className="px-4 py-3">7-10 days field curing with foliage</td>
                <td className="px-4 py-3 text-rose-300">Black mold rot & premature sprouting</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

