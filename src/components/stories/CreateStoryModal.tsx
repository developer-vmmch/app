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
  Image,
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
  const [selectedImage, setSelectedImage] = useState(SAMPLE_STORY_IMAGES[0].url);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setSubmitting(true);
    const dto: CreateStoryDTO = {
      storyType,
      audience,
      caption: caption.trim(),
      mediaUrl: selectedImage,
      mediaType: 'image',
    };

    const res = await api.createStory(dto);
    setSubmitting(false);

    if (res.success) {
      onStoryCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92%] overflow-y-auto shadow-2xl border border-[#E1E9F3]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E1E9F3] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#246BCE] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#142238]">Add to My Story</h3>
              <p className="text-[11px] text-[#63738A]">
                Share professional learning or personal milestones
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#63738A] hover:text-[#142238]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Mandatory Expiry Rule Notice */}
          <div className="p-3 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/30 space-y-1 text-xs text-[#12345B]">
            <div className="flex items-center gap-1.5 font-bold text-[#246BCE]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>Daily Expiry Boundary: 23:59:59 Tonight</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#142238]">
              Stories expire at <strong>23:59:59 local time</strong> followed by the midnight reset. (This is a fixed daily boundary, not a rolling 24-hour expiry).
            </p>
          </div>

          {/* 1. Category Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1.5">
              Select Story Category *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStoryType('PROFESSIONAL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  storyType === 'PROFESSIONAL'
                    ? 'border-[#246BCE] bg-[#EAF3FF] text-[#12345B] shadow-xs'
                    : 'border-[#E1E9F3] bg-white text-[#63738A] hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-bold text-[#142238]">Professional Story</span>
                <span className="text-[10px] text-[#63738A] block mt-0.5 leading-snug">
                  Educational tips, specialty insights, case pearls, academic updates
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStoryType('PERSONAL')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  storyType === 'PERSONAL'
                    ? 'border-[#246BCE] bg-[#EAF3FF] text-[#12345B] shadow-xs'
                    : 'border-[#E1E9F3] bg-white text-[#63738A] hover:bg-slate-50'
                }`}
              >
                <span className="block text-xs font-bold text-[#142238]">Personal Story</span>
                <span className="text-[10px] text-[#63738A] block mt-0.5 leading-snug">
                  Career milestones, conference attendance, non-clinical doctor updates
                </span>
              </button>
            </div>
          </div>

          {/* 2. Audience Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1.5">
              Audience Scope *
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {[
                { id: 'FOLLOWERS', label: 'All Followers', icon: Users },
                { id: 'APPROVED_CONNECTIONS', label: 'Connections Only', icon: ShieldCheck },
                { id: 'INSTITUTION', label: 'My Institution', icon: Building2 },
                { id: 'PRIVATE', label: 'Private (Mentees)', icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = audience === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAudience(item.id as StoryAudience)}
                    className={`p-2 rounded-lg border flex items-center gap-2 text-left transition-colors ${
                      isSelected
                        ? 'border-[#246BCE] bg-[#EAF3FF] font-semibold text-[#12345B]'
                        : 'border-[#E1E9F3] text-[#63738A] hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#246BCE]" />
                    <span className="text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Media Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1.5">
              Select Background Image
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SAMPLE_STORY_IMAGES.map((img) => (
                <div
                  key={img.url}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative rounded-lg overflow-hidden h-16 cursor-pointer border-2 transition-all ${
                    selectedImage === img.url
                      ? 'border-[#246BCE] scale-95 ring-2 ring-[#246BCE]/30'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-0.5">
                    {img.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Caption */}
          <div>
            <label className="block text-[11px] font-bold text-[#142238] uppercase tracking-wider mb-1">
              Story Caption / Knowledge Snippet *
            </label>
            <textarea
              rows={3}
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Presenting our STEMI pre-transfer thrombolysis audit at the academic grand round today..."
              className="w-full bg-[#F6F9FD] border border-[#E1E9F3] rounded-xl p-2.5 text-xs text-[#142238] placeholder-[#63738A] focus:outline-none focus:border-[#246BCE] leading-relaxed"
            />
          </div>

          {/* Bottom Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1E9F3]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#63738A] hover:text-[#142238]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !caption.trim()}
              className="px-4 py-2 rounded-xl bg-[#246BCE] hover:bg-[#12345B] text-white text-xs font-semibold shadow-sm transition-colors disabled:opacity-40"
            >
              {submitting ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
