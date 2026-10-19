import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  Check,
  Plus,
  Building2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Community } from '../../types';
import { api } from '../../services/api';

interface Props {
  onSelectCommunityFeed: (communitySpecialty: string) => void;
  onOpenInstitutionDetail: (instId: string) => void;
}

export const CommunitiesScreen: React.FC<Props> = ({
  onSelectCommunityFeed,
  onOpenInstitutionDetail,
}) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    setLoading(true);
    const res = await api.getCommunities();
    if (res.success) {
      setCommunities(res.data);
    }
    setLoading(false);
  };

  const handleToggleJoin = async (id: string) => {
    const res = await api.toggleJoinCommunity(id);
    if (res.success) {
      setCommunities((prev) => prev.map((c) => (c.id === id ? res.data : c)));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F9FD]">
      {/* Header */}
      <div className="p-3.5 bg-white border-b border-[#E1E9F3] space-y-1 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#246BCE] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#12345B]">
              Hospital & Specialty Communities
            </h2>
            <p className="text-[11px] text-[#63738A]">
              Collegiate departmental circles governed by medical peer rules
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 min-h-0">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#63738A]">Loading communities...</div>
        ) : (
          communities.map((comm) => {
            const isExpanded = expandedId === comm.id;
            return (
              <div
                key={comm.id}
                className="bg-white border border-[#E1E9F3] rounded-xl p-3.5 space-y-3 shadow-2xs hover:border-[#246BCE]/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xs sm:text-sm font-bold text-[#12345B]">{comm.name}</h3>
                      {comm.isPrivate && (
                        <span className="flex items-center gap-0.5 text-[10px] text-[#63738A] bg-[#F6F9FD] px-1.5 py-0.5 rounded border border-[#E1E9F3]">
                          <Lock className="w-2.5 h-2.5 text-[#B7791F]" />
                          <span>Private Hospital Network</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#63738A] mt-0.5">
                      <span className="text-[#246BCE] font-semibold">{comm.specialty}</span>
                      <span>·</span>
                      <span>{comm.memberCount} doctors</span>
                      <span>·</span>
                      <span>{comm.postCount} clinical topics</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleJoin(comm.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all shrink-0 ${
                      comm.isJoined
                        ? 'bg-[#EAF8F1] text-[#16845B] border border-[#16845B]/30'
                        : 'bg-[#246BCE] hover:bg-[#12345B] text-white shadow-xs'
                    }`}
                  >
                    {comm.isJoined ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Joined</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Join Hub</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#142238] leading-relaxed">{comm.description}</p>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-[#E1E9F3] flex items-center justify-between text-xs text-[#63738A]">
                  <span className="text-[11px] truncate max-w-[180px]">
                    Moderators: {comm.moderators.join(', ')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : comm.id)}
                      className="text-[11px] text-[#63738A] hover:text-[#12345B] flex items-center gap-0.5"
                    >
                      <span>{isExpanded ? 'Hide Rules' : 'Community Rules'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => onSelectCommunityFeed(comm.specialty)}
                      className="px-2.5 py-1 rounded-lg bg-[#EAF3FF] hover:bg-[#246BCE] hover:text-white text-[#246BCE] text-[11px] font-bold transition-colors"
                    >
                      View Discussions
                    </button>
                  </div>
                </div>

                {/* Rules Dropdown */}
                {isExpanded && (
                  <div className="p-3 bg-[#F6F9FD] rounded-lg border border-[#E1E9F3] space-y-1.5 text-[11px] text-[#142238]">
                    <span className="font-bold text-[#12345B] block mb-1">
                      Professional Conduct & Standards:
                    </span>
                    {comm.rules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#246BCE] font-bold">•</span>
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
