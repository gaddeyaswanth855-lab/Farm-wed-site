import React from 'react';
import { PhoneCall, HeartHandshake, ShieldAlert, X, Scale } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export const DistressAlertModal: React.FC = () => {
  const { isDistressModalOpen, closeDistressModal } = useFarm();

  if (!isDistressModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border-2 border-red-500/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow decoration */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeDistressModal}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          aria-label="Close crisis lifeline modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              Farmer Emotional & Financial Crisis Lifeline
            </h3>
            <p className="text-xs text-red-300 font-semibold">
              Free, Confidential, 24/7 Government & Institutional Agricultural Helplines
            </p>
          </div>
        </div>

        {/* Compassionate Message */}
        <div className="bg-red-950/40 border border-red-800/50 rounded-2xl p-4 text-xs sm:text-sm text-red-100 leading-relaxed mb-6">
          <p className="font-semibold text-white mb-1">
            Brother / Sister Farmer, You Are Not Alone.
          </p>
          Agricultural crises, erratic monsoons, and debt stress can feel overwhelming, but no financial liability or crop loss is worth your precious life. There is immediate financial restructuring, legal protection, and compassionate human support available right now.
        </div>

        {/* Helpline Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          
          {/* Tele-MANAS */}
          <a
            href="tel:14416"
            className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-red-900/40 border border-slate-700 hover:border-red-500/60 rounded-2xl transition-all group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">Tele-MANAS (Mental Health)</div>
              <div className="text-lg font-black text-white group-hover:text-red-300">14416</div>
              <div className="text-[10px] text-emerald-400">Toll-Free | 24/7 in 22 Languages</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>

          {/* Kisan Call Centre */}
          <a
            href="tel:18001801551"
            className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-emerald-900/40 border border-slate-700 hover:border-emerald-500/60 rounded-2xl transition-all group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">Kisan Call Centre (Govt)</div>
              <div className="text-lg font-black text-white group-hover:text-emerald-300">1800-180-1551</div>
              <div className="text-[10px] text-emerald-400">Toll-Free | 6:00 AM - 10:00 PM</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>

          {/* Vandrevala Foundation */}
          <a
            href="tel:+919999666555"
            className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-amber-900/40 border border-slate-700 hover:border-amber-500/60 rounded-2xl transition-all group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">Vandrevala Crisis Support</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">+91 9999 666 555</div>
              <div className="text-[10px] text-amber-400">24/7 Multilingual Counselors</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall className="w-5 h-5" />
            </div>
          </a>

          {/* Legal Aid */}
          <a
            href="tel:15100"
            className="flex items-center justify-between p-4 bg-slate-800/80 hover:bg-cyan-900/40 border border-slate-700 hover:border-cyan-500/60 rounded-2xl transition-all group"
          >
            <div>
              <div className="text-xs text-slate-400 font-medium">National Legal Aid (DLSA)</div>
              <div className="text-lg font-black text-white group-hover:text-cyan-300">15100</div>
              <div className="text-[10px] text-cyan-400">Moneylender Harassment Protection</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5" />
            </div>
          </a>
        </div>

        {/* Rights Notice */}
        <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-start space-x-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Statutory Legal Protection: </strong>
            Under State Agricultural Debt Relief Acts and Supreme Court mandates, private moneylenders cannot legally seize your agricultural land, bullocks, or tractors without formal civil court adjudication. Coercive intimidation is a punishable cognizable offense.
          </span>
        </div>
      </div>
    </div>
  );
};
