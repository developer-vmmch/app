import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Globe,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Stethoscope,
} from 'lucide-react';
import { Institution, DoctorProfile, InstitutionMembership } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  institution: Institution | null;
  currentUser: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
  onMembershipUpdated: () => void;
  onOpenDoctorProfile: (id: string) => void;
}

export const InstitutionDetailModal: React.FC<Props> = ({
  institution,
  currentUser,
  isOpen,
  onClose,
  onMembershipUpdated,
  onOpenDoctorProfile,
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [userMembership, setUserMembership] = useState<InstitutionMembership | null>(null);
  const [memberDoctors, setMemberDoctors] = useState<DoctorProfile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (institution && isOpen) {
      loadInstitutionData();
    }
  }, [institution, isOpen]);

  const loadInstitutionData = async () => {
    if (!institution) return;
    setLoading(true);

    const [memsRes, doctorsRes] = await Promise.all([
      api.getInstitutionMemberships(currentUser.id),
      api.getDoctors(),
    ]);

    if (memsRes.success) {
      const match = memsRes.data.find((m) => m.institutionId === institution.id);
      setUserMembership(match || null);
    }

    if (doctorsRes.success) {
      // Find all doctors who have this institution listed
      const matchingDoctors = doctorsRes.data.filter((d) =>
        d.institution.toLowerCase().includes(institution.name.toLowerCase().split(' ')[0])
      );
      setMemberDoctors(matchingDoctors);
    }

    if (institution.departments.length > 0) {
      setSelectedDepartment(institution.departments[0]);
    }

    setLoading(false);
  };

  if (!isOpen || !institution) return null;

  const handleRequestJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await api.requestJoinInstitution(institution.id, selectedDepartment);
    setSubmitting(false);
    if (res.success) {
      setUserMembership(res.data);
      onMembershipUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[92%] overflow-y-auto shadow-2xl border border-[#E1E9F3]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E1E9F3] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#12345B] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[#12345B] truncate max-w-[260px]">
                  {institution.name}
                </h3>
                {institution.isVerified && (
                  <span title="Verified Institution">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#63738A]">ID: {institution.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#63738A] hover:text-[#12345B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Institution Card Banner */}
          <div className="p-3.5 rounded-xl bg-[#F6F9FD] border border-[#E1E9F3] space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={institution.logoUrl}
                alt={institution.name}
                className="w-12 h-12 rounded-xl object-cover border border-[#E1E9F3]"
              />
              <div>
                <span className="text-xs font-bold text-[#12345B] block">{institution.name}</span>
                <span className="text-[11px] text-[#246BCE] font-medium block">
                  {institution.institutionType}
                </span>
                <span className="text-[10px] text-[#63738A]">
                  {institution.city}, {institution.state}, {institution.country}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E1E9F3] text-[11px] text-[#63738A]">
              <div className="flex items-center gap-1.5 truncate">
                <Globe className="w-3.5 h-3.5 text-[#246BCE] shrink-0" />
                <a href={institution.verifiedWebsite} target="_blank" rel="noreferrer" className="hover:underline truncate">
                  {institution.verifiedWebsite.replace('https://', '')}
                </a>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Mail className="w-3.5 h-3.5 text-[#246BCE] shrink-0" />
                <span className="truncate">{institution.officialContactEmail}</span>
              </div>
            </div>
          </div>

          {/* Membership Status & Join Action */}
          <div className="p-3.5 rounded-xl border border-[#E1E9F3] bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#12345B] uppercase tracking-wider">
                My Institutional Membership
              </span>
              {userMembership ? (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                    userMembership.status === 'ACTIVE'
                      ? 'bg-[#EAF8F1] text-[#16845B]'
                      : 'bg-[#FEF6EC] text-[#B7791F]'
                  }`}
                >
                  {userMembership.status === 'ACTIVE' ? 'Active Doctor Member' : 'Pending Hospital Approval'}
                </span>
              ) : (
                <span className="text-[11px] text-[#63738A]">Not a member</span>
              )}
            </div>

            {userMembership ? (
              <div className="text-xs text-[#142238] space-y-1">
                <p>
                  <strong>Assigned Department:</strong> {userMembership.department}
                </p>
                <p>
                  <strong>Institutional Role:</strong> {userMembership.role.replace('_', ' ')}
                </p>
                <p className="text-[10px] text-[#63738A]">
                  Enforced on backend. Hospital membership is strictly separate from your follower/following list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRequestJoin} className="space-y-2.5 pt-1">
                <p className="text-[11px] text-[#63738A]">
                  Request affiliation with an authorized clinical department. An institution administrator will review your medical credentials.
                </p>
                <div>
                  <label className="block text-[11px] font-bold text-[#142238] mb-1">
                    Select Your Department *
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full bg-[#F6F9FD] border border-[#E1E9F3] rounded-lg px-2.5 py-1.5 text-xs text-[#142238] focus:outline-none"
                  >
                    {institution.departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2 rounded-xl bg-[#246BCE] hover:bg-[#12345B] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  {submitting ? 'Submitting Join Request...' : 'Send Affiliation Request'}
                </button>
              </form>
            )}
          </div>

          {/* Clinical Departments List */}
          <div>
            <h4 className="text-xs font-bold text-[#12345B] uppercase tracking-wider mb-2">
              Recognized Departments ({institution.departments.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {institution.departments.map((dept) => (
                <span
                  key={dept}
                  className="text-xs px-2.5 py-1 rounded-lg bg-[#EAF3FF] text-[#12345B] font-medium border border-[#246BCE]/20"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>

          {/* Affiliated Doctors in Directory */}
          <div className="space-y-2 pt-2 border-t border-[#E1E9F3]">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#12345B] uppercase tracking-wider">
                Affiliated Doctors ({memberDoctors.length})
              </h4>
              <span className="text-[10px] text-[#63738A]">Hospital Faculty & Fellows</span>
            </div>

            <div className="space-y-2">
              {memberDoctors.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => {
                    onOpenDoctorProfile(doc.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#E1E9F3] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={doc.avatarUrl}
                      alt={doc.fullName}
                      className="w-9 h-9 rounded-full object-cover border border-[#E1E9F3]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#142238]">{doc.fullName}</span>
                        <VerificationBadge status={doc.verificationStatus} showText={false} />
                      </div>
                      <span className="text-[10px] text-[#246BCE] font-medium">
                        {doc.primarySpecialty} · {doc.qualification}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#63738A] font-mono">{doc.id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
