import React, { useState } from 'react';
import { X, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { DoctorProfile } from '../../types';
import { api } from '../../services/api';

interface Props {
  mentor: DoctorProfile | null;
  onClose: () => void;
  onRequestSubmitted: () => void;
}

export const MentorshipRequestDialog: React.FC<Props> = ({
  mentor,
  onClose,
  onRequestSubmitted,
}) => {
  const [learningObjective, setLearningObjective] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!mentor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningObjective.trim()) {
      setError('Please define your primary clinical learning objective.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const res = await api.createMentorshipRequest({
      mentorId: mentor.id,
      learningObjective: learningObjective.trim(),
    });

    setSubmitting(false);

    if (res.success) {
      onRequestSubmitted();
      onClose();
    } else {
      setError(res.error?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100">
                Request Clinical Mentorship
              </h3>
              <p className="text-[10px] text-slate-400">
                To {mentor.fullName} ({mentor.primarySpecialty || mentor.specialty})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mentor Summary */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <img
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-800"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {mentor.fullName}
              </span>
              <span className="text-[11px] text-teal-400 block truncate">
                {mentor.qualification} · {mentor.institution}
              </span>
              <span className="text-[10px] text-slate-400">
                {mentor.yearsOfExperience} years practice · {mentor.publicationsCount} publications
              </span>
            </div>
          </div>

          {mentor.mentorshipTopics && mentor.mentorshipTopics.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider block mb-1">
                Mentor's Stated Mentorship Focus:
              </span>
              <div className="flex flex-wrap gap-1">
                {mentor.mentorshipTopics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] px-2 py-0.5 rounded bg-teal-950/60 text-teal-300 border border-teal-800/40"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Your Learning Objective & Goals *
            </label>
            <textarea
              rows={4}
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="Describe your current training level, what clinical skills or research techniques you seek guidance on, and your proposed commitment..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              Mentorship on AMT Doctor Knowledge Network is focused strictly on professional clinical learning and academic development. No recruitment or job hiring.
            </span>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md"
            >
              <Award className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
