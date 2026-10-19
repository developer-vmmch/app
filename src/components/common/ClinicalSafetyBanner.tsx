import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  X,
  FileCheck2,
  AlertTriangle,
  Database,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Props {
  isPolicyAccepted: boolean;
  onAcceptPolicy: () => Promise<{ success: boolean; error?: string }>;
  onOpenDetailedPolicyModal?: () => void;
}

export const ClinicalSafetyBanner: React.FC<Props> = ({
  isPolicyAccepted,
  onAcceptPolicy,
  onOpenDetailedPolicyModal,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [hasCheckedConsent, setHasCheckedConsent] = useState(false);
  const [isSubmittingAcceptance, setIsSubmittingAcceptance] = useState(false);
  const [acceptanceError, setAcceptanceError] = useState<string | null>(null);

  // If already accepted and confirmed by backend, don't show the persistent banner on feed
  if (isPolicyAccepted) {
    return null;
  }

  const handleReviewRules = () => {
    setAcceptanceError(null);
    if (onOpenDetailedPolicyModal) {
      onOpenDetailedPolicyModal();
    } else {
      setIsPolicyModalOpen(true);
    }
  };

  const handleConfirmAcceptance = async () => {
    if (!hasCheckedConsent) return;
    setIsSubmittingAcceptance(true);
    setAcceptanceError(null);

    const result = await onAcceptPolicy();
    setIsSubmittingAcceptance(false);

    if (result.success) {
      setIsPolicyModalOpen(false);
    } else {
      setAcceptanceError(result.error || 'Failed to persist policy acceptance. Please retry.');
    }
  };

  return (
    <>
      {/* Premium Dark Navy PHI Policy Banner */}
      <section
        aria-label="Clinical Privacy & PHI De-identification Standard"
        className="bg-gradient-to-r from-[#0A1A2F] via-[#0E2442] to-[#122D52] border-b border-[#1E3E66] px-3.5 sm:px-4 py-2.5 text-slate-200 relative shadow-inner overflow-hidden shrink-0"
      >
        {/* Subtle Ambient Medical Blue Glow */}
        <div
          aria-hidden="true"
          className="absolute -top-12 right-1/4 w-48 h-24 bg-[#246BCE]/15 rounded-full blur-2xl pointer-events-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 max-w-7xl mx-auto relative z-10">
          {/* Left: Medical Shield Icon & Clear Heading Hierarchy without clipping */}
          <div className="flex items-start sm:items-center gap-2.5 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-[#14355E] text-[#42A5F5] border border-[#246BCE]/30 shrink-0 shadow-xs mt-0.5 sm:mt-0">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-xs sm:text-[13px] font-bold text-white tracking-tight">
                  Strict Patient PHI De-identification Standard
                </h2>
                <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-500/40 text-[9px] font-semibold text-amber-300">
                  Action Required
                </span>
              </div>
              <p className="text-[11px] text-slate-300/90 leading-snug mt-0.5">
                Protect patient privacy. Share educational knowledge responsibly.
              </p>
            </div>
          </div>

          {/* Right: Actions (Review Rules button cleanly positioned) */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              onClick={handleReviewRules}
              className="px-3 py-1.5 rounded-lg bg-[#246BCE] hover:bg-[#347DE0] text-white text-[11px] sm:text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Review Rules</span>
              <FileCheck2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsExpanded((prev) => !prev)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse rules summary' : 'Expand rules summary'}
              title={isExpanded ? 'Collapse quick summary' : 'Expand quick summary'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Quick Inline Summary */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-[#1E3E66]/80 text-[11px] text-slate-300 space-y-1.5 leading-relaxed max-w-7xl mx-auto animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-2 rounded-lg bg-[#0C1B30]/80 border border-[#1E3E66]">
                <strong className="text-white block font-semibold">1. Zero Direct Identifiers</strong>
                <span className="text-slate-400 text-[10px]">
                  No patient names, MRN numbers, contact info, exact dates, or hospital room codes.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#0C1B30]/80 border border-[#1E3E66]">
                <strong className="text-white block font-semibold">2. Imagery Scrubbing</strong>
                <span className="text-slate-400 text-[10px]">
                  Scrub all radiology metadata tags and crop out facial or tattoo landmarks.
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[#0C1B30]/80 border border-[#1E3E66]">
                <strong className="text-white block font-semibold">3. Isolated from HMS</strong>
                <span className="text-slate-400 text-[10px]">
                  Zero sync with live hospital clinical records or electronic patient charts.
                </span>
              </div>
            </div>
            <div className="text-right pt-1">
              <button
                onClick={handleReviewRules}
                className="text-[#42A5F5] hover:text-[#64B5F6] underline text-[11px] font-semibold"
              >
                Open Full Policy & Acceptance Dialog →
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Complete Clinical Policy & PHI Acceptance Dialog */}
      {isPolicyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="phi-policy-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#D5E1F0] overflow-hidden">
            {/* Modal Header */}
            <div className="px-4 py-3.5 bg-gradient-to-r from-[#0A1A2F] to-[#122D52] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#246BCE]/30 border border-[#246BCE]/50 flex items-center justify-center text-[#42A5F5]">
                  <Lock className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 id="phi-policy-title" className="text-sm font-bold tracking-tight">
                    Strict Patient PHI De-identification Standard
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    AMT Doctor Knowledge Network · Version 1.2.0
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-[#142238] leading-relaxed">
              <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/20 space-y-1">
                <span className="font-bold text-[#12345B] block text-xs">
                  Mandatory Practitioner Obligation
                </span>
                <p className="text-[#63738A] text-[11px]">
                  All clinical case discussions, ECG interpretations, differential diagnoses, and
                  educational materials must be completely stripped of Protected Health
                  Information (PHI).
                </p>
              </div>

              {/* Prohibited Identifiers Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#12345B] text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-[#C43D4B]" />
                  <span>Prohibited Patient Information (18 Safe Harbor Identifiers)</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-[#63738A] text-[11px]">
                  <li>
                    <strong className="text-[#142238]">Names & Initials:</strong> Patient full name, first name, surname, or family relations.
                  </li>
                  <li>
                    <strong className="text-[#142238]">Medical Identifiers:</strong> Hospital Medical Record Number (MRN), IP/OP admission ID, or billing accounts.
                  </li>
                  <li>
                    <strong className="text-[#142238]">Specific Dates:</strong> Exact admission dates, discharge dates, or exact date of birth (ages &gt; 89 aggregated).
                  </li>
                  <li>
                    <strong className="text-[#142238]">Geographic Identifiers:</strong> Street address, ward/room number, or postal code.
                  </li>
                  <li>
                    <strong className="text-[#142238]">Biometrics:</strong> Un-obscured facial photographs, tattoo landmarks, or biometric records.
                  </li>
                </ul>
              </div>

              {/* Technical Architecture Safeguards */}
              <div className="space-y-2 pt-2 border-t border-[#E1E9F3]">
                <h4 className="font-bold text-[#12345B] text-xs flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-[#246BCE]" />
                  <span>System Architecture Isolation</span>
                </h4>
                <p className="text-[11px] text-[#63738A]">
                  Doctor Knowledge Network operates on an independent peer discussion store. It
                  has zero bridge or sync with live electronic health records (EHR) or AMT Nova
                  HMS patient charts.
                </p>
              </div>

              {/* Error display if persistence failed */}
              {acceptanceError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{acceptanceError}</span>
                </div>
              )}

              {/* Explicit Acceptance Checkbox */}
              <div className="p-3 rounded-xl bg-[#F6F9FD] border border-[#D5E1F0] space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasCheckedConsent}
                    onChange={(e) => setHasCheckedConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-[#D5E1F0] text-[#246BCE] focus:ring-[#246BCE]"
                  />
                  <span className="text-[11px] font-semibold text-[#142238] leading-tight">
                    I have read and agree to strictly comply with the Patient PHI De-identification Standard. I will never publish identifiable patient records or clinical numbers.
                  </span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-[#F6F9FD] border-t border-[#E1E9F3] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] text-[#63738A]">
                Acceptance is persisted per authenticated doctor profile.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setIsPolicyModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-[#D5E1F0] text-xs font-semibold text-[#63738A] hover:bg-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={!hasCheckedConsent || isSubmittingAcceptance}
                  onClick={handleConfirmAcceptance}
                  className="px-4 py-1.5 rounded-xl bg-[#246BCE] hover:bg-[#12345B] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  {isSubmittingAcceptance ? (
                    'Saving...'
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Accept & Acknowledge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
