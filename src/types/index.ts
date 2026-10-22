export type AccountCategory = 'doctor' | 'clinic' | 'hospital';

export type VerificationType = 'DOCTOR' | 'CLINIC' | 'HOSPITAL';

export type VerificationStatus =
  | 'NOT_STARTED'
  | 'SUBMITTED'
  | 'PENDING_REVIEW'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REQUIRES_MORE_INFORMATION'
  | 'EXPIRED';

export type MentorshipStatus =
  | 'Pending'
  | 'Accepted'
  | 'Declined'
  | 'Cancelled'
  | 'Completed';

export type PostType =
  | 'knowledge_post'
  | 'clinical_question'
  | 'case_discussion'
  | 'article'
  | 'poll'
  | 'video'
  | 'clinical_pearl'
  | 'milestone'
  | 'conference_update'
  | 'institutional_announcement';

export type StoryType = 'PERSONAL' | 'PROFESSIONAL';

export type StoryAudience =
  | 'FOLLOWERS'
  | 'CLOSE_FRIENDS'
  | 'APPROVED_CONNECTIONS'
  | 'INSTITUTION'
  | 'PRIVATE';

export type InstitutionRole =
  | 'INSTITUTION_OWNER'
  | 'INSTITUTION_ADMIN'
  | 'DEPARTMENT_ADMIN'
  | 'DOCTOR_MEMBER'
  | 'PENDING_MEMBER';

export type ThemeMode = 'light' | 'dark' | 'system';

export type AnimationPreference = 'full' | 'reduced' | 'minimal';

export type AudienceVisibility = 'EVERYONE' | 'FOLLOWERS' | 'CONNECTIONS' | 'INSTITUTION_MEMBERS' | 'ONLY_ME';

export interface PrivacySettings {
  accountPrivacy: 'PUBLIC' | 'PRIVATE';
  profileDiscoverability: 'EVERYONE' | 'VERIFIED_ONLY' | 'CONNECTIONS_ONLY';
  biographyVisibility: AudienceVisibility;
  institutionVisibility: AudienceVisibility;
  qualificationsVisibility: AudienceVisibility;
  experienceVisibility: AudienceVisibility;
  followerListVisibility: AudienceVisibility;
  whoCanMessage: 'EVERYONE' | 'CONNECTIONS' | 'FOLLOWERS' | 'INSTITUTION_MEMBERS' | 'NOBODY';
  whoCanSendConnectionRequests: 'EVERYONE' | 'VERIFIED_ONLY' | 'INSTITUTION_MEMBERS';
  activityStatusVisible: boolean;
  showInExternalSearch: boolean;
  closeFriendsList: string[]; // Doctor IDs
  blockedUsers: string[]; // Doctor IDs
  mutedUsers: string[]; // Doctor IDs
}

export interface NotificationPreferences {
  directMessages: boolean;
  messageRequests: boolean;
  mentorshipRequests: boolean;
  mentorshipUpdates: boolean;
  newFollowers: boolean;
  connectionRequests: boolean;
  comments: boolean;
  replies: boolean;
  mentions: boolean;
  communityAnnouncements: boolean;
  institutionInvitations: boolean;
  verificationUpdates: boolean;
  storyInteractions: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  hideClinicalPreviewOnLockScreen: boolean; // Clinical safety requirement
}

export interface AppSettings {
  theme: ThemeMode;
  animationMode: AnimationPreference;
  privacy: PrivacySettings;
  notifications: NotificationPreferences;
  preferredLanguage: string;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl: string;
  authorSpecialty: string;
  authorVerificationStatus: VerificationStatus;
  isInstitution?: boolean;
  institutionName?: string;
  storyType: StoryType;
  caption: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  audience: StoryAudience;
  createdAt: string;
  expiresAt: string; // Server-calculated 23:59:59 local boundary
  viewCount: number;
  moderationStatus: 'APPROVED' | 'PENDING' | 'FLAGGED';
}

export interface Institution {
  id: string; // e.g. AMT-INST-VMMC-001
  name: string;
  verifiedWebsite: string;
  address: string;
  city: string;
  state: string;
  country: string;
  institutionType: 'Medical College & Hospital' | 'Specialty Institute' | 'General Hospital' | 'Research Center';
  officialContactEmail: string;
  officialPhone: string;
  departments: string[];
  isVerified: boolean;
  logoUrl: string;
  bannerUrl?: string;
  memberDoctorsCount: number;
  bedCapacity?: number;
  accreditations: string[];
  authorizedAdmins: string[];
}

export interface InstitutionMembership {
  id: string;
  doctorId: string;
  institutionId: string;
  institutionName: string;
  institutionLogo: string;
  department: string;
  role: InstitutionRole;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'INVITED' | 'REJECTED';
  joinedAt?: string;
  invitedAt?: string;
}

export interface DoctorProfile {
  id: string; // Stable internal account ID format: AMT-DOC-xxxx
  username?: string;
  fullName: string;
  email: string;
  mobileNumber?: string;
  accountCategory?: AccountCategory;
  verificationType?: VerificationType;
  country: string;
  medicalProfession: string;
  primarySpecialty: string;
  specialty?: string; // Compatibility alias
  additionalSpecialties: string[];
  qualification: string;
  medicalCollege: string;
  institution: string;
  registrationCouncil: string; // Tamil Nadu Medical Council (TNMC)
  medicalRegistrationNumber: string; // e.g. TNMC-89421
  graduationYear: number;
  yearsOfExperience: number;
  verificationStatus: VerificationStatus;
  verificationAuditTrail?: {
    status: VerificationStatus;
    timestamp: string;
    remarks: string;
    reviewedBy?: string;
  }[];
  verificationDocumentUrl?: string;
  preferredLanguage: string;
  bio: string;
  avatarUrl: string;
  mentorshipAvailable: boolean;
  mentorshipTopics: string[];
  maxMentees?: number;
  currentMenteesCount?: number;
  areasOfInterest: string[];
  publicationsCount: number;
  // Separate following and followers relationship counts
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isCurrentUser?: boolean;
  // PHI and Terms Policy Version Tracking
  acceptedPhiPolicyVersion?: string;
  acceptedPhiPolicyAt?: string;
  acceptedTermsVersion?: string;
  acceptedTermsAt?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface PollData {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  expiresAt: string;
}

export interface ReferenceLink {
  title: string;
  url: string;
  doi?: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    specialty: string;
    institution: string;
    avatarUrl: string;
    verificationStatus: VerificationStatus;
  };
  title?: string;
  body: string;
  postType: PostType;
  specialty: string;
  institutionId?: string;
  institutionName?: string;
  tags: string[];
  references?: ReferenceLink[];
  poll?: PollData;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likesCount: number;
  commentsCount: number;
  bookmarksCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  hasPatientSafetyDisclaimer: boolean;
  isClinicalGuideline?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: {
    id: string;
    fullName: string;
    specialty: string;
    avatarUrl: string;
    verificationStatus: VerificationStatus;
  };
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorSpecialty: string;
  mentorAvatarUrl: string;
  requesterId: string;
  requesterName: string;
  requesterSpecialty: string;
  requesterAvatarUrl: string;
  learningObjective: string;
  status: MentorshipStatus;
  createdAt: string;
  responseNote?: string;
  learningPlan?: {
    goal: string;
    durationWeeks: number;
    milestones: LearningMilestone[];
    recommendedResources: string[];
  };
}

export interface Community {
  id: string;
  name: string;
  specialty: string;
  description: string;
  type: 'SPECIALTY' | 'HOSPITAL_WIDE' | 'ACADEMIC' | 'JUNIOR_DOCTOR';
  institutionId?: string;
  isPrivate: boolean;
  memberCount: number;
  postCount: number;
  isJoined: boolean;
  moderators: string[];
  rules: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  createdAt: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  attachmentType?: 'article' | 'case_ref' | 'image' | 'location' | 'voice_call' | 'video_call' | 'voice_note' | 'document';
  attachmentMetadata?: {
    title: string;
    summary?: string;
    url?: string;
    lat?: number;
    lng?: number;
    address?: string;
    placeName?: string;
    isLive?: boolean;
    durationMinutes?: number;
    callDurationSeconds?: number;
    callStatus?: 'ended' | 'missed';
  };
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  reactions?: Record<string, string[]>; // emoji -> array of userIds
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participant: {
    id: string;
    fullName: string;
    specialty: string;
    avatarUrl: string;
    verificationStatus: VerificationStatus;
    isOnline?: boolean;
    lastActive?: string;
  };
  lastMessage?: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
  type: 'direct' | 'mentorship' | 'institution';
  communityName?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isTyping?: boolean;
}

export interface EducationalShort {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    specialty: string;
    avatarUrl: string;
    verificationStatus: VerificationStatus;
  };
  specialty: string;
  tags: string[];
  caption: string;
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  keyLearningPoint: string;
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type:
    | 'mentorship_request'
    | 'mentorship_accepted'
    | 'new_message'
    | 'reply_to_post'
    | 'mention'
    | 'institution_invitation'
    | 'institution_membership_approved'
    | 'community_update'
    | 'verification_status_update';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, string>;
}

export interface ModerationReport {
  id: string;
  targetType: 'post' | 'comment' | 'user' | 'story' | 'institution';
  targetId: string;
  targetTitleOrSnippet?: string;
  reason:
    | 'patient_privacy_phi'
    | 'unverified_medical_claim'
    | 'harassment_unprofessional'
    | 'commercial_solicitation'
    | 'other';
  explanation: string;
  reportedAt: string;
  status: 'submitted' | 'under_review' | 'resolved';
}

export interface RegisterDTO {
  fullName: string;
  email: string;
  mobileNumber?: string;
  country: string;
  medicalProfession: string;
  primarySpecialty: string;
  additionalSpecialties?: string[];
  qualification: string;
  medicalCollege: string;
  institution: string;
  registrationCouncil: string;
  medicalRegistrationNumber: string;
  graduationYear: number;
  preferredLanguage: string;
  verificationDocumentProvided?: boolean;
}

export interface CreatePostDTO {
  title?: string;
  body: string;
  postType: PostType;
  specialty: string;
  institutionId?: string;
  institutionName?: string;
  tags?: string[];
  references?: { title: string; url: string; doi?: string }[];
  poll?: {
    question: string;
    options: string[];
    durationDays?: number;
  };
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  videoDuration?: number;
  confirmedNoPatientPHI?: boolean;
}

export interface CreateStoryDTO {
  storyType: StoryType;
  caption: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
  audience: StoryAudience;
}

export interface CreateMentorshipRequestDTO {
  mentorId: string;
  learningObjective: string;
  proposedDurationWeeks?: number;
}

export interface RegisterUserDTO {
  fullName: string;
  username: string;
  email: string;
  mobileNumber?: string;
  password: string;
  accountCategory: AccountCategory;
  country: string;
  agreedToTerms: boolean;
}

export interface DoctorVerificationApplication {
  id: string;
  doctorId: string;
  legalName: string;
  country: string;
  registrationCouncil: string;
  medicalRegistrationNumber: string;
  primarySpecialty: string;
  qualification: string;
  medicalCollege?: string;
  graduationYear?: number;
  documentUrl?: string;
  documentName?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  auditHistory: {
    status: VerificationStatus;
    timestamp: string;
    remarks: string;
    reviewedBy?: string;
  }[];
}

export interface OrganisationVerificationApplication {
  id: string;
  applicantId: string;
  type: 'CLINIC' | 'HOSPITAL';
  orgName: string;
  country: string;
  physicalAddress: string;
  contactEmail: string;
  contactPhone: string;
  licenceNumber: string;
  regAuthority: string;
  authorizedRepresentative: string;
  representativeRole: string;
  accreditations?: string[];
  documentUrl?: string;
  documentName?: string;
  status: VerificationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  auditHistory: {
    status: VerificationStatus;
    timestamp: string;
    remarks: string;
    reviewedBy?: string;
  }[];
}

export interface ProfessionalRankingItem {
  id: string;
  rank: number;
  name: string;
  subtitle: string;
  category: 'doctors' | 'contributors' | 'communities' | 'clinics' | 'hospitals';
  avatarUrl?: string;
  verificationStatus: VerificationStatus;
  verificationType: VerificationType;
  score: number;
  metricLabel: string;
  metricValue: string | number;
  antiAbuseStatus: 'VALIDATED' | 'PROTECTED';
  badges?: string[];
}

