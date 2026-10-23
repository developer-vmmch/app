import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Clock,
  Send,
  Flag,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Story, DoctorProfile } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  story: Story | null;
  currentUser: DoctorProfile;
  onClose: () => void;
  onStoryDeleted: (storyId: string) => void;
  onReplyToStory: (authorId: string, replyText: string) => void;
  onReportStory: (story: Story) => void;
  onNextStory?: () => void;
  onPrevStory?: () => void;
}

export const StoryViewerModal: React.FC<Props> = ({
  story,
  currentUser,
  onClose,
  onStoryDeleted,
  onReplyToStory,
  onReportStory,
  onNextStory,
  onPrevStory,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  const progressTimerRef = useRef<any>(null);
  const touchStartXRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!story) return;
    setProgress(0);
    setReplySent(false);

    const interval = 50; // Update every 50ms (total 6 seconds)
    const step = 100 / (6000 / interval);

    progressTimerRef.current = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimerRef.current);
            if (onNextStory) {
              onNextStory();
            } else {
              onClose();
            }
            return 100;
          }
          return prev + step;
        });
      }
    }, interval);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [story, isPaused]);

  if (!story) return null;

  const isOwnStory = story.authorId === currentUser.id;

  const handleDelete = async () => {
    if (confirm('Delete this story?')) {
      await api.deleteStory(story.id);
      onStoryDeleted(story.id);
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyToStory(story.authorId, `Replied to your story: "${replyText.trim()}"`);
    setReplyText('');
    setReplySent(true);
    setTimeout(() => setReplySent(false), 2000);
  };

  const handleTapNavigation = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isRightSide = clickX > rect.width / 2;

    if (isRightSide) {
      if (onNextStory) onNextStory();
      else onClose();
    } else {
      if (onPrevStory) onPrevStory();
      else setProgress(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(true);
    if (e.touches[0]) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartTimeRef.current = Date.now();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsPaused(false);
    if (e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
      const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
      const duration = Date.now() - touchStartTimeRef.current;

      // Horizontal swipe gesture check
      if (Math.abs(deltaX) > 40 && Math.abs(deltaY) < 60 && duration < 400) {
        if (deltaX < 0 && onNextStory) {
          onNextStory(); // Swipe Left -> Next
        } else if (deltaX > 0 && onPrevStory) {
          onPrevStory(); // Swipe Right -> Previous
        }
      }
    }
  };

  const calculateTimeToExpiry = () => {
    const diff = new Date(story.expiresAt).getTime() - new Date().getTime();
    if (diff <= 0) return 'Expired';
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${h}h ${m}m until midnight reset`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative w-full max-w-[420px] h-[92vh] max-h-[780px] bg-[#0C1A30] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-slate-700">
        {/* Progress Bar (6-second story duration) */}
        <div className="absolute top-2 left-3 right-3 z-30 flex items-center gap-1">
          <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Header */}
        <div className="absolute top-5 left-3 right-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <img
              src={story.authorAvatarUrl}
              alt={story.authorName}
              className="w-9 h-9 rounded-full object-cover border border-white"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold leading-tight drop-shadow">
                  {story.authorName}
                </span>
                <VerificationBadge status={story.authorVerificationStatus} showText={false} />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/90 drop-shadow">
                <span className="font-medium text-[#38BDF8] bg-[#0C1A30]/80 px-1 py-0.2 rounded">
                  {story.storyType === 'PROFESSIONAL' ? 'Professional Story' : 'Personal Story'}
                </span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-white/80">
                  <Clock className="w-2.5 h-2.5" />
                  <span>{calculateTimeToExpiry()}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwnStory ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="p-1.5 rounded-full bg-black/40 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                title="Delete your story"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReportStory(story);
                }}
                className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
                title="Report story"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story Media Container with Tap Zones */}
        <div
          onClick={handleTapNavigation}
          className="flex-1 w-full h-full relative flex items-center justify-center bg-black cursor-pointer"
        >
          {story.mediaUrl ? (
            <img
              src={story.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover opacity-90 pointer-events-none"
            />
          ) : (
            <div className="p-8 text-center text-white bg-gradient-to-b from-[#081122] via-[#0C1A30] to-[#1D4ED8] w-full h-full flex items-center justify-center pointer-events-none">
              <p className="text-base font-bold leading-relaxed max-w-xs">{story.caption}</p>
            </div>
          )}

          {/* Touch-and-Hold Pause Indicator Watermark */}
          {isPaused && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white text-xs font-bold px-3.5 py-1.5 rounded-full backdrop-blur z-20">
              Paused
            </div>
          )}

          {/* Navigation Chevron Affordances */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onPrevStory) onPrevStory();
              else setProgress(0);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/80 transition-colors z-20 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onNextStory) onNextStory();
              else onClose();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white/80 transition-colors z-20 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Story Caption & Audience Overlay */}
        <div className="absolute bottom-16 left-3 right-3 z-30 space-y-2 pointer-events-auto">
          <div className="flex items-center gap-2 text-[10px] text-white/90">
            <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur font-medium">
              Audience: {story.audience.replace('_', ' ')}
            </span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 backdrop-blur">
              <Eye className="w-3 h-3" />
              <span>{story.viewCount} views</span>
            </span>
          </div>

          {story.caption && (
            <p className="text-xs text-white bg-black/70 backdrop-blur p-2.5 rounded-xl border border-white/20 leading-relaxed drop-shadow">
              {story.caption}
            </p>
          )}
        </div>

        {/* Bottom Reply Bar */}
        {!isOwnStory && (
          <form
            onSubmit={handleSendReply}
            className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-2 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${story.authorName}...`}
              className="flex-1 bg-white/20 backdrop-blur border border-white/30 rounded-xl px-3 py-2 text-xs text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
            />
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="p-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white disabled:opacity-40 transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        {replySent && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#16845B] text-white text-xs px-3 py-1 rounded-full shadow-lg z-40">
            Reply sent via Direct Message!
          </div>
        )}
      </div>
    </div>
  );
};
