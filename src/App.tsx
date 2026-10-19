/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DoctorProfile, Post, Story, Institution } from './types';
import { api } from './services/api';
import { MobileShell } from './components/layout/MobileShell';
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
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

export default function App() {
  const [productName, setProductName] = useState('Doctor Knowledge Network');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [feedFilter, setFeedFilter] = useState<string>('all');
  const [currentDoctor, setCurrentDoctor] = useState<DoctorProfile | null>(null);

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
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
    const [userRes, storiesRes] = await Promise.all([
      api.getCurrentUser(),
      api.getActiveStories(),
    ]);

    if (userRes.success) {
      setCurrentDoctor(userRes.data);
      await checkUserConsentStatus(userRes.data);
    }
    if (storiesRes.success) setStories(storiesRes.data);
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

  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-[#12345B] flex items-center justify-center text-white text-xs">
        Loading AMT Doctor Knowledge Network...
      </div>
    );
  }

  return (
    <MobileShell
      productName={productName}
      onUpdateProductName={(name) => setProductName(name)}
      onOpenSpecs={() => setIsArchitectureOpen(true)}
    >
      {/* Top Header: Left Feed Title, Right Independent Chat & Notifications */}
      <TopHeader
        currentDoctor={currentDoctor}
        unreadChatCount={unreadChatCount}
        unreadNotificationCount={unreadNotificationCount}
        feedFilter={feedFilter}
        onFeedFilterChange={(f) => setFeedFilter(f)}
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
      />

      {/* Main Screen View (based on bottom nav) */}
      <main className="flex-1 flex flex-col min-h-0 relative">
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
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverScreen
            onOpenDoctorProfile={handleOpenDoctorProfile}
            onOpenInstitutionDetail={handleOpenInstitutionDetail}
            onRequestMentorship={handleOpenMentorshipRequest}
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

      {/* Exactly Five Options Bottom Navigation (Section 6) */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setViewDoctorId(undefined);
          setActiveTab(tab);
        }}
        onOpenCreate={() => setIsComposerOpen(true)}
      />

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
      <ChatModal
        currentUser={currentDoctor}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenDoctorProfile={handleOpenDoctorProfile}
      />

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
    </MobileShell>
  );
}
