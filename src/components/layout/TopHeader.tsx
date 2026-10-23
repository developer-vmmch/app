import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ShieldCheck,
  User,
  Settings,
  Lock,
  LogOut,
  Send,
  Code2,
  MapPin,
  Sparkles,
  Trophy,
  Play,
  Plus,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { useNoveaLogo } from '../branding/useNoveaLogo';

interface Props {
  currentDoctor: DoctorProfile;
  unreadChatCount: number;
  unreadNotificationCount: number;
  feedFilter?: string;
  onFeedFilterChange?: (filter: string) => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onOpenArchitecture: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: () => void;
  onOpenSafetyPolicy?: () => void;
  onOpenMap?: () => void;
  onSearch?: (query: string) => void;
  onOpenLogoSettings?: () => void;
  onOpenRankings?: () => void;
  onReplayLaunch?: () => void;
  onOpenCreate?: () => void;
  onOpenSubscription?: () => void;
}

export const TopHeader: React.FC<Props> = ({
  currentDoctor,
  unreadChatCount,
  unreadNotificationCount,
  activeTab = 'home',
  onSelectTab,
  onOpenChat,
  onOpenNotifications,
  onOpenArchitecture,
  onOpenProfile,
  onOpenAuth,
  onOpenSafetyPolicy,
  onOpenMap,
  onSearch,
  onOpenLogoSettings,
  onOpenRankings,
  onReplayLaunch,
  onOpenCreate,
  onOpenSubscription,
}) => {
  const { activeLogo } = useNoveaLogo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSelectTab) {
      onSelectTab('discover');
      if (onSearch) onSearch(searchQuery.trim());
      setShowSearchBar(false);
    }
  };

  return (
    <header className="bg-[#081122] border-b border-[#1E3A63] sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-lg text-white">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
        {/* LEFT SECTION: User Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-label={`Open profile menu for ${currentDoctor.fullName}`}
            className="flex items-center gap-2 p-1 -ml-1 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-left cursor-pointer focus:outline-none"
          >
            <Avatar
              src={currentDoctor.avatarUrl}
              name={currentDoctor.fullName}
              id={currentDoctor.id}
              size="md"
              verificationStatus={currentDoctor.verificationStatus}
              showBadge
            />

            <div className="hidden lg:flex flex-col min-w-0 max-w-[140px]">
              <span className="font-bold text-xs text-white truncate">
                {currentDoctor.fullName}
              </span>
              <span className="text-[10px] text-[#38BDF8] font-semibold truncate leading-tight mt-0.5">
                {currentDoctor.primarySpecialty}
              </span>
            </div>
          </button>

          {/* Account Dropdown Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute left-0 top-full mt-2 w-72 bg-[#0C1A30] rounded-2xl shadow-2xl border border-[#1E3E6E] py-2 z-50 animate-fadeIn text-white"
            >
              <div className="px-3.5 py-3 border-b border-[#1E3E6E] bg-[#081122]">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={currentDoctor.avatarUrl}
                    name={currentDoctor.fullName}
                    id={currentDoctor.id}
                    size="lg"
                    verificationStatus={currentDoctor.verificationStatus}
                    showBadge
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white truncate">
                        {currentDoctor.fullName}
                      </span>
                      {currentDoctor.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#38BDF8] font-semibold truncate">
                      {currentDoctor.primarySpecialty}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] truncate mt-0.5">
                      {currentDoctor.institution}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-1 text-xs text-slate-200">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 hover:bg-white/10 text-left cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#38BDF8]" />
                  <span>View Full Profile</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-white/10 text-left cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#38BDF8]" />
                  <span>Account & Credentials</span>
                </button>

                {onOpenSubscription && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSubscription();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-white/10 text-left cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#A855F7]" />
                    <span>Subscription Quotas</span>
                  </button>
                )}

                <div className="my-1 border-t border-[#1E3E6E]" />

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-rose-400 hover:bg-rose-500/10 text-left font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out / Switch Persona</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* CENTER SECTION: DoctoHub Official Logo + Wordmark + Powered by NOVEA */}
        <button
          onClick={() => onSelectTab && onSelectTab('home')}
          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 cursor-pointer select-none group focus:outline-none py-1 h-9"
          title="DoctoHub — Powered by NOVEA"
          aria-label="DoctoHub Home"
        >
          {/* Logo Mark */}
          <div className="h-7 w-auto flex items-center justify-center">
            {activeLogo.renderLogo({
              className: 'h-7 sm:h-8 w-auto max-w-full drop-shadow-md',
            })}
          </div>

          {/* Wordmark & Subtitle */}
          <div className="flex flex-col text-left leading-none">
            <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans flex items-center">
              Docto<span className="text-[#38BDF8]">Hub</span>
            </span>
            <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-[#0D9488]">
              Powered by <span className="text-white">NOVEA</span>
            </span>
          </div>
        </button>

        {/* RIGHT SECTION: Search & Notifications Icons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Search Toggle / Button */}
          <button
            onClick={() => {
              if (onSelectTab) onSelectTab('discover');
            }}
            aria-label="Search"
            title="Search Doctors, Posts & Topics"
            className="p-2 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Notifications Bell with Badge */}
          <button
            onClick={onOpenNotifications}
            aria-label={`Notifications (${unreadNotificationCount} unread)`}
            title="Notifications"
            className="p-2 rounded-xl text-white hover:bg-white/10 active:scale-95 transition-all relative cursor-pointer"
          >
            <Bell className="w-5 h-5 stroke-[2.2]" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#DC2626] text-[10px] font-extrabold text-white ring-2 ring-[#081122]">
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
