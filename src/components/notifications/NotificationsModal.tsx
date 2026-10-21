import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Building2,
  Award,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { AppNotification } from '../../types';
import { api } from '../../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToAction: (actionUrl?: string) => void;
}

export const NotificationsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onNavigateToAction,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentorship' | 'clinical'>('all');

  useEffect(() => {
    if (isOpen) {
      loadNotifs();
    }
  }, [isOpen]);

  const loadNotifs = async () => {
    const res = await api.getNotifications();
    if (res.success) {
      setNotifications(res.data);
    }
  };

  const handleMarkRead = async (id: string, actionUrl?: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (actionUrl) {
      onNavigateToAction(actionUrl);
      onClose();
    }
  };

  const handleMarkAllRead = async () => {
    await Promise.all(notifications.filter((n) => !n.read).map((n) => api.markNotificationRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'mentorship') return n.type.includes('mentorship');
    if (filter === 'clinical') return n.type.includes('institution') || n.type.includes('verification');
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl border border-[#E2E8F0] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#1D4ED8] border border-[#DBEAFE] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#0F172A]">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold bg-[#1D4ED8] text-white px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B]">
                Institutional, Council & Mentorship Updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] px-2 py-1 rounded-lg hover:bg-[#EFF6FF] transition-colors"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="px-5 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all' as const, label: 'All' },
            { id: 'unread' as const, label: 'Unread' },
            { id: 'mentorship' as const, label: 'Mentorship' },
            { id: 'clinical' as const, label: 'Hospital & Credentials' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filter === tab.id
                  ? 'bg-[#1D4ED8] text-white shadow-2xs'
                  : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 bg-[#FAFCFF]">
          {filtered.length === 0 ? (
            <div className="py-14 text-center text-xs text-[#64748B] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <p className="font-semibold">All caught up! No notifications in this category.</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'institution_invitation':
                  case 'institution_membership_approved':
                    return <Building2 className="w-4 h-4 text-[#1D4ED8]" />;
                  case 'verification_status_update':
                    return <ShieldCheck className="w-4 h-4 text-[#16A34A]" />;
                  case 'mentorship_request':
                  case 'mentorship_accepted':
                    return <Award className="w-4 h-4 text-[#D97706]" />;
                  default:
                    return <MessageSquare className="w-4 h-4 text-[#1D4ED8]" />;
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id, notif.actionUrl)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all space-y-1.5 ${
                    notif.read
                      ? 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                      : 'bg-white border-[#1D4ED8]/40 text-[#0F172A] shadow-xs ring-1 ring-[#1D4ED8]/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                      <div className="p-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                        {getIcon()}
                      </div>
                      <span className="truncate">{notif.title}</span>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] shrink-0 font-medium">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    {notif.body}
                  </p>
                  {notif.actionUrl && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8]">
                      <span>Respond / View Update</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
