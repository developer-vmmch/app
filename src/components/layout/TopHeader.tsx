import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ChevronDown,
  ShieldCheck,
  User,
  Settings,
  Lock,
  Moon,
  Sun,
  LogOut,
  Send,
  Code2,
  Check,
  Compass,
  MapPin,
  Search,
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
}) => {
  const { activeLogo } = useNoveaLogo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
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

  const getInitials = (name: string) => {
    const cleaned = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase() || 'MD';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSelectTab) {
      onSelectTab('discover');
      if (onSearch) onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 px-3 sm:px-6 py-2.5 shadow-2xs">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative">
        {/* =========================================================================
            LEFT SECTION: Profile Avatar at Top-Left (Master Prompt Section 5)
            ========================================================================= */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-label={`Open profile menu for ${currentDoctor.fullName}`}
            className="flex items-center gap-2 p-1 -ml-1 rounded-2xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] active:scale-95 transition-all text-left group focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30"
          >
            {/* Top-Left Avatar with Verified Status */}
            <Avatar
              src={currentDoctor.avatarUrl}
              name={currentDoctor.fullName}
              id={currentDoctor.id}
              size="md"
              verificationStatus={currentDoctor.verificationStatus}
              showBadge
            />

            {/* Doctor Info on Desktop */}
            <div className="hidden md:flex flex-col min-w-0 max-w-[130px] lg:max-w-[170px]">
              <div className="flex items-center gap-1 leading-tight">
                <span className="font-bold text-xs text-[#0F172A] truncate">
                  {currentDoctor.fullName}
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-[#64748B] transition-transform ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
              <span className="text-[10px] text-[#0284C7] font-semibold truncate leading-tight mt-0.5">
                {currentDoctor.primarySpecialty}
              </span>
            </div>
          </button>

          {/* Profile & Account Dropdown Menu */}
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E2E8F0] py-2 z-50 animate-fadeIn"
            >
              {/* Profile Summary Card */}
              <div className="px-3.5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
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
                      <span className="text-xs font-bold text-[#0F172A] truncate">
                        {currentDoctor.fullName}
                      </span>
                      {currentDoctor.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#0284C7] font-semibold truncate">
                      {currentDoctor.primarySpecialty}
                    </p>
                    <p className="text-[10px] text-[#64748B] truncate mt-0.5">
                      {currentDoctor.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1 text-xs">
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#64748B]" />
                  <div>
                    <span className="font-bold block">View Full Profile</span>
                    <span className="text-[10px] text-[#64748B]">
                      Cases, publications, articles & experience
                    </span>
                  </div>
                </button>

                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-[#64748B]" />
                  <div>
                    <span className="font-semibold block">Account & Credentials</span>
                    <span className="text-[10px] text-[#64748B]">
                      Medical Council licenses & verified credentials
                    </span>
                  </div>
                </button>

                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenSafetyPolicy) onOpenSafetyPolicy();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                >
                  <Lock className="w-4 h-4 text-[#64748B]" />
                  <div>
                    <span className="font-semibold block">Patient PHI Safeguards</span>
                    <span className="text-[10px] text-[#64748B]">
                      Safe harbor de-identification rules
                    </span>
                  </div>
                </button>

                {onOpenMap && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenMap();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#0D9488] transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-[#0D9488]" />
                    <div>
                      <span className="font-semibold block">Nearby Doctor Circles</span>
                      <span className="text-[10px] text-[#64748B]">
                        Live Google Maps hospital tele-triage
                      </span>
                    </div>
                  </button>
                )}

                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenArchitecture();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                >
                  <Code2 className="w-4 h-4 text-[#2563EB]" />
                  <div>
                    <span className="font-semibold block">Android Specifications</span>
                    <span className="text-[10px] text-[#64748B]">
                      Kotlin MVI, Room DB, Baseline Specs
                    </span>
                  </div>
                </button>

                {onOpenSubscription && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSubscription();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
                    <div>
                      <span className="font-semibold block">Subscription & Usage Quotas</span>
                      <span className="text-[10px] text-[#64748B]">
                        Monthly messaging & voice/video limits
                      </span>
                    </div>
                  </button>
                )}

                {onOpenRankings && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenRankings();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <Trophy className="w-4 h-4 text-[#F59E0B]" />
                    <div>
                      <span className="font-semibold block">Professional Rankings</span>
                      <span className="text-[10px] text-[#64748B]">
                        Merit leaderboards & verified checkmarks
                      </span>
                    </div>
                  </button>
                )}

                {onReplayLaunch && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onReplayLaunch();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <Play className="w-4 h-4 text-[#0D9488]" />
                    <div>
                      <span className="font-semibold block">Replay App Launch</span>
                      <span className="text-[10px] text-[#64748B]">
                        Animated NOVEA opening sequence
                      </span>
                    </div>
                  </button>
                )}

                {onOpenLogoSettings && (
                  <button
                    role="menuitem"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenLogoSettings();
                    }}
                    className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#0F172A] hover:bg-[#F8FAFC] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <Sparkles className="w-4 h-4 text-[#1D4ED8]" />
                    <div>
                      <span className="font-semibold block">Brand & Logo Gallery</span>
                      <span className="text-[10px] text-[#64748B]">
                        36 official concepts · 10m auto-rotate
                      </span>
                    </div>
                  </button>
                )}

                <div className="my-1 border-t border-[#E2E8F0]" />

                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full px-3.5 py-2.5 flex items-center gap-2.5 text-[#DC2626] hover:bg-rose-50 transition-colors text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <div>
                    <span>Switch Doctor Persona / Sign Out</span>
                    <span className="block text-[10px] text-[#64748B] font-normal">
                      Access multi-persona portal & credentials
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            CENTER SECTION: Perfectly Centered NOVEA Official Logo (36 Concepts)
            - 10-minute auto-rotation across the 36 official logo concepts
            - Stable dimensions (w-[155px] sm:w-[175px] h-9) prevents any layout shift
            - No old stethoscope icon in separate colored square
            - High visual quality vector SVG
            ========================================================================= */}
        <button
          onClick={() => onSelectTab && onSelectTab('home')}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer select-none group focus:outline-none py-1 h-9 w-[155px] sm:w-[175px]"
          title={`NOVEA — ${activeLogo.name} (Concept #${activeLogo.id})`}
          aria-label={`NOVEA Home — ${activeLogo.name}`}
        >
          {activeLogo.renderLogo({
            className: 'h-7 sm:h-8 w-auto max-w-full drop-shadow-2xs group-hover:opacity-90 transition-opacity',
          })}
        </button>

        {/* =========================================================================
            RIGHT SECTION: Search, Live Map, Messages, Notifications, Settings
            ========================================================================= */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          {/* Google Maps Live Circles Button */}
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              title="Nearby Doctor Circles & Hospital Networks (Google Maps)"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
              <span className="hidden xl:inline">Circles</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            </button>
          )}

          {/* Professional Rankings & Verification Badges */}
          {onOpenRankings && (
            <button
              onClick={onOpenRankings}
              title="NOVEA Professional Rankings & Verification Badges"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFFBEB] hover:bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-[#D97706]" />
              <span className="hidden xl:inline">Rankings</span>
            </button>
          )}

          {/* Create Action Button (Plus icon and "Create" label) */}
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              title="Create Story, Post or Video/Reel"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}

          {/* Direct Messages (Paper-Plane Icon with Unread Badge) */}
          <button
            onClick={onOpenChat}
            aria-label={`Open direct messages (${unreadChatCount} unread)`}
            title="Direct Messages & Consultations"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95 transition-all relative focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 flex items-center gap-1.5"
          >
            <Send className="w-4.5 h-4.5 -rotate-12 stroke-[2.2]" />
            <span className="hidden xl:inline text-xs font-bold">Messages</span>
            {unreadChatCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-4.5 px-1 rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-xs ring-2 ring-white"
              >
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* Notifications Bell with Unread Badge */}
          <button
            onClick={onOpenNotifications}
            aria-label={`Open notifications (${unreadNotificationCount} unread)`}
            title="Notifications & Mentorship Updates"
            className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-[#0F172A] hover:bg-[#EFF6FF] hover:text-[#1D4ED8] active:scale-95 transition-all relative focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 flex items-center gap-1.5"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2.2]" />
            <span className="hidden xl:inline text-xs font-bold">Alerts</span>
            {unreadNotificationCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[17px] h-4.5 px-1 rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-xs ring-2 ring-white"
              >
                {unreadNotificationCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
