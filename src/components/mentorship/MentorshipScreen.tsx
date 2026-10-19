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
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {/* Header & Tabs */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                Doctor Mentorship Portal
              </h2>
              <p className="text-[10px] text-slate-400">
                Professional guidance & structured clinical learning plans
              </p>
            </div>
          </div>
        </div>

        {/* Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
              activeTab === 'active'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active ({activeRelationships.length})
          </button>
          <button
            onClick={() => setActiveTab('incoming')}
            className={`flex-1 py-1 text-center font-medium rounded-md transition-colors relative ${
              activeTab === 'incoming'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Incoming ({incomingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-1 text-center font-medium rounded-md transition-colors ${
              activeTab === 'sent'
                ? 'bg-slate-800 text-teal-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            My Requests ({sentRequests.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading mentorship relations...</div>
        ) : activeTab === 'active' ? (
          /* Active Relationships & Learning Plans */
          activeRelationships.length === 0 ? (
            <div className="py-12 text-center space-y-2 bg-slate-900/50 rounded-xl border border-slate-800 p-6">
              <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-200">No active mentorships yet</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
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
                  className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => onOpenDoctorProfile(counterpartId)}
                      className="flex items-center gap-2.5 text-left"
                    >
                      <img
                        src={counterpartAvatar}
                        alt={counterpartName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-100">
                            {counterpartName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-950 text-teal-400 font-medium">
                            {isUserMentor ? 'Mentee' : 'Mentor'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{counterpartSpecialty}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => onOpenConversation(counterpartId)}
                      className="px-2.5 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 text-xs font-medium border border-teal-700/50 flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  </div>

                  {/* Objective */}
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Agreed Learning Objective:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {req.learningObjective}
                    </p>
                  </div>

                  {/* Learning Plan Milestones */}
                  {req.learningPlan && (
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                        <div className="flex items-center gap-1.5 text-teal-300">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Structured Learning Plan</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {req.learningPlan.durationWeeks} Weeks Target
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {req.learningPlan.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                              m.completed
                                ? 'bg-teal-950/20 border-teal-800/40 text-slate-300'
                                : 'bg-slate-950/60 border-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="mt-0.5">
                              {m.completed ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`font-medium ${m.completed ? 'line-through text-slate-400' : ''}`}>
                                  {m.title}
                                </span>
                                {m.dueDate && (
                                  <span className="text-[10px] text-slate-500">{m.dueDate}</span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal mt-0.5">
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
          /* Incoming Requests for Senior Doctor */
          incomingRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No pending mentorship requests for your profile.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.requesterAvatarUrl}
                      alt={req.requesterName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-100 block">
                        {req.requesterName}
                      </span>
                      <span className="text-[11px] text-teal-400 block">
                        {req.requesterSpecialty}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      req.status === 'Accepted'
                        ? 'bg-teal-950 text-teal-400'
                        : req.status === 'Declined'
                        ? 'bg-rose-950 text-rose-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                    Requested Learning Objective:
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {req.learningObjective}
                  </p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Declined')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Accepted')}
                      className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
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
          /* Sent Requests */
          sentRequests.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              You have not submitted any mentorship requests yet.
            </div>
          ) : (
            sentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={req.mentorAvatarUrl}
                      alt={req.mentorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">
                        To {req.mentorName}
                      </span>
                      <span className="text-[10px] text-teal-400">{req.mentorSpecialty}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                      req.status === 'Accepted'
                        ? 'bg-teal-950 text-teal-400'
                        : req.status === 'Declined'
                        ? 'bg-rose-950 text-rose-400'
                        : 'bg-amber-950 text-amber-400'
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800/80">
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
