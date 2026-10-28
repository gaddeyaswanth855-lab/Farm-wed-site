import React, { useState, useEffect } from 'react';
import {
  Bug,
  Upload,
  Camera,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  History,
  RotateCcw,
  Sparkles,
  X
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { useLanguage } from '../context/LanguageContext';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { diagnosePestApi, fetchPestHistory } from '../api/advisories';
import { RemedyAccordion } from '../components/RemedyAccordion';
import { PestDiagnosis } from '../types';

export const PestDoctor: React.FC = () => {
  const { plots, selectedPlot, setSelectedPlot } = useFarm();
  const { t } = useLanguage();
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useVoiceInput();
  const { speak, stop, isSpeaking } = useSpeechSynthesis();

  const [cropName, setCropName] = useState<string>('Cotton');
  const [selectedParts, setSelectedParts] = useState<string[]>(['Leaves']);
  const [symptomsText, setSymptomsText] = useState<string>(
    'Upward leaf curling, yellowing along leaf margins, honeydew secretion and sooty mold spots.'
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<PestDiagnosis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<PestDiagnosis[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Sync transcript from voice input into symptomsText
  useEffect(() => {
    if (transcript) {
      setSymptomsText(transcript);
    }
  }, [transcript]);

  // Load history on mount
  useEffect(() => {
    fetchPestHistory()
      .then((data) => setHistory(data || []))
      .catch((err) => console.warn('Could not fetch pest history', err));
  }, []);

  const plantPartsList = [
    { id: 'Leaves', label: 'Leaves / Foliage' },
    { id: 'Stem', label: 'Stem & Trunk' },
    { id: 'Roots', label: 'Roots & Crown' },
    { id: 'Pod/Fruit', label: 'Boll / Pod / Fruit' },
    { id: 'Flower', label: 'Flower Buds' }
  ];

  const commonCrops = [
    'Cotton',
    'Soybean',
    'Paddy (Rice)',
    'Wheat',
    'Onion',
    'Tomato',
    'Sugarcane',
    'Chickpea (Gram)',
    'Maize'
  ];

  const handleTogglePart = (part: string) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Photo size exceeds 8MB limit. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDiagnose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName.trim()) {
      alert('Please select or specify the affected crop.');
      return;
    }
    if (!symptomsText.trim() && !imageBase64) {
      alert('Please describe visible symptoms or attach a leaf photo.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const payload = {
        plotId: selectedPlot?.id,
        cropName,
        plantPart: selectedParts,
        symptomsText,
        imageBase64: imageBase64 || undefined
      };

      const result = await diagnosePestApi(payload);
      setDiagnosisResult(result);

      // Refresh history
      fetchPestHistory()
        .then((data) => setHistory(data || []))
        .catch(() => {});
    } catch (err: any) {
      console.error('Pest diagnosis failure:', err);
      setErrorMessage(err.message || 'Diagnosis service encountered an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceReadout = () => {
    if (!diagnosisResult) return;
    if (isSpeaking) {
      stop();
    } else {
      const speech = `${diagnosisResult.diagnosisName}. Severity level is ${diagnosisResult.severityLevel}. ${diagnosisResult.symptomSummary}. Recommended biological treatment: ${
        diagnosisResult.organicRemedies?.[0]?.method || 'Biological IPM'
      }.`;
      speak(speech);
    }
  };

  const getSeverityBadgeClass = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'critical':
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'moderate':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-950 border border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                Multimodal Pathology & Entomological AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">
              Pest & Pathogen Doctor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Upload leaf damage photos or state field symptoms for instant pathogen identification, economic injury levels, and integrated pest management (IPM) bio-remedies.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <History className="w-4 h-4 text-rose-400" />
              <span>{showHistory ? 'Back to Diagnosis' : `Past Diagnoses (${history.length})`}</span>
            </button>
          </div>
        </div>
      </div>

      {showHistory ? (
        /* History View */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5 text-rose-400" />
            <span>Past Diagnostic Records & Treatments</span>
          </h2>

          {history.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              No historical diagnosis records found. Run a diagnosis below to get started.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((item, idx) => (
                <div
                  key={item.diagnosisId || idx}
                  onClick={() => {
                    setDiagnosisResult(item);
                    setShowHistory(false);
                  }}
                  className="bg-slate-950/70 border border-slate-800 hover:border-rose-600/60 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                        {item.cropName}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getSeverityBadgeClass(
                          item.severityLevel
                        )}`}
                      >
                        {item.severityLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white">{item.diagnosisName}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.symptomSummary}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Confidence: {item.confidenceScorePercent}%</span>
                    <span className="text-rose-400 font-semibold hover:underline">View Remedies →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Diagnostic Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleDiagnose}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5"
            >
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Bug className="w-5 h-5 text-rose-400" />
                <span>Field Symptom & Photo Inspector</span>
              </h2>

              {/* Plot Selector */}
              {plots.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Select Farm Plot (Optional Context)
                  </label>
                  <select
                    value={selectedPlot?.id || ''}
                    onChange={(e) => {
                      const p = plots.find((plot) => plot.id === e.target.value) || null;
                      setSelectedPlot(p);
                      if (p?.current_crop) {
                        setCropName(p.current_crop.split(' ')[0]);
                      }
                    }}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="">-- No specific plot (General query) --</option>
                    {plots.map((plot) => (
                      <option key={plot.id} value={plot.id}>
                        {plot.plot_name} ({plot.size_acres} ac, {plot.current_crop || 'Fallow'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Crop Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Affected Crop Name *
                </label>
                <input
                  type="text"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  placeholder="e.g. Cotton, Soybean, Tomato, Onion"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  required
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {commonCrops.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCropName(c)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors ${
                        cropName.toLowerCase() === c.toLowerCase()
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Affected Plant Parts */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Affected Plant Parts
                </label>
                <div className="flex flex-wrap gap-2">
                  {plantPartsList.map((part) => (
                    <button
                      type="button"
                      key={part.id}
                      onClick={() => handleTogglePart(part.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedParts.includes(part.id)
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload with Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Upload Leaf / Damage Photo
                </label>
                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-rose-500/50 bg-slate-950 group">
                    <img
                      src={imagePreview}
                      alt="Crop symptom preview"
                      className="w-full h-44 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageBase64(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-700 hover:border-rose-500/80 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950/40 hover:bg-slate-950 transition-colors">
                    <Camera className="w-8 h-8 text-rose-400 mb-2" />
                    <span className="text-xs font-bold text-white">Click or Tap to Snap / Attach Photo</span>
                    <span className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP (Max 8MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Symptom Description & Mic Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Symptom Description & Behavioral Signs
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (isListening) {
                        stopListening();
                      } else {
                        resetTranscript();
                        startListening();
                      }
                    }}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      isListening
                        ? 'bg-red-600 text-white animate-pulse'
                        : 'bg-slate-800 text-rose-300 hover:bg-slate-700'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Mic</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Voice Input</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={symptomsText}
                  onChange={(e) => setSymptomsText(e.target.value)}
                  placeholder="Describe leaf yellowing, spots, holes, wilting, sticky secretion, pests seen..."
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              {errorMessage && (
                <div className="bg-red-950/60 border border-red-800 rounded-xl p-3 text-xs text-red-300 flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Pathology & Agronomic Vectors...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Diagnose Crop Pathology</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Diagnosis & Remedies Result Section */}
          <div className="lg:col-span-7 space-y-6">
            {diagnosisResult ? (
              <div className="space-y-6">
                {/* Result Title Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {diagnosisResult.cropName} Pathology
                        </span>
                        <span
                          className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${getSeverityBadgeClass(
                            diagnosisResult.severityLevel
                          )}`}
                        >
                          Severity: {diagnosisResult.severityLevel}
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          Confidence: {diagnosisResult.confidenceScorePercent}%
                        </span>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          Pathogen: {diagnosisResult.pathogenType}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-black text-white">
                        {diagnosisResult.diagnosisName}
                      </h2>
                    </div>

                    <button
                      onClick={handleVoiceReadout}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                        isSpeaking
                          ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                      }`}
                      title="Read diagnosis aloud in chosen mother tongue"
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4" />
                          <span>Stop Voice</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-rose-400" />
                          <span>Listen Aloud</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Symptom Analysis Box */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <span className="font-bold text-rose-300 block mb-1">Observed Field Symptomatology:</span>
                    {diagnosisResult.symptomSummary}
                  </div>
                </div>

                {/* Integrated Pest Management Remedies Accordion */}
                <RemedyAccordion
                  organicRemedies={diagnosisResult.organicRemedies || []}
                  chemicalRemedies={diagnosisResult.chemicalRemedies || []}
                  preventativeMeasures={diagnosisResult.preventativeMeasuresNextSeason || []}
                />
              </div>
            ) : (
              /* Empty Placeholder State */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-xl space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                  <Bug className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Awaiting Leaf Photo or Symptoms
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Enter crop details on the left, attach a leaf photo from your farm, or record your voice describing the damage. Our pathology engine will identify the pest or fungus and give tailored biological IPM dosages.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto pt-4 text-left">
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                    <Leaf className="w-4 h-4 text-emerald-400 mb-1" />
                    <div className="text-xs font-bold text-white">Tier 1: Bio-Control</div>
                    <div className="text-[10px] text-slate-400">Neem NSKE 5%, Trichoderma, pheromones.</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                    <AlertTriangle className="w-4 h-4 text-rose-400 mb-1" />
                    <div className="text-xs font-bold text-white">Tier 2: Chemical Rescue</div>
                    <div className="text-[10px] text-slate-400">CIBRC registered molecules & safety waiting periods.</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 mb-1" />
                    <div className="text-xs font-bold text-white">Tier 3: Prevention</div>
                    <div className="text-[10px] text-slate-400">Crop rotation, seed treatment & trap cropping.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

