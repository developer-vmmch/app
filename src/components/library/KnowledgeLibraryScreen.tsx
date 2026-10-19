import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Search,
  BookOpen,
  PlaySquare,
  Stethoscope,
  Trash2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Post, EducationalShort } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  onOpenAuthorProfile: (id: string) => void;
  onOpenFeedWithPost: (postId: string) => void;
}

export const KnowledgeLibraryScreen: React.FC<Props> = ({
  onOpenAuthorProfile,
  onOpenFeedWithPost,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [shorts, setShorts] = useState<EducationalShort[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'posts' | 'shorts'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedContent();
  }, []);

  const loadSavedContent = async () => {
    setLoading(true);
    const [feedRes, shortsRes] = await Promise.all([api.getFeed(), api.getShorts()]);
    if (feedRes.success) {
      setPosts(feedRes.data.filter((p: Post) => p.isBookmarked));
    }
    if (shortsRes.success) {
      setShorts(shortsRes.data.filter((s: EducationalShort) => s.isBookmarked));
    }
    setLoading(false);
  };

  const handleRemoveBookmark = async (postId: string) => {
    const res = await api.toggleBookmarkPost(postId);
    if (res.success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShorts = shorts.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {/* Header */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold text-slate-100">
              Saved Knowledge Library
            </h2>
            <p className="text-[10px] text-slate-400">
              Personal archive of verified clinical cases, pearls & educational media
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved clinical pearls, cases, topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 py-1 text-center font-medium rounded ${
              filterType === 'all' ? 'bg-slate-800 text-teal-300' : 'text-slate-400'
            }`}
          >
            All Items ({filteredPosts.length + filteredShorts.length})
          </button>
          <button
            onClick={() => setFilterType('posts')}
            className={`flex-1 py-1 text-center font-medium rounded ${
              filterType === 'posts' ? 'bg-slate-800 text-teal-300' : 'text-slate-400'
            }`}
          >
            Discussions ({filteredPosts.length})
          </button>
          <button
            onClick={() => setFilterType('shorts')}
            className={`flex-1 py-1 text-center font-medium rounded ${
              filterType === 'shorts' ? 'bg-slate-800 text-teal-300' : 'text-slate-400'
            }`}
          >
            Video Shorts ({filteredShorts.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading library...</div>
        ) : filteredPosts.length === 0 && filteredShorts.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-slate-900/50 rounded-xl border border-slate-800 p-6">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-200">Library Empty</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Bookmark clinical discussions or educational shorts from the feed to review them later.
            </p>
          </div>
        ) : (
          <>
            {/* Posts */}
            {(filterType === 'all' || filterType === 'posts') &&
              filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onOpenAuthorProfile(post.author.id)}
                      className="flex items-center gap-2 text-left"
                    >
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.fullName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-200">
                            {post.author.fullName}
                          </span>
                          <VerificationBadge status={post.author.verificationStatus} showText={false} />
                        </div>
                        <span className="text-[10px] text-teal-400">{post.specialty}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleRemoveBookmark(post.id)}
                      title="Remove from saved"
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {post.title && (
                    <h4 className="text-xs font-bold text-slate-100">{post.title}</h4>
                  )}
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {post.body}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex gap-1 flex-wrap">
                      {post.tags.map((t) => (
                        <span key={t} className="text-teal-400/90 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => onOpenFeedWithPost(post.id)}
                      className="text-teal-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Open Discussion</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

            {/* Shorts */}
            {(filterType === 'all' || filterType === 'shorts') &&
              filteredShorts.map((short) => (
                <div
                  key={short.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3"
                >
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    className="w-16 h-20 rounded-lg object-cover ring-1 ring-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1 text-[10px] text-teal-400 font-medium">
                      <PlaySquare className="w-3 h-3" />
                      <span>{short.specialty} · Clinical Video</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 truncate">{short.title}</h4>
                    <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                      {short.keyLearningPoint}
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Creator: {short.creator.name}
                    </span>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
};
