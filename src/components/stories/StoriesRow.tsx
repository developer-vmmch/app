import React from 'react';
import { Plus, ShieldCheck } from 'lucide-react';
import { Story, DoctorProfile } from '../../types';
import { Avatar } from '../common/Avatar';

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

  const formatShortName = (name: string) => {
    const cleaned = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 1) {
      return `Dr. ${parts[0]}`;
    }
    return name;
  };

  const getShortSpecialty = (story: Story) => {
    if (story.authorSpecialty) return story.authorSpecialty;
    if (story.authorId === 'AMT-DOC-08412') return 'Cardiology';
    if (story.authorId === 'AMT-DOC-07921') return 'Pediatrics';
    if (story.authorId === 'AMT-DOC-11204') return 'Gen Med';
    return 'Specialist';
  };

  return (
    <div
      role="region"
      aria-label="Doctor Stories"
      className="w-full shrink-0 select-none"
    >
      {/* Stories Scrolling Row with completely invisible scrollbar */}
      <div
        tabIndex={0}
        aria-label="Doctor stories list, scroll horizontally to view more"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none no-scrollbar py-0.5 focus:outline-none [&::-webkit-scrollbar]:hidden"
      >
        {/* 1. "Your Story" / Add Story Button */}
        <div className="flex flex-col items-center shrink-0 w-[64px] sm:w-[68px]">
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
            {/* Circular Border */}
            <div
              className={`w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full p-[2.5px] transition-all duration-300 ${
                userStory
                  ? 'bg-gradient-to-tr from-[#1D4ED8] via-[#0D9488] to-[#38BDF8] shadow-xs'
                  : 'p-[2px] border-2 border-dashed border-[#CBD5E1] hover:border-[#1D4ED8] group-hover:bg-[#EFF6FF]'
              }`}
            >
              <Avatar
                src={currentUser.avatarUrl}
                name={currentUser.fullName}
                id={currentUser.id}
                size="md"
                className="w-full h-full"
              />
            </div>

            {/* Plus Button Overlay for creating story */}
            {!userStory && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateStory();
                }}
                title="Add Story"
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center border-2 border-white shadow-xs transition-transform duration-200 group-hover:scale-110"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.8]" />
              </div>
            )}
          </button>

          <span className="text-[11px] text-[#0F172A] font-bold mt-1.5 truncate max-w-[64px] sm:max-w-[68px] text-center leading-tight">
            Your story
          </span>
          <span className="text-[9px] text-[#1D4ED8] font-semibold truncate max-w-[64px] text-center">
            {userStory ? 'Active' : '+ Add'}
          </span>
        </div>

        {/* 2. Connected Doctor Peer Stories */}
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
                className="flex flex-col items-center shrink-0 w-[64px] sm:w-[68px] cursor-pointer group active:scale-95 transition-transform focus:outline-none"
              >
                {/* Circular Border with Active Story Gradient Ring */}
                <div className="relative">
                  <div className="w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-full p-[2.5px] bg-gradient-to-tr from-[#1D4ED8] via-[#0D9488] to-[#38BDF8] shadow-xs group-hover:scale-105 transition-all">
                    <Avatar
                      src={story.authorAvatarUrl}
                      name={story.authorName}
                      id={story.authorId}
                      size="md"
                      className="w-full h-full"
                    />
                  </div>

                  {/* Verified Indicator Badge */}
                  {isVerified && (
                    <div
                      title="Verified Doctor"
                      className="absolute -bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-[#16A34A] border-2 border-white flex items-center justify-center text-white shadow-2xs"
                    >
                      <ShieldCheck className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>

                {/* Short Name */}
                <span className="text-[11px] text-[#0F172A] font-semibold mt-1.5 truncate max-w-[64px] sm:max-w-[68px] text-center group-hover:text-[#1D4ED8] transition-colors leading-tight">
                  {formatShortName(story.authorName)}
                </span>

                {/* Specialty Label */}
                <span className="text-[9px] text-[#64748B] font-medium truncate max-w-[64px] sm:max-w-[68px] text-center leading-tight">
                  {getShortSpecialty(story)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
