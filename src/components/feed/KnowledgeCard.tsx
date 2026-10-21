import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Calendar,
  MessageSquare,
  X,
  ChevronRight,
  ExternalLink,
  Award,
  CheckCircle2,
} from 'lucide-react';

export interface KnowledgeItem {
  id: string;
  type: 'cme' | 'guideline' | 'case_study' | 'conference' | 'discussion';
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction?: string;
  credits?: string;
  icon: 'cme' | 'guideline' | 'case' | 'conference' | 'discussion';
}

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'k-1',
    type: 'guideline',
    badge: 'Clinical Practice Update',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    title: '2026 ACC/AHA HFpEF Guideline Update',
    description: 'Updated class 1A recommendations on SGLT2-inhibitor titration and ARNI regimens in preserved ejection fraction.',
    primaryAction: 'Review Guidelines',
    icon: 'guideline',
  },
  {
    id: 'k-2',
    type: 'cme',
    badge: 'Accredited CME Module',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    title: 'Acute Ischemic Stroke: Extended Window Endovascular Thrombectomy',
    description: 'Interactive case simulations evaluating perfusion mismatch criteria. Earn 2.0 AMA PRA Category 1 Credits™.',
    primaryAction: 'Earn CME Credits',
    credits: '2.0 CME Credits',
    icon: 'cme',
  },
  {
    id: 'k-3',
    type: 'case_study',
    badge: 'Grand Rounds Case',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    title: 'Rare Presentation: Takotsubo vs. Acute LAD Occlusion',
    description: 'Multimodality imaging breakdown with cardiac MRI and coronary angiogram review by interventional fellows.',
    primaryAction: 'Explore Cases',
    icon: 'case',
  },
  {
    id: 'k-4',
    type: 'conference',
    badge: 'Live Clinical Summit',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    title: 'Cardiovascular Innovations 2026 Tele-Symposium',
    description: 'Live structural heart case broadcast tomorrow from Vinayaka Mission Hospital cath lab at 3:00 PM EST.',
    primaryAction: 'Join Discussion',
    icon: 'conference',
  },
];

interface Props {
  onActionClick?: (item: KnowledgeItem) => void;
  onExploreCases?: () => void;
}

export const KnowledgeCard: React.FC<Props> = ({ onActionClick, onExploreCases }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('nova_knowledge_card_dismissed') === 'true';
  });

  if (isDismissed) return null;

  const currentItem = KNOWLEDGE_ITEMS[currentIndex % KNOWLEDGE_ITEMS.length];

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('nova_knowledge_card_dismissed', 'true');
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % KNOWLEDGE_ITEMS.length);
  };

  const handlePrimaryAction = () => {
    if (currentItem.type === 'case_study' && onExploreCases) {
      onExploreCases();
    } else if (onActionClick) {
      onActionClick(currentItem);
    }
  };

  const renderIcon = () => {
    switch (currentItem.icon) {
      case 'cme':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'guideline':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'case':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'conference':
        return <Calendar className="w-5 h-5 text-amber-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-teal-600" />;
    }
  };

  return (
    <div
      role="region"
      aria-label="Clinical Knowledge and CME Update"
      className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs relative overflow-hidden transition-all duration-300"
    >
      {/* Top row with badge, indicator & dismiss */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${currentItem.badgeColor}`}
          >
            {currentItem.badge}
          </span>
          {currentItem.credits && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
              <Award className="w-3 h-3 text-blue-600" />
              {currentItem.credits}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleNext}
            title="Next clinical update"
            className="text-[11px] font-semibold text-[#64748B] hover:text-[#1D4ED8] px-2 py-0.5 rounded-lg hover:bg-[#F8FAFC] transition-colors"
          >
            {currentIndex + 1} of {KNOWLEDGE_ITEMS.length} • Next
          </button>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss this update"
            title="Dismiss card"
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-3 mt-2">
        <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0 mt-0.5">
          {renderIcon()}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-[#0F172A] leading-snug">
            {currentItem.title}
          </h4>
          <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
            {currentItem.description}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#F1F5F9]">
            <button
              onClick={handlePrimaryAction}
              className="px-3.5 py-1.5 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-2xs active:scale-95 flex items-center gap-1.5"
            >
              <span>{currentItem.primaryAction}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#475569] text-xs font-semibold border border-[#E2E8F0] transition-colors"
            >
              More Clinical Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
