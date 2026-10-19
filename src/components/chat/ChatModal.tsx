import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Building2,
  FileText,
  Lock,
  Search,
  Filter,
  Paperclip,
  Smile,
  Info,
  Phone,
  Video,
  MoreVertical,
  Flag,
  Moon,
  Sun,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Clock,
  Sparkles,
  AlertTriangle,
  User,
  Share2,
  CheckCircle2,
  Activity,
  BookOpen,
} from 'lucide-react';
import { Conversation, Message, DoctorProfile, VerificationStatus } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  currentUser: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenDoctorProfile: (id: string) => void;
  onReportDoctor?: (name: string) => void;
}

export const ChatModal: React.FC<Props> = ({
  currentUser,
  isOpen,
  onClose,
  onOpenDoctorProfile,
  onReportDoctor,
}) => {
  // Theme state: light vs dark clinical mode
  const [chatTheme, setChatTheme] = useState<'dark' | 'light'>('light');

  // Conversation & Messaging state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'unread' | 'mentorship' | 'institution'>('all');

  // UI Panels
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showCallNotice, setShowCallNotice] = useState<string | null>(null);
  const [reportSuccess, setReportSuccess] = useState(false);

  // Auto-scroll ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load conversations on modal open
  useEffect(() => {
    if (isOpen) {
      loadInbox();
    }
  }, [isOpen]);

  const loadInbox = async () => {
    setLoading(true);
    const res = await api.getConversations();
    if (res.success) {
      setConversations(res.data);
      // Auto-select first conversation on desktop if none selected
      if (!activeConv && window.innerWidth >= 768 && res.data.length > 0) {
        selectConversation(res.data[0]);
      }
    }
    setLoading(false);
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConv(conv);
    setLoadingMessages(true);
    setShowInfoPanel(false);
    const res = await api.getMessages(conv.id);
    if (res.success) {
      setMessages(res.data);
    }
    setLoadingMessages(false);

    // Focus input on selection
    setTimeout(() => {
      inputRef.current?.focus();
      scrollToBottom();
    }, 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeConv) {
      scrollToBottom();
    }
  }, [messages.length, activeConv]);

  // Handle message submission
  const handleSendMessage = async (e?: React.FormEvent, customAttachment?: Message['attachmentMetadata']) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !customAttachment) return;
    if (!activeConv || sending) return;

    setSending(true);
    const textToSend = messageText.trim() || 'Attached clinical case review document';
    setMessageText('');

    const res = await api.sendMessage({
      conversationId: activeConv.id,
      text: textToSend,
      attachmentType: customAttachment ? 'case_ref' : undefined,
      attachmentMetadata: customAttachment,
    });

    setSending(false);
    setShowAttachMenu(false);

    if (res.success) {
      setMessages((prev) => [...prev, res.data]);

      // Update local conversations last message
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConv.id
            ? {
                ...c,
                lastMessage: {
                  text: textToSend,
                  createdAt: res.data.createdAt,
                  senderId: currentUser.id,
                },
                unreadCount: 0,
              }
            : c
        )
      );
    }
  };

  // Attach a clinical educational template
  const handleAttachTemplate = (type: string) => {
    let attachment: Message['attachmentMetadata'];
    if (type === 'case') {
      attachment = {
        title: 'De-identified Case Summary: Echocardiogram Review',
        summary: 'Pre-procedural assessment with complete patient PHI stripped. Educational peer exchange.',
        url: '#case-ref',
      };
    } else if (type === 'ecg') {
      attachment = {
        title: '12-Lead ECG Analysis: ST-Elevation Differential',
        summary: 'De-identified trace for residency training and diagnostic review.',
        url: '#ecg-ref',
      };
    } else {
      attachment = {
        title: 'Clinical Practice Guideline Summary',
        summary: 'Evidence-based consensus recommendation for collegiate discussion.',
        url: '#guidelines',
      };
    }
    handleSendMessage(undefined, attachment);
  };

  const handleReportConversation = async (name: string) => {
    if (onReportDoctor) {
      onReportDoctor(name);
    } else {
      await api.submitReport({
        targetType: 'user',
        targetId: activeConv?.participant.id || 'chat-report',
        targetTitleOrSnippet: `Chat conversation with ${name}`,
        reason: 'harassment_unprofessional',
        explanation: 'Collegiate chat moderation review requested by practitioner.',
      });
    }
    setReportSuccess(true);
    setTimeout(() => setReportSuccess(false), 3000);
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch =
        c.participant.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.participant.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.lastMessage?.text || '').toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTab === 'unread') return c.unreadCount > 0;
      if (filterTab === 'mentorship') return c.type === 'mentorship';
      if (filterTab === 'institution') return c.type === 'institution';
      return true;
    });
  }, [conversations, searchQuery, filterTab]);

  if (!isOpen) return null;

  const isDark = chatTheme === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Doctor Direct Messaging & Clinical Consultations"
      className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-md flex items-end md:items-center justify-center p-0 md:p-4 animate-fadeIn"
    >
      {/* Main Messaging Container: Full-height native feel on mobile, 3-panel layout on desktop */}
      <div
        className={`w-full max-w-6xl h-full md:h-[88vh] md:max-h-[820px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-colors border ${
          isDark
            ? 'bg-[#09152C] text-slate-100 border-[#1E3E6E]/70'
            : 'bg-white text-[#142238] border-[#E1E9F3]'
        }`}
      >
        {/* =========================================================================
            TOP GLOBAL BAR: Brand, Status, Theme Toggle & Modal Close
            ========================================================================= */}
        <div
          className={`px-4 py-2.5 flex items-center justify-between border-b shrink-0 ${
            isDark ? 'bg-[#0B1832] border-[#1E3E6E]/60' : 'bg-[#F6F9FD] border-[#E1E9F3]'
          }`}
        >
          {/* Left Title */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1B4B82] via-[#3185FF] to-[#26D9C3] flex items-center justify-center text-white shadow-xs shrink-0">
              <MessageSquare className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-bold text-xs sm:text-sm text-[#12345B] dark:text-white">
                  AMT Clinical Consults & Direct Messaging
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#3185FF]/15 text-[#3185FF] dark:text-[#64B5F6]">
                  <Lock className="w-2.5 h-2.5" />
                  CONFIDENTIAL CHANNEL
                </span>
              </div>
              <p className="text-[10px] text-[#63738A] dark:text-slate-400 mt-0.5">
                Peer-to-peer doctor consultations · Strict PHI de-identification standard
              </p>
            </div>
          </div>

          {/* Right Header Controls: Theme toggle & Close */}
          <div className="flex items-center gap-1.5">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setChatTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
              title={`Switch to ${isDark ? 'Light Clinical Mode' : 'Dark Hospital Mode'}`}
              className={`p-1.5 rounded-xl transition-colors ${
                isDark
                  ? 'bg-[#122345] hover:bg-[#1A3362] text-amber-400'
                  : 'bg-white hover:bg-[#EAF3FF] text-[#12345B] border border-[#E1E9F3]'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              aria-label="Close messaging modal"
              className={`p-1.5 rounded-xl transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                  : 'hover:bg-[#EAF3FF] text-[#63738A] hover:text-[#12345B]'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            MAIN CHAT WORKSPACE: 3-column on Desktop / Single-view on Mobile
            ========================================================================= */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          {/* =======================================================================
              PANEL 1: CONVERSATION SIDEBAR (List, Search, Filters)
              Visible on desktop, or on mobile when activeConv is null
              ======================================================================= */}
          <div
            className={`w-full md:w-80 lg:w-88 flex flex-col shrink-0 border-r transition-colors ${
              activeConv ? 'hidden md:flex' : 'flex'
            } ${
              isDark ? 'bg-[#081226] border-[#1E3E6E]/60' : 'bg-white border-[#E1E9F3]'
            }`}
          >
            {/* Search Input Bar */}
            <div className="p-3 border-b border-inherit space-y-2">
              <div className="relative">
                <Search
                  className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-400' : 'text-[#63738A]'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, specialties, topics..."
                  className={`w-full rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-[#0D1C3B] border border-[#1E3E6E] text-white placeholder-slate-500 focus:border-[#3185FF]'
                      : 'bg-[#F6F9FD] border border-[#D5E1F0] text-[#142238] placeholder-slate-400 focus:border-[#246BCE]'
                  }`}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Tabs (All, Unread, Mentorship, Hospital) */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
                {(['all', 'unread', 'mentorship', 'institution'] as const).map((tab) => {
                  const isActive = filterTab === tab;
                  const labelMap = {
                    all: 'All',
                    unread: 'Unread',
                    mentorship: 'Mentorship',
                    institution: 'Hospital',
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilterTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize whitespace-nowrap transition-colors ${
                        isActive
                          ? isDark
                            ? 'bg-[#3185FF] text-white shadow-2xs'
                            : 'bg-[#12345B] text-white shadow-2xs'
                          : isDark
                          ? 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                          : 'text-[#63738A] hover:text-[#12345B] hover:bg-[#F6F9FD]'
                      }`}
                    >
                      {labelMap[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation List Scroll Area */}
            <div className="flex-1 overflow-y-auto divide-y divide-inherit">
              {loading ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <div className="w-6 h-6 border-2 border-[#3185FF]/30 border-t-[#3185FF] rounded-full animate-spin mx-auto mb-2" />
                  Loading consultations...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-400">No conversations found</p>
                  <p className="text-[11px] text-slate-500">
                    Try another search term or start a consultation from Doctor Discover.
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConv?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-3.5 flex items-start gap-3 transition-all text-left relative ${
                        isSelected
                          ? isDark
                            ? 'bg-[#102347] border-l-4 border-l-[#3185FF]'
                            : 'bg-[#EAF3FF]/80 border-l-4 border-l-[#246BCE]'
                          : isDark
                          ? 'hover:bg-[#0D1C3B]/60'
                          : 'hover:bg-[#F6F9FD]'
                      }`}
                    >
                      {/* Avatar with Online Activity Indicator */}
                      <div className="relative shrink-0">
                        <img
                          src={conv.participant.avatarUrl}
                          alt={conv.participant.fullName}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                        />
                        {conv.participant.isOnline !== false && (
                          <span
                            title="Online for consult"
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#16845B] ring-2 ring-white dark:ring-[#081226]"
                          />
                        )}
                      </div>

                      {/* Info & Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className={`text-xs font-bold truncate ${
                                isDark ? 'text-white' : 'text-[#12345B]'
                              }`}
                            >
                              {conv.participant.fullName}
                            </span>
                            <VerificationBadge
                              status={conv.participant.verificationStatus}
                              showText={false}
                            />
                          </div>
                          {conv.lastMessage && (
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] font-semibold text-[#3185FF] dark:text-[#64B5F6] truncate">
                            {conv.participant.specialty}
                          </span>
                          <span className="text-[10px] text-slate-400">·</span>
                          <span className="text-[10px] text-slate-500 capitalize truncate">
                            {conv.type}
                          </span>
                        </div>

                        {conv.lastMessage && (
                          <p
                            className={`text-xs truncate mt-1 leading-snug ${
                              conv.unreadCount > 0
                                ? 'font-semibold text-[#12345B] dark:text-white'
                                : 'text-slate-500 dark:text-slate-400'
                            }`}
                          >
                            {conv.lastMessage.text}
                          </p>
                        )}
                      </div>

                      {/* Unread badge */}
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#C43D4B] text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* =======================================================================
              PANEL 2: ACTIVE CONVERSATION (Header, Body, Messages, Composer)
              Visible when activeConv is present (or full view on mobile)
              ======================================================================= */}
          {activeConv ? (
            <div className="flex-1 flex flex-col min-h-0 bg-[#F8FAFD] dark:bg-[#070F20] transition-colors">
              {/* Active Conversation Header */}
              <div
                className={`px-3 sm:px-4 py-2.5 border-b flex items-center justify-between shrink-0 transition-colors ${
                  isDark ? 'bg-[#0B1832] border-[#1E3E6E]/60' : 'bg-white border-[#E1E9F3]'
                }`}
              >
                {/* Participant Details */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setActiveConv(null)}
                    aria-label="Back to conversations list"
                    className="md:hidden p-1.5 -ml-1 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={activeConv.participant.avatarUrl}
                      alt={activeConv.participant.fullName}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700 bg-slate-100"
                    />
                    {activeConv.participant.isOnline !== false && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16845B] ring-2 ring-white dark:ring-[#0B1832]" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span className="text-xs sm:text-sm font-bold truncate text-[#12345B] dark:text-white">
                        {activeConv.participant.fullName}
                      </span>
                      <VerificationBadge
                        status={activeConv.participant.verificationStatus}
                        showText={false}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] leading-tight text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      <span className="text-[#3185FF] dark:text-[#64B5F6] font-semibold truncate">
                        {activeConv.participant.specialty}
                      </span>
                      <span>·</span>
                      <span className="text-[#16845B] font-medium">Online for Consult</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls: Voice, Video, Profile Info, Report */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={() => setShowCallNotice('Voice Consultation Channel')}
                    title="Start encrypted collegiate audio consult"
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? 'hover:bg-white/10 text-slate-300'
                        : 'hover:bg-[#EAF3FF] text-[#12345B]'
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowCallNotice('Video Tele-Case Review')}
                    title="Start collegiate video case review"
                    className={`p-2 rounded-xl transition-colors ${
                      isDark
                        ? 'hover:bg-white/10 text-slate-300'
                        : 'hover:bg-[#EAF3FF] text-[#12345B]'
                    }`}
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  {/* Toggle Participant Info Panel (Desktop) */}
                  <button
                    onClick={() => setShowInfoPanel(!showInfoPanel)}
                    title="View doctor professional summary"
                    className={`hidden sm:flex p-2 rounded-xl transition-colors ${
                      showInfoPanel
                        ? isDark
                          ? 'bg-[#3185FF] text-white'
                          : 'bg-[#12345B] text-white'
                        : isDark
                        ? 'hover:bg-white/10 text-slate-300'
                        : 'hover:bg-[#EAF3FF] text-[#12345B]'
                    }`}
                  >
                    <Info className="w-4 h-4" />
                  </button>

                  {/* Report action */}
                  <button
                    onClick={() => handleReportConversation(activeConv.participant.fullName)}
                    title="Report conversation conduct"
                    className={`p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors`}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Call Notice Feedback Banner */}
              {showCallNotice && (
                <div className="px-4 py-2 bg-[#EAF3FF] dark:bg-[#0E2042] border-b border-[#3185FF]/20 text-[11px] text-[#12345B] dark:text-[#90CAF9] flex items-center justify-between">
                  <span>
                    Initiating <strong>{showCallNotice}</strong> with {activeConv.participant.fullName}...
                  </span>
                  <button
                    onClick={() => setShowCallNotice(null)}
                    className="p-1 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Report Success Toast */}
              {reportSuccess && (
                <div className="px-4 py-2 bg-rose-950 border-b border-rose-800 text-rose-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-rose-400" />
                  <span>Report submitted to AMT Healthcare Moderation Board for review.</span>
                </div>
              )}

              {/* Strict PHI Safety Banner (Unobtrusive & Clear) */}
              <div
                className={`px-3 py-1.5 border-b text-[10px] text-center flex items-center justify-center gap-1.5 shrink-0 ${
                  isDark
                    ? 'bg-[#0B1A36] border-[#1E3E6E]/60 text-slate-300'
                    : 'bg-[#EAF3FF]/80 border-[#246BCE]/20 text-[#12345B]'
                }`}
              >
                <Lock className="w-3 h-3 text-[#3185FF] shrink-0" />
                <span>
                  <strong>Strict Patient PHI De-identification Standard:</strong> Do not share raw patient MRNs or identifiable health information in collegiate chat.
                </span>
              </div>

              {/* Message History Body */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
                {/* Date separator */}
                <div className="flex items-center justify-center my-2">
                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                      isDark
                        ? 'bg-white/10 text-slate-400'
                        : 'bg-[#E1E9F3] text-[#63738A]'
                    }`}
                  >
                    Today, October 12, 2026
                  </span>
                </div>

                {loadingMessages ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    <div className="w-6 h-6 border-2 border-[#3185FF]/30 border-t-[#3185FF] rounded-full animate-spin mx-auto mb-2" />
                    Loading encrypted message history...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-[#3185FF]/10 text-[#3185FF] mx-auto flex items-center justify-center">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400">Consultation Channel Open</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Send a message to Dr. {activeConv.participant.fullName} to discuss clinical questions, mentorship, or peer case studies.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.senderId === currentUser.id;
                    const prevMsg = messages[index - 1];
                    const isSameSender = prevMsg && prevMsg.senderId === msg.senderId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} ${
                          isSameSender ? 'mt-1' : 'mt-3'
                        }`}
                      >
                        {/* Message Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs break-words ${
                            isMe
                              ? isDark
                                ? 'bg-gradient-to-r from-[#1E56A0] to-[#246BCE] text-white rounded-tr-xs'
                                : 'bg-gradient-to-r from-[#246BCE] to-[#1E88E5] text-white rounded-tr-xs'
                              : isDark
                              ? 'bg-[#102347] text-slate-100 border border-[#1E3E6E] rounded-tl-xs'
                              : 'bg-white text-[#142238] border border-[#E1E9F3] rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-line selection:bg-teal-500 selection:text-white">
                            {msg.text}
                          </p>

                          {/* Case Attachment Metadata Preview Card */}
                          {msg.attachmentMetadata && (
                            <div
                              className={`mt-2.5 p-2.5 rounded-xl border space-y-1 text-left ${
                                isMe
                                  ? 'bg-black/15 border-white/20 text-white'
                                  : isDark
                                  ? 'bg-[#070F20] border-[#1E3E6E] text-slate-200'
                                  : 'bg-[#F6F9FD] border-[#D5E1F0] text-[#12345B]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold text-[11px]">
                                <FileText className="w-3.5 h-3.5 text-[#26D9C3] shrink-0" />
                                <span className="truncate">{msg.attachmentMetadata.title}</span>
                              </div>
                              {msg.attachmentMetadata.summary && (
                                <p className="text-[10px] opacity-90 leading-normal">
                                  {msg.attachmentMetadata.summary}
                                </p>
                              )}
                              <div className="pt-1 flex items-center justify-between text-[9px] font-semibold opacity-80 uppercase tracking-wider">
                                <span>De-identified Patient Record</span>
                                <span className="text-[#26D9C3]">Verified Case</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Timestamp and Delivery State */}
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1 mt-0.5">
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {isMe && (
                            <span>
                              {msg.status === 'read' ? (
                                <span title="Read by doctor" className="inline-flex items-center">
                                  <CheckCheck className="w-3 h-3 text-[#26D9C3]" />
                                </span>
                              ) : msg.status === 'delivered' ? (
                                <span title="Delivered" className="inline-flex items-center">
                                  <CheckCheck className="w-3 h-3 text-slate-400" />
                                </span>
                              ) : (
                                <span title="Sent" className="inline-flex items-center">
                                  <Check className="w-3 h-3 text-slate-400" />
                                </span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Clinical Attachment Quick Menu */}
              {showAttachMenu && (
                <div
                  className={`p-3 border-t grid grid-cols-3 gap-2 animate-fadeIn shrink-0 ${
                    isDark ? 'bg-[#0D1C3B] border-[#1E3E6E]' : 'bg-[#EAF3FF] border-[#CAD8E8]'
                  }`}
                >
                  <button
                    onClick={() => handleAttachTemplate('case')}
                    className="p-2 rounded-xl bg-white dark:bg-[#122345] border border-[#CAD8E8] dark:border-[#1E3E6E] text-left hover:scale-[1.02] transition-transform text-xs"
                  >
                    <FileText className="w-4 h-4 text-[#3185FF] mb-1" />
                    <span className="font-bold text-[11px] block truncate">Echo / Case Summary</span>
                    <span className="text-[9px] text-slate-500 block truncate">De-identified loop</span>
                  </button>
                  <button
                    onClick={() => handleAttachTemplate('ecg')}
                    className="p-2 rounded-xl bg-white dark:bg-[#122345] border border-[#CAD8E8] dark:border-[#1E3E6E] text-left hover:scale-[1.02] transition-transform text-xs"
                  >
                    <Activity className="w-4 h-4 text-[#26D9C3] mb-1" />
                    <span className="font-bold text-[11px] block truncate">12-Lead ECG Analysis</span>
                    <span className="text-[9px] text-slate-500 block truncate">De-identified strip</span>
                  </button>
                  <button
                    onClick={() => handleAttachTemplate('guideline')}
                    className="p-2 rounded-xl bg-white dark:bg-[#122345] border border-[#CAD8E8] dark:border-[#1E3E6E] text-left hover:scale-[1.02] transition-transform text-xs"
                  >
                    <BookOpen className="w-4 h-4 text-amber-500 mb-1" />
                    <span className="font-bold text-[11px] block truncate">Clinical Guideline</span>
                    <span className="text-[9px] text-slate-500 block truncate">Evidence consensus</span>
                  </button>
                </div>
              )}

              {/* Message Composer */}
              <form
                onSubmit={(e) => handleSendMessage(e)}
                className={`p-2.5 sm:p-3 border-t flex items-center gap-2 shrink-0 ${
                  isDark ? 'bg-[#0B1832] border-[#1E3E6E]/60' : 'bg-white border-[#E1E9F3]'
                }`}
              >
                {/* Paperclip / Attach menu trigger */}
                <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  title="Attach de-identified clinical case review"
                  className={`p-2 rounded-xl transition-colors ${
                    showAttachMenu
                      ? isDark
                        ? 'bg-[#3185FF] text-white'
                        : 'bg-[#12345B] text-white'
                      : isDark
                      ? 'hover:bg-white/10 text-slate-400 hover:text-white'
                      : 'hover:bg-[#F6F9FD] text-[#63738A] hover:text-[#12345B]'
                  }`}
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Input Text Box */}
                <input
                  ref={inputRef}
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Message Dr. ${activeConv.participant.fullName.split(' ')[0]}...`}
                  className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-colors ${
                    isDark
                      ? 'bg-[#070F20] border border-[#1E3E6E] text-white placeholder-slate-500 focus:border-[#3185FF]'
                      : 'bg-[#F6F9FD] border border-[#D5E1F0] text-[#142238] placeholder-slate-400 focus:border-[#246BCE]'
                  }`}
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  title="Send message"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#3185FF] to-[#246BCE] hover:from-[#42A5F5] hover:to-[#246BCE] text-white font-bold disabled:opacity-40 transition-all active:scale-95 shadow-xs shrink-0 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            /* No conversation selected state (Desktop) */
            <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 text-center bg-[#F8FAFD] dark:bg-[#070F20]">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#1B4B82] via-[#3185FF] to-[#26D9C3] text-white flex items-center justify-center shadow-lg mb-4">
                <MessageSquare className="w-8 h-8 stroke-[2.2]" />
              </div>
              <h3 className="text-base font-bold text-[#12345B] dark:text-white">
                Select a Doctor Consultation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                Choose a conversation from the sidebar to review peer case studies, residency mentorship, or clinical inquiries.
              </p>
            </div>
          )}

          {/* =======================================================================
              PANEL 3: COLLAPSIBLE PARTICIPANT INFORMATION PANEL (Desktop/Tablet)
              ======================================================================= */}
          {activeConv && showInfoPanel && (
            <div
              className={`w-72 lg:w-80 shrink-0 border-l p-4 overflow-y-auto hidden sm:flex flex-col justify-between transition-colors animate-fadeIn ${
                isDark ? 'bg-[#081226] border-[#1E3E6E]/60' : 'bg-white border-[#E1E9F3]'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Doctor Summary
                  </span>
                  <button
                    onClick={() => setShowInfoPanel(false)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Profile Card */}
                <div className="text-center p-4 rounded-2xl bg-white/5 border border-inherit space-y-2">
                  <img
                    src={activeConv.participant.avatarUrl}
                    alt={activeConv.participant.fullName}
                    className="w-16 h-16 rounded-full object-cover mx-auto ring-2 ring-[#3185FF]"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#12345B] dark:text-white">
                      {activeConv.participant.fullName}
                    </h4>
                    <p className="text-xs text-[#3185FF] dark:text-[#64B5F6] font-semibold">
                      {activeConv.participant.specialty}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#16845B]/15 text-[#16845B] text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    <span>COUNCIL VERIFIED PRACTITIONER</span>
                  </div>
                </div>

                {/* Clinical Channel Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-inherit">
                    <span className="text-slate-400">Interaction</span>
                    <span className="font-semibold capitalize">{activeConv.type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-inherit">
                    <span className="text-slate-400">Department</span>
                    <span className="font-semibold truncate max-w-[140px]">
                      {activeConv.communityName || 'Specialty Exchange'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-inherit">
                    <span className="text-slate-400">Security</span>
                    <span className="font-semibold text-emerald-500">De-identified</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      onOpenDoctorProfile(activeConv.participant.id);
                      onClose();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#3185FF] hover:bg-[#246BCE] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>View Full Doctor Profile</span>
                  </button>

                  <button
                    onClick={() => handleReportConversation(activeConv.participant.fullName)}
                    className="w-full py-2 px-3 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Practitioner Conduct</span>
                  </button>
                </div>
              </div>

              {/* Bottom Security Standard */}
              <div className="pt-4 border-t border-inherit text-[10px] text-slate-500">
                <p>
                  Communications are protected under the AMT Doctor Knowledge Network Professional Code of Conduct.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
