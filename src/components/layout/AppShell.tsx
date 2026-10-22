import React from 'react';
import { DoctorProfile } from '../../types';
import { TopNavigation } from './TopNavigation';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { BottomNav } from './BottomNav';

interface Props {
  currentDoctor: DoctorProfile;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  unreadChatCount: number;
  unreadNotificationCount: number;
  onOpenChat: () => void;
  onOpenNotifications: () => void;
  onOpenMap: () => void;
  onOpenProfile: () => void;
  onOpenAuth: () => void;
  onOpenArchitecture: () => void;
  onOpenSafetyPolicy: () => void;
  onOpenCreate: () => void;
  onOpenDoctorProfile: (id: string) => void;
  onOpenMentorshipTab: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<Props> = ({
  currentDoctor,
  activeTab,
  onSelectTab,
  unreadChatCount,
  unreadNotificationCount,
  onOpenChat,
  onOpenNotifications,
  onOpenMap,
  onOpenProfile,
  onOpenAuth,
  onOpenArchitecture,
  onOpenSafetyPolicy,
  onOpenCreate,
  onOpenDoctorProfile,
  onOpenMentorshipTab,
  children,
}) => {
  const isFeedOrDashboard =
    activeTab === 'home' ||
    activeTab === 'discover' ||
    activeTab === 'mentorship' ||
    activeTab === 'communities';

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-[#0F1E36] flex flex-col antialiased">
      {/* Horizontal Top Navigation Bar */}
      <TopNavigation
        currentDoctor={currentDoctor}
        activeTab={activeTab}
        onSelectTab={onSelectTab}
        unreadChatCount={unreadChatCount}
        unreadNotificationCount={unreadNotificationCount}
        onOpenChat={onOpenChat}
        onOpenNotifications={onOpenNotifications}
        onOpenMap={onOpenMap}
        onOpenProfile={onOpenProfile}
        onOpenAuth={onOpenAuth}
        onOpenArchitecture={onOpenArchitecture}
        onOpenSafetyPolicy={onOpenSafetyPolicy}
        onOpenCreate={onOpenCreate}
      />

      {/* Main Content Workspace Container (Max 1440px Centered) */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 flex gap-6 min-h-0">
        {/* Left Navigation & Profile Summary Sidebar (Desktop >= 1024px) */}
        {isFeedOrDashboard && (
          <LeftSidebar
            currentDoctor={currentDoctor}
            activeTab={activeTab}
            onSelectTab={onSelectTab}
            onOpenProfile={onOpenProfile}
            onOpenMap={onOpenMap}
            onOpenSafetyPolicy={onOpenSafetyPolicy}
            onOpenInstitutionDetail={() => {}}
            onOpenAuth={onOpenAuth}
          />
        )}

        {/* Flexible Center Main Workspace Column */}
        <main
          className={`flex-1 flex flex-col min-w-0 ${
            isFeedOrDashboard
              ? 'max-w-full lg:max-w-[760px] xl:max-w-[780px]'
              : 'w-full'
          }`}
        >
          {children}
        </main>

        {/* Right Recommended & Medical Network Sidebar (Desktop >= 1280px) */}
        {isFeedOrDashboard && (
          <RightSidebar
            onOpenDoctorProfile={onOpenDoctorProfile}
            onOpenSpecs={onOpenArchitecture}
            onOpenMap={onOpenMap}
            onOpenChat={onOpenChat}
          />
        )}
      </div>

      {/* Mobile Sticky Bottom Navigation (Below 1024px) */}
      <div className="lg:hidden sticky bottom-0 z-30">
        <BottomNav
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          onOpenCreate={onOpenCreate}
        />
      </div>
    </div>
  );
};
