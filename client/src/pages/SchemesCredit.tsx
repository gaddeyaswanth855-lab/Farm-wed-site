import React, { useState, useEffect } from 'react';
import {
  Award,
  CreditCard,
  Shield,
  FileText,
  ExternalLink,
  PhoneCall,
  CheckCircle,
  HelpCircle,
  Scale,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { fetchMatchedSchemes } from '../api/mandi';
import { SchemeInfo } from '../types';

export const SchemesCredit: React.FC = () => {
  const [schemes, setSchemes] = useState<SchemeInfo[]>([]);
  const [totalBenefits, setTotalBenefits] = useState<number>(49000);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMatchedSchemes()
      .then((res) => {
        if (res?.schemes) {
          setSchemes(res.schemes);
          setTotalBenefits(res.totalPotentialBenefitsINR || 49000);
        }
      })
      .catch((err) => console.warn('Could not load schemes', err))
      .finally(() => setIsLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Schemes' },
    { id: 'direct_benefit', label: 'Direct Benefit (DBT)' },
    { id: 'credit', label: '4% Concessional Credit (KCC)' },
    { id: 'insurance', label: 'Crop Insurance (PMFBY)' },
    { id: 'subsidy', label: 'Solar & Machinery Subsidies' }
  ];

  const filteredSchemes =
    selectedCategory === 'all'
      ? schemes
      : schemes.filter((s) => s.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 border border-purple-900/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                Institutional Welfare & Concessional 4% Credit Gateway
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Government Schemes & Concessional Credit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Verified statutory benefits, subsidized crop loans, and natural disaster insurance matching your land holding and crop profile.
            </p>
          </div>

          {/* Cumulative Benefit Badge */}
          <div className="bg-slate-800/80 border border-purple-500/30 rounded-2xl p-4 text-center sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
              Estimated Annual Farmer Benefit
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-0.5">
              ₹{totalBenefits.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">Direct Transfers & Interest Subventions</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === c.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Cross-referencing state and central agronomic schemes...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-md">
                    {scheme.code}
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{scheme.matchScorePercent}% Match</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{scheme.name}</h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {scheme.benefitSummary}
                </p>

                {/* Eligibility Criteria */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
                    Eligibility Conditions:
                  </span>
                  <ul className="space-y-1">
                    {scheme.eligibilityConditions?.map((cond, i) => (
                      <li key={i} className="text-xs text-slate-300 flex items-start space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{cond}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Required Documents */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider block mb-1.5">
                    Pre-filled Application Document Checklist:
                  </span>
                  <ul className="space-y-1">
                    {scheme.requiredDocuments?.map((doc, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Nodal Support:</span>
                  <span className="font-semibold text-slate-200">{scheme.nodalContact}</span>
                </div>

                <a
                  href={scheme.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-800 hover:bg-purple-600 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shadow-md group"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Institutional Legal Protection Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-3 text-white font-bold text-sm">
          <Scale className="w-5 h-5 text-purple-400" />
          <span>Statutory Farmer Debt Protections & Reserve Bank of India Rules</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Under the Agricultural Debt Relief Acts and RBI Master Circulars on Natural Calamity Restructuring: when crop damage exceeds 33% due to drought, unseasonal rain, or pest outbreaks, farmers are entitled to a mandatory conversion of short-term crop loans into medium-term loans (3-5 years) with a 1-year repayment moratorium. Private recovery agents are strictly prohibited by law from harassing farmer households.
        </p>
      </div>
    </div>
  );
};

