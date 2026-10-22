import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  BookOpen,
  Image as ImageIcon,
  FileText,
  Film,
  Video,
} from 'lucide-react';
import { Post, DoctorProfile, Story, PostType } from '../../types';
import { api } from '../../services/api';
import { PostCard } from './PostCard';
import { CommentsModal } from './CommentsModal';
import { StoriesRow } from '../stories/StoriesRow';
import { ClinicalSafetyBanner } from '../common/ClinicalSafetyBanner';
import { Avatar } from '../common/Avatar';

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
  onOpenComposer?: (initialType?: PostType) => void;
  onSelectTag?: (tag: string) => void;
}

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
  onOpenComposer,
  onSelectTag,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryTab, setCategoryTab] = useState<'all' | 'posts' | 'videos' | 'reels' | 'articles'>('all');
  const [activeCommentsPost, setActiveCommentsPost] = useState<Post | null>(null);

  const fetchFeed = async () => {
    setLoading(true);
    const specialtyParam =
      feedFilter !== 'all' && feedFilter !== 'institutions' ? feedFilter : undefined;

    const res = await api.getFeed({
      specialty: specialtyParam,
      filterScope: feedFilter === 'institutions' ? 'institutions' : undefined,
    });

    if (res.success) {
      setPosts(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [feedFilter]);

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

  const filteredPosts = posts.filter((post) => {
    if (categoryTab === 'all') return true;
    if (categoryTab === 'posts') {
      return (
        post.postType === 'case_discussion' ||
        post.postType === 'knowledge_post' ||
        post.postType === 'clinical_question' ||
        post.postType === 'clinical_pearl' ||
        post.postType === 'poll' ||
        (!post.postType && post.mediaType !== 'video')
      );
    }
    if (categoryTab === 'videos') {
      return post.mediaType === 'video' || post.postType === 'video';
    }
    if (categoryTab === 'reels') {
      return post.postType === 'video' || (post.mediaType === 'video' && (!post.title || post.body.length < 160));
    }
    if (categoryTab === 'articles') {
      return post.postType === 'article';
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-3 sm:space-y-4">
      {/* Patient PHI Safety Banner (only displayed if not yet accepted) */}
      <ClinicalSafetyBanner
        isPolicyAccepted={isPolicyAccepted}
        onAcceptPolicy={onAcceptPolicy}
      />

      {/* 1. Stories Carousel Row */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-xs">
        <StoriesRow
          stories={stories}
          currentUser={currentUser}
          onOpenStory={onOpenStory}
          onOpenCreateStory={onOpenCreateStory}
        />
      </div>

      {/* 2. Feed Category Tabs (Section 2: All, Posts, Videos, Reels, Articles) */}
      <div
        role="tablist"
        aria-label="Feed category filters"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar py-0.5 shrink-0 [&::-webkit-scrollbar]:hidden"
      >
        {[
          { id: 'all' as const, label: 'All' },
          { id: 'posts' as const, label: 'Posts' },
          { id: 'videos' as const, label: 'Videos' },
          { id: 'reels' as const, label: 'Reels' },
          { id: 'articles' as const, label: 'Articles' },
        ].map((tab) => {
          const isActive = categoryTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCategoryTab(tab.id)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#1D4ED8] text-white shadow-xs'
                  : 'bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] border border-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Social Feed Posts List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs">
            <RefreshCw className="w-6 h-6 text-[#1D4ED8] animate-spin mx-auto" />
            <p className="text-xs text-[#64748B]">Loading verified medical discussions...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-xs">
            <BookOpen className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h3 className="text-sm font-bold text-[#0F172A]">
              {categoryTab === 'all'
                ? 'No discussions in this filter'
                : `No ${categoryTab} found`}
            </h3>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              Be the first doctor to publish in this category.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
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
              onSelectTag={onSelectTag}
            />
          ))
        )}
      </div>

      {/* Comments Modal */}
      {activeCommentsPost && (
        <CommentsModal
          post={activeCommentsPost}
          onClose={() => {
            setActiveCommentsPost(null);
            fetchFeed();
          }}
          onOpenAuthorProfile={onOpenAuthorProfile}
        />
      )}
    </div>
  );
};
