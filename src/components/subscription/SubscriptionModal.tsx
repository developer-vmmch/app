import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  MessageSquare,
  Phone,
  Video,
  Award,
  CreditCard,
} from 'lucide-react';
import { DoctorProfile } from '../../types';
import {
  subscriptionService,
  SUBSCRIPTION_PLANS,
  SubscriptionTier,
  UserSubscription,
} from '../../services/subscriptionService';

interface Props {
  isOpen: boolean;
  currentUser: DoctorProfile;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<Props> = ({
  isOpen,
  currentUser,
  onClose,
}) => {
  const [sub, setSub] = useState<UserSubscription>(() =>
    subscriptionService.getSubscription(currentUser.id)
  );

  if (!isOpen) return null;

  const currentPlan = SUBSCRIPTION_PLANS[sub.tier];

  const handleActivateTestTier = (tier: SubscriptionTier) => {
    const updated = subscriptionService.activateTestPlan(currentUser.id, tier);
    setSub(updated);
  };

  const calculatePercent = (used: number, max: number) => {
    if (max === -1) return 100;
    if (max === 0) return 0;
    return Math.min(100, Math.round((used / max) * 100));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070B18]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#CBD5E1] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#1D4ED8] to-[#0D9488] text-white flex items-center justify-center shadow-md">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  Medical Communication Subscriptions
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px] font-bold uppercase">
                  Test Subscription Mode
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Monthly direct messaging, voice consults & video calling quotas
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#64748B] hover:text-[#0F172A] cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Active Plan Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0F1E36] to-[#081122] text-white space-y-4 border border-[#1E3E6E] shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-wider block">
                Active Medical Tier
              </span>
              <h3 className="text-lg font-extrabold text-white">{currentPlan.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-[#22C55E]">{currentPlan.priceMonthly}</span>
              <span className="text-[10px] text-[#94A3B8] block">Renews {new Date(sub.expiresDate).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Quota Progress Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-white/10">
            {/* Messages */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Messages</span>
                </span>
                <span className="font-bold text-white">
                  {currentPlan.maxMessagesMonthly === -1 ? 'Unlimited' : `${sub.usedMessagesCount} / ${currentPlan.maxMessagesMonthly}`}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#38BDF8] h-full rounded-full transition-all duration-500"
                  style={{ width: `${calculatePercent(sub.usedMessagesCount, currentPlan.maxMessagesMonthly)}%` }}
                />
              </div>
            </div>

            {/* Voice Mins */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>Voice Consults</span>
                </span>
                <span className="font-bold text-white">
                  {currentPlan.maxVoiceMinsMonthly === -1 ? 'Unlimited' : `${sub.usedVoiceMins} / ${currentPlan.maxVoiceMinsMonthly}m`}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                  style={{ width: `${calculatePercent(sub.usedVoiceMins, currentPlan.maxVoiceMinsMonthly)}%` }}
                />
              </div>
            </div>

            {/* Video Mins */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Video className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Video Consults</span>
                </span>
                <span className="font-bold text-white">
                  {currentPlan.maxVideoMinsMonthly === -1 ? 'Unlimited' : `${sub.usedVideoMins} / ${currentPlan.maxVideoMinsMonthly}m`}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#A855F7] h-full rounded-full transition-all duration-500"
                  style={{ width: `${calculatePercent(sub.usedVideoMins, currentPlan.maxVideoMinsMonthly)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test Mode Plan Switcher */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Activate Test Subscription Tier
            </h4>
            <span className="text-[10px] text-[#64748B]">Google Play Billing Ready Architecture</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {(Object.keys(SUBSCRIPTION_PLANS) as SubscriptionTier[]).map((tierKey) => {
              const plan = SUBSCRIPTION_PLANS[tierKey];
              const isSelected = sub.tier === tierKey;
              return (
                <div
                  key={tierKey}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#1D4ED8] bg-[#EFF6FF] ring-2 ring-[#1D4ED8]/30 shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0F172A]">{plan.title}</span>
                      <span className="text-xs font-bold text-[#1D4ED8]">{plan.priceMonthly}</span>
                    </div>
                    <ul className="text-[11px] text-[#64748B] space-y-0.5 pt-1">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-[#16845B] shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleActivateTestTier(tierKey)}
                    disabled={isSelected}
                    className={`w-full mt-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#16845B] text-white cursor-default'
                        : 'bg-[#1D4ED8] hover:bg-[#1E40AF] text-white'
                    }`}
                  >
                    {isSelected ? 'Active Tier' : 'Switch to Tier'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-[#14B8A6]" />
            <span>Server-side Quota Verification & Play Billing Compliant</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0F172A] text-white text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
