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
  History,
  X,
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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [watchHistory, setWatchHistory] = useState<{ reelId: string; watchedAt: string }[]>(() => {
    try {
      const saved = localStorage.getItem('novea_reels_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const currentReel = reels[currentIndex];

  // IntersectionObserver implementing 'Snap to Reel' logic tracking when a video element fully occupies the viewport (threshold 0.9)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
            const indexStr = entry.target.getAttribute('data-reel-index');
            if (indexStr !== null) {
              const idx = parseInt(indexStr, 10);
              if (!isNaN(idx) && idx !== currentIndex) {
                setCurrentIndex(idx);
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.9,
      }
    );

    const reelElements = container.querySelectorAll('[data-reel-index]');
    reelElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [reels.length, currentIndex]);

  // Handle active video playback, pausing all other videos when viewport ownership changes
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === currentIndex) {
        vid.currentTime = 0;
        vid.muted = isMuted;
        vid.play().catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
        setIsPlaying(true);
      } else {
        vid.pause();
      }
    });

    setWatchHistory((prev) => {
      const filtered = prev.filter((h) => h.reelId !== currentReel.id);
      const updated = [
        {
          reelId: currentReel.id,
          watchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...filtered,
      ];
      try {
        localStorage.setItem('novea_reels_history', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, [currentIndex, isMuted]);

  const scrollToReel = (index: number) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.scrollTo({
      top: index * container.clientHeight,
      behavior: 'smooth',
    });
    setCurrentIndex(index);
  };

  const togglePlay = (idx: number) => {
    const vid = videoRefs.current[idx];
    if (vid) {
      if (isPlaying && !vid.paused) {
        vid.pause();
        setIsPlaying(false);
      } else {
        vid.play().catch(() => {});
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
    const nextIdx = currentIndex < reels.length - 1 ? currentIndex + 1 : 0;
    scrollToReel(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = currentIndex > 0 ? currentIndex - 1 : reels.length - 1;
    scrollToReel(prevIdx);
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistoryModal(true)}
            title="Recent Views Watch History"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] text-xs font-bold hover:bg-[#F8FAFC] shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span className="hidden sm:inline">History</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-[#64748B] px-2 py-1 bg-white border border-[#E2E8F0] rounded-xl">
            <span className="font-bold text-[#0F172A]">{currentIndex + 1}</span>
            <span>/</span>
            <span>{reels.length}</span>
          </div>
        </div>
      </div>

      {/* Vertical Scroll-Snap Container with Snap-to-Reel IntersectionObserver */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[390px] sm:max-w-[410px] h-[72vh] max-h-[680px] bg-black rounded-3xl overflow-y-scroll snap-y snap-mandatory scrollbar-none no-scrollbar shadow-2xl border border-[#CBD5E1]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {reels.map((reel, idx) => (
          <div
            key={reel.id}
            data-reel-index={idx}
            className="w-full h-full snap-start snap-always relative flex flex-col justify-between shrink-0 bg-slate-950"
          >
            {/* Video Element */}
            <div
              onClick={() => togglePlay(idx)}
              className="absolute inset-0 cursor-pointer flex items-center justify-center overflow-hidden bg-black"
            >
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={reel.videoUrl}
                poster={reel.thumbnailUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover select-none"
              />

              {/* Big Heart Pop on Like */}
              {heartAnim && idx === currentIndex && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-ping">
                  <Heart className="w-24 h-24 fill-[#DC2626] text-[#DC2626] drop-shadow-xl" />
                </div>
              )}

              {/* Play/Pause Overlay */}
              {!isPlaying && idx === currentIndex && (
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
              <div className="min-w-0 flex-1 space-y-2 text-white">
                <button
                  onClick={() => onOpenDoctorProfile(reel.author.id)}
                  className="flex items-center gap-2.5 text-left group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={reel.author.avatarUrl}
                      alt={reel.author.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    {reel.author.isVerified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#16A34A] border-1.5 border-white flex items-center justify-center">
                        <Check className="w-2 h-2 text-white stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 truncate">
                        {reel.author.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-teal-300 font-medium truncate">
                      {reel.author.specialty}
                    </p>
                  </div>
                </button>

                <h3 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow">
                  {reel.title}
                </h3>

                <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                  {reel.description}
                </p>

                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {reel.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-sky-300 font-semibold bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Action Rail */}
              <div className="flex flex-col items-center gap-3 shrink-0 pb-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike();
                  }}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      reel.isLiked
                        ? 'bg-[#DC2626] text-white scale-110'
                        : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        reel.isLiked ? 'fill-white stroke-white' : 'stroke-white'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">
                    {reel.likesCount}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentsReel(reel);
                  }}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                    <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">
                    {reel.commentsCount}
                  </span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark();
                  }}
                  className="flex flex-col items-center gap-1 text-white group"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      reel.isBookmarked
                        ? 'bg-[#1D4ED8] text-white'
                        : 'bg-black/40 backdrop-blur-md text-white hover:bg-black/60'
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${
                        reel.isBookmarked ? 'fill-white' : 'stroke-white'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold drop-shadow">Save</span>
                </button>

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
                  {copiedLink && idx === currentIndex && (
                    <span className="absolute -left-20 top-2 bg-white text-[#0F172A] font-bold text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
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

      {/* Recent Views Watch History Modal */}
      {showHistoryModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
        >
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#CBD5E1] p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#1D4ED8]" />
                <h3 className="font-bold text-sm text-[#0F172A]">Recent Reels Watch History</h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 overflow-y-auto flex-1 text-xs">
              {watchHistory.length === 0 ? (
                <p className="text-center text-slate-500 py-8">No recently watched clinical reels.</p>
              ) : (
                watchHistory.map((item, idx) => {
                  const reel = reels.find((r) => r.id === item.reelId);
                  if (!reel) return null;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        const targetIdx = reels.findIndex((r) => r.id === item.reelId);
                        if (targetIdx !== -1) {
                          scrollToReel(targetIdx);
                          setShowHistoryModal(false);
                        }
                      }}
                      className="p-3 rounded-xl border border-[#E2E8F0] hover:border-[#1D4ED8] bg-[#F8FAFC] hover:bg-[#EFF6FF] transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={reel.thumbnailUrl}
                          alt={reel.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border"
                        />
                        <div className="min-w-0">
                          <h4 className="font-bold text-[#0F172A] truncate">{reel.title}</h4>
                          <p className="text-[10px] text-[#64748B]">
                            {reel.author.name} · Watched at {item.watchedAt}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#1D4ED8] shrink-0">Reopen</span>
                    </div>
                  );
                })
              )}
            </div>

            {watchHistory.length > 0 && (
              <div className="pt-2 border-t border-[#E2E8F0] flex justify-between">
                <button
                  onClick={() => {
                    setWatchHistory([]);
                    try {
                      localStorage.removeItem('novea_reels_history');
                    } catch {}
                  }}
                  className="text-xs text-rose-600 font-semibold hover:underline"
                >
                  Clear History
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#1D4ED8] text-white text-xs font-bold"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
