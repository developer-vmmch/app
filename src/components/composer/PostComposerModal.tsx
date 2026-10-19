import React, { useState, useEffect } from 'react';
import {
  X,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Vote,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  Edit3,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { PostType, CreatePostDTO } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const SPECIALTIES = [
  'Cardiology',
  'Neurosurgery',
  'Pediatrics',
  'Emergency Medicine',
  'Internal Medicine',
  'Oncology',
  'General Surgery',
  'Infectious Disease',
  'Radiology',
  'Pathology',
];

const DRAFT_STORAGE_KEY = 'amt_dkn_post_composer_draft';

export const PostComposerModal: React.FC<Props> = ({ isOpen, onClose, onPostCreated }) => {
  const [postType, setPostType] = useState<PostType>('case_discussion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['ClinicalDiscussion']);
  const [references, setReferences] = useState<{ title: string; url: string; doi?: string }[]>([]);
  const [refTitle, setRefTitle] = useState('');
  const [refUrl, setRefUrl] = useState('');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Patient PHI Safety confirmation
  const [confirmedNoPatientPHI, setConfirmedNoPatientPHI] = useState(false);
  const [acknowledgedNotClinicalGuideline, setAcknowledgedNotClinicalGuideline] = useState(true);

  // Preview tab
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore draft on open
  useEffect(() => {
    if (isOpen) {
      try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setBody(parsed.body || '');
          setSpecialty(parsed.specialty || 'Cardiology');
          setPostType(parsed.postType || 'case_discussion');
          if (parsed.tags) setTags(parsed.tags);
        }
      } catch {}
    }
  }, [isOpen]);

  const handleSaveDraft = () => {
    try {
      const draft = { title, body, specialty, postType, tags };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      alert('Draft saved locally.');
    } catch {}
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddReference = () => {
    if (refTitle.trim() && refUrl.trim()) {
      setReferences([...references, { title: refTitle.trim(), url: refUrl.trim() }]);
      setRefTitle('');
      setRefUrl('');
    }
  };

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleUpdatePollOption = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!body.trim()) {
      setError('Please provide educational content or question details.');
      return;
    }

    if (!confirmedNoPatientPHI) {
      setError('You must certify that all patient identifiers (PHI) have been completely removed.');
      return;
    }

    setSubmitting(true);

    const dto: CreatePostDTO = {
      title: title.trim() || undefined,
      body: body.trim(),
      postType,
      specialty,
      tags,
      references: references.length > 0 ? references : undefined,
      poll:
        postType === 'poll' && pollQuestion.trim()
          ? {
              question: pollQuestion.trim(),
              options: pollOptions.filter((o) => o.trim().length > 0),
            }
          : undefined,
      confirmedNoPatientPHI: true,
    };

    const res = await api.createPost(dto);
    setSubmitting(false);

    if (res.success) {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      onPostCreated();
      onClose();
    } else {
      setError(res.error?.message || 'Failed to submit post');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl max-h-[92%] flex flex-col shadow-2xl overflow-hidden w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                Create Knowledge Post
              </h2>
              <p className="text-[10px] text-slate-400">
                Share clinical cases, questions & evidence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700/60 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                  activeTab === 'edit' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-teal-600 text-white' : 'text-slate-400'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Healthcare Safety & PHI Warning Box */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Mandatory Protected Health Information (PHI) Verification</span>
            </div>
            <p className="text-[11px] text-amber-200/90 leading-relaxed">
              Medical regulations strictly prohibit posting patient names, initials, identification numbers, facial photography, or hospital dates. Ensure clinical case details have been completely anonymized or synthesized.
            </p>
            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedNoPatientPHI}
                onChange={(e) => setConfirmedNoPatientPHI(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-teal-600 focus:ring-teal-500 w-4 h-4 bg-slate-900"
              />
              <span className="text-xs font-medium text-slate-200">
                I certify under professional medical ethics that this post contains zero identifiable patient data.
              </span>
            </label>
          </div>

          {activeTab === 'preview' ? (
            /* Live Preview */
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-teal-400 font-semibold">{specialty}</span>
                <span>·</span>
                <span className="capitalize">{postType.replace('_', ' ')}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100">{title || 'Untitled Post'}</h3>
              <p className="text-xs text-slate-300 whitespace-pre-line">
                {body || 'Content will appear here...'}
              </p>
              {tags.length > 0 && (
                <div className="flex gap-1 flex-wrap pt-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs text-teal-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Edit Form */
            <form id="composer-form" onSubmit={handleSubmit} className="space-y-3.5">
              {/* Post Type Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Knowledge Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'case_discussion', label: 'Case Study', icon: Stethoscope },
                    { id: 'clinical_question', label: 'Question', icon: HelpCircle },
                    { id: 'poll', label: 'Clinical Poll', icon: Vote },
                    { id: 'article', label: 'Literature', icon: FileText },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPostType(item.id as PostType)}
                        className={`p-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 transition-colors ${
                          postType === item.id
                            ? 'bg-teal-950/80 border-teal-500 text-teal-300 font-medium'
                            : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialty Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Medical Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Title or Clinical Dilemma
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Management of refractory vasoplegia in post-cardiac surgery..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Case Details, Presentation & Teaching Points *
                </label>
                <textarea
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide structured clinical history, de-identified parameters, imaging findings, diagnostic rationale, or specific question for senior colleagues..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500 leading-relaxed"
                />
              </div>

              {/* Poll Fields if type is Poll */}
              {postType === 'poll' && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
                  <span className="text-xs font-semibold text-teal-300">Poll Configuration</span>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Question to vote on..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                  <div className="space-y-1.5">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdatePollOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-100 focus:outline-none"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOption(i)}
                            className="p-1 text-slate-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddPollOption}
                        className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Option</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Topic Tags
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="e.g. CathLab, POCUS, Resuscitation"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    Add
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-slate-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Academic Citation / Guideline Link
                </label>
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={refTitle}
                      onChange={(e) => setRefTitle(e.target.value)}
                      placeholder="Title (e.g. ACC/AHA 2026 Guidelines)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <input
                      type="url"
                      value={refUrl}
                      onChange={(e) => setRefUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-1/3 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddReference}
                      className="px-2.5 py-1.5 bg-slate-800 text-xs rounded-lg text-slate-200"
                    >
                      +
                    </button>
                  </div>
                  {references.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-slate-950 px-2.5 py-1 rounded border border-slate-800"
                    >
                      <span className="text-teal-400 truncate">{r.title}</span>
                      <button
                        type="button"
                        onClick={() => setReferences(references.filter((_, idx) => idx !== i))}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error indicator */}
              {error && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-2 rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              form="composer-form"
              type="submit"
              disabled={submitting || !confirmedNoPatientPHI}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish to Feed'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
