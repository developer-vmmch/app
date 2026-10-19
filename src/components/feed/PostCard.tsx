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
} from 'lucide-react';
import { Post } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  post: Post;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onVote: (postId: string, optionId: string) => void;
  onOpenComments: (post: Post) => void;
  onOpenAuthorProfile: (authorId: string) => void;
  onOpenInstitutionDetail?: (instId: string) => void;
  onReport: (post: Post) => void;
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
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const getPostTypeLabel = () => {
    switch (post.postType) {
      case 'clinical_question':
        return { label: 'Question', icon: HelpCircle, color: 'text-[#246BCE]' };
      case 'case_discussion':
        return { label: 'Case Discussion', icon: Stethoscope, color: 'text-[#12345B]' };
      case 'poll':
        return { label: 'Clinical Poll', icon: Vote, color: 'text-[#B7791F]' };
      case 'article':
        return { label: 'Article Review', icon: FileText, color: 'text-[#246BCE]' };
      default:
        return { label: 'Knowledge Post', icon: FileText, color: 'text-[#63738A]' };
    }
  };

  const typeInfo = getPostTypeLabel();
  const TypeIcon = typeInfo.icon;

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="bg-white border border-[#E1E9F3] rounded-xl p-3.5 space-y-3 shadow-2xs hover:border-[#246BCE]/40 transition-colors">
      {/* Header: Author & Specialty */}
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={() => onOpenAuthorProfile(post.author.id)}
          className="flex items-center gap-2.5 text-left group"
        >
          <img
            src={post.author.avatarUrl}
            alt={post.author.fullName}
            className="w-10 h-10 rounded-full object-cover border border-[#E1E9F3] group-hover:ring-2 group-hover:ring-[#246BCE] transition-all shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-[#142238] group-hover:text-[#246BCE] transition-colors">
                {post.author.fullName}
              </span>
              <VerificationBadge status={post.author.verificationStatus} />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#63738A]">
              <span className="text-[#246BCE] font-semibold">{post.author.specialty}</span>
              <span>·</span>
              <span className="truncate max-w-[150px]">{post.author.institution}</span>
            </div>
          </div>
        </button>

        {/* Post Type & Menu */}
        <div className="relative flex items-center gap-1">
          <div className="flex items-center gap-1 text-[11px] bg-[#F6F9FD] px-2 py-0.5 rounded border border-[#E1E9F3] text-[#12345B]">
            <TypeIcon className={`w-3.5 h-3.5 ${typeInfo.color}`} />
            <span className="font-semibold">{typeInfo.label}</span>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded text-[#63738A] hover:text-[#12345B]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-7 w-44 bg-white border border-[#E1E9F3] rounded-xl shadow-xl z-20 py-1 text-xs">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onReport(post);
                }}
                className="w-full text-left px-3 py-2 text-[#C43D4B] hover:bg-rose-50 flex items-center gap-2"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Content</span>
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenAuthorProfile(post.author.id);
                }}
                className="w-full text-left px-3 py-2 text-[#142238] hover:bg-[#F6F9FD] flex items-center gap-2"
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Doctor Profile</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hospital Banner if tagged to institution */}
      {post.institutionName && (
        <div className="flex items-center gap-1 text-[11px] text-[#12345B] bg-[#EAF3FF] px-2.5 py-1 rounded-lg">
          <Building2 className="w-3.5 h-3.5 text-[#246BCE] shrink-0" />
          <span className="font-semibold">{post.institutionName}</span>
        </div>
      )}

      {/* Title */}
      {post.title && (
        <h2 className="text-xs sm:text-sm font-bold text-[#12345B] leading-snug">
          {post.title}
        </h2>
      )}

      {/* Body */}
      <div className="text-xs text-[#142238] leading-relaxed whitespace-pre-line">
        {post.body}
      </div>

      {/* Poll */}
      {post.poll && (
        <div className="bg-[#F6F9FD] border border-[#E1E9F3] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#12345B]">
            <span>{post.poll.question}</span>
            <span className="text-[10px] text-[#63738A] font-normal">{post.poll.totalVotes} votes</span>
          </div>

          <div className="space-y-1.5">
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
                  className={`w-full text-left text-xs p-2.5 rounded-lg relative overflow-hidden border transition-all ${
                    isVoted
                      ? 'border-[#246BCE] bg-[#EAF3FF] font-bold text-[#12345B]'
                      : hasVotedAny
                      ? 'border-[#E1E9F3] bg-white text-[#142238]'
                      : 'border-[#E1E9F3] bg-white hover:border-[#246BCE] text-[#142238]'
                  }`}
                >
                  {hasVotedAny && (
                    <div
                      className={`absolute left-0 top-0 bottom-0 opacity-15 ${
                        isVoted ? 'bg-[#246BCE]' : 'bg-[#63738A]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-2">
                    <span className="truncate">{option.text}</span>
                    {hasVotedAny && (
                      <span className="text-[11px] font-bold text-[#246BCE] shrink-0">{percentage}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* References */}
      {post.references && post.references.length > 0 && (
        <div className="pt-1 space-y-1">
          <span className="text-[10px] uppercase font-bold text-[#63738A] tracking-wider">
            Evidence Citations:
          </span>
          {post.references.map((ref, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-xs text-[#246BCE]">
              <ExternalLink className="w-3 h-3 shrink-0" />
              <a href={ref.url} target="_blank" rel="noreferrer" className="hover:underline truncate">
                {ref.title}
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Tags & De-identification */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E1E9F3] text-[11px] text-[#63738A]">
        <div className="flex items-center gap-1.5 flex-wrap">
          {post.tags.map((tag) => (
            <span key={tag} className="text-[#246BCE] font-mono">
              #{tag}
            </span>
          ))}
        </div>

        {post.hasPatientSafetyDisclaimer && (
          <div className="flex items-center gap-1 text-[10px] text-[#16845B] font-medium shrink-0">
            <CheckCircle2 className="w-3 h-3 text-[#16845B]" />
            <span>Zero PHI Verified</span>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E1E9F3] text-xs text-[#63738A]">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
            post.isLiked
              ? 'text-[#C43D4B] bg-[#FDF2F3] font-bold'
              : 'hover:text-[#12345B] hover:bg-[#F6F9FD]'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-[#C43D4B] text-[#C43D4B]' : ''}`} />
          <span>{post.likesCount}</span>
        </button>

        <button
          onClick={() => onOpenComments(post)}
          className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:text-[#12345B] hover:bg-[#F6F9FD] transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{post.commentsCount} Comments</span>
        </button>

        <button
          onClick={() => onBookmark(post.id)}
          className={`flex items-center gap-1.5 py-1 px-2.5 rounded-lg transition-colors ${
            post.isBookmarked
              ? 'text-[#246BCE] bg-[#EAF3FF] font-bold'
              : 'hover:text-[#12345B] hover:bg-[#F6F9FD]'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-[#246BCE] text-[#246BCE]' : ''}`} />
          <span>Save</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 py-1 px-2 rounded-lg hover:text-[#12345B] hover:bg-[#F6F9FD] transition-colors relative"
        >
          <Share2 className="w-4 h-4" />
          {copiedLink && (
            <span className="absolute -top-7 right-0 bg-[#12345B] text-white text-[10px] px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
              Link Copied!
            </span>
          )}
        </button>
      </div>
    </article>
  );
};
