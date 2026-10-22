import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  RotateCw,
  CheckCircle2,
  RefreshCw,
  Sliders,
  ShieldCheck,
  Check,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { NOVEA_LOGOS, NoveaLogoDefinition, getLogoById } from './noveaLogos';
import { useNoveaLogo } from './useNoveaLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    activeLogo,
    settings,
    formattedCountdown,
    updateSettings,
    resetToDefault,
  } = useNoveaLogo();

  // Local draft state for preview before saving
  const [selectedId, setSelectedId] = useState<number>(settings.currentLogoId);
  const [autoRotate, setAutoRotate] = useState<boolean>(settings.isAutoRotate);
  const [intervalMinutes, setIntervalMinutes] = useState<number>(settings.intervalMinutes || 10);
  const [savedToast, setSavedToast] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'stethoscope' | 'cross' | 'network' | 'wave'>('all');

  // Sync draft state whenever modal opens or settings change externally
  React.useEffect(() => {
    if (isOpen) {
      setSelectedId(settings.currentLogoId);
      setAutoRotate(settings.isAutoRotate);
      setIntervalMinutes(settings.intervalMinutes || 10);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const previewLogo = getLogoById(selectedId);

  const handleSave = () => {
    updateSettings({
      currentLogoId: selectedId,
      isAutoRotate: autoRotate,
      intervalMinutes,
    });
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  const handleReset = () => {
    resetToDefault();
    setSelectedId(1);
    setAutoRotate(true);
    setIntervalMinutes(10);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 900);
  };

  const INTERVAL_OPTIONS = [
    { label: '5 min', value: 5 },
    { label: '10 min (Default)', value: 10 },
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '60 min', value: 60 },
  ];

  const filteredLogos = NOVEA_LOGOS.filter((logo) => {
    if (filterCategory === 'all') return true;
    const tag = logo.tagline.toLowerCase() + ' ' + logo.description.toLowerCase();
    if (filterCategory === 'stethoscope') return tag.includes('stethoscope') || tag.includes('mentor');
    if (filterCategory === 'cross') return tag.includes('cross') || tag.includes('health') || tag.includes('plus');
    if (filterCategory === 'network') return tag.includes('network') || tag.includes('community') || tag.includes('connect');
    if (filterCategory === 'wave') return tag.includes('wave') || tag.includes('pulse') || tag.includes('heartbeat');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logo-settings-title"
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col border border-[#E2E8F0] overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-gradient-to-r from-[#F8FAFC] to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#1D4ED8]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="logo-settings-title" className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
                NOVEA Official Logo Collection
              </h2>
              <p className="text-xs text-[#64748B]">
                Browse 36 official concepts · Configurable 10-minute auto-rotation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          {/* Top Live Preview & Rotation Controls Stage */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 shadow-2xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Preview Window */}
              <div className="md:col-span-5 bg-white border border-[#CBD5E1] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#64748B] mb-2">
                  Active / Selected Preview
                </span>
                <div className="h-14 sm:h-16 flex items-center justify-center w-full px-2 py-1">
                  {previewLogo.renderLogo({ className: 'h-10 sm:h-12 w-auto max-w-full drop-shadow-xs' })}
                </div>
                <div className="mt-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] text-xs font-bold border border-[#DBEAFE]">
                    <span>Concept #{String(previewLogo.id).padStart(2, '0')}</span>
                    <span>·</span>
                    <span>{previewLogo.name}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-1.5 line-clamp-2 max-w-xs">
                    {previewLogo.description}
                  </p>
                </div>
              </div>

              {/* Rotation & Interval Configuration */}
              <div className="md:col-span-7 space-y-3.5">
                {/* Auto Rotate Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E2E8F0]">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                      <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin-slow' : ''}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0F172A]">Automatic Logo Rotation</div>
                      <div className="text-[11px] text-[#64748B]">
                        Cycle through all 36 concepts sequentially (1 → 36)
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={autoRotate}
                    onClick={() => setAutoRotate(!autoRotate)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      autoRotate ? 'bg-[#1D4ED8]' : 'bg-[#CBD5E1]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        autoRotate ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Interval Selector */}
                <div className="p-3 rounded-xl bg-white border border-[#E2E8F0] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0284C7]" />
                      <span className="text-xs font-bold text-[#0F172A]">Rotation Interval</span>
                    </div>
                    {autoRotate && (
                      <span className="text-[11px] font-mono font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#DBEAFE]">
                        Next in {formattedCountdown}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1">
                    {INTERVAL_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setIntervalMinutes(opt.value)}
                        className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border transition-all text-center ${
                          intervalMinutes === opt.value
                            ? 'bg-[#1D4ED8] text-white border-[#1D4ED8] shadow-xs'
                            : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#64748B] px-1">
                  <Info className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                  <span>
                    Settings are saved in your account preferences and persist across browser refreshes.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery Category Filter Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
            <div className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-[#64748B]" />
              <span className="text-xs font-bold text-[#0F172A]">
                All 36 NOVEA Logo Concepts ({filteredLogos.length})
              </span>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'all', label: 'All (36)' },
                { id: 'stethoscope', label: 'Stethoscope' },
                { id: 'cross', label: 'Clinical Cross' },
                { id: 'wave', label: 'Lifeline / ECG' },
                { id: 'network', label: 'Doctor Network' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id as any)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                    filterCategory === cat.id
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* 36 Logo Grid Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredLogos.map((logo) => {
              const isSelected = selectedId === logo.id;
              const isCurrentActive = activeLogo.id === logo.id;

              return (
                <div
                  key={logo.id}
                  onClick={() => setSelectedId(logo.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedId(logo.id);
                    }
                  }}
                  className={`relative p-3.5 rounded-2xl border transition-all text-left flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-[#1D4ED8] bg-[#EFF6FF]/40 ring-2 ring-[#1D4ED8]/30 shadow-sm'
                      : 'border-[#E2E8F0] bg-white hover:border-[#94A3B8] hover:shadow-xs'
                  }`}
                >
                  {/* Top Bar with Number & Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-[#94A3B8] group-hover:text-[#64748B]">
                      #{String(logo.id).padStart(2, '0')}
                    </span>

                    <div className="flex items-center gap-1">
                      {isCurrentActive && (
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#DCFCE7] text-[#15803D] px-2 py-0.5 rounded-full border border-[#86EFAC]">
                          Active Now
                        </span>
                      )}
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[#1D4ED8] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* SVG Logo Display */}
                  <div className="h-12 flex items-center justify-center my-2 px-1">
                    {logo.renderLogo({ className: 'h-8 sm:h-9 w-auto max-w-full group-hover:scale-105 transition-transform' })}
                  </div>

                  {/* Metadata */}
                  <div className="mt-2 pt-2 border-t border-[#F1F5F9]">
                    <div className="text-xs font-black text-[#0F172A] truncate">
                      {logo.name}
                    </div>
                    <div className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
                      {logo.tagline}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-bold text-[#64748B] hover:text-[#0F172A] px-3 py-2 rounded-xl hover:bg-[#E2E8F0] transition-colors"
          >
            Restore Default (Logo 1)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-[#475569] hover:text-[#0F172A] px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] transition-colors shadow-2xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="text-xs font-bold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] px-5 py-2 rounded-xl transition-all shadow-xs active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save Selection</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {savedToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0F172A] text-white px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            <span>NOVEA brand logo settings updated successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
};
