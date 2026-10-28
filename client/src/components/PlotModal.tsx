import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, PlusCircle, Sprout, Loader2 } from 'lucide-react';
import { createPlotApi } from '../api/plots';
import { useFarm } from '../context/FarmContext';

const plotFormSchema = z.object({
  plotName: z.string().min(1, 'Plot name is required').max(50),
  sizeAcres: z.coerce.number().positive('Size must be greater than 0').max(500),
  irrigationType: z.enum(['rainfed', 'borewell', 'canal', 'drip', 'open_well']),
  soilType: z.enum(['black_cotton', 'alluvial', 'red_sandy', 'laterite', 'clay', 'saline']),
  organicCarbonStatus: z.enum(['low', 'medium', 'high']),
  soilPh: z.coerce.number().min(3.0).max(11.0),
  currentCrop: z.string().optional(),
  sowingDate: z.string().optional()
});

type PlotFormValues = z.infer<typeof plotFormSchema>;

interface PlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlotModal: React.FC<PlotModalProps> = ({ isOpen, onClose }) => {
  const { refreshPlots } = useFarm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PlotFormValues>({
    resolver: zodResolver(plotFormSchema),
    defaultValues: {
      plotName: '',
      sizeAcres: 2.0,
      irrigationType: 'drip',
      soilType: 'black_cotton',
      organicCarbonStatus: 'medium',
      soilPh: 7.2,
      currentCrop: '',
      sowingDate: new Date().toISOString().split('T')[0]
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data: PlotFormValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);
      await createPlotApi(data);
      await refreshPlots();
      reset();
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to save plot. Please check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Add New Land Plot</h3>
              <p className="text-xs text-slate-400">Record soil chemistry and water source for precision planning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800 text-xs text-red-200 rounded-xl">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          
          {/* Plot Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Plot Name / Identifier *
            </label>
            <input
              type="text"
              placeholder="e.g., North Well Field / Canal Survey No. 42"
              {...register('plotName')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.plotName && (
              <p className="text-[11px] text-red-400 mt-1">{errors.plotName.message}</p>
            )}
          </div>

          {/* Size & Irrigation Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Size in Acres *
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="2.5"
                {...register('sizeAcres')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.sizeAcres && (
                <p className="text-[11px] text-red-400 mt-1">{errors.sizeAcres.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Irrigation Source *
              </label>
              <select
                {...register('irrigationType')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="drip">Drip / Micro-irrigation</option>
                <option value="canal">Canal Command</option>
                <option value="borewell">Borewell</option>
                <option value="open_well">Open Well / Farm Pond</option>
                <option value="rainfed">Strictly Rainfed</option>
              </select>
            </div>
          </div>

          {/* Soil Type & Organic Carbon */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Soil Texture *
              </label>
              <select
                {...register('soilType')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="black_cotton">Black Cotton Soil (Regur)</option>
                <option value="alluvial">Alluvial Loam</option>
                <option value="red_sandy">Red Sandy Loam</option>
                <option value="laterite">Laterite Soil</option>
                <option value="clay">Heavy Clay</option>
                <option value="saline">Saline / Sodic</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Organic Carbon (OC) *
              </label>
              <select
                {...register('organicCarbonStatus')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="low">&lt; 0.50% (Critically Low)</option>
                <option value="medium">0.50% - 0.75% (Medium)</option>
                <option value="high">&gt; 0.75% (High / Healthy)</option>
              </select>
            </div>
          </div>

          {/* Soil pH & Current Crop */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Soil pH Rating
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="7.2"
                {...register('soilPh')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {errors.soilPh && (
                <p className="text-[11px] text-red-400 mt-1">{errors.soilPh.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Current Crop
              </label>
              <input
                type="text"
                placeholder="e.g. Cotton, Soybean, Fallow"
                {...register('currentCrop')}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Sowing Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Sowing Date (Optional)
            </label>
            <input
              type="date"
              {...register('sowingDate')}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-glow-green transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Plot...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Save Plot Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
