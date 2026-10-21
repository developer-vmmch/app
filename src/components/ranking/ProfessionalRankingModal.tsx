import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  Building2,
  Users,
  BookOpen,
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { api } from '../../services/api';
import { ProfessionalRankingItem } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorProfile: (doctorId: string) => void;
  onOpenInstitutionDetail?: (instId: string) => void;
}

export const ProfessionalRankingModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOpenDoctorProfile,
  onOpenInstitutionDetail,
}) => {
  const [category, setCategory] = useState<'doctors' | 'contributors' | 'communities' | 'clinics' | 'hospitals'>('doctors');
  const [rankings, setRankings] = useState<ProfessionalRankingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const loadRankings = async () => {
      setLoading(true);
      const res = await api.getRankings(category);
      if (res.success) {
        setRankings(res.data);
      }
      setLoading(false);
    };

    loadRankings();
  }, [isOpen, category]);

  if (!isOpen) return null;

  const categories = [
    { id: 'doctors' as const, label: 'Clinical Excellence', icon: Award },
    { id: 'contributors' as const, label: 'Research & Publications', icon: BookOpen },
    { id: 'hospitals' as const, label: 'Verified Hospitals', icon: Building2 },
    { id: 'communities' as const, label: 'Specialty Hubs', icon: Users },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="NOVEA Professional Rankings & Verification Badges"
      className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn"
    >
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border border-[#E2E8F0] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-linear-to-r from-[#0E1E38] via-[#0A162B] to-[#0D9488]/80 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FBBF24]">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">Professional Ranking & Badges</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#14B8A6]/30 text-[#5EEAD4] border border-[#14B8A6]/40 uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Merit-based clinical peer recognition & institutional accreditation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="p-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map((c) => {
            const Icon = c.icon;
            const isActive = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white shadow-xs'
                    : 'bg-white hover:bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="py-16 text-center space-y-2">
              <div className="w-7 h-7 border-2 border-[#1D4ED8] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#64748B]">Compiling verified merit rankings...</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#64748B] space-y-1">
              <Award className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
              <p className="font-bold text-[#0F172A]">No rankings published yet</p>
              <p>Rankings update weekly based on clinical peer reviews.</p>
            </div>
          ) : (
            rankings.map((item) => {
              const isTop3 = item.rank <= 3;
              const rankColor =
                item.rank === 1
                  ? 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                  : item.rank === 2
                  ? 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]'
                  : item.rank === 3
                  ? 'bg-[#FFEDD5] text-[#C2410C] border-[#FED7AA]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0]';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isTop3
                      ? 'bg-linear-to-r from-white via-white to-[#F8FAFC] border-[#CBD5E1] shadow-xs'
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border shrink-0 ${rankColor}`}
                    >
                      {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                    </div>

                    {/* Entity Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                          {item.name}
                        </span>
                        {/* Verification Checkmark */}
                        {item.verificationStatus === 'VERIFIED' && (
                          <span
                            className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]"
                            title="Verified on Council Roll / Accreditation Registry"
                          >
                            <ShieldCheck className="w-3 h-3 text-[#059669]" />
                            <span>Verified</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5 truncate">
                        <span>{item.subtitle}</span>
                      </div>

                      {/* Badges Earned */}
                      {item.badges && item.badges.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          {item.badges.map((b, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-[#2563EB]" />
                              <span>{b}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Score & View Action */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center justify-end gap-1 text-xs font-black text-[#0F172A]">
                      <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#F59E0B]" />
                      <span>{item.score.toLocaleString()} pts</span>
                    </div>
                    {item.id.startsWith('AMT-DOC') || item.id.startsWith('doc-') ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenDoctorProfile(item.id);
                        }}
                        className="mt-1 text-[11px] font-bold text-[#1D4ED8] hover:text-[#1E40AF] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : onOpenInstitutionDetail && (item.id.startsWith('inst-') || item.subtitle.includes('Hospital')) ? (
                      <button
                        onClick={() => {
                          onClose();
                          onOpenInstitutionDetail(item.id);
                        }}
                        className="mt-1 text-[11px] font-bold text-[#0D9488] hover:underline inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Blue & Gold Verification Badges are strictly bound to official council & NABH registers.</span>
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white border border-[#CBD5E1] text-[#0F172A] font-bold hover:bg-[#F1F5F9] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
