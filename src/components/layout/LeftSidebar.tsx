import React from 'react';
import {
  Home,
  Compass,
  GraduationCap,
  Users,
  MapPin,
  Building2,
  Lock,
  ChevronRight,
  LogOut,
  Film,
  Trophy,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface Props {
  currentDoctor: DoctorProfile;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenMap: () => void;
  onOpenSafetyPolicy: () => void;
  onOpenInstitutionDetail: (instId: string) => void;
  onOpenAuth: () => void;
  onOpenRankings?: () => void;
}

export const LeftSidebar: React.FC<Props> = ({
  currentDoctor,
  activeTab,
  onSelectTab,
  onOpenProfile,
  onOpenMap,
  onOpenSafetyPolicy,
  onOpenInstitutionDetail,
  onOpenAuth,
  onOpenRankings,
}) => {
  const navItems = [
    { id: 'home', label: 'Feed & Discussions', icon: Home },
    { id: 'reels', label: 'Clinical Reels', icon: Film },
    { id: 'discover', label: 'Discover Doctors', icon: Compass },
    { id: 'mentorship', label: 'Clinical Mentorship', icon: GraduationCap },
    { id: 'communities', label: 'Specialty Hubs', icon: Users },
  ];

  return (
    <div className="space-y-4 sticky top-20">
      {/* Doctor Mini-Profile Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs hover:border-[#CBD5E1] transition-all">
        <div className="flex items-start gap-3">
          <Avatar
            src={currentDoctor.avatarUrl}
            name={currentDoctor.fullName}
            id={currentDoctor.id}
            size="lg"
            verificationStatus={currentDoctor.verificationStatus}
            showBadge
          />

          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm text-[#0F172A] truncate leading-tight">
              {currentDoctor.fullName}
            </h3>
            <p className="text-xs font-semibold text-[#0284C7] truncate mt-0.5">
              {currentDoctor.primarySpecialty}
            </p>
            <p className="text-[11px] text-[#64748B] truncate mt-0.5">
              {currentDoctor.institution}
            </p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
          <div className="text-center flex-1 border-r border-[#F1F5F9]">
            <span className="block font-bold text-[#0F172A]">
              {currentDoctor.yearsOfExperience || 8}y
            </span>
            <span className="text-[10px] text-[#64748B]">Experience</span>
          </div>
          <div className="text-center flex-1 border-r border-[#F1F5F9]">
            <span className="block font-bold text-[#16A34A]">Active</span>
            <span className="text-[10px] text-[#64748B]">Triage</span>
          </div>
          <div className="text-center flex-1">
            <span className="block font-bold text-[#0284C7]">Verified</span>
            <span className="text-[10px] text-[#64748B]">Status</span>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="mt-3 w-full py-1.5 px-3 rounded-xl bg-[#F8FAFC] hover:bg-[#EFF6FF] text-[#1E40AF] hover:text-[#1D4ED8] text-xs font-bold transition-colors border border-[#E2E8F0] flex items-center justify-center gap-1.5"
        >
          <span>View Clinical Profile</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Navigation Menu */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-2 shadow-xs">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] shadow-2xs'
                    : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-[#1D4ED8]' : 'text-[#64748B]'
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                )}
              </button>
            );
          })}

          {/* Direct Map Launcher */}
          <button
            onClick={onOpenMap}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#0F766E] hover:bg-[#F0FDFA] transition-all text-left group cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-[#0D9488] group-hover:scale-110 transition-transform" />
            <span className="flex-1">Live Location Circles</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#CCFBF1] text-[#0F766E]">
              Maps
            </span>
          </button>

          {/* Professional Ranking & Badges */}
          {onOpenRankings && (
            <button
              onClick={onOpenRankings}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-[#B45309] hover:bg-[#FFFBEB] transition-all text-left group cursor-pointer"
            >
              <Trophy className="w-4 h-4 text-[#D97706] group-hover:scale-110 transition-transform" />
              <span className="flex-1">Professional Rankings</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                Badges
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Hospital Hub */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3.5 shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>Affiliated Campus</span>
          </span>
          <span className="text-[10px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
        <p className="text-xs font-bold text-[#1E293B]">
          Vinayaka Mission's Medical College
        </p>
        <p className="text-[11px] text-[#64748B] mt-0.5">
          Sankari Main Road, Ariyanoor, Salem
        </p>
        <button
          onClick={() => onOpenInstitutionDetail('inst-vmmc')}
          className="mt-2.5 text-[11px] text-[#0284C7] hover:underline font-bold flex items-center gap-1"
        >
          <span>Campus details & department roster</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Safety & Compliance Card */}
      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-3 text-xs space-y-2">
        <div className="flex items-center gap-2 text-[#0F172A] font-bold">
          <Lock className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Patient PHI Safeguards</span>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          HIPAA safe-harbor standards active. Patient identifiers and MRNs are automatically blocked before publication.
        </p>
        <div className="flex items-center justify-between pt-1 text-[11px]">
          <button
            onClick={onOpenSafetyPolicy}
            className="text-[#0284C7] font-semibold hover:underline"
          >
            Review Code of Conduct
          </button>
          <button
            onClick={onOpenAuth}
            className="text-[#DC2626] hover:underline flex items-center gap-1 font-semibold"
          >
            <LogOut className="w-3 h-3" />
            <span>Switch Persona</span>
          </button>
        </div>
      </div>
    </div>
  );
};
