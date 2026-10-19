import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  Building2,
  Award,
  ShieldCheck,
  MessageSquare,
  CheckCircle2,
  Settings,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[88%] flex flex-col shadow-2xl border border-[#E1E9F3] overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#E1E9F3] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EAF3FF] text-[#246BCE] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#12345B]">Notifications</h3>
              <p className="text-[11px] text-[#63738A]">
                Institutional, Council & Mentorship Updates
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#63738A] hover:text-[#12345B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-3 overflow-y-auto space-y-2.5 flex-1 bg-[#F6F9FD]">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#63738A]">No notifications.</div>
          ) : (
            notifications.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'institution_invitation':
                  case 'institution_membership_approved':
                    return <Building2 className="w-4 h-4 text-[#246BCE]" />;
                  case 'verification_status_update':
                    return <ShieldCheck className="w-4 h-4 text-[#16845B]" />;
                  case 'mentorship_request':
                  case 'mentorship_accepted':
                    return <Award className="w-4 h-4 text-[#B7791F]" />;
                  default:
                    return <MessageSquare className="w-4 h-4 text-[#246BCE]" />;
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id, notif.actionUrl)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                    notif.read
                      ? 'bg-white border-[#E1E9F3] text-[#63738A]'
                      : 'bg-white border-[#246BCE]/40 text-[#142238] shadow-2xs ring-1 ring-[#246BCE]/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-[#12345B]">
                      {getIcon()}
                      <span>{notif.title}</span>
                    </div>
                    <span className="text-[10px] text-[#63738A]">
                      {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#63738A] pl-6 leading-relaxed">
                    {notif.body}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
