import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Truck,
  Building2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Warehouse,
  AlertCircle,
  Clock
} from 'lucide-react';
import { fetchMandiPrices, calculateArbitrageApi, calculateStorageBreakevenApi } from '../api/mandi';
import { MandiPrice } from '../types';

export const MandiPrices: React.FC = () => {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'rates' | 'arbitrage' | 'storage'>('rates');

  // Arbitrage State
  const [arbitrageData, setArbitrageData] = useState({
    commodity: 'Onion',
    quantityQuintals: 50,
    localPricePerQuintal: 2200,
    destinationPricePerQuintal: 2950,
    distanceKm: 180,
    destinationMarket: 'Vashi APMC (Navi Mumbai)'
  });
  const [arbitrageResult, setArbitrageResult] = useState<any>(null);
  const [isCalculatingArbitrage, setIsCalculatingArbitrage] = useState(false);

  // Storage Breakeven State
  const [storageData, setStorageData] = useState({
    commodity: 'Soybean',
    quantityQuintals: 40,
    currentPricePerQuintal: 4680,
    storageMonths: 3,
    isPerishable: false
  });
  const [storageResult, setStorageResult] = useState<any>(null);
  const [isCalculatingStorage, setIsCalculatingStorage] = useState(false);

  useEffect(() => {
    loadPrices();
  }, [stateFilter]);

  const loadPrices = async () => {
    try {
      setIsLoadingPrices(true);
      const data = await fetchMandiPrices({
        commodity: searchTerm || undefined,
        state: stateFilter || undefined
      });
      setPrices(data || []);
    } catch (err) {
      console.warn('Error loading mandi prices', err);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadPrices();
  };

  const handleCalculateArbitrage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCalculatingArbitrage(true);
      const res = await calculateArbitrageApi(arbitrageData);
      setArbitrageResult(res);
    } catch (err) {
      console.error('Arbitrage calculation failed:', err);
    } finally {
      setIsCalculatingArbitrage(false);
    }
  };

  const handleCalculateStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCalculatingStorage(true);
      const res = await calculateStorageBreakevenApi(storageData);
      setStorageResult(res);
    } catch (err) {
      console.error('Storage breakeven calculation failed:', err);
    } finally {
      setIsCalculatingStorage(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 border border-amber-900/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30">
                Real-Time APMC Agmarknet & Transit Arbitrage
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Mandi Intelligence & Market Shield
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Compare wholesale modal prices across Indian APMC yards, calculate transit transport arbitrage, and determine cold storage holding profitability to protect your hard-earned harvest.
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('rates')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rates'
                ? 'bg-amber-600 text-white shadow-glow-amber'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Live APMC Mandi Rates</span>
          </button>

          <button
            onClick={() => setActiveTab('arbitrage')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'arbitrage'
                ? 'bg-amber-600 text-white shadow-glow-amber'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Transit Arbitrage Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'storage'
                ? 'bg-amber-600 text-white shadow-glow-amber'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Storage & e-NWR Breakeven</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Live Rates */}
      {activeTab === 'rates' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3 shadow-lg"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                placeholder="Search commodity (e.g. Onion, Soybean, Cotton, Wheat, Paddy, Orange)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={stateFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStateFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>

            <button
              type="submit"
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Search Rates
            </button>
          </form>

          {/* Rates Cards Grid */}
          {isLoadingPrices ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Fetching authenticated APMC wholesale market feeds...
            </div>
          ) : prices.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No mandi price quotes matched your criteria. Try searching for "Onion", "Soybean", or "Cotton".
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {prices.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-lg transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {p.commodity}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                      {p.price_date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate">{p.market_name}</h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {p.district}, {p.state} {p.variety ? `• ${p.variety}` : ''}
                  </p>

                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Modal Wholesale Price</div>
                      <div className="text-xl font-black text-emerald-400">
                        ₹{Number(p.modal_price).toLocaleString('en-IN')}{' '}
                        <span className="text-[10px] font-normal text-slate-400">/ Quintal</span>
                      </div>
                    </div>

                    <div className="text-right text-[11px] text-slate-400">
                      <div>Min: ₹{p.min_price}</div>
                      <div>Max: ₹{p.max_price}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Transit Arbitrage Calculator */}
      {activeTab === 'arbitrage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCalculateArbitrage}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <span>Inter-Mandi Transit Arbitrage</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Commodity Name
                </label>
                <input
                  type="text"
                  value={arbitrageData.commodity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setArbitrageData({ ...arbitrageData, commodity: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantity (Quintals)
                  </label>
                  <input
                    type="number"
                    value={arbitrageData.quantityQuintals}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArbitrageData({ ...arbitrageData, quantityQuintals: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Distance (Km)
                  </label>
                  <input
                    type="number"
                    value={arbitrageData.distanceKm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setArbitrageData({ ...arbitrageData, distanceKm: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Local APMC Price (₹/Quintal)
                </label>
                <input
                  type="number"
                  value={arbitrageData.localPricePerQuintal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setArbitrageData({ ...arbitrageData, localPricePerQuintal: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination APMC Price (₹/Quintal)
                </label>
                <input
                  type="number"
                  value={arbitrageData.destinationPricePerQuintal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setArbitrageData({
                      ...arbitrageData,
                      destinationPricePerQuintal: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination Market Name
                </label>
                <input
                  type="text"
                  value={arbitrageData.destinationMarket}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setArbitrageData({ ...arbitrageData, destinationMarket: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isCalculatingArbitrage}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isCalculatingArbitrage ? (
                  <span>Evaluating Logistics & Toll Economics...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Net Arbitrage Gain</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {arbitrageResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold leading-relaxed ${
                    arbitrageResult.isProfitable
                      ? 'bg-emerald-950/60 text-emerald-200 border-emerald-800/80'
                      : 'bg-rose-950/60 text-rose-200 border-rose-800/80'
                  }`}
                >
                  {arbitrageResult.recommendation}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 block">Local Sale Gross Revenue</span>
                    <span className="text-xl font-extrabold text-white">
                      ₹{arbitrageResult.localMarketRevenue?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 block">Destination Net Revenue</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{arbitrageResult.netDestinationRevenue?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Expenses Breakdown */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2 text-xs">
                  <span className="font-bold text-white block mb-2">Transit & Transaction Cost Breakdown:</span>
                  <div className="flex justify-between text-slate-300">
                    <span>Freight (₹3.20/q/km):</span>
                    <span className="font-semibold text-white">
                      ₹{arbitrageResult.expensesBreakdown?.freightCost?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>APMC Cess, Loading/Unloading:</span>
                    <span className="font-semibold text-white">
                      ₹{arbitrageResult.expensesBreakdown?.handlingMandiFees?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>In-transit 2% Moisture Shrinkage Value:</span>
                    <span className="font-semibold text-white">
                      ₹{arbitrageResult.expensesBreakdown?.transitLossValue?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-rose-400 font-bold pt-2 border-t border-slate-800">
                    <span>Total Transit Expenses:</span>
                    <span>
                      ₹{arbitrageResult.expensesBreakdown?.totalTransitExpenses?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
                  <span className="text-xs text-amber-300 font-medium">Net Profit Margin per Quintal:</span>
                  <span className="text-xl font-black text-amber-400">
                    ₹{arbitrageResult.netProfitPerQuintal} / q
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
                <Truck className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
                Fill the details on the left and click "Calculate Net Arbitrage Gain" to verify whether transporting to an out-of-district terminal APMC beats local commission agent prices after accounting for diesel freight, loading labor, and moisture loss.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Storage Breakeven Calculator */}
      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <form
              onSubmit={handleCalculateStorage}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Warehouse className="w-5 h-5 text-amber-400" />
                <span>Warehouse Holding & e-NWR Analysis</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Commodity Name
                </label>
                <input
                  type="text"
                  value={storageData.commodity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStorageData({ ...storageData, commodity: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Quantity (Quintals)
                  </label>
                  <input
                    type="number"
                    value={storageData.quantityQuintals}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStorageData({ ...storageData, quantityQuintals: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Holding Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={storageData.storageMonths}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setStorageData({ ...storageData, storageMonths: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Current Harvest Gate Price (₹/Quintal)
                </label>
                <input
                  type="number"
                  value={storageData.currentPricePerQuintal}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStorageData({
                      ...storageData,
                      currentPricePerQuintal: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="perishableCheck"
                  checked={storageData.isPerishable}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStorageData({ ...storageData, isPerishable: e.target.checked })
                  }
                  className="rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                />
                <label htmlFor="perishableCheck" className="text-xs text-slate-300">
                  Perishable Crop (Cold storage rate ₹140/q/mo vs Grain ₹45/q/mo)
                </label>
              </div>

              <button
                type="submit"
                disabled={isCalculatingStorage}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isCalculatingStorage ? (
                  <span>Evaluating Holding Curves...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Calculate Holding Breakeven</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7">
            {storageResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
                <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-xs sm:text-sm text-emerald-200 font-semibold rounded-2xl leading-relaxed">
                  {storageResult.advice}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 block">Required Breakeven Price</span>
                    <span className="text-xl font-extrabold text-amber-400">
                      ₹{storageResult.breakevenPricePerQuintal} / q
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (+₹{storageResult.priceHikeNeededToBreakeven}/q over harvest price)
                    </span>
                  </div>

                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                    <span className="text-[10px] text-slate-400 block">Anticipated Off-Season Rate</span>
                    <span className="text-xl font-extrabold text-emerald-400">
                      ₹{storageResult.anticipatedFuturePrice} / q
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Projected Gain: ₹{storageResult.projectedNetGain?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* e-NWR Warehouse Pledge Financing Banner */}
                {storageResult.eNWRFinancingAvailable && (
                  <div className="p-4 bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-800/60 rounded-2xl space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-bold text-blue-300">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Electronic Negotiable Warehouse Receipt (e-NWR) Pledge Loan</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Deposit harvest in WDRA registered godowns to get an immediate{' '}
                      <strong className="text-white">
                        ₹{storageResult.eNWRFinancingAvailable.availableCashAdvance?.toLocaleString('en-IN')} (75% loan)
                      </strong>{' '}
                      from nationalized banks at 7% p.a. interest. Liquidate working capital immediately without selling at harvest-time distress lows!
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-sm">
                <Warehouse className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
                Discover whether paying warehouse rent and KCC interest is profitable compared to selling right now during harvest glut.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

