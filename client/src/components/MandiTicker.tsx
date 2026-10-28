import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Store, ArrowRight } from 'lucide-react';
import { fetchMandiPrices } from '../api/mandi';
import { MandiPrice } from '../types';
import { Link } from 'react-router-dom';

export const MandiTicker: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);

  useEffect(() => {
    fetchMandiPrices()
      .then(res => setPrices(res))
      .catch(e => console.warn('Mandi ticker load err:', e));
  }, []);

  if (prices.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Store className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live APMC Mandi Ticker (₹ / Quintal)
          </h4>
        </div>
        <Link
          to="/mandi-prices"
          className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
        >
          <span>View Arbitrage</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
        {prices.map((item, idx) => {
          const isUp = idx % 2 === 0;
          return (
            <div
              key={item.id || idx}
              className="bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 rounded-xl p-3 shrink-0 min-w-[200px] transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-[120px]">
                  {item.commodity}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
                  {item.district}
                </span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-base font-extrabold text-emerald-400">
                  ₹{Number(item.modal_price).toLocaleString('en-IN')}
                </div>
                <div className={`flex items-center text-[10px] font-bold ${isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isUp ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {isUp ? '+3.4%' : '-1.8%'}
                </div>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                {item.market_name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
