import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Stethoscope,
} from 'lucide-react';
import { DoctorProfile } from '../../types';

interface Props {
  isOpen: boolean;
  currentDoctor: DoctorProfile;
  onAccept: () => Promise<{ success: boolean; error?: string }>;
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({
  isOpen,
  currentDoctor,
  onAccept,
  onClose,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAcceptTerms = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    setError(null);

    const result = await onAccept();
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to record terms acceptance. Please try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="terms-title"
      className="fixed inset-0 z-50 bg-[#040C1A]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D5E1F0] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-[#12345B] to-[#1E4C82] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#246BCE]/40 border border-white/20 flex items-center justify-center text-white">
              <FileText className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 id="terms-title" className="text-sm font-bold tracking-tight">
                Terms of Service & Code of Conduct
              </h3>
              <p className="text-[11px] text-slate-200">
                AMT Doctor Knowledge Network · Version 2.0.0
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-[#142238] leading-relaxed">
          <div className="p-2.5 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/20 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-[#246BCE] shrink-0" />
            <span className="text-[11px] text-[#12345B] font-semibold">
              Practitioner Agreement for {currentDoctor.fullName} ({currentDoctor.primarySpecialty})
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#12345B] text-xs">
              1. Professional Verification & Credential Integrity
            </h4>
            <p className="text-[11px] text-[#63738A]">
              By participating, you confirm that your medical council registration ({currentDoctor.registrationCouncil})
              and qualifications are active and in good standing. You agree not to impersonate other
              healthcare personnel.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#12345B] text-xs">
              2. Peer Educational Discourse
            </h4>
            <p className="text-[11px] text-[#63738A]">
              Discussions and clinical insights shared are intended solely for peer-to-peer educational
              exchange among licensed medical professionals. They do not constitute formal diagnostic
              directives or telemedicine consultations.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[#12345B] text-xs">
              3. Independent System Architecture
            </h4>
            <p className="text-[11px] text-[#63738A]">
              The Doctor Knowledge Network does not sync, write, or access electronic health record (EHR)
              charts or hospital management databases.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Consent Checkbox */}
          <div className="p-3 rounded-xl bg-[#F6F9FD] border border-[#D5E1F0]">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#D5E1F0] text-[#246BCE] focus:ring-[#246BCE]"
              />
              <span className="text-[11px] font-semibold text-[#142238] leading-tight">
                I agree to the AMT Doctor Knowledge Network Terms of Service (Version 2.0.0). I understand this acceptance is stored with my verified profile.
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#F6F9FD] border-t border-[#E1E9F3] flex items-center justify-between gap-2 shrink-0">
          <span className="text-[10px] text-[#63738A]">
            Single-time prompt per version
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-[#D5E1F0] text-xs font-semibold text-[#63738A] hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!agreed || isSubmitting}
              onClick={handleAcceptTerms}
              className="px-4 py-1.5 rounded-xl bg-[#12345B] hover:bg-[#1B4B82] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Terms</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
