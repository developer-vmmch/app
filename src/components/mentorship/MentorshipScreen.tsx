import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  BookOpen,
  Calendar,
  ChevronRight,
  UserCheck,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { MentorshipRequest, DoctorProfile } from '../../types';
import { api } from '../../services/api';

interface Props {
  currentDoctor: DoctorProfile;
  onOpenConversation: (mentorId: string) => void;
  onOpenDoctorProfile: (id: string) => void;
}

export const MentorshipScreen: React.FC<Props> = ({
  currentDoctor,
  onOpenConversation,
  onOpenDoctorProfile,
}) => {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'incoming' | 'sent'>('active');
  const [loading, setLoading] = useState(true);

  const fetchMentorship = async () => {
    setLoading(true);
    const res = await api.getMentorshipRequests();
    if (res.success) {
      setRequests(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMentorship();
  }, []);

  const handleUpdateStatus = async (
    requestId: string,
    action: 'Accepted' | 'Declined' | 'Completed' | 'Cancelled'
  ) => {
    const res = await api.updateMentorshipStatus(requestId, action);
    if (res.success) {
      setRequests((prev) => prev.map((r) => (r.id === requestId ? res.data : r)));
    }
  };

  const incomingRequests = requests.filter((r) => r.mentorId === currentDoctor.id);
  const sentRequests = requests.filter((r) => r.requesterId === currentDoctor.id);
  const activeRelationships = requests.filter(
    (r) => (r.mentorId === currentDoctor.id || r.requesterId === currentDoctor.id) && r.status === 'Accepted'
  );

  return (
    <div className="flex-1 flex flex-col min-h-0 space-y-4">
      {/* Header & Tabs */}
      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] flex items-center justify-center border border-[#BFDBFE]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F172A]">
                Doctor Mentorship Portal
              </h2>
              <p className="text-xs text-[#64748B]">
                Professional guidance & structured clinical learning plans
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-xs">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Active ({activeRelationships.length})
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'incoming'
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Incoming ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-1.5 text-center font-bold rounded-lg transition-all ${
              activeTab === 'sent'
                ? 'bg-[#1D4ED8] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            My Requests ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-8">
            Loading mentorship relations...
          </div>
        ) : activeTab === 'active' ? (
          activeRelationships.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-white rounded-2xl border border-[#E2E8F0] p-8">
              <UserCheck className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <h3 className="text-sm font-bold text-[#0F172A]">No active mentorships yet</h3>
              <p className="text-xs text-[#64748B] max-w-xs mx-auto">
                Explore experienced doctors in Discover to request structured guidance or accept an incoming request.
              </p>
            </div>
          ) : (
            activeRelationships.map((req) => {
              const isUserMentor = req.mentorId === currentDoctor.id;
              const counterpartName = isUserMentor ? req.requesterName : req.mentorName;
              const counterpartSpecialty = isUserMentor ? req.requesterSpecialty : req.mentorSpecialty;
              const counterpartAvatar = isUserMentor ? req.requesterAvatarUrl : req.mentorAvatarUrl;
              const counterpartId = isUserMentor ? req.requesterId : req.mentorId;

              return (
                <div
                  key={req.id}
                  className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3.5 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onOpenDoctorProfile(counterpartId)}
                      className="flex items-center gap-3 text-left"
                    >
                      <img
                        src={counterpartAvatar}
                        alt={counterpartName}
                        className="w-11 h-11 rounded-full object-cover ring-1 ring-[#E2E8F0]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                            {counterpartName}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] font-bold">
                            {isUserMentor ? 'Mentee' : 'Mentor'}
                          </span>
                        </div>
                        <span className="text-xs text-[#64748B]">{counterpartSpecialty}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => onOpenConversation(counterpartId)}
                      className="px-3 py-1.5 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1D4ED8] text-xs font-bold border border-[#BFDBFE] flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>

                  {/* Objective */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                      Agreed Learning Objective:
                    </span>
                    <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
                      {req.learningObjective}
                    </p>
                  </div>

                  {/* Learning Plan Milestones */}
                  {req.learningPlan && (
                    <div className="space-y-2 pt-2 border-t border-[#F1F5F9]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                        <div className="flex items-center gap-1.5 text-[#1D4ED8]">
                          <BookOpen className="w-4 h-4" />
                          <span>Structured Learning Plan</span>
                        </div>
                        <span className="text-[11px] text-[#64748B] font-semibold">
                          {req.learningPlan.durationWeeks} Weeks Target
                        </span>
                      </div>

                      <div className="space-y-2">
                        {req.learningPlan.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                              m.completed
                                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                                : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#0F172A]'
                            }`}
                          >
                            <div className="mt-0.5">
                              {m.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-[#94A3B8]" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`font-bold ${m.completed ? 'line-through text-[#64748B]' : ''}`}>
                                  {m.title}
                                </span>
                                {m.dueDate && (
                                  <span className="text-[10px] text-[#64748B] font-medium">{m.dueDate}</span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#64748B] leading-normal mt-0.5">
                                {m.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )
        ) : activeTab === 'incoming' ? (
          incomingRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-8">
              No pending mentorship requests for your profile.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3.5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.requesterAvatarUrl}
                      alt={req.requesterName}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-[#E2E8F0]"
                    />
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-[#0F172A] block">
                        {req.requesterName}
                      </span>
                      <span className="text-xs text-[#0284C7] font-semibold block">
                        {req.requesterSpecialty}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      req.status === 'Accepted'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : req.status === 'Declined'
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">
                    Requested Learning Objective:
                  </span>
                  <p className="text-xs text-[#0F172A] leading-relaxed font-medium">
                    {req.learningObjective}
                  </p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Declined')}
                      className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept & Setup Plan</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )
        ) : (
          sentRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#64748B] bg-white rounded-2xl border border-[#E2E8F0] p-8">
              You have not submitted any mentorship requests yet.
            </div>
          ) : (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.mentorAvatarUrl}
                      alt={req.mentorName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-[#E2E8F0]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0F172A] block">
                        To {req.mentorName}
                      </span>
                      <span className="text-[11px] text-[#0284C7] font-semibold">{req.mentorSpecialty}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2.5 py-1 rounded-full font-bold ${
                      req.status === 'Accepted'
                        ? 'bg-[#DCFCE7] text-[#166534]'
                        : req.status === 'Declined'
                        ? 'bg-[#FEE2E2] text-[#991B1B]'
                        : 'bg-[#FEF3C7] text-[#92400E]'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-[#0F172A] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] font-medium leading-relaxed">
                  {req.learningObjective}
                </p>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
