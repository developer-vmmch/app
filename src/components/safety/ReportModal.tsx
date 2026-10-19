import React, { useState } from 'react';
import { X, Flag, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

interface Props {
  targetTitleOrSnippet?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<Props> = ({ targetTitleOrSnippet, isOpen, onClose }) => {
  const [reason, setReason] = useState<
    'patient_privacy_phi' | 'unverified_medical_claim' | 'harassment_unprofessional' | 'commercial_solicitation' | 'other'
  >('patient_privacy_phi');
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!explanation.trim()) return;

    setSubmitting(true);
    await api.submitReport({
      targetType: 'post',
      targetId: `item-${Date.now()}`,
      targetTitleOrSnippet,
      reason,
      explanation: explanation.trim(),
    });
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-950 text-rose-400">
              <Flag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                Healthcare Moderation & Safety Report
              </h3>
              <p className="text-[10px] text-slate-400">
                Enforcing medical professional rules and patient privacy
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-teal-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-100">Report Transmitted to Medical Board</h4>
            <p className="text-xs text-slate-400">
              Thank you for upholding peer patient privacy and evidence-based medicine standards.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
            {targetTitleOrSnippet && (
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 italic truncate">
                "{targetTitleOrSnippet}"
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Reason for Moderation Review *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              >
                <option value="patient_privacy_phi">
                  Protected Health Information (PHI) / Patient Identifier Breach
                </option>
                <option value="unverified_medical_claim">
                  Unverified Medical Claim / Non-Evidence Based Advice
                </option>
                <option value="harassment_unprofessional">
                  Unprofessional Conduct or Harassment
                </option>
                <option value="commercial_solicitation">
                  Commercial Solicitation / Job Recruitment (Prohibited)
                </option>
                <option value="other">Other Violation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Clinical Context & Explanation *
              </label>
              <textarea
                rows={3}
                required
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Explain the specific issue (e.g. identifiable patient initials in text, unreferenced drug dosing claim)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !explanation.trim()}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow"
              >
                {submitting ? 'Submitting...' : 'File Audit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
