import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Bookmark,
  Share2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  MoreVertical,
  Flag,
  HelpCircle,
  Vote,
  FileText,
  Stethoscope,
  Building2,
  Check,
  Play,
} from 'lucide-react';
import { Post } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Avatar } from '../common/Avatar';

interface Props {
  post: Post;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onOpenComments: (post: Post) => void;
  onOpenAuthorProfile: (authorId: string) => void;
  onOpenInstitutionDetail?: (instId: string) => void;
  onReport: (post: Post) => void;
  onSelectTag?: (tag: string) => void;
}

export const PostCard: React.FC<Props> = ({
  post,
  onLike,
  onBookmark,
  onVote,
  onOpenComments,
  onOpenAuthorProfile,
  onOpenInstitutionDetail,
  onReport,
  onSelectTag,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formatTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 60) return `${Math.max(1, diffMins)} min ago`;
      if (diffHours < 24) return `${diffHours} hr ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="bg-white border border-[#E5EDF5] rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-[#1D4ED8]/30 transition-all space-y-3.5">
      {/* =========================================================================
          HEADER: Author Avatar (44px circle), Name, Title & Timestamp
          ========================================================================= */}
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => onOpenAuthorProfile(post.author.id)}
          className="flex items-center gap-3 text-left group min-w-0"
        >
          {/* Avatar with Initials Fallback */}
          <Avatar
            src={post.author.avatarUrl}
            name={post.author.fullName}
            id={post.author.id}
            size="md"
            verificationStatus={post.author.verificationStatus}
            showBadge
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-[#0F1E36] group-hover:text-[#1D4ED8] transition-colors truncate">
                {post.author.fullName}
              </span>
              <VerificationBadge status={post.author.verificationStatus} showText={false} />
            </div>
            <p className="text-xs text-[#5A6B82] leading-tight truncate">
              {post.author.specialty}
            </p>
            <p className="text-[11px] text-[#7A8B9E] leading-tight mt-0.5">
              {formatTimestamp(post.createdAt)}
            </p>
          </div>
        </button>

        {/* Post Type Badge & Options Menu */}
        <div className="flex items-center gap-1.5 relative shrink-0">
          <span className="text-[11px] font-semibold text-[#1D4ED8] bg-[#EFF6FF] px-2.5 py-1 rounded-full capitalize">
            {post.postType.replace('_', ' ')}
          </span>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-[#7A8B9E] hover:text-[#0F1E36] hover:bg-[#F4F7FB] transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-8 w-44 bg-white border border-[#E5EDF5] rounded-xl shadow-xl z-20 py-1 text-xs">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onReport(post);
                }}
                className="w-full text-left px-3.5 py-2 text-[#DC2626] hover:bg-red-50 flex items-center gap-2"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Content</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAuthorProfile(post.author.id);
                }}
                className="w-full text-left px-3.5 py-2 text-[#0F1E36] hover:bg-[#F4F7FB] flex items-center gap-2"
              >
                <Stethoscope className="w-3.5 h-3.5 text-[#1D4ED8]" />
                <span>Doctor Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hospital Affiliation if present */}
      {post.institutionName && (
        <div className="flex items-center gap-1.5 text-xs text-[#1D4ED8] bg-[#EFF6FF] px-3 py-1.5 rounded-xl font-medium">
          <Building2 className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
          <span className="truncate">{post.institutionName}</span>
        </div>
      )}

      {/* Post Title */}
      {post.title && (
        <h3 className="text-sm sm:text-base font-bold text-[#0F1E36] leading-snug">
          {post.title}
        </h3>
      )}

      {/* Post Body Text */}
      <div className="text-xs sm:text-[13px] text-[#334155] leading-relaxed whitespace-pre-line">
        {post.body}
      </div>

      {/* Clinical Media Attachment (Image or Video) */}
      {post.mediaUrl && (
        <div className="w-full rounded-2xl overflow-hidden border border-[#E5EDF5] relative bg-black">
          {post.mediaType === 'video' || post.postType === 'video' ? (
            <video
              src={post.mediaUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[420px] object-contain bg-black"
            />
          ) : (
            <div className="relative group">
              <img
                src={post.mediaUrl}
                alt={post.title || 'Clinical imaging'}
                className="w-full max-h-[360px] object-cover group-hover:scale-[1.01] transition-transform duration-300"
              />
              {post.title && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A1733]/90 via-[#0A1733]/60 to-transparent p-3 sm:p-4 text-white">
                  <p className="text-xs sm:text-sm font-bold truncate">{post.title}</p>
                  <p className="text-[10px] text-slate-300 mt-0.5">Verified clinical case visual</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Poll Component */}
      {post.poll && (
        <div className="bg-[#F8FAFD] border border-[#E5EDF5] rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F1E36]">
            <span>{post.poll.question}</span>
            <span className="text-[10px] text-[#5A6B82] font-normal">{post.poll.totalVotes} votes</span>
          </div>

          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const isVoted = post.poll?.userVotedOptionId === option.id;
              const hasVotedAny = Boolean(post.poll?.userVotedOptionId);
              const percentage =
                post.poll!.totalVotes > 0 ? Math.round((option.votes / post.poll!.totalVotes) * 100) : 0;

              return (
                <button
                  key={option.id}
                  disabled={hasVotedAny}
                  onClick={() => onVote(post.id, option.id)}
                  className={`w-full text-left text-xs p-3 rounded-xl relative overflow-hidden border transition-all ${
                    isVoted
                      ? 'border-[#1D4ED8] bg-[#EFF6FF] font-bold text-[#1D4ED8]'
                      : hasVotedAny
                      ? 'border-[#E5EDF5] bg-white text-[#0F1E36]'
                      : 'border-[#E5EDF5] bg-white hover:border-[#1D4ED8] text-[#0F1E36]'
                  }`}
                >
                  {hasVotedAny && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 opacity-15 ${
                        isVoted ? 'bg-[#1D4ED8]' : 'bg-[#7A8B9E]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="truncate">{option.text}</span>
                    {hasVotedAny && (
                      <span className="text-[11px] font-bold text-[#1D4ED8] shrink-0">{percentage}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Medical Poll Safety Notice */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#64748B] pt-1.5 border-t border-[#E5EDF5]">
            <HelpCircle className="w-3 h-3 text-[#0284C7] shrink-0" />
            <span>Educational peer consensus only. Not a substitute for clinical guidelines.</span>
          </div>
        </div>
      )}

      {/* Evidence Citations */}
      {post.references && post.references.length > 0 && (
        <div className="pt-1 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#7A8B9E] tracking-wider block">
            Evidence Citations:
          </span>
          {post.references.map((ref, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-[#1D4ED8]">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <a href={ref.url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                {ref.title}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Tags and Zero-PHI Check */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E5EDF5] text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => onSelectTag && onSelectTag(tag)}
              className="text-[#1D4ED8] hover:text-[#1E40AF] font-bold text-[11px] bg-[#EFF6FF] px-2 py-0.5 rounded-md hover:bg-[#DBEAFE] transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>

        {post.hasPatientSafetyDisclaimer && (
          <div className="flex items-center gap-1 text-[10px] text-[#16845B] font-semibold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16845B]" />
            <span>Zero PHI Verified</span>
          </div>
        )}
      </div>

      {/* Actions Row (Consistent horizontal row matching reference screenshot) */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[#E5EDF5] text-xs text-[#5A6B82]">
        {/* Like */}
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            post.isLiked
              ? 'text-[#DC2626] bg-[#FEF2F2] font-bold'
              : 'hover:text-[#0F1E36] hover:bg-[#F4F7FB]'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
          <span>{post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}</span>
        </button>

        {/* Comment */}
        <button
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:text-[#0F1E36] hover:bg-[#F4F7FB] transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount} Comments</span>
        </button>

        {/* Save */}
        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl transition-all ${
            post.isBookmarked
              ? 'text-[#1D4ED8] bg-[#EFF6FF] font-bold'
              : 'hover:text-[#0F1E36] hover:bg-[#F4F7FB]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#1D4ED8] text-[#1D4ED8]' : ''}`} />
          <span>Save</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl hover:text-[#0F1E36] hover:bg-[#F4F7FB] transition-all relative"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
          {copiedLink && (
            <span className="absolute -top-7 right-0 bg-[#0F1E36] text-white text-[10px] px-2.5 py-0.5 rounded-lg shadow-sm whitespace-nowrap">
              Link Copied!
            </span>
          )}
        </button>
      </div>
    </article>
  );
};
