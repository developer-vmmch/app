import React, { useState, useEffect } from 'react';
import { X, Send, Heart, Stethoscope } from 'lucide-react';
import { Post, Comment } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  post: Post;
  onClose: () => void;
  onOpenAuthorProfile: (authorId: string) => void;
}

export const CommentsModal: React.FC<Props> = ({ post, onClose, onOpenAuthorProfile }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    setLoading(true);
    const res = await api.getComments(post.id);
    if (res.success) {
      setComments(res.data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || submitting) return;
    setSubmitting(true);
    const res = await api.addComment(post.id, newCommentText.trim());
    if (res.success) {
      setComments([...comments, res.data]);
      setNewCommentText('');
    }
    setSubmitting(false);
  };

  return (
    <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end animate-fadeIn">
      <div className="bg-slate-900 border-t border-slate-800 rounded-t-2xl max-h-[85%] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              Clinical Discussion ({comments.length})
            </h3>
            <p className="text-[11px] text-slate-400 truncate max-w-[280px]">
              {post.title || post.body.slice(0, 40)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments list */}
        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 divide-y divide-slate-800/60">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading peer responses...</div>
          ) : comments.length === 0 ? (
            <div className="py-8 text-center space-y-1">
              <Stethoscope className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">No replies yet</p>
              <p className="text-[11px] text-slate-500">
                Share your clinical insight or ask a follow-up question.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="pt-3 first:pt-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onOpenAuthorProfile(comment.author.id)}
                    className="flex items-center gap-2 text-left"
                  >
                    <img
                      src={comment.author.avatarUrl}
                      alt={comment.author.fullName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-800"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200">
                          {comment.author.fullName}
                        </span>
                        <VerificationBadge status={comment.author.verificationStatus} />
                      </div>
                      <span className="text-[10px] text-teal-400 font-medium">
                        {comment.author.specialty}
                      </span>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-slate-300 pl-9 leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add collegiate medical response..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim() || submitting}
            className="p-2.5 rounded-xl bg-teal-600 text-white hover:bg-teal-500 disabled:opacity-40 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
