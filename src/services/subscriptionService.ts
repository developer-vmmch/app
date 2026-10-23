/**
 * NOVEA / DoctoHub Medical Network - Monthly Subscription & Usage Quota Management
 * Enforces monthly plan allowances when FEATURE_SUBSCRIPTION_ENFORCEMENT=true.
 * Defaults to free testing access during development.
 */

export type SubscriptionTier = 'FREE' | 'CHAT' | 'VOICE' | 'CHAT_VOICE' | 'UNLIMITED';

export interface PlanDetails {
  tier: SubscriptionTier;
  title: string;
  priceMonthly: string;
  maxMessagesMonthly: number; // -1 for unlimited
  maxVoiceMinsMonthly: number; // -1 for unlimited
  maxVideoMinsMonthly: number; // -1 for unlimited
  features: string[];
}

export interface UserSubscription {
  userId: string;
  tier: SubscriptionTier;
  startDate: string;
  expiresDate: string;
  usedMessagesCount: number;
  usedVoiceMins: number;
  usedVideoMins: number;
  isTestSubscription: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanDetails> = {
  FREE: {
    tier: 'FREE',
    title: 'Medical Free Tier',
    priceMonthly: '$0 / mo',
    maxMessagesMonthly: 50,
    maxVoiceMinsMonthly: 0,
    maxVideoMinsMonthly: 0,
    features: ['50 Monthly Clinical Messages', 'Public Knowledge Feed', '24h Stories Access'],
  },
  CHAT: {
    tier: 'CHAT',
    title: 'Clinical Chat Tier',
    priceMonthly: '$14.99 / mo',
    maxMessagesMonthly: -1, // Unlimited
    maxVoiceMinsMonthly: 0,
    maxVideoMinsMonthly: 0,
    features: ['Unlimited Clinical Direct Messages', 'File & Case Attachments', 'Priority Delivery'],
  },
  VOICE: {
    tier: 'VOICE',
    title: 'Voice Consult Tier',
    priceMonthly: '$29.99 / mo',
    maxMessagesMonthly: 100,
    maxVoiceMinsMonthly: 180,
    maxVideoMinsMonthly: 0,
    features: ['180 Monthly Voice Minutes', '100 Monthly Messages', 'End-to-End Encrypted Voice'],
  },
  CHAT_VOICE: {
    tier: 'CHAT_VOICE',
    title: 'Pro Consult Bundle',
    priceMonthly: '$49.99 / mo',
    maxMessagesMonthly: -1,
    maxVoiceMinsMonthly: 400,
    maxVideoMinsMonthly: 60,
    features: ['Unlimited Direct Messages', '400 Voice Consult Minutes', '60 Video Minutes'],
  },
  UNLIMITED: {
    tier: 'UNLIMITED',
    title: 'Hospital Fellowship Tier',
    priceMonthly: '$99.99 / mo',
    maxMessagesMonthly: -1,
    maxVoiceMinsMonthly: -1,
    maxVideoMinsMonthly: -1,
    features: ['Unlimited Direct Messages', 'Unlimited Voice Consults', 'Unlimited Video Consults', '24/7 Priority Support'],
  },
};

class SubscriptionService {
  private isEnforcementEnabled(): boolean {
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.VITE_FEATURE_SUBSCRIPTION_ENFORCEMENT === 'true';
      }
    } catch {}
    return false; // Default: Free access for dev/testing phase
  }

  private getStorageKey(userId: string): string {
    return `novea_subscription_${userId}`;
  }

  public getSubscription(userId: string): UserSubscription {
    try {
      const saved = localStorage.getItem(this.getStorageKey(userId));
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    const now = new Date();
    const expiry = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const defaultSub: UserSubscription = {
      userId,
      tier: 'FREE',
      startDate: now.toISOString(),
      expiresDate: expiry.toISOString(),
      usedMessagesCount: 0,
      usedVoiceMins: 0,
      usedVideoMins: 0,
      isTestSubscription: true,
    };
    this.saveSubscription(defaultSub);
    return defaultSub;
  }

  public saveSubscription(sub: UserSubscription): void {
    try {
      localStorage.setItem(this.getStorageKey(sub.userId), JSON.stringify(sub));
    } catch {}
  }

  public activateTestPlan(userId: string, tier: SubscriptionTier): UserSubscription {
    const now = new Date();
    const expiry = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const newSub: UserSubscription = {
      userId,
      tier,
      startDate: now.toISOString(),
      expiresDate: expiry.toISOString(),
      usedMessagesCount: 0,
      usedVoiceMins: 0,
      usedVideoMins: 0,
      isTestSubscription: true,
    };
    this.saveSubscription(newSub);
    return newSub;
  }

  public canSendMessage(userId: string): { allowed: boolean; remaining: number } {
    if (!this.isEnforcementEnabled()) {
      return { allowed: true, remaining: 9999 };
    }
    const sub = this.getSubscription(userId);
    const plan = SUBSCRIPTION_PLANS[sub.tier];
    if (plan.maxMessagesMonthly === -1) {
      return { allowed: true, remaining: 9999 };
    }
    const remaining = plan.maxMessagesMonthly - sub.usedMessagesCount;
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  }

  public recordMessageSent(userId: string): void {
    const sub = this.getSubscription(userId);
    sub.usedMessagesCount += 1;
    this.saveSubscription(sub);
  }

  public canMakeCall(userId: string, callType: 'audio' | 'video'): { allowed: boolean; remainingMins: number } {
    if (!this.isEnforcementEnabled()) {
      return { allowed: true, remainingMins: 9999 };
    }
    const sub = this.getSubscription(userId);
    const plan = SUBSCRIPTION_PLANS[sub.tier];
    const maxMins = callType === 'audio' ? plan.maxVoiceMinsMonthly : plan.maxVideoMinsMonthly;
    if (maxMins === -1) {
      return { allowed: true, remainingMins: 9999 };
    }
    const usedMins = callType === 'audio' ? sub.usedVoiceMins : sub.usedVideoMins;
    const remaining = maxMins - usedMins;
    return { allowed: remaining > 0, remainingMins: Math.max(0, remaining) };
  }

  public recordCallDuration(userId: string, callType: 'audio' | 'video', durationSecs: number): void {
    const sub = this.getSubscription(userId);
    const mins = Math.ceil(durationSecs / 60);
    if (callType === 'audio') {
      sub.usedVoiceMins += mins;
    } else {
      sub.usedVideoMins += mins;
    }
    this.saveSubscription(sub);
  }
}

export const subscriptionService = new SubscriptionService();
