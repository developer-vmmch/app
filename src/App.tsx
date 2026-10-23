/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DoctorProfile, Post, PostType, Story, Institution } from './types';
import { api } from './services/api';
import { MobileShell } from './components/layout/MobileShell';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { FeedScreen } from './components/feed/FeedScreen';
import { DiscoverScreen } from './components/discover/DiscoverScreen';
import { PostComposerModal } from './components/composer/PostComposerModal';
import { CommunitiesScreen } from './components/communities/CommunitiesScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { MentorshipScreen } from './components/mentorship/MentorshipScreen';
import { MentorshipRequestDialog } from './components/mentorship/MentorshipRequestDialog';
import { StoryViewerModal } from './components/stories/StoryViewerModal';
import { CreateStoryModal } from './components/stories/CreateStoryModal';
import { InstitutionDetailModal } from './components/institutions/InstitutionDetailModal';
import { ChatModal } from './components/chat/ChatModal';
import { NotificationsModal } from './components/notifications/NotificationsModal';
import { AuthModal } from './components/auth/AuthModal';
import { ReportModal } from './components/safety/ReportModal';
import { ArchitectureModal } from './components/architecture/ArchitectureModal';
import { TermsModal } from './components/common/TermsModal';
import { DoctorKnowledgeMap } from './components/maps/DoctorKnowledgeMap';
import { ReelsScreen } from './components/reels/ReelsScreen';
import { useNoveaLogo } from './components/branding/useNoveaLogo';
import { LogoSettingsModal } from './components/branding/LogoSettingsModal';
import { AnimatedLaunchScreen } from './components/launch/AnimatedLaunchScreen';
import { ProfessionalRankingModal } from './components/ranking/ProfessionalRankingModal';
import { CreateMenuModal } from './components/composer/CreateMenuModal';
import { INITIAL_PROFILES } from './services/mockData';
import { SubscriptionModal } from './components/subscription/SubscriptionModal';

export default function App() {
  const [productName, setProductName] = useState('Doctor Knowledge Network');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [feedFilter, setFeedFilter] = useState<string>('all');
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile | null>(null);

  // Animated Launch Screen State
  const [isLaunchScreenActive, setIsLaunchScreenActive] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      return !window.sessionStorage.getItem('novea_launch_seen');
    }
    return true;
  });

  // Policy & Terms Consent State
  const [isPhiPolicyAccepted, setIsPhiPolicyAccepted] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Stories State
  const [stories, setStories] = useState<Story[]>([]);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);

  // Institution Modal
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  // Independent Modals
  const { activeLogo } = useNoveaLogo();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerInitialType, setComposerInitialType] = useState<PostType>('case_discussion');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
  const [isLogoSettingsOpen, setIsLogoSettingsOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<string | null>(null);

  // Mentorship dialog
  const [targetMentor, setTargetMentor] = useState<DoctorProfile | null>(null);

  // Profile view detail
  const [viewDoctorId, setViewDoctorId] = useState<string | undefined>(undefined);

  // Dynamic unread counts
  const [unreadChatCount, setUnreadChatCount] = useState(2);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(3);

  useEffect(() => {
    loadAppInitialState();
  }, []);

  const checkUserConsentStatus = async (user: DoctorProfile) => {
    const [phiRes, termsRes] = await Promise.all([
      api.getPhiPolicyStatus(user.id),
      api.getTermsStatus(user.id),
    ]);
    if (phiRes.success) {
      setIsPhiPolicyAccepted(phiRes.data.accepted);
    }
    if (termsRes.success) {
      setIsTermsAccepted(termsRes.data.accepted);
    }
  };

  const loadAppInitialState = async () => {
    try {
      const [userRes, storiesRes] = await Promise.all([
        api.getCurrentUser(),
        api.getActiveStories(),
      ]);

      if (userRes.success && userRes.data && userRes.data.id) {
        setCurrentDoctor(userRes.data);
        await checkUserConsentStatus(userRes.data);
      } else {
        const fallbackUser = INITIAL_PROFILES[0];
        setCurrentDoctor(fallbackUser);
        await checkUserConsentStatus(fallbackUser);
      }

      if (storiesRes.success && storiesRes.data) {
        setStories(storiesRes.data);
      }
    } catch (err) {
      console.warn('Initial state load error:', err);
      setCurrentDoctor(INITIAL_PROFILES[0]);
    }
  };

  const handleAcceptPhiPolicy = async () => {
    if (!currentDoctor) return { success: false, error: 'No authenticated doctor profile found' };
    const res = await api.acceptPhiPolicy('1.2.0', currentDoctor.id);
    if (res.success) {
      setIsPhiPolicyAccepted(true);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Failed to save policy acceptance' };
  };

  const handleAcceptTerms = async () => {
    if (!currentDoctor) return { success: false, error: 'No authenticated doctor profile found' };
    const res = await api.acceptTerms('2.0.0', currentDoctor.id);
    if (res.success) {
      setIsTermsAccepted(true);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Failed to record terms acceptance' };
  };

  const handleOpenInstitutionDetail = async (instId: string) => {
    const res = await api.getInstitutions();
    if (res.success) {
      const found = res.data.find((i) => i.id === instId);
      if (found) {
        setSelectedInstitution(found);
      }
    }
  };

  const handleOpenDoctorProfile = (doctorId: string) => {
    setViewDoctorId(doctorId);
    setActiveTab('profile');
  };

  const handleOpenMentorshipRequest = (doctor: DoctorProfile) => {
    setTargetMentor(doctor);
  };

  const handleReplyToStory = async (authorId: string, replyText: string) => {
    const convs = await api.getConversations();
    if (convs.success) {
      const match = convs.data.find((c) => c.participant.id === authorId) || convs.data[0];
      await api.sendMessage({
        conversationId: match.id,
        text: replyText,
      });
      setUnreadChatCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleReportContent = (postOrTitle: Post | Story | string) => {
    if (typeof postOrTitle === 'string') {
      setReportTarget(postOrTitle);
    } else if ('title' in postOrTitle && postOrTitle.title) {
      setReportTarget(postOrTitle.title);
    } else if ('caption' in postOrTitle) {
      setReportTarget(`Story: ${postOrTitle.caption}`);
    } else {
      setReportTarget('Clinical Content Review');
    }
  };

  const handleEnterApp = () => {
    setIsLaunchScreenActive(false);
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('novea_launch_seen', 'true');
    }
  };

  if (isLaunchScreenActive) {
    return (
      <AnimatedLaunchScreen
        currentDoctor={currentDoctor}
        onEnterApp={handleEnterApp}
        onOpenAuth={() => {
          setIsLaunchScreenActive(false);
          setIsAuthOpen(true);
        }}
        onContinueAsGuest={handleEnterApp}
      />
    );
  }

  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-[#0F172A]">
        <div className="flex flex-col items-center max-w-sm text-center space-y-4 animate-fadeIn">
          {/* Active NOVEA Logo */}
          <div className="h-14 flex items-center justify-center mb-1">
            {activeLogo.renderLogo({ className: 'h-10 sm:h-12 w-auto' })}
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-ping" />
            <span>Connecting to verified medical network...</span>
          </div>
        </div>
        {/* Render Auth Modal so sign in or registration is always available */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onUserChanged={async (user) => {
            setCurrentDoctor(user);
            setViewDoctorId(undefined);
            await checkUserConsentStatus(user);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      {/* Top Header: Left Profile Avatar, Center Rotating NOVEA Logo, Right Actions */}
      <TopHeader
        currentDoctor={currentDoctor}
        unreadChatCount={unreadChatCount}
        unreadNotificationCount={unreadNotificationCount}
        feedFilter={feedFilter}
        onFeedFilterChange={(f) => setFeedFilter(f)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setViewDoctorId(undefined);
          setActiveTab(tab);
        }}
        onOpenChat={() => {
          setIsChatOpen(true);
          setUnreadChatCount(0);
        }}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotificationCount(0);
        }}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onOpenProfile={() => {
          setViewDoctorId(undefined);
          setActiveTab('profile');
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSafetyPolicy={() => setIsTermsModalOpen(true)}
        onOpenMap={() => setIsMapModalOpen(true)}
        onOpenLogoSettings={() => setIsLogoSettingsOpen(true)}
        onOpenRankings={() => setIsRankingOpen(true)}
        onOpenSubscription={() => setIsSubscriptionOpen(true)}
        onReplayLaunch={() => setIsLaunchScreenActive(true)}
        onOpenCreate={() => setIsCreateMenuOpen(true)}
      />

      {/* Main Responsive Three-Column Desktop & Fluid Mobile Layout */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex gap-6">
        {/* Left Sidebar (Desktop lg+) */}
        <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
          <LeftSidebar
            currentDoctor={currentDoctor}
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setViewDoctorId(undefined);
              setActiveTab(tab);
            }}
            onOpenProfile={() => {
              setViewDoctorId(undefined);
              setActiveTab('profile');
            }}
            onOpenMap={() => setIsMapModalOpen(true)}
            onOpenSafetyPolicy={() => setIsTermsModalOpen(true)}
            onOpenInstitutionDetail={handleOpenInstitutionDetail}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenRankings={() => setIsRankingOpen(true)}
          />
        </aside>

        {/* Center Main Screen View */}
        <main className="flex-1 min-w-0 max-w-full">
          {activeTab === 'home' && (
            <FeedScreen
              currentUser={currentDoctor}
              stories={stories}
              feedFilter={feedFilter}
              isPolicyAccepted={isPhiPolicyAccepted}
              onAcceptPolicy={handleAcceptPhiPolicy}
              onOpenStory={(s) => setActiveStory(s)}
              onOpenCreateStory={() => setIsCreateStoryOpen(true)}
              onOpenAuthorProfile={handleOpenDoctorProfile}
              onOpenInstitutionDetail={handleOpenInstitutionDetail}
              onOpenMentorshipTab={() => setActiveTab('mentorship')}
              onReport={handleReportContent}
              onOpenComposer={() => setIsComposerOpen(true)}
            />
          )}

          {activeTab === 'reels' && (
            <ReelsScreen
              currentUser={currentDoctor}
              onOpenDoctorProfile={handleOpenDoctorProfile}
              onOpenChatWithAuthor={(authorId) => {
                handleOpenDoctorProfile(authorId);
              }}
            />
          )}

          {activeTab === 'discover' && (
            <DiscoverScreen
              onOpenDoctorProfile={handleOpenDoctorProfile}
              onOpenInstitutionDetail={handleOpenInstitutionDetail}
              onRequestMentorship={handleOpenMentorshipRequest}
              onOpenMap={() => setIsMapModalOpen(true)}
              onSelectCommunity={(specialty) => {
                setFeedFilter(specialty);
                setActiveTab('home');
              }}
            />
          )}

          {activeTab === 'communities' && (
            <CommunitiesScreen
              onSelectCommunityFeed={(specialty) => {
                setFeedFilter(specialty);
                setActiveTab('home');
              }}
              onOpenInstitutionDetail={handleOpenInstitutionDetail}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileScreen
              doctorId={viewDoctorId}
              onOpenInstitutionDetail={handleOpenInstitutionDetail}
              onOpenDoctorProfile={handleOpenDoctorProfile}
              onOpenMentorshipTab={() => setActiveTab('mentorship')}
              onOpenAuthModal={() => setIsAuthOpen(true)}
            />
          )}

          {activeTab === 'mentorship' && (
            <MentorshipScreen
              currentDoctor={currentDoctor}
              onOpenConversation={() => setIsChatOpen(true)}
              onOpenDoctorProfile={handleOpenDoctorProfile}
            />
          )}
        </main>

        {/* Right Sidebar (Desktop xl+) */}
        <aside className="hidden xl:block w-80 shrink-0">
          <RightSidebar
            onOpenMap={() => setIsMapModalOpen(true)}
            onOpenSpecs={() => setIsArchitectureOpen(true)}
            onOpenDoctorProfile={handleOpenDoctorProfile}
            onRequestMentorship={handleOpenMentorshipRequest}
            onOpenChat={() => setIsChatOpen(true)}
          />
        </aside>
      </div>

      {/* Exactly Five Options Bottom Navigation (Mobile & Tablet < lg) */}
      <div className="block lg:hidden sticky bottom-0 z-30">
        <BottomNav
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setViewDoctorId(undefined);
            setActiveTab(tab);
          }}
          onOpenCreate={() => setIsCreateMenuOpen(true)}
        />
      </div>

      {/* Interactive Story Viewer (with 23:59:59 local midnight expiry) */}
      <StoryViewerModal
        story={activeStory}
        currentUser={currentDoctor}
        onClose={() => setActiveStory(null)}
        onStoryDeleted={(deletedId) => {
          setStories((prev) => prev.filter((s) => s.id !== deletedId));
        }}
        onReplyToStory={handleReplyToStory}
        onReportStory={handleReportContent}
      />

      {/* Create Story Modal (Personal vs Professional, local midnight expiry) */}
      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onStoryCreated={async () => {
          const res = await api.getActiveStories();
          if (res.success) setStories(res.data);
        }}
      />

      {/* Hospital Institution Detail & Affiliation Request Modal */}
      <InstitutionDetailModal
        institution={selectedInstitution}
        currentUser={currentDoctor}
        isOpen={Boolean(selectedInstitution)}
        onClose={() => setSelectedInstitution(null)}
        onMembershipUpdated={async () => {
          const userRes = await api.getCurrentUser();
          if (userRes.success) setCurrentDoctor(userRes.data);
        }}
        onOpenDoctorProfile={handleOpenDoctorProfile}
      />

      {/* Independent Chat Inbox Modal (opened from Top-Right Header) */}
      {currentDoctor && (
        <ChatModal
          currentUser={currentDoctor}
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onOpenDoctorProfile={handleOpenDoctorProfile}
          onOpenFullMap={() => {
            setIsChatOpen(false);
            setIsMapModalOpen(true);
          }}
        />
      )}

      {/* Google Maps Medical Knowledge Circles & Hospital Networks Modal */}
      {isMapModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Google Maps Medical Knowledge Circles & Hospital Network"
          className="fixed inset-0 z-50 bg-[#070B18]/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4 animate-fadeIn"
        >
          <div className="w-full max-w-5xl h-full md:h-[90vh] md:max-h-[850px] bg-[#070D18] md:rounded-3xl overflow-hidden border border-[#16845B]/60 shadow-2xl flex flex-col">
            <DoctorKnowledgeMap
              currentUser={currentDoctor}
              onSelectDoctor={(docId) => {
                setIsMapModalOpen(false);
                handleOpenDoctorProfile(docId);
              }}
              onOpenChatWithDoctor={() => {
                setIsMapModalOpen(false);
                setIsChatOpen(true);
              }}
              onClose={() => setIsMapModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Independent Notifications Modal (opened from Top-Right Header) */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToAction={(url) => {
          if (url === 'feed') setActiveTab('home');
          if (url === 'institutions') setActiveTab('profile');
          if (url === 'profile') setActiveTab('profile');
        }}
      />

      {/* Create Knowledge Post Composer */}
      <PostComposerModal
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={() => {
          setActiveTab('home');
        }}
      />

      {/* Mentorship Request Dialog */}
      <MentorshipRequestDialog
        mentor={targetMentor}
        onClose={() => setTargetMentor(null)}
        onRequestSubmitted={() => {
          setActiveTab('mentorship');
        }}
      />

      {/* Healthcare Moderation Report Modal */}
      <ReportModal
        targetTitleOrSnippet={reportTarget || undefined}
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
      />

      {/* Doctor Authentication & Persona Switcher */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onUserChanged={async (user) => {
          setCurrentDoctor(user);
          setViewDoctorId(undefined);
          await checkUserConsentStatus(user);
        }}
      />

      {/* Terms of Service & Healthcare Professional Code of Conduct Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        currentDoctor={currentDoctor}
        onAccept={handleAcceptTerms}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Native Android Project Architecture & Deliverables Viewer */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* NOVEA Official Logo Settings & 36-Concept Rotation Gallery */}
      <LogoSettingsModal
        isOpen={isLogoSettingsOpen}
        onClose={() => setIsLogoSettingsOpen(false)}
      />

      {/* NOVEA Professional Rankings & Verification Badges Leaderboard */}
      <ProfessionalRankingModal
        isOpen={isRankingOpen}
        onClose={() => setIsRankingOpen(false)}
        onOpenDoctorProfile={handleOpenDoctorProfile}
        onOpenInstitutionDetail={handleOpenInstitutionDetail}
      />

      {/* NOVEA Unified Create Selection Menu (Story, Post, Video/Reel) */}
      <CreateMenuModal
        isOpen={isCreateMenuOpen}
        onClose={() => setIsCreateMenuOpen(false)}
        onSelectStory={() => setIsCreateStoryOpen(true)}
        onSelectPost={() => {
          setComposerInitialType('case_discussion');
          setIsComposerOpen(true);
        }}
        onSelectVideoReel={() => {
          setComposerInitialType('video');
          setIsComposerOpen(true);
        }}
      />

      {/* Subscription & Usage Quota Management Modal */}
      {currentDoctor && (
        <SubscriptionModal
          isOpen={isSubscriptionOpen}
          currentUser={currentDoctor}
          onClose={() => setIsSubscriptionOpen(false)}
        />
      )}
    </div>
  );
}
