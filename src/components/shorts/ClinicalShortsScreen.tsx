import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Award,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Flag,
} from 'lucide-react';
import { EducationalShort } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  onOpenCreatorProfile: (creatorId: string) => void;
  onReport: (title: string) => void;
}

export const ClinicalShortsScreen: React.FC<Props> = ({
  onOpenCreatorProfile,
  onReport,
}) => {
  const [shorts, setShorts] = useState<EducationalShort[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    loadShorts();
  }, []);

  const loadShorts = async () => {
    const res = await api.getShorts();
    if (res.success) {
      setShorts(res.data);
    }
  };

  const currentShort = shorts[currentIndex];

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleToggleLike = async () => {
    if (!currentShort) return;
    const res = await api.toggleLikeShort(currentShort.id);
    if (res.success) {
      setShorts((prev) =>
        prev.map((s) => (s.id === currentShort.id ? res.data : s))
      );
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentShort) return;
    const res = await api.toggleBookmarkShort(currentShort.id);
    if (res.success) {
      setShorts((prev) =>
        prev.map((s) => (s.id === currentShort.id ? res.data : s))
      );
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  if (!currentShort) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 text-xs">
        Loading clinical educational shorts...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950 relative overflow-hidden select-none">
      {/* Video Container */}
      <div
        className="relative flex-1 bg-black flex items-center justify-center cursor-pointer overflow-hidden"
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          poster={currentShort.thumbnailUrl}
          loop
          playsInline
          muted={isMuted}
          autoPlay
          className="w-full h-full object-cover"
        />

        {/* Play/Pause overlay indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full bg-slate-900/80 backdrop-blur text-white flex items-center justify-center">
              <Play className="w-7 h-7 ml-1" />
            </div>
          </div>
        )}

        {/* Top Floating Controls */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur text-xs text-slate-200 border border-slate-700/60">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-semibold text-teal-300">{currentShort.specialty}</span>
            <span className="text-slate-500">·</span>
            <span>Clinical Short</span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted(!isMuted);
            }}
            className="p-2 rounded-full bg-slate-900/80 backdrop-blur text-white border border-slate-700/60 hover:bg-slate-800"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Floating Actions Bar */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3.5 z-20">
          {/* Like */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike();
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-all ${
                currentShort.isLiked
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-900/70 text-slate-200 group-hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentShort.isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow">
              {currentShort.likesCount}
            </span>
          </button>

          {/* Bookmark */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleBookmark();
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-all ${
                currentShort.isBookmarked
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-900/70 text-slate-200 group-hover:bg-slate-800'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${currentShort.isBookmarked ? 'fill-slate-950' : ''}`} />
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow">
              {currentShort.bookmarksCount}
            </span>
          </button>

          {/* Comments count */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur text-slate-200 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-white drop-shadow">
              {currentShort.commentsCount}
            </span>
          </div>

          {/* Report */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReport(currentShort.title);
            }}
            className="w-10 h-10 rounded-full bg-slate-900/70 backdrop-blur text-slate-400 hover:text-rose-400 flex items-center justify-center"
            title="Report video"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Overlay: Creator info, Title, Key Learning Point */}
        <div className="absolute left-3 right-16 bottom-3 z-20 space-y-2 pointer-events-auto">
          {/* Creator Profile */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenCreatorProfile(currentShort.creator.id);
            }}
            className="flex items-center gap-2 text-left group"
          >
            <img
              src={currentShort.creator.avatarUrl}
              alt={currentShort.creator.name}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-white/50"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white drop-shadow group-hover:text-teal-300">
                  {currentShort.creator.name}
                </span>
                <VerificationBadge status={currentShort.creator.verificationStatus} showText={false} />
              </div>
              <span className="text-[10px] text-teal-300 drop-shadow">
                {currentShort.creator.specialty}
              </span>
            </div>
          </button>

          {/* Title & Caption */}
          <h3 className="text-xs font-bold text-white drop-shadow leading-snug">
            {currentShort.title}
          </h3>
          <p className="text-[11px] text-slate-200 drop-shadow line-clamp-2 leading-relaxed">
            {currentShort.caption}
          </p>

          {/* Key Clinical Learning Point Box */}
          <div className="p-2 rounded-lg bg-teal-950/80 backdrop-blur border border-teal-700/60 text-[10px] text-teal-100 space-y-0.5">
            <span className="font-semibold text-teal-300 uppercase tracking-wider block">
              Key Clinical Pearl:
            </span>
            <p className="leading-snug">{currentShort.keyLearningPoint}</p>
          </div>
        </div>

        {/* Vertical Navigation Arrows */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
          <button
            disabled={currentIndex === 0}
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-1.5 rounded-full bg-slate-900/80 backdrop-blur text-white disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            disabled={currentIndex === shorts.length - 1}
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-1.5 rounded-full bg-slate-900/80 backdrop-blur text-white disabled:opacity-30 hover:bg-slate-800"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
