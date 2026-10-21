import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building2,
  Upload,
  Award,
  Sparkles,
  Building,
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

const ACCREDITATIONS = [
  'NABH (National Accreditation Board for Hospitals & Healthcare)',
  'JCI (Joint Commission International)',
  'NABL (National Accreditation Board for Testing and Calibration Laboratories)',
  'ISO 15189 Medical Laboratories',
  'State Department of Health Licensure',
];

export const VerificationModal: React.FC<Props> = ({
  doctor,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'doctor' | 'organisation'>('doctor');

  // Doctor verification state
  const [council, setCouncil] = useState(doctor.registrationCouncil || COUNCILS[0]);
  const [regNumber, setRegNumber] = useState(doctor.medicalRegistrationNumber || '');
  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [adminSimulating, setAdminSimulating] = useState(false);

  // Organisation verification state
  const [orgName, setOrgName] = useState(doctor.institution || 'Vinayaka Mission Hospital');
  const [orgType, setOrgType] = useState<'hospital' | 'clinic' | 'laboratory' | 'academic_center'>('hospital');
  const [accreditation, setAccreditation] = useState(ACCREDITATIONS[0]);
  const [orgLicenseNumber, setOrgLicenseNumber] = useState('NABH-HOSP-TN-2024-884');
  const [orgSubmitted, setOrgSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmitDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNumber.trim()) return;

    setSubmitting(true);
    const res = await api.submitDoctorVerification({
      doctorId: doctor.id,
      fullName: doctor.fullName,
      registrationCouncil: council,
      medicalRegistrationNumber: regNumber.trim(),
      qualification: doctor.qualification || 'MBBS, MD',
      primarySpecialty: doctor.primarySpecialty || doctor.specialty || 'Internal Medicine',
      idDocumentUrl: documentUploaded ? 'https://storage.amtnovanet.org/docs/tnmc-cert-scan.pdf' : undefined,
    });
    setSubmitting(false);

    if (res.success) {
      onStatusUpdated(res.data);
    }
  };

  const handleSubmitOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !orgLicenseNumber.trim()) return;

    setSubmitting(true);
    const res = await api.submitOrganisationVerification({
      orgName: orgName.trim(),
      type: orgType,
      registrationNumber: orgLicenseNumber.trim(),
      accreditationBody: accreditation,
      representativeDoctorId: doctor.id,
      documentUrl: 'https://storage.amtnovanet.org/docs/org-accreditation-cert.pdf',
    });
    setSubmitting(false);

    if (res.success) {
      setOrgSubmitted(true);
    }
  };

  const handleSimulateAdminApproval = async () => {
    setAdminSimulating(true);
    const res = await api.adminApproveVerification(
      doctor.id,
      `Official roll verified against ${council} register by NOVEA Medical Board.`
    );
    setAdminSimulating(false);
    if (res.success) {
      onStatusUpdated(res.data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92%] overflow-y-auto shadow-2xl border border-[#E2E8F0]">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                NOVEA Official Medical Verification
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Medical Council Credential & Organisation Authentication
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: Doctor vs Organisation */}
        <div className="px-4 pt-3 flex items-center gap-2 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <button
            onClick={() => setActiveTab('doctor')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'doctor'
                ? 'border-[#1D4ED8] text-[#1D4ED8]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Doctor Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('organisation')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'organisation'
                ? 'border-[#0D9488] text-[#0D9488]'
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Hospital & Organisation</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {activeTab === 'doctor' ? (
            <>
              {/* Current Status Card */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                    Current Verification Status
                  </span>
                  <div className="mt-1">
                    <VerificationBadge status={doctor.verificationStatus} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] block">Practitioner ID</span>
                  <span className="font-mono text-xs font-bold text-[#0F172A]">{doctor.id}</span>
                </div>
              </div>

              {/* Protocol Notice */}
              <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1 text-xs text-[#1E3A8A]">
                <div className="flex items-center gap-1.5 font-bold text-[#1D4ED8]">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span>State Medical Council Verification Protocol</span>
                </div>
                <p className="text-[11px] leading-relaxed text-[#334155]">
                  Verification status confers the Verified Doctor Blue Badge. Credentials are confirmed against official state council gazette rolls. No synthetic claims are accepted.
                </p>
              </div>

              {/* Doctor Form */}
              <form onSubmit={handleSubmitDoctor} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Medical Registration Council *
                  </label>
                  <select
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D4ED8]"
                  >
                    {COUNCILS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Medical Council Registration Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    placeholder="e.g. TNMC-89421 or NMC-109482"
                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <span className="text-[10px] text-[#64748B] mt-0.5 block">
                    Registration numbers are held securely and matched against public registrar audits.
                  </span>
                </div>

                {/* Document proof upload */}
                <div>
                  <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                    Medical Registration Certificate Scan (Optional PDF/Image)
                  </label>
                  <div
                    onClick={() => setDocumentUploaded(!documentUploaded)}
                    className={`p-3 rounded-xl border-2 border-dashed cursor-pointer text-center transition-colors ${
                      documentUploaded
                        ? 'border-[#16A34A] bg-[#F0FDF4] text-[#16A34A]'
                        : 'border-[#CBD5E1] hover:border-[#1D4ED8] bg-[#F8FAFC] text-[#64748B]'
                    }`}
                  >
                    <Upload className="w-5 h-5 mx-auto mb-1 text-[#64748B]" />
                    <span className="text-xs font-semibold block">
                      {documentUploaded ? 'Registration Proof Attached: Council_Cert.pdf' : 'Click to attach certificate scan'}
                    </span>
                    <span className="text-[10px] text-[#64748B] block">
                      Encrypted HIPAA/GDPR private document storage
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    {submitting ? 'Submitting Proof...' : 'Submit for Council Audit'}
                  </button>
                </div>
              </form>

              {/* Admin Simulation Section */}
              <div className="pt-3 border-t border-[#E2E8F0] space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                  Medical Board Registrar Review Simulation
                </span>
                <p className="text-[11px] text-[#64748B]">
                  Test the administrator verification decision workflow to transition this account to <strong>VERIFIED</strong>:
                </p>
                <button
                  type="button"
                  onClick={handleSimulateAdminApproval}
                  disabled={adminSimulating || doctor.verificationStatus === 'VERIFIED'}
                  className="w-full py-2 rounded-xl border border-[#16A34A] bg-[#F0FDF4] hover:bg-[#16A34A] hover:text-white text-[#16A34A] text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {adminSimulating
                    ? 'Validating Council Roll...'
                    : doctor.verificationStatus === 'VERIFIED'
                    ? '✓ Already Verified Practitioner'
                    : 'Approve & Confirm Verified Doctor Status'}
                </button>
              </div>

              {/* Audit Trail */}
              {doctor.verificationAuditTrail && doctor.verificationAuditTrail.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider block">
                    Verification Audit History:
                  </span>
                  <div className="space-y-1 text-[11px] text-[#0F172A]">
                    {doctor.verificationAuditTrail.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        <div className="flex items-center justify-between text-[10px] text-[#64748B]">
                          <span className="font-semibold text-[#1D4ED8]">{item.status}</span>
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="mt-0.5">{item.remarks}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Organisation / Hospital Verification */
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#F0FDFA] border border-[#99F6E4] space-y-1 text-xs text-[#134E4A]">
                <div className="flex items-center gap-1.5 font-bold text-[#0D9488]">
                  <Sparkles className="w-4 h-4 text-[#0D9488]" />
                  <span>Gold Checkmark Institution Verification</span>
                </div>
                <p className="text-[11px] text-[#0F766E] leading-relaxed">
                  Verified Healthcare Institutions receive the Gold Badge, allowing official hospital announcements, accredited residency programs, and inter-hospital consult networks.
                </p>
              </div>

              {orgSubmitted ? (
                <div className="py-8 text-center space-y-2 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-6">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
                  <h4 className="text-sm font-bold text-[#0F172A]">Organisation Dossier Submitted</h4>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                    Your institutional accreditation package for <strong>{orgName}</strong> is queued for registrar audit. You will receive an official notification once reviewed.
                  </p>
                  <button
                    onClick={() => setOrgSubmitted(false)}
                    className="mt-2 text-xs text-[#0D9488] font-bold hover:underline cursor-pointer"
                  >
                    Submit another organization
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrg} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Healthcare Institution Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="e.g. Apollo Heart Center or Vinayaka Mission Hospital"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                        Facility Type *
                      </label>
                      <select
                        value={orgType}
                        onChange={(e) => setOrgType(e.target.value as any)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="hospital">Tertiary Hospital</option>
                        <option value="clinic">Specialty Clinic</option>
                        <option value="academic_center">Academic Medical Center</option>
                        <option value="laboratory">Diagnostic Laboratory</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                        Accreditation Body *
                      </label>
                      <select
                        value={accreditation}
                        onChange={(e) => setAccreditation(e.target.value)}
                        className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                      >
                        {ACCREDITATIONS.map((a) => (
                          <option key={a} value={a}>
                            {a.split(' ')[0]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
                      Accreditation / Government License Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={orgLicenseNumber}
                      onChange={(e) => setOrgLicenseNumber(e.target.value)}
                      placeholder="e.g. NABH-HOSP-TN-2024-884"
                      className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 rounded-lg text-xs text-[#64748B] hover:text-[#0F172A] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      {submitting ? 'Submitting...' : 'Apply for Gold Verification'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
