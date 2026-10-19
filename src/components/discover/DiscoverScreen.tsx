import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  Award,
  Users,
  Compass,
  GraduationCap,
  MapPin,
  ChevronRight,
  ShieldCheck,
  UserPlus,
  Check,
  X,
  Clock,
  Filter,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { DoctorProfile, Institution, Community } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  onOpenDoctorProfile: (id: string) => void;
  onOpenInstitutionDetail: (instId: string) => void;
  onRequestMentorship: (doctor: DoctorProfile) => void;
  onSelectCommunity?: (specialty: string) => void;
}

const SPECIALTIES = [
  'All Specialties',
  'Cardiology',
  'General Medicine',
  'Pediatrics',
  'Neurosurgery',
  'Anesthesiology & Critical Care',
];

const RECENT_SEARCHES_STORAGE_KEY = 'amt_recent_searches_v1';

export const DiscoverScreen: React.FC<Props> = ({
  onOpenDoctorProfile,
  onOpenInstitutionDetail,
  onRequestMentorship,
  onSelectCommunity,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [activeCategory, setActiveCategory] = useState<
    'doctors' | 'institutions' | 'communities' | 'mentors'
  >('doctors');
  const [mentorshipOnly, setMentorshipOnly] = useState(false);

  // Data states
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  // Status states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Pediatrics',
    'Apollo Hospital',
    'Cardiology',
    'TNMC',
  ]);

  // Request counter to cancel stale responses
  const searchRequestId = useRef(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
        setRecentSearches((prev) => [searchTerm.trim(), ...prev.slice(0, 4)]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch when filters or search change
  useEffect(() => {
    fetchDirectory();
  }, [debouncedSearch, selectedSpecialty, mentorshipOnly, activeCategory]);

  const fetchDirectory = async () => {
    const currentId = ++searchRequestId.current;
    setLoading(true);
    setError(null);

    try {
      const [docsRes, instsRes, commsRes] = await Promise.all([
        api.getDoctors({
          search: debouncedSearch,
          specialty: selectedSpecialty !== 'All Specialties' ? selectedSpecialty : undefined,
          mentorshipOnly: activeCategory === 'mentors' ? true : mentorshipOnly,
        }),
        api.getInstitutions(),
        api.getCommunities(),
      ]);

      // If a newer request was made, disregard stale response
      if (currentId !== searchRequestId.current) return;

      if (docsRes.success) {
        setDoctors(docsRes.data);
      }
      if (instsRes.success) {
        const filteredInsts = debouncedSearch
          ? instsRes.data.filter(
              (i) =>
                i.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                i.city.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
          : instsRes.data;
        setInstitutions(filteredInsts);
      }
      if (commsRes.success) {
        const filteredComms = debouncedSearch
          ? commsRes.data.filter(
              (c) =>
                c.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                c.specialty.toLowerCase().includes(debouncedSearch.toLowerCase())
            )
          : commsRes.data;
        setCommunities(filteredComms);
      }
    } catch (err) {
      if (currentId === searchRequestId.current) {
        setError('Failed to query directory. Please check network connection.');
      }
    } finally {
      if (currentId === searchRequestId.current) {
        setLoading(false);
      }
    }
  };

  const handleToggleFollow = (docId: string) => {
    setFollowingMap((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F6F9FD]">
      {/* Top Search Bar & Header */}
      <div className="p-3 sm:p-4 bg-white border-b border-[#E1E9F3] space-y-3 shrink-0 shadow-2xs">
        {/* Search Input with Clear Button */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#63738A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search doctors, verified specialties, hospitals, TNMC licenses..."
            className="w-full bg-[#F6F9FD] border border-[#D5E1F0] rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#142238] placeholder-[#63738A] focus:outline-none focus:border-[#246BCE] focus:ring-2 focus:ring-[#246BCE]/20 transition-all"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              aria-label="Clear search query"
              className="p-1 rounded-full text-[#63738A] hover:text-[#12345B] absolute right-2.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recent Searches Chips */}
        {recentSearches.length > 0 && !searchTerm && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] text-[#63738A] pt-0.5">
            <span className="flex items-center gap-1 font-semibold text-[#12345B] shrink-0 text-[10px] uppercase">
              <Clock className="w-3 h-3 text-[#63738A]" />
              <span>Recent:</span>
            </span>
            {recentSearches.map((rec) => (
              <button
                key={rec}
                onClick={() => setSearchTerm(rec)}
                className="px-2 py-0.5 rounded-lg bg-[#F6F9FD] hover:bg-[#EAF3FF] hover:text-[#246BCE] border border-[#E1E9F3] text-[10px] font-medium shrink-0 transition-colors"
              >
                {rec}
              </button>
            ))}
          </div>
        )}

        {/* Primary Discovery Categories & Specialty Filters */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-1 bg-[#F6F9FD] p-1 rounded-xl border border-[#E1E9F3] text-xs">
            <button
              onClick={() => setActiveCategory('doctors')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeCategory === 'doctors'
                  ? 'bg-[#12345B] text-white shadow-xs'
                  : 'text-[#63738A] hover:text-[#12345B]'
              }`}
            >
              Doctors ({doctors.length})
            </button>
            <button
              onClick={() => setActiveCategory('institutions')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeCategory === 'institutions'
                  ? 'bg-[#12345B] text-white shadow-xs'
                  : 'text-[#63738A] hover:text-[#12345B]'
              }`}
            >
              Hospitals ({institutions.length})
            </button>
            <button
              onClick={() => setActiveCategory('communities')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeCategory === 'communities'
                  ? 'bg-[#12345B] text-white shadow-xs'
                  : 'text-[#63738A] hover:text-[#12345B]'
              }`}
            >
              Communities ({communities.length})
            </button>
            <button
              onClick={() => setActiveCategory('mentors')}
              className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors flex items-center gap-1 ${
                activeCategory === 'mentors'
                  ? 'bg-[#246BCE] text-white shadow-xs'
                  : 'text-[#246BCE] hover:bg-[#EAF3FF]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Mentors (Can Teach)</span>
            </button>
          </div>

          {/* Specialty Dropdown */}
          <div className="shrink-0">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-[#F6F9FD] text-xs text-[#12345B] font-semibold rounded-xl px-2.5 py-1.5 border border-[#D5E1F0] focus:outline-none focus:border-[#246BCE]"
            >
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory & Search Results Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 min-h-0">
        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-[#246BCE] animate-spin mx-auto" />
            <p className="text-xs text-[#63738A]">Querying verified medical directory...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center space-y-2">
            <p>{error}</p>
            <button
              onClick={fetchDirectory}
              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs"
            >
              Retry Search
            </button>
          </div>
        )}

        {/* DOCTORS & MENTORS VIEW */}
        {!loading && (activeCategory === 'doctors' || activeCategory === 'mentors') && (
          doctors.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#63738A] bg-white rounded-2xl border border-[#E1E9F3] p-6 space-y-2">
              <Compass className="w-8 h-8 text-[#63738A] mx-auto opacity-40" />
              <p className="font-bold text-[#142238]">No doctors found</p>
              <p className="text-[11px]">Try adjusting your search keywords or specialty filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('All Specialties');
                }}
                className="mt-2 px-3 py-1 text-xs text-[#246BCE] font-bold hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            doctors.map((doctor) => {
              const isFollowing = followingMap[doctor.id];
              return (
                <div
                  key={doctor.id}
                  className="bg-white border border-[#E1E9F3] rounded-2xl p-4 space-y-3 shadow-2xs hover:border-[#246BCE]/40 transition-all"
                >
                  {/* Top Doctor Row */}
                  <div className="flex items-start justify-between gap-3">
                    <button
                      onClick={() => onOpenDoctorProfile(doctor.id)}
                      className="flex items-start gap-3 text-left group min-w-0"
                    >
                      <img
                        src={doctor.avatarUrl}
                        alt={doctor.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-[#D5E1F0] group-hover:ring-2 group-hover:ring-[#246BCE] shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-[#12345B] group-hover:text-[#246BCE]">
                            {doctor.fullName}
                          </span>
                          <VerificationBadge status={doctor.verificationStatus} />
                        </div>
                        <p className="text-xs text-[#246BCE] font-semibold mt-0.5">
                          {doctor.primarySpecialty} · {doctor.qualification}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-[#63738A] mt-0.5">
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">
                            {doctor.institution}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Follow Action */}
                    {!doctor.isCurrentUser && (
                      <button
                        onClick={() => handleToggleFollow(doctor.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                          isFollowing
                            ? 'bg-[#EAF3FF] text-[#246BCE] border border-[#246BCE]/30'
                            : 'bg-[#12345B] text-white hover:bg-[#1B4B82]'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-[#334155] line-clamp-2 leading-relaxed">
                    {doctor.bio}
                  </p>

                  {/* Mentorship & Credentials Tag */}
                  {doctor.mentorshipAvailable && (
                    <div className="p-2 rounded-xl bg-[#EAF3FF] border border-[#246BCE]/20 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#12345B]">
                        <Award className="w-4 h-4 text-[#246BCE] shrink-0" />
                        <span className="font-semibold">
                          Open to Mentorship (Can Teach: {doctor.primarySpecialty})
                        </span>
                      </div>
                      {!doctor.isCurrentUser && (
                        <button
                          onClick={() => onRequestMentorship(doctor)}
                          className="px-2.5 py-1 rounded-lg bg-[#246BCE] hover:bg-[#12345B] text-white font-bold text-[11px] transition-colors shrink-0"
                        >
                          Request
                        </button>
                      )}
                    </div>
                  )}

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#E1E9F3] text-xs">
                    <span className="text-[11px] text-[#63738A]">
                      {doctor.yearsOfExperience} yrs practice · {doctor.followersCount} peers
                    </span>

                    <button
                      onClick={() => onOpenDoctorProfile(doctor.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#246BCE] hover:bg-[#EAF3FF] transition-colors"
                    >
                      View Profile →
                    </button>
                  </div>
                </div>
              );
            })
          )
        )}

        {/* HOSPITALS VIEW */}
        {!loading && activeCategory === 'institutions' && (
          institutions.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#63738A] bg-white rounded-2xl border border-[#E1E9F3]">
              No hospitals matching query.
            </div>
          ) : (
            institutions.map((inst) => (
              <div
                key={inst.id}
                onClick={() => onOpenInstitutionDetail(inst.id)}
                className="bg-white border border-[#E1E9F3] rounded-2xl p-4 space-y-3 shadow-2xs hover:border-[#246BCE] cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={inst.logoUrl}
                    alt={inst.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-[#E1E9F3] shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#12345B] truncate">
                        {inst.name}
                      </span>
                      {inst.isVerified && (
                        <ShieldCheck className="w-4 h-4 text-[#16845B] shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-[#246BCE] font-semibold block">
                      {inst.institutionType} · {inst.memberDoctorsCount} doctors
                    </span>
                    <span className="text-[11px] text-[#63738A] block">
                      {inst.city}, {inst.state}, {inst.country}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E1E9F3] flex items-center justify-between text-xs text-[#246BCE] font-bold">
                  <span>Explore Hospital Departments & Medical Staff</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )
        )}

        {/* COMMUNITIES VIEW */}
        {!loading && activeCategory === 'communities' && (
          communities.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#63738A] bg-white rounded-2xl border border-[#E1E9F3]">
              No communities matching query.
            </div>
          ) : (
            communities.map((comm) => (
              <div
                key={comm.id}
                className="bg-white border border-[#E1E9F3] rounded-2xl p-4 space-y-3 shadow-2xs hover:border-[#246BCE] transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#12345B]">{comm.name}</h3>
                    <p className="text-xs text-[#246BCE] font-semibold">{comm.specialty}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#EAF3FF] text-[#246BCE] font-bold">
                    {comm.memberCount} Doctors
                  </span>
                </div>

                <p className="text-xs text-[#334155] leading-relaxed">{comm.description}</p>

                <div className="pt-2 border-t border-[#E1E9F3] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-[#63738A]">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Peer Discussions & Case Studies</span>
                  </div>
                  <button
                    onClick={() => onSelectCommunity && onSelectCommunity(comm.specialty)}
                    className="px-3 py-1.5 rounded-xl bg-[#12345B] hover:bg-[#1B4B82] text-white text-xs font-bold transition-colors"
                  >
                    Enter Hub
                  </button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
