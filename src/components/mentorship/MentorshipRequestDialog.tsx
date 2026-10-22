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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                Request Clinical Mentorship
              </h3>
              <p className="text-xs text-[#64748B]">
                To {mentor.fullName} ({mentor.primarySpecialty || mentor.specialty})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-[#FAFCFF]">
          {/* Mentor Summary */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs">
            <img
              src={mentor.avatarUrl}
              alt={mentor.fullName}
              className="w-12 h-12 rounded-2xl object-cover border border-[#E2E8F0]"
            />
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#0F172A] block truncate">
                {mentor.fullName}
              </span>
              <span className="text-[11px] text-[#1D4ED8] font-semibold block truncate">
                {mentor.qualification} · {mentor.institution}
              </span>
              <span className="text-[10px] text-[#64748B]">
                {mentor.yearsOfExperience} years practice · {mentor.publicationsCount} publications
              </span>
            </div>
          </div>

          {mentor.mentorshipTopics && mentor.mentorshipTopics.length > 0 && (
            <div>
              <span className="text-[10px] uppercase font-bold text-[#475569] tracking-wider block mb-1.5">
                Mentor's Stated Clinical Focus:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {mentor.mentorshipTopics.map((topic) => (
                  <span
                    key={topic}
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE]"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Your Learning Objective & Clinical Goals *
            </label>
            <textarea
              rows={4}
              value={learningObjective}
              onChange={(e) => setLearningObjective(e.target.value)}
              placeholder="Describe your current medical training level, what clinical skills or research techniques you seek guidance on, and your proposed commitment..."
              className="w-full bg-white border border-[#CBD5E1] rounded-2xl p-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] leading-relaxed shadow-2xs"
            />
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Mentorship on NOVA is focused strictly on professional clinical learning and academic development. No recruitment or job hiring.
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting Request...' : 'Send Mentorship Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
