import React from 'react';
import { Plus, Clock, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { Story, DoctorProfile } from '../../types';

interface Props {
  stories: Story[];
  currentUser: DoctorProfile;
  onOpenStory: (story: Story) => void;
  onOpenCreateStory: () => void;
}

export const StoriesRow: React.FC<Props> = ({
  stories,
  currentUser,
  onOpenStory,
  onOpenCreateStory,
}) => {
  const userStory = stories.find((s) => s.authorId === currentUser.id);

  // Time left until today's 23:59:59 local boundary
  const calculateHoursToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    const diffMs = midnight.getTime() - now.getTime();
    if (diffMs <= 0) return 'Resetting at midnight';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m left`;
  };

  // Helper to format short doctor name and specialty
  const formatShortName = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0]} ${parts[1]}`;
    }
    return name;
  };

  const getShortSpecialty = (story: Story) => {
    if (story.authorSpecialty) return story.authorSpecialty;
    if (story.authorId === 'AMT-DOC-08412') return 'Cardiology';
    if (story.authorId === 'AMT-DOC-07921') return 'Pediatrics';
    if (story.authorId === 'AMT-DOC-11204') return 'Gen Med';
    return 'Clinical';
  };

  return (
    <div
      role="region"
      aria-label="Clinical and Professional Stories"
      className="bg-white border-b border-[#E1E9F3] py-2.5 px-3 sm:px-4 shrink-0"
    >
      {/* Top Meta Line: Expiry Notification & Guidelines */}
      <div className="flex items-center justify-between text-[11px] text-[#63738A] mb-2 px-0.5">
        <span className="font-bold text-[#12345B] text-[10px] sm:text-[11px] tracking-wide uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#246BCE] animate-pulse" />
          <span>Doctor Stories</span>
        </span>
        <span
          className="flex items-center gap-1 text-[#246BCE] font-semibold text-[10px] sm:text-[11px] bg-[#EAF3FF] px-2 py-0.5 rounded-full"
          title="Daily Expiry: Stories automatically expire at 23:59:59 local time and reset at midnight"
        >
          <Clock className="w-3 h-3 stroke-[2.2]" />
          <span>Midnight Expiry (23:59:59 · {calculateHoursToMidnight()})</span>
        </span>
      </div>

      {/* Stories Scrolling Row */}
      <div
        tabIndex={0}
        aria-label="Doctor stories list, scroll horizontally to view more"
        className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1 focus:outline-none focus:ring-1 focus:ring-[#246BCE]/40 rounded-xl"
      >
        {/* 1. "Your Story" Tile with animated plus button */}
        <div className="flex flex-col items-center shrink-0 w-[68px] sm:w-[72px]">
          <button
            onClick={() => {
              if (userStory) {
                onOpenStory(userStory);
              } else {
                onOpenCreateStory();
              }
            }}
            aria-label={userStory ? 'View your active story' : 'Add new story'}
            className="relative focus:outline-none group active:scale-95 transition-transform"
          >
            {/* Elegant Circular Border */}
            <div
              className={`w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-full p-[2.5px] transition-all duration-300 ${
                userStory
                  ? 'bg-gradient-to-tr from-[#12345B] via-[#246BCE] to-[#16845B] shadow-sm'
                  : 'border-2 border-dashed border-[#B8CEE8] hover:border-[#246BCE] group-hover:bg-[#EAF3FF]/40'
              }`}
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-full h-full rounded-full object-cover border-2 border-white bg-slate-100"
              />
            </div>

            {/* Plus Button Overlay (Animated on hover) */}
            {!userStory && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateStory();
                }}
                title="Add clinical or personal story"
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#246BCE] hover:bg-[#12345B] text-white flex items-center justify-center border-2 border-white shadow-sm transition-transform duration-200 group-hover:scale-110"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
              </div>
            )}
          </button>

          <span className="text-[11px] text-[#142238] font-bold mt-1.5 truncate max-w-[68px] sm:max-w-[72px] text-center leading-none">
            Your Story
          </span>
          <span className="text-[9px] text-[#246BCE] font-semibold mt-0.5 truncate max-w-[68px] text-center">
            {userStory ? 'Active' : '+ Share'}
          </span>
        </div>

        {/* 2. Doctor Peer Stories */}
        {stories
          .filter((s) => s.authorId !== currentUser.id)
          .map((story) => {
            const isVerified = story.authorVerificationStatus === 'VERIFIED';
            return (
              <div
                key={story.id}
                role="button"
                tabIndex={0}
                aria-label={`View story by ${story.authorName}, ${getShortSpecialty(story)}`}
                onClick={() => onOpenStory(story)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenStory(story);
                  }
                }}
                className="flex flex-col items-center shrink-0 w-[68px] sm:w-[72px] cursor-pointer group active:scale-95 transition-transform focus:outline-none"
              >
                {/* Elegant Circular Border with Active Story Gradient */}
                <div className="relative">
                  <div className="w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#12345B] via-[#246BCE] to-[#4D8DE0] shadow-xs group-hover:shadow-md transition-shadow">
                    <img
                      src={story.authorAvatarUrl}
                      alt={story.authorName}
                      className="w-full h-full rounded-full object-cover border-2 border-white bg-slate-100"
                    />
                  </div>

                  {/* Verified Indicator Badge */}
                  {isVerified && (
                    <div
                      title="Verified Doctor"
                      className="absolute -bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#16845B] border-2 border-white flex items-center justify-center text-white shadow-xs"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Short Name */}
                <span className="text-[11px] text-[#142238] font-semibold mt-1.5 truncate max-w-[68px] sm:max-w-[72px] text-center group-hover:text-[#246BCE] transition-colors leading-none">
                  {formatShortName(story.authorName)}
                </span>

                {/* Specialty Label */}
                <span className="text-[9px] text-[#63738A] font-medium mt-0.5 truncate max-w-[68px] sm:max-w-[72px] text-center leading-none">
                  {getShortSpecialty(story)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
