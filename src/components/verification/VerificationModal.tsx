import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building,
  Upload,
} from 'lucide-react';
import { DoctorProfile, VerificationStatus } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  doctor: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updatedDoctor: DoctorProfile) => void;
}

const COUNCILS = [
  'Tamil Nadu Medical Council (TNMC)',
  'National Medical Commission (NMC India)',
  'Karnataka Medical Council (KMC)',
  'Maharashtra Medical Council (MMC)',
  'General Medical Council (GMC UK)',
  'US State Medical Boards (FSMB)',
];

export const VerificationModal: React.FC<Props> = ({
  doctor,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [council, setCouncil] = useState(doctor.registrationCouncil || COUNCILS[0]);
  const [regNumber, setRegNumber] = useState(doctor.medicalRegistrationNumber || '');
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminSimulating, setAdminSimulating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) return;

    setSubmitting(true);
    const res = await api.submitVerificationProof(doctor.id, {
      council,
      regNumber: regNumber.trim(),
      documentUrl: documentUploaded ? 'https://storage.amtnovanet.org/docs/tnmc-cert-scan.pdf' : undefined,
    });
    setSubmitting(false);

    if (res.success) {
      onStatusUpdated(res.data);
    }
  };

  const handleSimulateAdminApproval = async () => {
    setAdminSimulating(true);
    const res = await api.adminApproveVerification(
      doctor.id,
      `Official roll verified against ${council} register by AMT Medical Board.`
    );
    setAdminSimulating(false);
    if (res.success) {
      onStatusUpdated(res.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92%] overflow-y-auto shadow-2xl border border-[#E1E9F3]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E1E9F3] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#246BCE] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12345B]">
                Medical Council Verification
              </h3>
              <p className="text-[11px] text-[#63738A]">
                Tamil Nadu Medical Council & State Councils
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#63738A] hover:text-[#12345B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Status Card */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#E1E9F3] flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#63738A] tracking-wider block">
                Current Verification Status
              </span>
              <div className="mt-1">
                <VerificationBadge status={doctor.verificationStatus} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#63738A] block">Stable Internal ID</span>
              <span className="font-mono text-xs font-bold text-[#12345B]">{doctor.id}</span>
            </div>
          </div>

          {/* TNMC Integration Notice from Section 9 */}
          <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/30 space-y-1.5 text-xs text-[#12345B]">
            <div className="flex items-center gap-1.5 font-bold text-[#246BCE]">
              <Lock className="w-4 h-4 shrink-0" />
              <span>TNMC Official Verification Protocol (Section 9)</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#142238]">
              The official Tamil Nadu Medical Council (TNMC) doctor search uses controlled request validation and email OTP authentication. We never scrape or assume unofficial public APIs. Credential certificates are held in secure <strong>PENDING_REVIEW</strong> until registrar audit.
            </p>
          </div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1">
                Medical Registration Council *
              </label>
              <select
                value={council}
                onChange={(e) => setCouncil(e.target.value)}
                className="w-full bg-[#F6F9FD] border border-[#E1E9F3] rounded-lg px-3 py-2 text-xs text-[#142238] focus:outline-none focus:border-[#246BCE]"
              >
                {COUNCILS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1">
                Medical Registration / Certificate Number *
              </label>
              <input
                type="text"
                required
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="e.g. TNMC-89421 or NMC-109482"
                className="w-full bg-[#F6F9FD] border border-[#E1E9F3] rounded-lg px-3 py-2 text-xs text-[#142238] focus:outline-none focus:border-[#246BCE]"
              />
              <span className="text-[10px] text-[#63738A] mt-0.5 block">
                Never invent false numbers. Full registration numbers are kept private and not displayed publicly by default.
              </span>
            </div>

            {/* Document proof upload */}
            <div>
              <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1">
                Medical Registration Certificate Scan (Optional PDF/Image)
              </label>
              <div
                onClick={() => setDocumentUploaded(!documentUploaded)}
                className={`p-3 rounded-xl border-2 border-dashed cursor-pointer text-center transition-colors ${
                  documentUploaded
                    ? 'border-[#16845B] bg-[#EAF8F1] text-[#16845B]'
                    : 'border-[#E1E9F3] hover:border-[#246BCE] bg-[#F6F9FD] text-[#63738A]'
                }`}
              >
                <Upload className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium block">
                  {documentUploaded ? 'Registration Proof Attached: TNMC_Cert_Scan.pdf' : 'Click to simulate document upload'}
                </span>
                <span className="text-[10px] text-[#63738A] block">
                  Encrypted HIPAA/GDPR private document store
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg text-xs text-[#63738A] hover:text-[#142238]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-xl bg-[#246BCE] hover:bg-[#12345B] text-white text-xs font-bold shadow-xs transition-colors"
              >
                {submitting ? 'Submitting Proof...' : 'Submit for Council Audit'}
              </button>
            </div>
          </form>

          {/* Admin Simulation Section (for demonstration of Section 9 review flow) */}
          <div className="pt-3 border-t border-[#E1E9F3] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#63738A] tracking-wider block">
              Medical Board Registrar Review Simulation
            </span>
            <p className="text-[11px] text-[#63738A]">
              Test the administrator verification decision workflow to transition this account to <strong>VERIFIED</strong>:
            </p>
            <button
              type="button"
              onClick={handleSimulateAdminApproval}
              disabled={adminSimulating || doctor.verificationStatus === 'VERIFIED'}
              className="w-full py-2 rounded-xl border border-[#16845B] bg-[#EAF8F1] hover:bg-[#16845B] hover:text-white text-[#16845B] text-xs font-bold transition-colors disabled:opacity-50"
            >
              {adminSimulating
                ? 'Validating Council Roll...'
                : doctor.verificationStatus === 'VERIFIED'
                ? '✓ Already Verified'
                : 'Approve & Confirm Verified Doctor Status'}
            </button>
          </div>

          {/* Audit Trail */}
          {doctor.verificationAuditTrail && doctor.verificationAuditTrail.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#E1E9F3]">
              <span className="text-[10px] uppercase font-bold text-[#63738A] tracking-wider block">
                Verification Audit History:
              </span>
              <div className="space-y-1 text-[11px] text-[#142238]">
                {doctor.verificationAuditTrail.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-[#F6F9FD] border border-[#E1E9F3]">
                    <div className="flex items-center justify-between text-[10px] text-[#63738A]">
                      <span className="font-semibold text-[#12345B]">{item.status}</span>
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="mt-0.5">{item.remarks}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
