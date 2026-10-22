import React from 'react';
import {
  MapPin,
  Compass,
  Calendar,
  Clock,
  Award,
  Video,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import { Avatar } from '../common/Avatar';

interface Props {
  onOpenMap: () => void;
  onOpenSpecs: () => void;
  onOpenDoctorProfile: (id: string) => void;
  onRequestMentorship?: (doctor: DoctorProfile) => void;
  onOpenChat?: () => void;
}

export const RightSidebar: React.FC<Props> = ({
  onOpenMap,
  onOpenSpecs,
  onOpenDoctorProfile,
  onOpenChat,
}) => {
  const webinars = [
    {
      id: 'web-1',
      title: 'Pediatric Acute Sepsis & Trauma Triage',
      time: 'Tomorrow, 6:00 PM IST',
      host: 'Dr. Anand Kumar, MD',
      specialty: 'Pediatrics',
      credits: '1.5 CME',
    },
    {
      id: 'web-2',
      title: '2026 ESC Guidelines: STEMI & Cardiogenic Shock',
      time: 'Oct 24, 7:30 PM IST',
      host: 'Dr. Priya Sundaram, DM',
      specialty: 'Cardiology',
      credits: '2.0 CME',
    },
  ];

  const suggestedMentors = [
    {
      id: 'AMT-DOC-102',
      name: 'Dr. Priya Sundaram',
      specialty: 'Cardiology',
      institution: 'Apollo Speciality Hospitals, Salem',
      avatarUrl:
        'https://images.unsplash.com/photo-1594824813637-295b95d13778?w=150&auto=format&fit=crop&q=80',
      activeMentees: 4,
    },
    {
      id: 'AMT-DOC-103',
      name: 'Dr. Rajesh Nathan',
      specialty: 'General Medicine',
      institution: 'Manipal Hospital, Salem',
      avatarUrl:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      activeMentees: 2,
    },
  ];

  return (
    <div className="space-y-4 sticky top-20">
      {/* Google Maps Live Knowledge Circles Widget */}
      <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F766E] rounded-2xl p-4 text-white shadow-md relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9488]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[#2DD4BF] font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span>Google Maps Platform</span>
          </div>
          <span className="text-[11px] text-slate-300">Salem Radius</span>
        </div>

        <h3 className="font-bold text-sm text-white flex items-center gap-1.5 mt-1">
          <MapPin className="w-4 h-4 text-[#2DD4BF]" />
          <span>Live Doctor Circles & Tele-Triage</span>
        </h3>

        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Interactive map of 7+ verified hospitals, trauma centers, and active specialists on duty across Salem & Tamil Nadu.
        </p>

        <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
          <div className="text-[11px] text-slate-300">
            <span className="font-bold text-white">Vinayaka Mission's</span>
            <span className="block text-[10px] text-teal-300">Hub Online</span>
          </div>

          <button
            onClick={onOpenMap}
            className="px-3 py-1.5 rounded-xl bg-[#0D9488] hover:bg-[#14B8A6] active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Open Map</span>
          </button>
        </div>
      </div>

      {/* Verified Specialists Available for Consult */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
            <Award className="w-4 h-4 text-[#1D4ED8]" />
            <span>Top Verified Mentors</span>
          </div>
          <span className="text-[11px] text-[#64748B]">Available</span>
        </div>

        <div className="space-y-3">
          {suggestedMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="p-2.5 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all flex items-center justify-between gap-2.5"
            >
              <div
                onClick={() => onOpenDoctorProfile(mentor.id)}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
              >
                <Avatar
                  src={mentor.avatarUrl}
                  name={mentor.name}
                  id={mentor.id}
                  size="sm"
                  verificationStatus="VERIFIED"
                  showBadge
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#0F172A] truncate hover:text-[#1D4ED8]">
                    {mentor.name}
                  </h4>
                  <p className="text-[11px] text-[#0284C7] font-semibold truncate">
                    {mentor.specialty}
                  </p>
                  <p className="text-[10px] text-[#64748B] truncate">
                    {mentor.institution}
                  </p>
                </div>
              </div>

              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  title="Direct Consultation"
                  className="p-1.5 rounded-lg text-[#1D4ED8] hover:bg-[#EFF6FF] border border-[#BFDBFE] transition-colors shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Clinical Webinars & Grand Rounds */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
            <Calendar className="w-4 h-4 text-[#0284C7]" />
            <span>Clinical Grand Rounds</span>
          </div>
          <span className="text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
            CME
          </span>
        </div>

        <div className="space-y-3">
          {webinars.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all"
            >
              <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1">
                <span className="font-semibold text-[#0284C7]">{item.specialty}</span>
                <span className="font-bold text-[#16A34A]">{item.credits}</span>
              </div>
              <h4 className="text-xs font-bold text-[#0F172A] leading-snug">
                {item.title}
              </h4>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B] pt-1.5 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#64748B]" />
                  <span>{item.time}</span>
                </div>
                <span className="font-medium text-[#1E40AF]">Register</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Native Android APK & Jetpack Compose Specs Launcher */}
      <div className="bg-[#F1F5F9] rounded-2xl border border-[#CBD5E1] p-3 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Smartphone className="w-4 h-4 text-[#1E40AF] shrink-0" />
          <div className="min-w-0">
            <span className="font-bold text-[#0F172A] block truncate">
              Native Android Specs
            </span>
            <span className="text-[10px] text-[#64748B] block truncate">
              Kotlin, Room DB & MVI Architecture
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSpecs}
          className="px-2.5 py-1 bg-white hover:bg-[#EFF6FF] border border-[#CBD5E1] rounded-lg text-[#1E40AF] font-bold text-[11px] shrink-0 transition-colors"
        >
          View Specs
        </button>
      </div>
    </div>
  );
};
