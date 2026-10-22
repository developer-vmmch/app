import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Building2,
  Lock,
  Camera,
  Image as ImageIcon,
  Upload,
  Film,
} from 'lucide-react';
import { StoryType, StoryAudience, CreateStoryDTO } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}

const SAMPLE_STORY_IMAGES = [
  {
    name: 'Clinical Discussion',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Academic Conference',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Medical Skills Lab',
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Catheterization Review',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80',
  },
];

export const CreateStoryModal: React.FC<Props> = ({ isOpen, onClose, onStoryCreated }) => {
  const [storyType, setStoryType] = useState<StoryType>('PROFESSIONAL');
  const [audience, setAudience] = useState<StoryAudience>('FOLLOWERS');
  const [caption, setCaption] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(SAMPLE_STORY_IMAGES[0].url);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit.');
      return;
    }

    setErrorMessage(null);
    const isVid = file.type.startsWith('video');

    if (isVid) {
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoEl.src);
        if (videoEl.duration > 30.5) {
          setErrorMessage('Video stories must be limited to 30 seconds maximum.');
        } else {
          setMediaType('video');
          const objectUrl = URL.createObjectURL(file);
          setSelectedMediaUrl(objectUrl);
        }
      };
      videoEl.src = URL.createObjectURL(file);
    } else {
      setMediaType('image');
      const objectUrl = URL.createObjectURL(file);
      setSelectedMediaUrl(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setErrorMessage('Please enter a caption for your story.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const dto: CreateStoryDTO = {
      storyType,
      audience,
      caption: caption.trim(),
      mediaUrl: selectedMediaUrl,
      mediaType,
    };

    const res = await api.createStory(dto);
    setSubmitting(false);

    if (res.success) {
      onStoryCreated();
      onClose();
    } else {
      setErrorMessage(res.error?.message || 'Failed to publish story. Please retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92%] overflow-y-auto shadow-2xl border border-[#E2E8F0]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">Publish New Story</h3>
              <p className="text-[11px] text-[#64748B]">
                24-hour expiring clinical update or milestone
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Daily Expiry Boundary Notice */}
          <div className="p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] space-y-1 text-xs text-[#1E3A8A]">
            <div className="flex items-center gap-1.5 font-bold text-[#1D4ED8]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>24-Hour Expiry Policy</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#334155]">
              Stories automatically expire after 24 hours from publication.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {errorMessage}
            </div>
          )}

          {/* 1. Category Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Story Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStoryType('PROFESSIONAL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  storyType === 'PROFESSIONAL'
                    ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8] font-bold shadow-2xs'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="block text-xs font-bold text-[#0F172A]">Professional</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5 leading-snug">
                  Case pearl, CME, medical insight
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStoryType('PERSONAL')}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  storyType === 'PERSONAL'
                    ? 'border-[#1D4ED8] bg-[#EFF6FF] text-[#1D4ED8] font-bold shadow-2xs'
                    : 'border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
                }`}
              >
                <span className="block text-xs font-bold text-[#0F172A]">Personal</span>
                <span className="text-[10px] text-[#64748B] block mt-0.5 leading-snug">
                  Conference, milestone, hospital life
                </span>
              </button>
            </div>
          </div>

          {/* 2. Audience Scope */}
          <div>
            <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Audience Scope *
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'FOLLOWERS', label: 'All Followers', icon: Users },
                { id: 'APPROVED_CONNECTIONS', label: 'Connections Only', icon: ShieldCheck },
                { id: 'INSTITUTION', label: 'My Institution', icon: Building2 },
                { id: 'PRIVATE', label: 'Mentees Only', icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = audience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAudience(item.id as StoryAudience)}
                    className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'border-[#1D4ED8] bg-[#EFF6FF] font-bold text-[#1D4ED8]'
                        : 'border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#1D4ED8] shrink-0" />
                    <span className="text-[11px] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Media Selection & Upload */}
          <div>
            <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1.5">
              Select Photo or Video *
            </label>

            {/* Local File Picker */}
            <div className="mb-2.5">
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#1D4ED8] bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#475569] cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-[#1D4ED8]" />
                <span className="text-xs font-bold">Choose Media from Device (Photo / Video)</span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview Selected Media */}
            <div className="relative rounded-2xl overflow-hidden h-40 bg-black border border-[#E2E8F0] flex items-center justify-center">
              {mediaType === 'video' ? (
                <video src={selectedMediaUrl} controls className="w-full h-full object-cover" />
              ) : (
                <img src={selectedMediaUrl} alt="Story preview" className="w-full h-full object-cover" />
              )}
              <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider backdrop-blur-xs">
                {mediaType} Preview
              </div>
            </div>

            {/* Or Sample Presets */}
            <div className="mt-2">
              <span className="text-[10px] font-semibold text-[#64748B] block mb-1">Or pick a professional background:</span>
              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLE_STORY_IMAGES.map((img) => (
                  <div
                    key={img.url}
                    onClick={() => {
                      setSelectedMediaUrl(img.url);
                      setMediaType('image');
                    }}
                    className={`relative rounded-xl overflow-hidden h-14 cursor-pointer border-2 transition-all ${
                      selectedMediaUrl === img.url && mediaType === 'image'
                        ? 'border-[#1D4ED8] scale-95 ring-2 ring-[#1D4ED8]/30'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Caption */}
          <div>
            <label className="block text-[11px] font-bold text-[#0F172A] uppercase tracking-wider mb-1">
              Story Caption / Knowledge Snippet *
            </label>
            <textarea
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Presenting our STEMI pre-transfer thrombolysis audit at grand rounds..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#1D4ED8] leading-relaxed font-medium"
            />
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#0F172A] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !caption.trim()}
              className="px-4 py-2 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
            >
              {submitting ? 'Publishing Story...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
