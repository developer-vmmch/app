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
  Film,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { PostType, CreatePostDTO } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  initialPostType?: PostType;
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

const DRAFT_STORAGE_KEY = 'nova_post_composer_draft';

export const PostComposerModal: React.FC<Props> = ({
  isOpen,
  initialPostType,
  onClose,
  onPostCreated,
}) => {
  const [postType, setPostType] = useState<PostType>(initialPostType || 'case_discussion');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['ClinicalDiscussion']);
  const [references, setReferences] = useState<{ title: string; url: string; doi?: string }[]>([]);
  const [refTitle, setRefTitle] = useState('');
  const [refUrl, setRefUrl] = useState('');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);

  // Patient PHI Safety confirmation
  const [confirmedNoPatientPHI, setConfirmedNoPatientPHI] = useState(true);

  // Preview tab
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Restore draft or apply initialPostType on open
  useEffect(() => {
    if (isOpen) {
      if (initialPostType) {
        setPostType(initialPostType);
        if (initialPostType === 'video') {
          setMediaType('video');
          setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
          if (!tags.includes('Reels')) setTags((prev) => [...prev, 'Reels']);
        }
      } else {
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
    }
  }, [isOpen, initialPostType]);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem(
        DRAFT_STORAGE_KEY,
        JSON.stringify({ title, body, specialty, postType, tags })
      );
      alert('Draft saved locally.');
    } catch {
      setError('Unable to save draft locally.');
    }
  };

  // Video duration state for Reels (60-150s) and standard videos (<= 30 min)
  const [videoDuration, setVideoDuration] = useState<number | null>(null);

  const compressImageFile = (file: File, maxWidth = 1200, quality = 0.85): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleLocalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      setError('File size must be under 50MB.');
      return;
    }
    setError(null);
    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'image');
    if (isVid && postType !== 'video') {
      setPostType('video');
    }

    if (isVid) {
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        window.URL.revokeObjectURL(vid.src);
        const dur = vid.duration;
        setVideoDuration(dur);
        const isReel = tags.includes('Reels') || postType === 'video';
        if (isReel && (dur < 60 || dur > 150)) {
          setError(`Reels must be strictly between 60 and 150 seconds (1 - 2.5 minutes). Selected video is ${Math.round(dur)} seconds.`);
        } else if (!isReel && dur > 1800) {
          setError(`Standard video posts cannot exceed 30 minutes. Selected video is ${Math.round(dur / 60)} minutes.`);
        } else {
          setError(null);
        }
      };
      vid.src = URL.createObjectURL(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setMediaUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setVideoDuration(null);
      const dataUrl = await compressImageFile(file);
      setMediaUrl(dataUrl);
    }
  };

  const handleAddTag = () => {
    const cleaned = tagInput.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
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
      setError('Please provide educational content or clinical question details.');
      return;
    }

    if (!confirmedNoPatientPHI) {
      setError('You must certify that all patient identifiers (PHI) have been completely removed.');
      return;
    }

    const isReel = tags.includes('Reels') || postType === 'video';
    if (mediaType === 'video' && mediaUrl && videoDuration !== null) {
      if (isReel && (videoDuration < 60 || videoDuration > 150)) {
        setError(`Reels must be strictly between 60 and 150 seconds (1 - 2.5 minutes). Selected video duration is ${Math.round(videoDuration)} seconds.`);
        setSubmitting(false);
        return;
      }
      if (!isReel && videoDuration > 1800) {
        setError(`Standard video posts cannot exceed 30 minutes. Selected video duration is ${Math.round(videoDuration / 60)} minutes.`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(true);

    const dto: CreatePostDTO = {
      title: title.trim() || undefined,
      body: body.trim(),
      postType,
      specialty,
      tags,
      mediaUrl: mediaUrl.trim() || undefined,
      mediaType: mediaUrl.trim()
        ? mediaType || (postType === 'video' ? 'video' : 'image')
        : undefined,
      videoDuration: videoDuration !== null ? videoDuration : undefined,
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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white border border-[#E2E8F0] rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">
                Create Medical Post
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Share peer knowledge, cases & clinical questions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode switch */}
            <div className="flex items-center bg-[#F1F5F9] p-0.5 rounded-xl border border-[#E2E8F0] text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activeTab === 'edit'
                    ? 'bg-white text-[#1D4ED8] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white text-[#1D4ED8] shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-[#FAFCFF]">
          {/* Healthcare Safety & PHI Warning Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Protected Health Information (PHI) Safe Harbor Check</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              NOVA policy strictly prohibits patient names, initials, MRNs, facial photographs, or hospital dates. Ensure clinical findings are de-identified or synthesized.
            </p>
            <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={confirmedNoPatientPHI}
                onChange={(e) => setConfirmedNoPatientPHI(e.target.checked)}
                className="mt-0.5 rounded border-[#CBD5E1] text-[#1D4ED8] focus:ring-[#1D4ED8] w-4 h-4 bg-white"
              />
              <span className="text-xs font-semibold text-[#0F172A]">
                I certify that this post contains zero patient identifiable data (Zero PHI).
              </span>
            </label>
          </div>

          {activeTab === 'preview' ? (
            /* Live Preview */
            <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span className="text-[#1D4ED8] font-bold">{specialty}</span>
                <span>•</span>
                <span className="capitalize">{postType.replace('_', ' ')}</span>
              </div>
              <h3 className="text-base font-bold text-[#0F172A]">{title || 'Untitled Post'}</h3>
              <p className="text-xs text-[#334155] whitespace-pre-line leading-relaxed">
                {body || 'Content will appear here...'}
              </p>
              {tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap pt-2">
                  {tags.map((t) => (
                    <span key={t} className="text-xs text-[#1D4ED8] font-bold bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Edit Form */
            <form id="composer-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Post Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-2">
                  Knowledge Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {[
                    { id: 'case_discussion', label: 'Case Study', icon: Stethoscope },
                    { id: 'clinical_question', label: 'Question', icon: HelpCircle },
                    { id: 'poll', label: 'Clinical Poll', icon: Vote },
                    { id: 'article', label: 'Article', icon: FileText },
                    { id: 'video', label: 'Video / Reel', icon: Film },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = postType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPostType(item.id as PostType);
                          if (item.id === 'video') setMediaType('video');
                        }}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-[#1D4ED8] border-[#1D4ED8] text-white shadow-2xs'
                            : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Media Attachment (Photo / Video / Reel) */}
              <div className="bg-white p-3.5 rounded-2xl border border-[#E2E8F0] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#475569]">
                    Media Attachment {postType === 'video' ? '(Video / Reel)' : '(Photo / Video)'}
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] rounded-xl text-xs font-bold cursor-pointer transition-all border border-[#BFDBFE]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleLocalFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={
                        postType === 'video'
                          ? 'Paste MP4 / Reel URL or upload from device'
                          : 'Paste image/video URL or upload from device'
                      }
                      className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                    />
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                      className="bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-2.5 text-xs text-[#0F172A] font-semibold focus:outline-none focus:border-[#1D4ED8]"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>

                  {/* Media Preview Box if mediaUrl is present */}
                  {mediaUrl && (
                    <div className="relative rounded-xl overflow-hidden h-36 bg-black border border-[#CBD5E1] flex items-center justify-center">
                      {mediaType === 'video' ? (
                        <video src={mediaUrl} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setMediaUrl('')}
                        className="absolute top-2 right-2 p-1 rounded-full bg-black/70 text-white hover:bg-black"
                        title="Remove media"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Quick Preset Clinical Media Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
                    <span className="text-[10px] text-[#64748B] font-semibold shrink-0">Sample Media:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80');
                        setMediaType('image');
                      }}
                      className="text-[10px] font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1D4ED8] px-2 py-0.5 rounded-lg border border-[#E2E8F0] shrink-0"
                    >
                      Angiogram
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80');
                        setMediaType('image');
                      }}
                      className="text-[10px] font-semibold bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1D4ED8] px-2 py-0.5 rounded-lg border border-[#E2E8F0] shrink-0"
                    >
                      Clinical Echo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                        setMediaType('video');
                        setPostType('video');
                      }}
                      className="text-[10px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-0.5 rounded-lg border border-purple-200 shrink-0"
                    >
                      Surgical Reel (MP4)
                    </button>
                  </div>
                </div>
              </div>

              {/* Specialty Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Medical Specialty
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#1D4ED8]"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Title or Clinical Dilemma
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Management of refractory vasoplegia in post-cardiac surgery..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Case Details, Presentation & Teaching Points *
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide structured clinical history, de-identified parameters, imaging findings, diagnostic rationale, or question for colleagues..."
                  className="w-full bg-white border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] leading-relaxed"
                />
              </div>

              {/* Poll Fields if type is Poll */}
              {postType === 'poll' && (
                <div className="p-3.5 bg-white rounded-2xl border border-[#E2E8F0] space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold text-[#1D4ED8]">Clinical Poll Options</span>
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Enter question for peer vote..."
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                  />
                  <div className="space-y-1.5">
                    {pollOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdatePollOption(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D4ED8] focus:bg-white"
                        />
                        {pollOptions.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePollOption(i)}
                            className="p-1.5 text-[#94A3B8] hover:text-[#DC2626]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddPollOption}
                        className="text-xs text-[#1D4ED8] hover:text-[#1E40AF] font-bold flex items-center gap-1 pt-1"
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
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
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
                    className="flex-1 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#1D4ED8]"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3.5 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold text-[#0F172A] transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] font-semibold"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#1D4ED8] hover:text-[#DC2626]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* References */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Academic Citation / Guideline Link
                </label>
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={refTitle}
                      onChange={(e) => setRefTitle(e.target.value)}
                      placeholder="Title (e.g. ACC/AHA 2026 Guidelines)"
                      className="flex-1 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                    />
                    <input
                      type="url"
                      value={refUrl}
                      onChange={(e) => setRefUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-1/3 bg-white border border-[#CBD5E1] rounded-xl px-3 py-1.5 text-xs text-[#0F172A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddReference}
                      className="px-3 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-xs font-bold rounded-xl text-[#0F172A]"
                    >
                      +
                    </button>
                  </div>
                  {references.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0]"
                    >
                      <span className="text-[#1D4ED8] font-medium truncate">{r.title}</span>
                      <button
                        type="button"
                        onClick={() => setReferences(references.filter((_, idx) => idx !== i))}
                        className="text-[#94A3B8] hover:text-[#DC2626]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Error indicator */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {error}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-3 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              form="composer-form"
              type="submit"
              disabled={submitting || !confirmedNoPatientPHI}
              className="px-5 py-2.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] disabled:opacity-40 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
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
