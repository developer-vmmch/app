import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Building2,
  Edit3,
  UserPlus,
  UserCheck,
  FileText,
  Video,
  Film,
  Hash,
  Heart,
  MessageSquare,
  Play,
  MapPin,
  X,
  Share2,
  Bookmark,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { DoctorProfile, Post } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';
import { VerificationModal } from '../verification/VerificationModal';
import { EditProfileModal } from './EditProfileModal';
import { PostCard } from '../feed/PostCard';
import { LogoSettingsModal } from '../branding/LogoSettingsModal';

interface Props {
  doctorId?: string;
  onOpenInstitutionDetail: (institutionId: string) => void;
  onOpenDoctorProfile: (id: string) => void;
  onOpenMentorshipTab: () => void;
  onOpenAuthModal: () => void;
}

// Exactly the four profile sections requested in Section 4
type TabType = 'posts' | 'videos' | 'reels' | 'tags';

export const ProfileScreen: React.FC<Props> = ({
  doctorId,
  onOpenInstitutionDetail,
  onOpenDoctorProfile,
  onOpenMentorshipTab,
  onOpenAuthModal,
}) => {
  const [profile, setProfile] = useState<DoctorProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showLogoSettingsModal, setShowLogoSettingsModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

    // Load feed posts
    const feedRes = await api.getFeed();
    if (feedRes.success) {
      setPosts(feedRes.data.filter((p) => p.authorId === targetDoc.id));
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

  // Video posts
  const videoPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        p.mediaType === 'video' ||
        p.postType === 'video' ||
        p.mediaUrl?.includes('.mp4') ||
        p.tags?.includes('Video') ||
        p.tags?.includes('Videos')
    );
  }, [posts]);

  // Reels
  const reelPosts = useMemo(() => {
    return posts.filter(
      (p) =>
        p.tags?.includes('Reels') ||
        p.tags?.includes('Shorts') ||
        p.postType === 'video'
    );
  }, [posts]);

  // # Tags dynamically aggregated from real posts & doctor profile
  const profileTags = useMemo(() => {
    const tagMap = new Map<string, number>();

    posts.forEach((p) => {
      p.tags?.forEach((tag) => {
        const cleaned = tag.replace(/^#/, '').trim();
        if (cleaned) {
          tagMap.set(cleaned, (tagMap.get(cleaned) || 0) + 1);
        }
      });
    });

    if (profile?.primarySpecialty) {
      const spec = profile.primarySpecialty.replace(/\s+/g, '');
      if (!tagMap.has(spec)) tagMap.set(spec, 1);
    }

    profile?.areasOfInterest?.forEach((area) => {
      const cleanArea = area.replace(/\s+/g, '');
      if (cleanArea && !tagMap.has(cleanArea)) tagMap.set(cleanArea, 1);
    });

    return Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }, [posts, profile]);

  // Filtered posts for # Tags tab
  const taggedPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter((p) =>
      p.tags?.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()))
    );
  }, [posts, selectedTag]);

  if (loading || !profile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] text-[#64748B] text-xs py-16">
        Loading doctor profile...
      </div>
    );
  }

  const coverImage =
    (profile as any).coverImageUrl ||
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3 sm:space-y-4">
      {/* Header Card with Cover Image */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs">
        {/* Cover Image Banner */}
        <div className="h-28 sm:h-40 w-full relative bg-gradient-to-r from-[#1D4ED8] to-[#0D9488]">
          <img
            src={coverImage}
            alt="Doctor Banner"
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        {/* Profile Details Container */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 space-y-3 sm:space-y-4 relative">
          {/* Avatar & Actions Row */}
          <div className="flex items-end justify-between -mt-9 sm:-mt-12 gap-3 flex-wrap">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="w-18 h-18 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white ring-2 ring-[#E2E8F0] shadow-md bg-white"
              />
              {profile.verificationStatus === 'VERIFIED' && (
                <span
                  title="Verified Medical Practitioner"
                  className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 bg-[#16A34A] text-white rounded-full shadow-xs ring-2 ring-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0">
              {profile.isCurrentUser ? (
                <>
                  <button
                    onClick={() => setShowLogoSettingsModal(true)}
                    className="px-3 sm:px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#1D4ED8] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                    title="NOVEA 36 Logo Concepts & Auto-Rotation Settings"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span className="hidden sm:inline">Logo Settings</span>
                    <span className="sm:hidden">Logos</span>
                  </button>

                  <button
                    onClick={() => setShowEditProfileModal(true)}
                    className="px-3.5 sm:px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-bold text-[#0F172A] hover:bg-[#F8FAFC] hover:border-[#1D4ED8] transition-all flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>Edit Profile</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleToggleFollow}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                    profile.isFollowing
                      ? 'border border-[#CBD5E1] text-[#0F172A] bg-white hover:bg-[#F8FAFC]'
                      : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
                  }`}
                >
                  {profile.isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Doctor Identity & Credentials */}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black text-[#0F172A]">{profile.fullName}</h2>
              <VerificationBadge status={profile.verificationStatus} />
            </div>

            <p className="text-xs sm:text-sm font-bold text-[#1D4ED8] mt-0.5">
              {profile.qualification} · {profile.primarySpecialty}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#64748B] mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                <Building2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" />
                {profile.institution}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                {profile.country || 'Salem, Tamil Nadu, India'}
              </span>
              <span>·</span>
              <span className="font-mono text-[10px] sm:text-[11px] bg-[#F1F5F9] px-2 py-0.5 rounded text-[#475569] border border-[#E2E8F0]">
                {profile.registrationCouncil}: {profile.medicalRegistrationNumber}
              </span>
            </div>

            {profile.bio && (
              <p className="text-xs text-[#334155] leading-relaxed mt-2 max-w-3xl">
                {profile.bio}
              </p>
            )}
          </div>

          {/* Metrics Row: Posts, Videos, Reels, Followers */}
          <div className="grid grid-cols-4 gap-2 pt-2.5 border-t border-[#F1F5F9] text-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'posts'
                  ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="block text-xs sm:text-sm font-black text-[#0F172A]">{posts.length}</span>
              <span className="text-[10px] font-semibold text-[#64748B]">Posts</span>
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'videos'
                  ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="block text-xs sm:text-sm font-black text-[#0F172A]">{videoPosts.length}</span>
              <span className="text-[10px] font-semibold text-[#64748B]">Videos</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'reels'
                  ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="block text-xs sm:text-sm font-black text-[#0F172A]">{reelPosts.length}</span>
              <span className="text-[10px] font-semibold text-[#64748B]">Reels</span>
            </button>

            <button
              onClick={() => setActiveTab('tags')}
              className={`p-2 rounded-xl border transition-all ${
                activeTab === 'tags'
                  ? 'border-[#1D4ED8] bg-[#EFF6FF]'
                  : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <span className="block text-xs sm:text-sm font-black text-[#0F172A]">{profileTags.length}</span>
              <span className="text-[10px] font-semibold text-[#64748B]"># Tags</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exactly 4 Navigation Tabs: Posts, Videos, Reels, # Tags (Section 4) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-1.5 text-xs shadow-xs">
        <div className="grid grid-cols-4 gap-1 sm:gap-2">
          {[
            { id: 'posts' as const, label: 'Posts', count: posts.length, icon: FileText },
            { id: 'videos' as const, label: 'Videos', count: videoPosts.length, icon: Video },
            { id: 'reels' as const, label: 'Reels', count: reelPosts.length, icon: Film },
            { id: 'tags' as const, label: '# Tags', count: profileTags.length, icon: Hash },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id !== 'tags') setSelectedTag(null);
                }}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3 font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[11px] sm:text-xs">{tab.label}</span>
                <span
                  className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full font-semibold hidden xs:inline ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Body */}
      <div className="space-y-3 sm:space-y-4 flex-1">
        {/* 1. Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-3">
            {posts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-1">
                <FileText className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <h4 className="font-bold text-[#0F172A] text-sm">No published posts</h4>
                <p>Published clinical questions and case analyses will appear here.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white p-4 rounded-2xl border border-[#E2E8F0] space-y-2.5 shadow-2xs hover:border-[#CBD5E1] transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                      {post.specialty}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                    {post.title || 'Clinical Knowledge Post'}
                  </h4>
                  <p className="text-xs text-[#334155] line-clamp-3 leading-relaxed">{post.body}</p>

                  {/* Attached Media preview if any */}
                  {post.mediaUrl && (
                    <div className="rounded-xl overflow-hidden border border-[#E2E8F0] max-h-48 bg-black">
                      {post.mediaType === 'video' ? (
                        <video src={post.mediaUrl} controls className="w-full max-h-48 object-contain" />
                      ) : (
                        <img src={post.mediaUrl} alt={post.title || 'Attached imaging'} className="w-full max-h-48 object-cover" />
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                    <span className="flex items-center gap-1 font-semibold">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <MessageSquare className="w-3.5 h-3.5 text-[#0284C7]" />
                      {post.commentsCount} comments
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Videos Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-3">
            {videoPosts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-1">
                <Video className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <h4 className="font-bold text-[#0F172A] text-sm">No video cases published</h4>
                <p>Surgical recordings, angiograms, and bedside sonography clips will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {videoPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:border-[#CBD5E1] transition-all flex flex-col"
                  >
                    <div className="relative aspect-video bg-black flex items-center justify-center">
                      {post.mediaUrl ? (
                        <video
                          src={post.mediaUrl}
                          controls
                          playsInline
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-slate-400 text-xs flex items-center gap-1">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                          {post.specialty}
                        </span>
                        <h4 className="text-xs font-bold text-[#0F172A] mt-1.5 line-clamp-2 leading-snug">
                          {post.title || post.body.slice(0, 60)}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#F1F5F9]">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#0284C7]" />
                          {post.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Reels Tab */}
        {activeTab === 'reels' && (
          <div className="space-y-3">
            {reelPosts.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-1">
                <Film className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                <h4 className="font-bold text-[#0F172A] text-sm">No clinical reels published</h4>
                <p>Vertical clinical procedural tips and technique demonstrations will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {reelPosts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative rounded-2xl overflow-hidden border border-[#E2E8F0] aspect-[9/16] bg-slate-900 cursor-pointer shadow-xs flex flex-col justify-end"
                  >
                    {post.mediaUrl ? (
                      <video
                        src={post.mediaUrl}
                        playsInline
                        muted
                        loop
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
                        <Play className="w-8 h-8 text-white/70" />
                      </div>
                    )}
                    <div className="relative z-10 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white space-y-1">
                      <span className="text-[10px] font-bold text-[#38BDF8] bg-sky-950/70 px-1.5 py-0.5 rounded border border-sky-700/50">
                        {post.specialty}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {post.title || post.body.slice(0, 50)}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 pt-1">
                        <span className="flex items-center gap-0.5">
                          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                          {post.likesCount}
                        </span>
                        <span>•</span>
                        <span>{post.commentsCount} comments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. # Tags Tab (Dedicated Collection) */}
        {activeTab === 'tags' && (
          <div className="space-y-4">
            {/* Tag Collection Cloud */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#1D4ED8]" />
                  <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    Hashtags Collection
                  </h3>
                </div>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Clear filter</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <p className="text-xs text-[#64748B]">
                Medical topic tags associated with {profile.fullName}'s clinical publications and cases:
              </p>

              {profileTags.length === 0 ? (
                <p className="text-xs text-[#94A3B8] italic">No hashtags found for this doctor.</p>
              ) : (
                <div className="flex flex-wrap gap-2 pt-1">
                  {profileTags.map(({ tag, count }) => {
                    const isSelected = selectedTag?.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(isSelected ? null : tag)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1D4ED8] text-white shadow-2xs scale-105'
                            : 'bg-[#EFF6FF] text-[#1D4ED8] hover:bg-[#DBEAFE] border border-[#BFDBFE]'
                        }`}
                      >
                        <span>#{tag}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-white text-[#1D4ED8]'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Filtered Posts List for Selected Tag */}
            {selectedTag && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1 text-xs text-[#64748B]">
                  <span>
                    Showing {taggedPosts.length} {taggedPosts.length === 1 ? 'post' : 'posts'} tagged with{' '}
                    <strong className="text-[#1D4ED8]">#{selectedTag}</strong>
                  </span>
                </div>

                {taggedPosts.length === 0 ? (
                  <div className="py-8 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-6">
                    No posts matching #{selectedTag}.
                  </div>
                ) : (
                  taggedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white p-4 rounded-2xl border border-[#E2E8F0] space-y-2.5 shadow-2xs"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#1D4ED8] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                          #{selectedTag}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
                        {post.title || 'Clinical Discussion'}
                      </h4>
                      <p className="text-xs text-[#334155] leading-relaxed">{post.body}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal
          isOpen={showEditProfileModal}
          profile={profile}
          onClose={() => setShowEditProfileModal(false)}
          onProfileUpdated={(updated) => {
            setProfile(updated);
          }}
        />
      )}

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

      {/* NOVEA Official Logo Settings & 36-Concept Rotation Gallery */}
      {showLogoSettingsModal && (
        <LogoSettingsModal
          isOpen={showLogoSettingsModal}
          onClose={() => setShowLogoSettingsModal(false)}
        />
      )}
    </div>
  );
};
