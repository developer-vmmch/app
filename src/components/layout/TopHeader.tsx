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
  Stethoscope,
  Send,
  Code2,
  Check,
} from 'lucide-react';
import { DoctorProfile } from '../../types';

interface Props {
  currentDoctor: DoctorProfile;
  unreadChatCount: number;
  unreadNotificationCount: number;
  feedFilter: string;
  onFeedFilterChange: (filter: string) => void;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onOpenArchitecture: () => void;
  onOpenProfile: () => void;
  onOpenAuth?: () => void;
  onOpenSafetyPolicy?: () => void;
}

export const TopHeader: React.FC<Props> = ({
  currentDoctor,
  unreadChatCount,
  unreadNotificationCount,
  feedFilter,
  onFeedFilterChange,
  onOpenChat,
  onOpenNotifications,
  onOpenArchitecture,
  onOpenProfile,
  onOpenAuth,
  onOpenSafetyPolicy,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [imageError, setImageError] = useState(false);
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

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Extract initials for fallback if avatar is missing or fails to load
  const getInitials = (name: string) => {
    const cleaned = name.replace(/^Dr\.\s*/i, '').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase() || 'MD';
  };

  return (
    <header className="bg-white border-b border-[#E1E9F3] shrink-0 sticky top-0 z-40 px-2.5 sm:px-4 py-2 sm:py-2.5 shadow-2xs">
      <div className="flex items-center justify-between gap-1.5 sm:gap-3 max-w-7xl mx-auto">
        {/* Left Section: Authenticated Doctor Identity (Profile Picture + Name) + AMT Brand */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 relative" ref={menuRef}>
          {/* Doctor Profile Identity Button */}
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
            aria-label={`Doctor profile & account settings for ${currentDoctor.fullName}`}
            className="flex items-center gap-2 p-1 -ml-1 rounded-xl hover:bg-[#F6F9FD] active:bg-[#EAF3FF] transition-all text-left group min-w-0 focus:outline-none focus:ring-2 focus:ring-[#246BCE]/30"
          >
            {/* Authenticated Doctor Avatar */}
            <div className="relative shrink-0">
              {currentDoctor.avatarUrl && !imageError ? (
                <img
                  src={currentDoctor.avatarUrl}
                  alt={currentDoctor.fullName}
                  onError={() => setImageError(true)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#D5E1F0] shadow-2xs ring-1 ring-[#E1E9F3] group-hover:ring-[#246BCE] transition-all bg-slate-100"
                />
              ) : (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#12345B] via-[#1B4B82] to-[#246BCE] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center shadow-2xs ring-1 ring-[#E1E9F3] group-hover:ring-[#246BCE] transition-all">
                  {getInitials(currentDoctor.fullName)}
                </div>
              )}

              {/* Verified Practitioner Badge on Avatar */}
              {currentDoctor.verificationStatus === 'VERIFIED' && (
                <span
                  title="Verified Healthcare Practitioner"
                  className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#16845B] ring-1.5 ring-white flex items-center justify-center shadow-2xs"
                >
                  <Check className="w-2 h-2 text-white stroke-[3]" />
                </span>
              )}
            </div>

            {/* Doctor Name & Specialty */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 leading-tight">
                <span className="font-bold text-xs sm:text-[13px] text-[#12345B] group-hover:text-[#246BCE] transition-colors truncate max-w-[105px] xs:max-w-[135px] sm:max-w-[180px]">
                  {currentDoctor.fullName}
                </span>
                {currentDoctor.verificationStatus === 'VERIFIED' && (
                  <span title="Council Verified" className="shrink-0 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16845B]" />
                  </span>
                )}
                <ChevronDown className={`w-3 h-3 text-[#63738A] group-hover:text-[#246BCE] transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px] leading-tight text-[#63738A] truncate">
                <span className="text-[#246BCE] font-semibold truncate max-w-[85px] xs:max-w-[120px]">
                  {currentDoctor.primarySpecialty}
                </span>
                <span className="hidden sm:inline text-slate-400">·</span>
                <span className="hidden md:inline truncate max-w-[130px] text-slate-500">
                  {currentDoctor.institution}
                </span>
              </div>
            </div>
          </button>

          {/* Compact AMT Network Brand Pill */}
          <div
            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#EAF3FF] border border-[#246BCE]/25 text-[#12345B] shrink-0"
            title="AMT Doctor Knowledge Network"
          >
            <Stethoscope className="w-3 h-3 text-[#246BCE]" />
            <span className="font-black text-[10px] tracking-tight text-[#12345B]">AMT</span>
          </div>

          {/* Specialty Selector (Clean, non-colliding dropdown filter) */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-[#E1E9F3] min-w-0">
            <label htmlFor="header-specialty-select" className="sr-only">
              Filter feed by medical specialty
            </label>
            <div className="relative min-w-0">
              <select
                id="header-specialty-select"
                value={feedFilter}
                onChange={(e) => onFeedFilterChange(e.target.value)}
                aria-label="Active medical specialty filter"
                className="appearance-none bg-[#F6F9FD] hover:bg-[#EAF3FF] border border-[#D5E1F0] hover:border-[#246BCE] rounded-lg pl-2 pr-5 py-1 text-[11px] sm:text-xs text-[#12345B] font-semibold cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-[#246BCE]/30 max-w-[88px] xs:max-w-[115px] sm:max-w-[145px] truncate"
              >
                <option value="all">All Topics</option>
                <option value="institutions">My Hospital</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Cardiology">Cardiology</option>
                <option value="General Medicine">General Medicine</option>
                <option value="Neurosurgery">Neurosurgery</option>
              </select>
              <ChevronDown className="w-3 h-3 text-[#63738A] absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Profile Dropdown Menu Anchored to Doctor Card */}
          {isMenuOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-[#E1E9F3] py-2 z-50 animate-fadeIn"
            >
              {/* Profile Header Summary */}
              <div className="px-3.5 py-2.5 border-b border-[#E1E9F3] bg-[#F6F9FD]/80">
                <div className="flex items-center gap-2.5">
                  {currentDoctor.avatarUrl && !imageError ? (
                    <img
                      src={currentDoctor.avatarUrl}
                      alt={currentDoctor.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-[#D5E1F0] shadow-2xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#12345B] to-[#246BCE] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                      {getInitials(currentDoctor.fullName)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#12345B] truncate">
                        {currentDoctor.fullName}
                      </span>
                      {currentDoctor.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16845B] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#246BCE] font-semibold truncate">
                      {currentDoctor.primarySpecialty}
                    </p>
                    <p className="text-[10px] text-[#63738A] truncate">
                      {currentDoctor.institution}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1 text-xs">
                {/* Doctor Profile */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#142238] hover:bg-[#F6F9FD] hover:text-[#246BCE] transition-colors text-left"
                >
                  <User className="w-4 h-4 text-[#63738A]" />
                  <div>
                    <span className="font-semibold block">Doctor Profile</span>
                    <span className="text-[10px] text-[#63738A]">
                      View clinical posts, cases & bio
                    </span>
                  </div>
                </button>

                {/* Account Settings */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#142238] hover:bg-[#F6F9FD] hover:text-[#246BCE] transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-[#63738A]" />
                  <div>
                    <span className="font-semibold block">Account Settings</span>
                    <span className="text-[10px] text-[#63738A]">
                      Credentials, council licenses & HMS links
                    </span>
                  </div>
                </button>

                {/* Privacy & PHI Safeguards */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenSafetyPolicy) onOpenSafetyPolicy();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#142238] hover:bg-[#F6F9FD] hover:text-[#246BCE] transition-colors text-left"
                >
                  <Lock className="w-4 h-4 text-[#63738A]" />
                  <div>
                    <span className="font-semibold block">Privacy & PHI Safeguards</span>
                    <span className="text-[10px] text-[#63738A]">
                      Strict de-identification rules
                    </span>
                  </div>
                </button>

                {/* Theme Toggle */}
                <button
                  role="menuitem"
                  onClick={toggleTheme}
                  className="w-full px-3.5 py-2 flex items-center justify-between text-[#142238] hover:bg-[#F6F9FD] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {isDarkMode ? (
                      <Moon className="w-4 h-4 text-[#246BCE]" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                    <div>
                      <span className="font-semibold block">Theme</span>
                      <span className="text-[10px] text-[#63738A]">
                        {isDarkMode ? 'Dark Clinical Mode' : 'Light Hospital Mode'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#246BCE]">
                    {isDarkMode ? 'Dark' : 'Light'}
                  </span>
                </button>

                {/* System Architecture & Android Specs */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenArchitecture();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#142238] hover:bg-[#F6F9FD] hover:text-[#246BCE] transition-colors text-left"
                >
                  <Code2 className="w-4 h-4 text-[#246BCE]" />
                  <div>
                    <span className="font-semibold block">Android Specs & Jetpack Architecture</span>
                    <span className="text-[10px] text-[#63738A]">
                      Kotlin MVI, Room DB, Baseline Profiles
                    </span>
                  </div>
                </button>

                <div className="my-1 border-t border-[#E1E9F3]" />

                {/* Sign Out / Switch Doctor Persona */}
                <button
                  role="menuitem"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#C43D4B] hover:bg-rose-50 transition-colors text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <div>
                    <span>Sign Out / Switch Doctor</span>
                    <span className="block text-[10px] text-[#63738A] font-normal">
                      Access animated Login & Verification Portal
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: 1. Direct Messages → 2. Notifications Bell */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* 1. Direct Messages (Instagram-inspired Paper Plane Icon) */}
          <button
            onClick={onOpenChat}
            aria-label={`Open direct messages (${unreadChatCount} unread)`}
            title="Direct Messages & Consultations"
            className="p-2 rounded-xl text-[#12345B] hover:bg-[#EAF3FF] hover:text-[#246BCE] active:scale-95 transition-all relative group focus:outline-none focus:ring-2 focus:ring-[#246BCE]/30"
          >
            {/* Paper-plane icon with subtle tilt */}
            <Send className="w-5 h-5 -rotate-12 translate-x-[-1px] translate-y-[-1px] stroke-[2.1]" />
            {unreadChatCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#C43D4B] text-[10px] font-bold text-white shadow-xs ring-2 ring-white"
              >
                {unreadChatCount}
              </span>
            )}
          </button>

          {/* 2. Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label={`Open notifications (${unreadNotificationCount} unread)`}
            title="Notifications & Mentorship Updates"
            className="p-2 rounded-xl text-[#12345B] hover:bg-[#EAF3FF] hover:text-[#246BCE] active:scale-95 transition-all relative focus:outline-none focus:ring-2 focus:ring-[#246BCE]/30"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {unreadNotificationCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-[#C43D4B] text-[10px] font-bold text-white shadow-xs ring-2 ring-white"
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
