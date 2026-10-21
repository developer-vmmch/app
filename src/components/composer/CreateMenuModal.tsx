import React from 'react';
import { X, Sparkles, FileText, Film, Camera, ArrowRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectStory: () => void;
  onSelectPost: () => void;
  onSelectVideoReel: () => void;
}

export const CreateMenuModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSelectStory,
  onSelectPost,
  onSelectVideoReel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Create content selection menu"
      className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-[#E2E8F0] p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#0F172A]">Create New Content</h3>
            <p className="text-xs text-[#64748B]">Share knowledge with the NOVA community</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {/* Story Option */}
          <button
            onClick={() => {
              onClose();
              onSelectStory();
            }}
            className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#1D4ED8] bg-white hover:bg-[#F8FAFC] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#0F172A]">Add Story</span>
                <span className="text-[11px] text-[#64748B]">24-hour expiring clinical update</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Post Option */}
          <button
            onClick={() => {
              onClose();
              onSelectPost();
            }}
            className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#1D4ED8] bg-white hover:bg-[#F8FAFC] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#0F172A]">Photo or Text Post</span>
                <span className="text-[11px] text-[#64748B]">Case discussion, article, or question</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#16A34A] group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Video / Reel Option */}
          <button
            onClick={() => {
              onClose();
              onSelectVideoReel();
            }}
            className="w-full p-3.5 rounded-2xl border border-[#E2E8F0] hover:border-[#7C3AED] bg-white hover:bg-[#F8FAFC] transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Film className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-[#0F172A]">Video / Clinical Reel</span>
                <span className="text-[11px] text-[#64748B]">Vertical educational medical video</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#7C3AED] group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};
