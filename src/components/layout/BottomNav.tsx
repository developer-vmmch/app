import React from 'react';
import { Home, Compass, Plus, Users, User } from 'lucide-react';

interface Props {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreate: () => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onSelectTab, onOpenCreate }) => {
  return (
    <nav className="bg-white border-t border-[#E1E9F3] shrink-0 sticky bottom-0 z-30 px-3 py-1 shadow-xs">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
            activeTab === 'home'
              ? 'text-[#12345B] font-bold'
              : 'text-[#63738A] hover:text-[#12345B]'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        {/* 2. Discover */}
        <button
          onClick={() => onSelectTab('discover')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
            activeTab === 'discover'
              ? 'text-[#12345B] font-bold'
              : 'text-[#63738A] hover:text-[#12345B]'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Discover</span>
        </button>

        {/* 3. Create (Action button) */}
        <button
          onClick={onOpenCreate}
          title="Create Knowledge Post, Question or Poll"
          className="flex flex-col items-center justify-center -mt-2 group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full bg-[#246BCE] hover:bg-[#12345B] text-white flex items-center justify-center shadow-md shadow-[#246BCE]/20 transition-all group-active:scale-95">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] tracking-tight text-[#63738A] group-hover:text-[#246BCE] mt-0.5 font-medium">
            Create
          </span>
        </button>

        {/* 4. Communities */}
        <button
          onClick={() => onSelectTab('communities')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
            activeTab === 'communities'
              ? 'text-[#12345B] font-bold'
              : 'text-[#63738A] hover:text-[#12345B]'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Communities</span>
        </button>

        {/* 5. Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors min-w-[56px] ${
            activeTab === 'profile'
              ? 'text-[#12345B] font-bold'
              : 'text-[#63738A] hover:text-[#12345B]'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Profile</span>
        </button>
      </div>
    </nav>
  );
};
