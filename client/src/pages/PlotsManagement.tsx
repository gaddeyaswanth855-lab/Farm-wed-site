import React, { useState } from 'react';
import {
  MapPin,
  PlusCircle,
  Trash2,
  Droplets,
  Sprout,
  Activity,
  Layers,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { deletePlotApi } from '../api/plots';
import { PlotModal } from '../components/PlotModal';
import { Plot } from '../types';

export const PlotsManagement: React.FC = () => {
  const { plots, refreshPlots, selectedPlot, setSelectedPlot } = useFarm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove plot "${name}"?`)) {
      try {
        setDeletingId(id);
        await deletePlotApi(id);
        await refreshPlots();
      } catch (e: any) {
        alert(e.message || 'Error deleting plot');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getCarbonBadge = (status: string) => {
    switch (status) {
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md">&gt; 0.75% High Carbon</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">0.50-0.75% Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-md">&lt; 0.50% Critically Low</span>;
    }
  };

  const getIrrigationBadge = (type: string) => {
    switch (type) {
      case 'drip':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">Micro-Drip</span>;
      case 'canal':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-md">Canal Command</span>;
      case 'borewell':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-md">Borewell</span>;
      case 'open_well':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">Open Well</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-md">Rainfed</span>;
    }
  };

  const totalAcres = plots.reduce((sum, p) => sum + Number(p.size_acres || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Agronomic Cadastral Engine</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">Plot & Soil Chemistry Profiling</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your land parcels, soil textures, organic carbon benchmarks, and irrigation infrastructure.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-green transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Plot</span>
        </button>
      </div>

      {/* Plots Holding Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-semibold">Total Land Holding</div>
          <div className="text-2xl font-black text-white mt-1">
            {totalAcres.toFixed(1)} <span className="text-sm font-normal text-slate-400">Acres</span>
          </div>
          <div className="text-xs text-emerald-400 mt-1">{plots.length} Registered Field Plots</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-semibold">Soil Carbon Deficit</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {plots.filter(p => p.organic_carbon_status === 'low').length} of {plots.length} Plots
          </div>
          <div className="text-xs text-amber-300 mt-1">Require FYM or Green Manure amendment</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-semibold">Micro-Irrigation Coverage</div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {plots.filter(p => p.irrigation_type === 'drip').reduce((s, p) => s + Number(p.size_acres), 0).toFixed(1)} Acres
          </div>
          <div className="text-xs text-cyan-300 mt-1">Protected with pressurized water savings</div>
        </div>
      </div>

      {/* Plots Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plots.map((plot) => {
          const isSelected = selectedPlot?.id === plot.id;
          return (
            <div
              key={plot.id}
              onClick={() => setSelectedPlot(plot)}
              className={`bg-slate-900 rounded-2xl p-5 border cursor-pointer transition-all hover:scale-[1.01] shadow-lg flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 shadow-glow-green ring-1 ring-emerald-500'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {plot.plot_name}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{plot.size_acres} Acres Holding</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(plot.id, plot.plot_name);
                    }}
                    disabled={deletingId === plot.id}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete plot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Badges Strip */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {getIrrigationBadge(plot.irrigation_type)}
                  {getCarbonBadge(plot.organic_carbon_status)}
                </div>

                {/* Soil Parameters Table */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Soil Texture</div>
                    <div className="font-bold text-slate-200 capitalize">
                      {plot.soil_type.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-400">Soil pH</div>
                    <div className="font-bold text-emerald-400">
                      {plot.soil_ph || 7.2} pH
                    </div>
                  </div>
                </div>

                {/* Current Crop */}
                <div className="mt-3 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Current Crop: <strong className="text-white">{plot.current_crop || 'None / Fallow'}</strong></span>
                  </div>
                  {plot.sowing_date && (
                    <span className="text-[10px] text-slate-400">
                      Sown: {plot.sowing_date}
                    </span>
                  )}
                </div>
              </div>

              {/* Footer selection hint */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className={isSelected ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isSelected ? '✓ Active Planning Plot' : 'Click to select for advisory'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <PlotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
