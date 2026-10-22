import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Compass,
  GraduationCap,
  Users,
  MessageSquare,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  User,
  Settings,
  LogOut,
  MapPin,
  Code2,
  Lock,
  Plus,
  Send,
  X,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { DoctorProfile } from '../../types';

interface Props {
  currentDoctor: DoctorProfile;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadChatCount: number;
  unreadNotificationCount: number;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onOpenMap: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onOpenSafetyPolicy: () => void;
  onOpenCreate?: () => void;
}

export const TopNavigation: React.FC<Props> = ({
  currentDoctor,
  activeTab,
  onSelectTab,
  unreadChatCount,
  unreadNotificationCount,
  onOpenChat,
  onOpenNotifications,
  onOpenMap,
  onOpenProfile,
  onOpenAuth,
  onOpenArchitecture,
  onOpenSafetyPolicy,
  onOpenCreate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [avatarError, setAvatarError] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const getInitials = (name: string) => {
    const cleaned = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase() || 'MD';
  };

  const navLinks = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'discover', label: 'Discover Doctors', icon: Compass },
    { id: 'mentorship', label: 'Learning', icon: GraduationCap },
    { id: 'communities', label: 'Communities', icon: Users },
  ];

  return (
    <header className="bg-white border-b border-[#E5EDF5] sticky top-0 z-40 shrink-0 shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* =========================================================================
            LEFT: Brand Identity (Modern AMT Tech Nova Logo)
            ========================================================================= */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="NOVA Home"
          >
            {/* Logo Mark: Stylized blue chevron with cyan medical dot */}
            <div className="relative flex items-center justify-center">
              <svg
                width="34"
                height="34"
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform group-hover:scale-105"
              >
                {/* Modern Lambda / Chevron Shape in Deep Medical Blue */}
                <path
                  d="M6 26L17 7L28 26"
                  stroke="#1D4ED8"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Turquoise / Cyan Medical Dot */}
                <circle cx="21" cy="27" r="3.2" fill="#0D9488" />
              </svg>
            </div>

            <div className="hidden xs:flex flex-col min-w-0">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F1E36] leading-none group-hover:text-[#1D4ED8] transition-colors">
                NOVA
              </span>
              <span className="text-[10px] text-[#5A6B82] font-semibold tracking-wider uppercase mt-0.5">
                Medical Knowledge Network
              </span>
            </div>
          </button>

          {/* Global Search Bar (Desktop) */}
          <div className="hidden md:flex items-center relative w-64 lg:w-80">
            <Search className="w-4 h-4 text-[#7A8B9E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, clinical cases, topics..."
              className="w-full bg-[#F4F7FB] hover:bg-[#EBF1F7] focus:bg-white text-xs text-[#0F1E36] placeholder-[#7A8B9E] rounded-full pl-9 pr-8 py-2 border border-[#E5EDF5] focus:border-[#1D4ED8] focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8B9E] hover:text-[#0F1E36]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            CENTER: Desktop Main Navigation Links (Single horizontal row)
            ========================================================================= */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'text-[#1D4ED8] bg-[#EFF6FF]'
                    : 'text-[#5A6B82] hover:text-[#0F1E36] hover:bg-[#F4F7FB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1D4ED8]' : 'text-[#7A8B9E]'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}

          {/* Google Maps Live Circles Button */}
          <button
            onClick={onOpenMap}
            title="Explore Google Maps Medical Knowledge Circles & Hospital Networks"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#0D9488] bg-[#F0FDFA] hover:bg-[#CCFBF1] transition-all border border-[#0D9488]/30"
          >
            <MapPin className="w-4 h-4 text-[#0D9488]" />
            <span>Live Map</span>
          </button>
        </nav>

        {/* =========================================================================
            RIGHT: Direct Messages, Notifications & Doctor Account Profile
            ========================================================================= */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Button */}
          <button
            onClick={() => setIsSearchOpenMobile(!isSearchOpenMobile)}
            aria-label="Toggle search input"
            className="md:hidden p-2 rounded-xl text-[#5A6B82] hover:text-[#0F1E36] hover:bg-[#F4F7FB] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* 1. Direct Messages (Instagram-inspired paper plane icon) */}
          <button
            onClick={onOpenChat}
            aria-label={`Direct messages (${unreadChatCount} unread)`}
            title="Direct Messages & Peer Consultations"
            className="p-2.5 rounded-xl text-[#0F1E36] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] active:scale-95 transition-all relative"
          >
            <Send className="w-5 h-5 -rotate-12 translate-x-[-1px] translate-y-[-1px]" />
            {unreadChatCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* 2. Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label={`Notifications (${unreadNotificationCount} unread)`}
            title="Notifications & Mentorship Updates"
            className="p-2.5 rounded-xl text-[#0F1E36] hover:text-[#1D4ED8] hover:bg-[#EFF6FF] active:scale-95 transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[17px] h-[17px] px-1 rounded-full bg-[#DC2626] text-[10px] font-bold text-white shadow-xs ring-2 ring-white">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          <div className="h-6 w-[1px] bg-[#E5EDF5] hidden sm:block" />

          {/* 3. User Avatar and Account Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={`Account menu for ${currentDoctor.fullName}`}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F4F7FB] transition-all focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/30 group"
            >
              {/* Doctor Avatar - Controlled circular size (38px) */}
              <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#E5EDF5] group-hover:ring-[#1D4ED8] transition-all bg-[#F4F7FB] shrink-0">
                {currentDoctor.avatarUrl && !avatarError ? (
                  <img
                    src={currentDoctor.avatarUrl}
                    alt={currentDoctor.fullName}
                    onError={() => setAvatarError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1D4ED8] text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(currentDoctor.fullName)}
                  </div>
                )}
                {currentDoctor.verificationStatus === 'VERIFIED' && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#16845B] rounded-full border-2 border-white flex items-center justify-center" title="Verified Practitioner">
                    <span className="w-1 h-1 bg-white rounded-full" />
                  </span>
                )}
              </div>

              {/* Name & chevron (Desktop) */}
              <div className="hidden xl:flex flex-col text-left leading-tight">
                <span className="font-bold text-xs text-[#0F1E36] group-hover:text-[#1D4ED8] transition-colors truncate max-w-[130px]">
                  {currentDoctor.fullName}
                </span>
                <span className="text-[10px] text-[#5A6B82] truncate max-w-[130px]">
                  {currentDoctor.primarySpecialty}
                </span>
              </div>

              <ChevronDown className={`w-3.5 h-3.5 text-[#7A8B9E] group-hover:text-[#1D4ED8] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Account Dropdown Menu */}
            {isMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#E5EDF5] py-2 z-50 animate-fadeIn"
              >
                {/* Doctor Summary Header */}
                <div className="px-4 py-3 border-b border-[#E5EDF5] bg-[#F8FAFD]">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentDoctor.avatarUrl}
                      alt={currentDoctor.fullName}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-[#1D4ED8]/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-[#0F1E36] truncate">
                          {currentDoctor.fullName}
                        </span>
                        {currentDoctor.verificationStatus === 'VERIFIED' && (
                          <ShieldCheck className="w-3.5 h-3.5 text-[#16845B] shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#1D4ED8] font-semibold truncate">
                        {currentDoctor.primarySpecialty}
                      </p>
                      <p className="text-[10px] text-[#5A6B82] truncate">
                        {currentDoctor.institution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1 text-xs">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#0F1E36] hover:bg-[#F4F7FB] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-[#7A8B9E]" />
                    <div>
                      <span className="font-semibold block">My Profile</span>
                      <span className="text-[10px] text-[#5A6B82]">
                        Credentials, publications, clinical interests
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onSelectTab('mentorship');
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#0F1E36] hover:bg-[#F4F7FB] hover:text-[#1D4ED8] transition-colors text-left"
                  >
                    <GraduationCap className="w-4 h-4 text-[#7A8B9E]" />
                    <div>
                      <span className="font-semibold block">Learning & Mentorship</span>
                      <span className="text-[10px] text-[#5A6B82]">
                        Clinical milestones & resident learning goals
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenMap();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#0F1E36] hover:bg-[#F4F7FB] hover:text-[#0D9488] transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-[#0D9488]" />
                    <div>
                      <span className="font-semibold block">Google Maps Medical Circles</span>
                      <span className="text-[10px] text-[#5A6B82]">
                        Emergency hospital triage & nearby colleagues
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSafetyPolicy();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#0F1E36] hover:bg-[#F4F7FB] transition-colors text-left"
                  >
                    <Lock className="w-4 h-4 text-[#7A8B9E]" />
                    <div>
                      <span className="font-semibold block">PHI & Professional Code</span>
                      <span className="text-[10px] text-[#5A6B82]">
                        Council compliance and de-identification
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenArchitecture();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#0F1E36] hover:bg-[#F4F7FB] transition-colors text-left"
                  >
                    <Code2 className="w-4 h-4 text-[#7A8B9E]" />
                    <div>
                      <span className="font-semibold block">Developer Specs & QA</span>
                      <span className="text-[10px] text-[#5A6B82]">
                        Android MVI specs and test runner
                      </span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-[#E5EDF5]" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full px-4 py-2 flex items-center gap-2.5 text-[#DC2626] hover:bg-red-50 transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch Doctor Persona</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Expandable Bar */}
      {isSearchOpenMobile && (
        <div className="md:hidden px-4 pb-3 pt-1 border-t border-[#E5EDF5] bg-white animate-fadeIn">
          <div className="relative">
            <Search className="w-4 h-4 text-[#7A8B9E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, clinical cases, topics..."
              className="w-full bg-[#F4F7FB] text-xs text-[#0F1E36] placeholder-[#7A8B9E] rounded-xl pl-9 pr-8 py-2.5 border border-[#E5EDF5] focus:outline-none focus:border-[#1D4ED8]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A8B9E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
