import React, { useState, useEffect } from 'react';
import {
  Filter,
  RefreshCw,
  Award,
  BookOpen,
  ChevronRight,
  Building2,
  Stethoscope,
} from 'lucide-react';
import { Post, DoctorProfile, Story } from '../../types';
import { api } from '../../services/api';
import { PostCard } from './PostCard';
import { CommentsModal } from './CommentsModal';
import { StoriesRow } from '../stories/StoriesRow';
import { ClinicalSafetyBanner } from '../common/ClinicalSafetyBanner';

interface Props {
  currentUser: DoctorProfile;
  stories: Story[];
  feedFilter: string;
  isPolicyAccepted: boolean;
  onAcceptPolicy: () => Promise<{ success: boolean; error?: string }>;
  onOpenStory: (story: Story) => void;
  onOpenCreateStory: () => void;
  onOpenAuthorProfile: (authorId: string) => void;
  onOpenInstitutionDetail: (instId: string) => void;
  onOpenMentorshipTab: () => void;
  onReport: (post: Post) => void;
}

const SPECIALTY_CHIPS = [
  'All',
  'Cardiology',
  'General Medicine',
  'Pediatrics',
  'Neurosurgery',
  'Critical Care',
];

export const FeedScreen: React.FC<Props> = ({
  currentUser,
  stories,
  feedFilter,
  isPolicyAccepted,
  onAcceptPolicy,
  onOpenStory,
  onOpenCreateStory,
  onOpenAuthorProfile,
  onOpenInstitutionDetail,
  onOpenMentorshipTab,
  onReport,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [loading, setLoading] = useState(true);
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    const res = await api.getFeed({
      specialty: selectedSpecialty !== 'All' ? selectedSpecialty : feedFilter !== 'all' && feedFilter !== 'institutions' ? feedFilter : undefined,
      filterScope: feedFilter === 'institutions' ? 'institutions' : undefined,
    });
    if (res.success) {
      setPosts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [selectedSpecialty, feedFilter]);

  const handleLike = async (postId: string) => {
    const res = await api.toggleLikePost(postId);
    if (res.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isLiked: res.data.isLiked, likesCount: res.data.likesCount } : p
        )
      );
    }
  };

  const handleBookmark = async (postId: string) => {
    const res = await api.toggleBookmarkPost(postId);
    if (res.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isBookmarked: res.data.isBookmarked, bookmarksCount: res.data.bookmarksCount } : p
        )
      );
    }
  };

  const handleVote = async (postId: string, optionId: string) => {
    const res = await api.votePoll(postId, optionId);
    if (res.success) {
      setPosts((prev) => prev.map((p) => (p.id === postId ? res.data : p)));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F9FD]">
      {/* Patient PHI Safety Banner (only displayed if not yet accepted) */}
      <ClinicalSafetyBanner
        isPolicyAccepted={isPolicyAccepted}
        onAcceptPolicy={onAcceptPolicy}
      />

      {/* Stories Row directly below Top Header (Section 4) */}
      <StoriesRow
        stories={stories}
        currentUser={currentUser}
        onOpenStory={onOpenStory}
        onOpenCreateStory={onOpenCreateStory}
      />

      {/* Filter Row */}
      <div className="px-3.5 py-2 bg-white border-b border-[#E1E9F3] shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {SPECIALTY_CHIPS.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                selectedSpecialty === spec
                  ? 'bg-[#12345B] text-white shadow-2xs'
                  : 'bg-[#F6F9FD] text-[#63738A] hover:bg-[#EAF3FF] hover:text-[#246BCE] border border-[#E1E9F3]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 min-h-0">
        {/* Mentorship Link Banner */}
        <div className="bg-[#EAF3FF] border border-[#246BCE]/30 rounded-xl p-3 flex items-center justify-between gap-3 shadow-2xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#12345B]">
              <Award className="w-4 h-4 text-[#246BCE]" />
              <span>Doctor-to-Doctor Mentorship</span>
            </div>
            <p className="text-[11px] text-[#63738A]">
              Connect with verified senior specialists for structured clinical learning.
            </p>
          </div>
          <button
            onClick={onOpenMentorshipTab}
            className="px-3 py-1.5 rounded-lg bg-[#246BCE] hover:bg-[#12345B] text-white text-xs font-bold shrink-0 flex items-center gap-1 transition-colors"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Feed Posts */}
        {loading ? (
          <div className="py-12 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-[#246BCE] animate-spin mx-auto" />
            <p className="text-xs text-[#63738A]">Loading verified medical discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-white rounded-xl border border-[#E1E9F3] p-6">
            <BookOpen className="w-8 h-8 text-[#63738A] mx-auto" />
            <h3 className="text-sm font-bold text-[#12345B]">No posts in this filter</h3>
            <p className="text-xs text-[#63738A] max-w-xs mx-auto">
              Be the first doctor to post a case discussion or question in this specialty.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onVote={handleVote}
              onOpenComments={(p) => setActiveCommentsPost(p)}
              onOpenAuthorProfile={onOpenAuthorProfile}
              onOpenInstitutionDetail={onOpenInstitutionDetail}
              onReport={onReport}
            />
          ))
        )}
      </div>

      {/* Comments Drawer */}
      {activeCommentsPost && (
        <CommentsModal
          post={activeCommentsPost}
          onClose={() => setActiveCommentsPost(null)}
          onOpenAuthorProfile={onOpenAuthorProfile}
        />
      )}
    </div>
  );
};
