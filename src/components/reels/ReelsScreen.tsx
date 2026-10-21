import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  Building2,
  Award,
  Sparkles,
  Check,
} from 'lucide-react';
import { DoctorProfile } from '../../types';

interface ReelItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  author: {
    id: string;
    name: string;
    specialty: string;
    institution: string;
    avatarUrl: string;
    isVerified: boolean;
  };
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

const CLINICAL_REELS: ReelItem[] = [
  {
    id: 'reel-1',
    title: 'Minimally Invasive Aortic Valve Replacement (TAVR) Deployment',
    description:
      'Step-by-step fluoroscopic positioning of balloon-expandable valve in calcified trileaflet stenosis. Note optimal coronary clearance.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-medical-laboratory-research-analysis-41135-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
    author: {
      id: 'AMT-DOC-102',
      name: 'Dr. Priya Sundaram',
      specialty: 'Interventional Cardiology',
      institution: 'Apollo Speciality Hospitals, Salem',
      avatarUrl: 'https://images.unsplash.com/photo-1594824813637-295b95d13778?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    tags: ['Cardiology', 'TAVR', 'SurgicalTechnique'],
    likesCount: 142,
    commentsCount: 28,
    sharesCount: 19,
  },
  {
    id: 'reel-2',
    title: 'Neonatal High-Frequency Oscillatory Ventilation (HFOV) Triage',
    description:
      'Real-time bedside waveform analysis for refractory hypoxemic respiratory failure. Verifying delta-P and lung recruitment chest vibration.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-doctor-checking-a-cardiac-monitor-41133-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
    author: {
      id: 'AMT-DOC-08412',
      name: 'Dr. Anand Kumar',
      specialty: 'Pediatrics & Neonatology',
      institution: "Vinayaka Mission's Medical College Hospital",
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    tags: ['Neonatology', 'HFOV', 'CriticalCare'],
    likesCount: 219,
    commentsCount: 43,
    sharesCount: 35,
  },
  {
    id: 'reel-3',
    title: 'Laparoscopic Critical View of Safety (CVS) Checklist',
    description:
      'Clear identification of cystic duct and cystic artery before clip application. The hepatocystic triangle is completely cleared of fat.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-surgery-team-operating-on-a-patient-in-hospital-41130-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&auto=format&fit=crop&q=80',
    author: {
      id: 'AMT-DOC-103',
      name: 'Dr. Rajesh Nathan',
      specialty: 'Minimal Access & GI Surgery',
      institution: 'Manipal Hospital, Salem',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
      isVerified: true,
    },
    tags: ['GeneralSurgery', 'Laparoscopy', 'PatientSafety'],
    likesCount: 98,
    commentsCount: 17,
    sharesCount: 12,
  },
];

interface Props {
  currentUser: DoctorProfile;
  onOpenDoctorProfile: (id: string) => void;
  onOpenChatWithAuthor?: (authorId: string) => void;
}

export const ReelsScreen: React.FC<Props> = ({
  currentUser,
  onOpenDoctorProfile,
  onOpenChatWithAuthor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reels, setReels] = useState<ReelItem[]>(CLINICAL_REELS);
  const [heartAnim, setHeartAnim] = useState(false);
  const [activeCommentsReel, setActiveCommentsReel] = useState<ReelItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute and play
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [currentIndex]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleLike = () => {
    setReels((prev) =>
      prev.map((r, i) =>
        i === currentIndex
          ? {
              ...r,
              isLiked: !r.isLiked,
              likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1,
            }
          : r
      )
    );
    if (!currentReel.isLiked) {
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 900);
    }
  };

  const toggleBookmark = () => {
    setReels((prev) =>
      prev.map((r, i) =>
        i === currentIndex
          ? {
              ...r,
              isBookmarked: !r.isBookmarked,
            }
          : r
      )
    );
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNext = () => {
    if (currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop around
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(reels.length - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-2 sm:py-4">
      {/* Top Header Pill */}
      <div className="w-full max-w-md flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1D4ED8] to-[#0D9488] flex items-center justify-center text-white shadow-xs">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#0F172A] leading-none">
              Clinical Reels & Rounds
            </h2>
            <p className="text-[11px] text-[#64748B] mt-0.5">
              Verified surgical procedures & diagnostic pearls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
          <span className="font-bold text-[#0F172A]">{currentIndex + 1}</span>
          <span>/</span>
          <span>{reels.length}</span>
        </div>
      </div>

      {/* Main Portrait Video Container */}
      <div className="relative w-full max-w-[390px] sm:max-w-[410px] h-[72vh] max-h-[680px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-[#CBD5E1] flex flex-col justify-between">
        {/* Actual Video Element */}
        <div
          onClick={togglePlay}
          className="absolute inset-0 cursor-pointer bg-slate-950 flex items-center justify-center overflow-hidden"
        >
          <video
            ref={videoRef}
            src={currentReel.videoUrl}
            poster={currentReel.thumbnailUrl}
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover select-none"
          />

          {/* Big Heart Pop on Double-tap / Like */}
          {heartAnim && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
              <Heart className="w-24 h-24 fill-[#DC2626] text-[#DC2626] drop-shadow-xl" />
            </div>
          )}

          {/* Play/Pause Overlay Indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none z-20">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-xl">
                <Play className="w-8 h-8 ml-1 fill-white" />
              </div>
            </div>
          )}
        </div>

        {/* Top Floating Controls */}
        <div className="relative z-20 p-3.5 flex items-center justify-between text-white bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Peer-Reviewed Clinical Pearl</span>
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/20 hover:bg-black/60 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Bottom Floating Author & Title Info + Vertical Action Rail */}
        <div className="relative z-20 p-4 flex items-end justify-between gap-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
          {/* Author Details & Description */}
          <div className="min-w-0 flex-1 space-y-2 text-white">
            <button
              onClick={() => onOpenDoctorProfile(currentReel.author.id)}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="relative shrink-0">
                <img
                  src={currentReel.author.avatarUrl}
                  alt={currentReel.author.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white"
                />
                {currentReel.author.isVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-1.5 border-white flex items-center justify-center">
                    <Check className="w-2 h-2 text-white stroke-[3]" />
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 truncate">
                    {currentReel.author.name}
                  </span>
                </div>
                <p className="text-[11px] text-teal-300 font-medium truncate">
                  {currentReel.author.specialty}
                </p>
              </div>
            </button>

            <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow">
              {currentReel.title}
            </h3>

            <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
              {currentReel.description}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              {currentReel.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-sky-300 font-semibold bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Action Rail (Instagram/TikTok Style) */}
          <div className="flex flex-col items-center gap-3 shrink-0 pb-1">
            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike();
              }}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentReel.isLiked
                    ? 'bg-[#DC2626] text-white scale-110'
                    : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    currentReel.isLiked ? 'fill-white stroke-white' : 'stroke-white'
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold drop-shadow">
                {currentReel.likesCount}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveCommentsReel(currentReel);
              }}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                <MessageSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold drop-shadow">
                {currentReel.commentsCount}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark();
              }}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentReel.isBookmarked
                    ? 'bg-[#1D4ED8] text-white'
                    : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    currentReel.isBookmarked ? 'fill-white' : 'stroke-white'
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold drop-shadow">Save</span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="flex flex-col items-center gap-1 text-white relative group"
            >
              <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                <Share2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold drop-shadow">Share</span>
              {copiedLink && (
                <span className="absolute -left-20 top-2 bg-white text-[#0F172A] font-bold text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                  Link copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Controls: Prev & Next Reel Buttons */}
      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={handlePrev}
          aria-label="Previous clinical reel"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleNext}
          aria-label="Next clinical reel"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <span>Next Reel</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Comments Drawer / Modal for Reels */}
      {activeCommentsReel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-[#CBD5E1] p-4 space-y-3 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-sm text-[#0F172A]">
                Clinical Discussion ({activeCommentsReel.commentsCount})
              </h3>
              <button
                onClick={() => setActiveCommentsReel(null)}
                className="text-xs font-bold text-[#64748B] hover:text-[#0F172A]"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#0F172A] block">
                  Dr. Rajesh Nathan · General Surgery
                </span>
                <p className="text-[#475569]">
                  Excellent visualization of the anatomical planes. Was intravenous heparin administered before wire cross?
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                <span className="font-bold text-[#0F172A] block">
                  Dr. Anand Kumar · Pediatrics
                </span>
                <p className="text-[#475569]">
                  Crucial demonstration of hemodynamic monitoring stability during balloon expansion.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0] flex items-center gap-2">
              <input
                type="text"
                placeholder="Add clinical observation..."
                className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#1D4ED8]"
              />
              <button
                onClick={() => setActiveCommentsReel(null)}
                className="px-3 py-2 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
