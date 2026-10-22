import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Paperclip,
  AlertCircle,
  FileText,
  Clock,
  MoreVertical,
  Flag,
  UserX,
  Stethoscope,
} from 'lucide-react';
import { Conversation, Message, DoctorProfile } from '../../types';
import { api } from '../../services/api';
import { VerificationBadge } from '../common/VerificationBadge';

interface Props {
  currentDoctor: DoctorProfile;
  initialConversationPartnerId?: string | null;
  onOpenDoctorProfile: (id: string) => void;
  onReportDoctor: (name: string) => void;
}

export const MessagesScreen: React.FC<Props> = ({
  currentDoctor,
  initialConversationPartnerId,
  onOpenDoctorProfile,
  onReportDoctor,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoadingConv(true);
    const res = await api.getConversations();
    if (res.success) {
      setConversations(res.data);
      if (initialConversationPartnerId) {
        const found = res.data.find(
          (c) => c.participant.id === initialConversationPartnerId
        );
        if (found) {
          selectConversation(found);
        }
      }
    }
    setLoadingConv(false);
  };

  const selectConversation = async (conv: Conversation) => {
    setActiveConversation(conv);
    setLoadingMsgs(true);
    const res = await api.getMessages(conv.id);
    if (res.success) {
      setMessages(res.data);
    }
    setLoadingMsgs(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeConversation || sending) return;

    setSending(true);
    const textToSend = newMessageText.trim();
    setNewMessageText('');

    const res = await api.sendMessage({
      conversationId: activeConversation.id,
      text: textToSend,
    });

    setSending(false);
    if (res.success) {
      setMessages((prev) => [...prev, res.data]);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950">
      {activeConversation ? (
        /* Active Chat View */
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat Header */}
          <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setActiveConversation(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOpenDoctorProfile(activeConversation.participant.id)}
                className="flex items-center gap-2 text-left min-w-0"
              >
                <img
                  src={activeConversation.participant.avatarUrl}
                  alt={activeConversation.participant.fullName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-100 truncate">
                      {activeConversation.participant.fullName}
                    </span>
                    <VerificationBadge
                      status={activeConversation.participant.verificationStatus}
                      showText={false}
                    />
                  </div>
                  <span className="text-[10px] text-teal-400 block truncate">
                    {activeConversation.participant.specialty} · Mentorship Channel
                  </span>
                </div>
              </button>
            </div>

            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-7 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 py-1 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onReportDoctor(activeConversation.participant.fullName);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-slate-700/70 flex items-center gap-2"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Conversation</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0 bg-slate-950">
            {/* Clinical Chat Safety Notice */}
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 text-center">
              Encrypted collegiate channel. Do not transmit unencrypted patient MRN or facial records.
            </div>

            {loadingMsgs ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading messages...</div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.senderId === currentDoctor.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-tr-sm'
                          : 'bg-slate-800 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.text}</p>

                      {/* Attachment Metadata Card */}
                      {msg.attachmentMetadata && (
                        <div className="mt-2 p-2 rounded-lg bg-slate-950/40 border border-slate-700/40 space-y-1 text-left">
                          <div className="flex items-center gap-1.5 font-medium text-[11px] text-teal-300">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{msg.attachmentMetadata.title}</span>
                          </div>
                          {msg.attachmentMetadata.summary && (
                            <p className="text-[10px] text-slate-300 leading-snug">
                              {msg.attachmentMetadata.summary}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 px-1">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMe && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3 h-3 text-teal-400 inline" />
                          ) : (
                            <Check className="w-3 h-3 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-2.5 bg-slate-900 border-t border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Type message to doctor..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!newMessageText.trim() || sending}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white disabled:opacity-40 transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Conversations List View */
        <div className="flex-1 flex flex-col min-h-0">
          <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-teal-950 text-teal-400 border border-teal-800/60">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                  Doctor Consults & Mentorship Chat
                </h2>
                <p className="text-[10px] text-slate-400">
                  1-on-1 collegiate exchanges and case study reviews
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80 min-h-0">
            {loadingConv ? (
              <div className="py-12 text-center text-xs text-slate-400">Loading inbox...</div>
            ) : conversations.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No active conversations.</div>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConversation(conv)}
                  className="w-full p-3.5 flex items-start gap-3 hover:bg-slate-900/60 transition-colors text-left"
                >
                  <img
                    src={conv.participant.avatarUrl}
                    alt={conv.participant.fullName}
                    className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-slate-200 truncate">
                          {conv.participant.fullName}
                        </span>
                        <VerificationBadge status={conv.participant.verificationStatus} showText={false} />
                      </div>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-slate-500 shrink-0">
                          {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-teal-400 font-medium block truncate">
                      {conv.participant.specialty}
                    </span>
                    {conv.lastMessage && (
                      <p className="text-xs text-slate-400 truncate mt-1">
                        {conv.lastMessage.text}
                      </p>
                    )}
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
