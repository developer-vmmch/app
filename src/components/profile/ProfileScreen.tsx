import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  GraduationCap,
  Globe,
  Award,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  UserCheck,
  Plus,
  FileCheck,
  Building,
  Save,
  Users,
} from 'lucide-react';
import { DoctorProfile, InstitutionMembership, Post } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';
import { VerificationModal } from '../verification/VerificationModal';

interface Props {
  doctorId?: string;
  onOpenInstitutionDetail: (institutionId: string) => void;
  onOpenDoctorProfile: (id: string) => void;
  onOpenMentorshipTab: () => void;
  onOpenAuthModal: () => void;
}

export const ProfileScreen: React.FC<Props> = ({
  doctorId,
  onOpenInstitutionDetail,
  onOpenDoctorProfile,
  onOpenMentorshipTab,
  onOpenAuthModal,
}) => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [memberships, setMemberships] = useState<InstitutionMembership[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [followersList, setFollowersList] = useState<DoctorProfile[]>([]);
  const [followingList, setFollowingList] = useState<DoctorProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'followers' | 'following' | 'institutions'>('posts');
  const [isEditing, setIsEditing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [editBio, setEditBio] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editMentorshipAvailable, setEditMentorshipAvailable] = useState(false);

  useEffect(() => {
    loadDoctorData();
  }, [doctorId]);

  const loadDoctorData = async () => {
    setLoading(true);
    let targetDoc: DoctorProfile;

    if (doctorId) {
      const res = await api.getDoctors();
      targetDoc = res.data.find((d) => d.id === doctorId) || res.data[0];
    } else {
      const res = await api.getCurrentUser();
      targetDoc = res.data;
    }

    setProfile(targetDoc);
    setEditBio(targetDoc.bio);
    setEditInstitution(targetDoc.institution);
    setEditMentorshipAvailable(targetDoc.mentorshipAvailable);

    // Load memberships, feed posts, and followers
    const [memsRes, feedRes, allDocsRes] = await Promise.all([
      api.getInstitutionMemberships(targetDoc.id),
      api.getFeed(),
      api.getDoctors(),
    ]);

    if (memsRes.success) {
      setMemberships(memsRes.data);
    }
    if (feedRes.success) {
      setPosts(feedRes.data.filter((p) => p.authorId === targetDoc.id));
    }
    if (allDocsRes.success) {
      // Mock followers and following list to demonstrate separate data relationships
      setFollowersList(allDocsRes.data.filter((d) => d.id !== targetDoc.id).slice(0, 3));
      setFollowingList(allDocsRes.data.filter((d) => d.id !== targetDoc.id).slice(1, 4));
    }

    setLoading(false);
  };

  const handleToggleFollow = async () => {
    if (!profile) return;
    const res = await api.toggleFollowDoctor(profile.id);
    if (res.success) {
      setProfile({
        ...profile,
        isFollowing: res.data.isFollowing,
        followersCount: res.data.followersCount,
      });
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    const res = await api.updateProfile(profile.id, {
      bio: editBio,
      institution: editInstitution,
      mentorshipAvailable: editMentorshipAvailable,
    });
    if (res.success) {
      setProfile(res.data);
      setIsEditing(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F6F9FD] text-[#63738A] text-xs">
        Loading doctor profile...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F9FD] overflow-y-auto">
      {/* Header Card */}
      <div className="bg-white border-b border-[#E1E9F3] p-4 space-y-3 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white ring-2 ring-[#246BCE] shadow-sm"
            />
            {profile.verificationStatus === 'VERIFIED' && (
              <span
                title="Verified Medical Practitioner"
                className="absolute -bottom-1 -right-1 p-1 bg-[#16845B] text-white rounded-full shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {profile.isCurrentUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-lg border border-[#E1E9F3] text-xs font-semibold text-[#142238] hover:bg-[#F6F9FD] transition-colors flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#246BCE]" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleToggleFollow}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
                  profile.isFollowing
                    ? 'border border-[#E1E9F3] text-[#142238] bg-white'
                    : 'bg-[#246BCE] text-white hover:bg-[#12345B]'
                }`}
              >
                {profile.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-[#16845B]" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow Doctor</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Doctor Identity & Stable ID */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold text-[#12345B]">{profile.fullName}</h2>
            <VerificationBadge status={profile.verificationStatus} />
          </div>

          <p className="text-xs font-semibold text-[#246BCE] mt-0.5">
            {profile.qualification} · {profile.primarySpecialty}
          </p>

          {profile.additionalSpecialties.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {profile.additionalSpecialties.map((spec) => (
                <span
                  key={spec}
                  className="text-[10px] bg-[#EAF3FF] text-[#12345B] font-medium px-1.5 py-0.5 rounded"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Council & Stable Internal ID Display */}
          <div className="flex items-center gap-3 text-[11px] text-[#63738A] mt-1.5 flex-wrap">
            <span className="font-mono text-[#12345B] font-semibold bg-[#F6F9FD] px-1.5 py-0.5 rounded border border-[#E1E9F3]">
              ID: {profile.id}
            </span>
            <span>·</span>
            <span>{profile.registrationCouncil}</span>
            <span>·</span>
            <span className="font-mono">Reg: {profile.medicalRegistrationNumber}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#63738A] mt-1">
            <Building2 className="w-3.5 h-3.5 text-[#246BCE] shrink-0" />
            <span className="font-medium text-[#142238]">{profile.institution}</span>
          </div>
        </div>

        {/* Verification Callout if not verified */}
        {profile.isCurrentUser && profile.verificationStatus !== 'VERIFIED' && (
          <div className="p-3 rounded-xl bg-[#FEF6EC] border border-[#B7791F]/30 flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#B7791F] block">
                Verification: {profile.verificationStatus}
              </span>
              <p className="text-[11px] text-[#142238]">
                Submit medical council registration certificate for official verified badge.
              </p>
            </div>
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[#B7791F] text-white text-[11px] font-bold shrink-0"
            >
              Verify Credentials
            </button>
          </div>
        )}

        {/* Metrics Row: Separate Followers, Following, Institutions */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#E1E9F3] text-center">
          <button
            onClick={() => setActiveTab('followers')}
            className={`p-2 rounded-lg border transition-all ${
              activeTab === 'followers' ? 'border-[#246BCE] bg-[#EAF3FF]' : 'border-[#E1E9F3] bg-white'
            }`}
          >
            <span className="block text-sm font-bold text-[#12345B]">{profile.followersCount}</span>
            <span className="text-[10px] text-[#63738A]">Followers</span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`p-2 rounded-lg border transition-all ${
              activeTab === 'following' ? 'border-[#246BCE] bg-[#EAF3FF]' : 'border-[#E1E9F3] bg-white'
            }`}
          >
            <span className="block text-sm font-bold text-[#12345B]">{profile.followingCount}</span>
            <span className="text-[10px] text-[#63738A]">Following</span>
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`p-2 rounded-lg border transition-all ${
              activeTab === 'institutions' ? 'border-[#246BCE] bg-[#EAF3FF]' : 'border-[#E1E9F3] bg-white'
            }`}
          >
            <span className="block text-sm font-bold text-[#12345B]">{memberships.length}</span>
            <span className="text-[10px] text-[#63738A]">Institutions</span>
          </button>

          <button
            onClick={() => setActiveTab('posts')}
            className={`p-2 rounded-lg border transition-all ${
              activeTab === 'posts' ? 'border-[#246BCE] bg-[#EAF3FF]' : 'border-[#E1E9F3] bg-white'
            }`}
          >
            <span className="block text-sm font-bold text-[#12345B]">{profile.publicationsCount}</span>
            <span className="text-[10px] text-[#63738A]">Publications</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white border-b border-[#E1E9F3] px-3 py-1.5 text-xs">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-1 text-center font-bold rounded-md transition-colors ${
            activeTab === 'posts' ? 'bg-[#EAF3FF] text-[#246BCE]' : 'text-[#63738A]'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('institutions')}
          className={`flex-1 py-1 text-center font-bold rounded-md transition-colors ${
            activeTab === 'institutions' ? 'bg-[#EAF3FF] text-[#246BCE]' : 'text-[#63738A]'
          }`}
        >
          Institutions ({memberships.length})
        </button>
        <button
          onClick={() => setActiveTab('followers')}
          className={`flex-1 py-1 text-center font-bold rounded-md transition-colors ${
            activeTab === 'followers' ? 'bg-[#EAF3FF] text-[#246BCE]' : 'text-[#63738A]'
          }`}
        >
          Followers ({profile.followersCount})
        </button>
        <button
          onClick={() => setActiveTab('following')}
          className={`flex-1 py-1 text-center font-bold rounded-md transition-colors ${
            activeTab === 'following' ? 'bg-[#EAF3FF] text-[#246BCE]' : 'text-[#63738A]'
          }`}
        >
          Following ({profile.followingCount})
        </button>
      </div>

      {/* Tab Body */}
      <div className="p-4 space-y-3 flex-1">
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {/* Bio */}
            <div className="bg-white p-3.5 rounded-xl border border-[#E1E9F3] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#63738A] tracking-wider block">
                Clinical Biography
              </span>
              <p className="text-xs text-[#142238] leading-relaxed">{profile.bio}</p>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#63738A] bg-white rounded-xl border border-[#E1E9F3]">
                No knowledge posts published yet.
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white p-3 rounded-xl border border-[#E1E9F3] space-y-2">
                  <h4 className="text-xs font-bold text-[#12345B]">{post.title || 'Clinical Post'}</h4>
                  <p className="text-xs text-[#142238] line-clamp-3 leading-relaxed">{post.body}</p>
                  <div className="flex items-center justify-between text-[11px] text-[#63738A] pt-1 border-t border-[#E1E9F3]">
                    <span className="text-[#246BCE] font-medium">{post.specialty}</span>
                    <span>{post.likesCount} likes · {post.commentsCount} comments</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Institutions Tab (Hospital accounts separate from doctors) */}
        {activeTab === 'institutions' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/30 text-xs text-[#12345B] space-y-1">
              <span className="font-bold text-[#246BCE] block">
                Mandatory Separation Rule (Section 13)
              </span>
              <p className="text-[11px] leading-relaxed text-[#142238]">
                Hospital membership is an institutional relationship with recognized department roles, completely distinct from following/followers.
              </p>
            </div>

            {memberships.map((mem) => (
              <div
                key={mem.id}
                onClick={() => onOpenInstitutionDetail(mem.institutionId)}
                className="bg-white p-3.5 rounded-xl border border-[#E1E9F3] flex items-center justify-between hover:border-[#246BCE] cursor-pointer transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={mem.institutionLogo}
                    alt={mem.institutionName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#E1E9F3]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#12345B] block">{mem.institutionName}</span>
                    <span className="text-[11px] text-[#246BCE] font-medium block">
                      Department: {mem.department}
                    </span>
                    <span className="text-[10px] text-[#63738A]">
                      Institutional Role: {mem.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#16845B] bg-[#EAF8F1] px-2 py-0.5 rounded">
                  {mem.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Followers Tab */}
        {activeTab === 'followers' && (
          <div className="space-y-2">
            <span className="text-[11px] text-[#63738A] block">
              Doctors who follow {profile.fullName} (Independent of hospital membership)
            </span>
            {followersList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDoctorProfile(doc.id)}
                className="p-3 bg-white rounded-xl border border-[#E1E9F3] flex items-center justify-between cursor-pointer hover:bg-[#F6F9FD]"
              >
                <div className="flex items-center gap-2.5">
                  <img src={doc.avatarUrl} alt={doc.fullName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <span className="text-xs font-bold text-[#142238] block">{doc.fullName}</span>
                    <span className="text-[10px] text-[#63738A]">{doc.primarySpecialty} · {doc.institution}</span>
                  </div>
                </div>
                <VerificationBadge status={doc.verificationStatus} showText={false} />
              </div>
            ))}
          </div>
        )}

        {/* Following Tab */}
        {activeTab === 'following' && (
          <div className="space-y-2">
            <span className="text-[11px] text-[#63738A] block">
              Doctors & institutions followed by {profile.fullName}
            </span>
            {followingList.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDoctorProfile(doc.id)}
                className="p-3 bg-white rounded-xl border border-[#E1E9F3] flex items-center justify-between cursor-pointer hover:bg-[#F6F9FD]"
              >
                <div className="flex items-center gap-2.5">
                  <img src={doc.avatarUrl} alt={doc.fullName} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <span className="text-xs font-bold text-[#142238] block">{doc.fullName}</span>
                    <span className="text-[10px] text-[#63738A]">{doc.primarySpecialty} · {doc.institution}</span>
                  </div>
                </div>
                <VerificationBadge status={doc.verificationStatus} showText={false} />
              </div>
            ))}
          </div>
        )}

        {/* Persona Switcher shortcut */}
        {profile.isCurrentUser && (
          <div className="pt-4 border-t border-[#E1E9F3]">
            <button
              onClick={onOpenAuthModal}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-[#EAF3FF] border border-[#E1E9F3] text-xs text-[#246BCE] font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Switch Doctor Profile / Create New Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <VerificationModal
          doctor={profile}
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          onStatusUpdated={(updated) => {
            setProfile(updated);
            setShowVerifyModal(false);
          }}
        />
      )}
    </div>
  );
};
