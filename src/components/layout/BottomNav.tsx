import React from 'react';
import { Home, Compass, Plus, Film, User } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onSelectTab, onOpenCreate }) => {
  return (
    <nav className="bg-white border-t border-[#E2E8F0] shrink-0 sticky bottom-0 z-30 px-3 py-1.5 shadow-md">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'home'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {activeTab === 'home' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#0D9488] rounded-full" />
          )}
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Reels */}
        <button
          onClick={() => onSelectTab('reels')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'reels'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {activeTab === 'reels' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#0D9488] rounded-full" />
          )}
          <Film className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Reels</span>
        </button>

        {/* 3. Create (Action button) */}
        <button
          onClick={onOpenCreate}
          title="Create Knowledge Post, Case Study or Poll"
          className="flex flex-col items-center justify-center -mt-3 group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center shadow-lg shadow-[#1D4ED8]/30 transition-all group-active:scale-95">
            <Plus className="w-6 h-6 stroke-[2.4]" />
          </div>
          <span className="text-[9px] tracking-tight text-[#64748B] group-hover:text-[#1D4ED8] mt-0.5 font-semibold">
            Post
          </span>
        </button>

        {/* 4. Network / Discover */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'discover'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {activeTab === 'discover' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#0D9488] rounded-full" />
          )}
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Network</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'profile'
              ? 'text-[#1D4ED8] font-bold'
              : 'text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          {activeTab === 'profile' && (
            <span className="absolute -top-1.5 w-6 h-0.5 bg-[#0D9488] rounded-full" />
          )}
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
