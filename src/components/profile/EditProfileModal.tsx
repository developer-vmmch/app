import React, { useState, useEffect } from 'react';
import {
  X,
  Camera,
  Image as ImageIcon,
  User,
  Building2,
  Stethoscope,
  GraduationCap,
  MapPin,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { api } from '../../services/api';
import { LogoSettingsModal } from '../branding/LogoSettingsModal';

interface Props {
  isOpen: boolean;
  profile: DoctorProfile;
  onClose: () => void;
  onProfileUpdated: (updated: DoctorProfile) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1594824813637-295b95d13778?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=80',
];

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<Props> = ({
  isOpen,
  profile,
  onClose,
  onProfileUpdated,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [qualification, setQualification] = useState(profile.qualification);
  const [primarySpecialty, setPrimarySpecialty] = useState(profile.primarySpecialty);
  const [institution, setInstitution] = useState(profile.institution);
  const [location, setLocation] = useState(profile.country || 'Tamil Nadu, India');
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [coverImageUrl, setCoverImageUrl] = useState(
    (profile as any).coverImageUrl || SAMPLE_COVERS[0]
  );
  const [interestsInput, setInterestsInput] = useState(
    profile.areasOfInterest ? profile.areasOfInterest.join(', ') : 'Cardiology, Pediatrics'
  );
  const [mentorshipAvailable, setMentorshipAvailable] = useState(
    profile.mentorshipAvailable ?? true
  );

  const [saving, setSaving] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFullName(profile.fullName);
      setQualification(profile.qualification);
      setPrimarySpecialty(profile.primarySpecialty);
      setInstitution(profile.institution);
      setLocation(profile.country || 'Tamil Nadu, India');
      setBio(profile.bio);
      setAvatarUrl(profile.avatarUrl);
      setCoverImageUrl((profile as any).coverImageUrl || SAMPLE_COVERS[0]);
      setInterestsInput(
        profile.areasOfInterest ? profile.areasOfInterest.join(', ') : 'Cardiology, Clinical Research'
      );
      setMentorshipAvailable(profile.mentorshipAvailable ?? true);
      setErrorMsg(null);
      setSuccessMsg(false);
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full name cannot be empty.');
      return;
    }

    setSaving(true);

    const areasOfInterest = interestsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const updates: Partial<DoctorProfile> = {
      fullName: fullName.trim(),
      qualification: qualification.trim(),
      primarySpecialty: primarySpecialty.trim(),
      specialty: primarySpecialty.trim(),
      institution: institution.trim(),
      country: location.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim(),
      areasOfInterest,
      mentorshipAvailable,
      ...({ coverImageUrl: coverImageUrl.trim() } as any),
    };

    const res = await api.updateProfile(profile.id, updates);
    setSaving(false);

    if (res.success) {
      setSuccessMsg(true);
      onProfileUpdated(res.data);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg(res.error?.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Doctor Profile"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="w-full max-w-xl max-h-[92vh] bg-white rounded-3xl overflow-hidden border border-[#E2E8F0] shadow-2xl flex flex-col">
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center border border-[#BFDBFE]">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#0F172A]">Edit Professional Profile</h3>
              <p className="text-[11px] text-[#64748B]">Update public credentials, clinical bio & interests</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close edit profile dialog"
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center gap-2 font-bold animate-fadeIn">
              <Check className="w-4 h-4 shrink-0 text-green-600" />
              <span>Profile updated successfully! Saving to network...</span>
            </div>
          )}

          {/* Cover & Avatar Live Preview */}
          <div className="space-y-3">
            <span className="block font-bold text-[#0F172A] text-xs">Cover Banner & Profile Photo</span>

            <div className="relative rounded-2xl overflow-hidden border border-[#CBD5E1] bg-slate-900 h-32 sm:h-36 shadow-xs">
              <img
                src={coverImageUrl}
                alt="Profile cover preview"
                className="w-full h-full object-cover opacity-85"
              />

              {/* Overlapping Avatar */}
              <div className="absolute bottom-3 left-4 flex items-end gap-3">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border-2 border-white ring-2 ring-[#1D4ED8] shadow-md bg-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#16A34A] border border-white flex items-center justify-center text-white">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                </div>

                <div className="text-white drop-shadow mb-1">
                  <span className="font-bold text-sm block leading-tight">{fullName || 'Doctor Name'}</span>
                  <span className="text-[11px] text-teal-300 font-semibold">{primarySpecialty}</span>
                </div>
              </div>
            </div>

            {/* Quick Sample Avatars Picker */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-[#64748B]">Choose from verified doctor avatars:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      avatarUrl === url ? 'border-[#1D4ED8] ring-2 ring-[#1D4ED8]/30 scale-105' : 'border-[#CBD5E1] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar sample ${i}`} className="w-10 h-10 object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Full Name"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Professional Title & Degrees</label>
              <input
                type="text"
                value={qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="MBBS, MD, DM, FRCS"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Primary Specialty</label>
              <input
                type="text"
                value={primarySpecialty}
                onChange={(e) => setPrimarySpecialty(e.target.value)}
                placeholder="Cardiology, Pediatrics, etc."
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Affiliated Hospital / Institution</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="Hospital or Medical College"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Location / Practice Region</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State, Country"
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#0F172A] mb-1">Clinical Mentorship Availability</label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={mentorshipAvailable}
                    onChange={(e) => setMentorshipAvailable(e.target.checked)}
                    className="w-4 h-4 text-[#1D4ED8] rounded"
                  />
                  <span className="font-semibold text-[#0F172A]">Available for resident mentorship</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Clinical Biography & Experience</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary of clinical experience, research interests, and surgical or clinical focus..."
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl p-3 text-xs focus:outline-none focus:border-[#1D4ED8] leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-bold text-[#0F172A] mb-1">Areas of Interest (comma-separated)</label>
            <input
              type="text"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              placeholder="e.g. Interventional Cardiology, Pediatric Critical Care, Medical Robotics"
              className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
            />
          </div>

          {/* Branding / Logo Settings Section (Master Prompt Section 4) */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
                <span className="font-bold text-xs text-[#0F172A]">NOVEA Brand & Logo Settings</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoModal(true)}
                className="text-xs font-bold text-[#1D4ED8] hover:text-[#1E40AF] px-2.5 py-1 rounded-lg bg-white border border-[#CBD5E1] hover:border-[#1D4ED8] transition-all shadow-2xs cursor-pointer"
              >
                Open 36-Logo Gallery
              </button>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Note: The NOVEA brand logo is application branding, whereas your profile avatar above is personal profile information. Configure your preferred header logo and 10-minute auto-rotation schedule.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#475569] font-bold hover:bg-[#F8FAFC] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? <span>Saving...</span> : <span>Save Changes</span>}
            </button>
          </div>
        </form>

        {/* Logo Settings Modal */}
        {showLogoModal && (
          <LogoSettingsModal
            isOpen={showLogoModal}
            onClose={() => setShowLogoModal(false)}
          />
        )}
      </div>
    </div>
  );
};
