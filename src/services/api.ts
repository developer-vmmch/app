import {
  DoctorProfile,
  Institution,
  InstitutionMembership,
  Story,
  Post,
  Comment,
  MentorshipRequest,
  Community,
  Message,
  Conversation,
  AppNotification,
  ModerationReport,
  VerificationStatus,
  RegisterDTO,
  CreatePostDTO,
  CreateStoryDTO,
  PostType,
} from '../types';
import {
  INITIAL_PROFILES,
  INITIAL_INSTITUTIONS,
  INITIAL_MEMBERSHIPS,
  INITIAL_STORIES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_MENTORSHIP_REQUESTS,
  INITIAL_COMMUNITIES,
  INITIAL_CONVERSATIONS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  getLocalMidnightExpiry,
} from './mockData';

const STORAGE_KEYS = {
  TOKEN: 'amt_dkn_auth_token_v2',
  CURRENT_USER_ID: 'amt_dkn_current_user_id_v2',
  PROFILES: 'amt_dkn_profiles_v2',
  INSTITUTIONS: 'amt_dkn_institutions_v2',
  MEMBERSHIPS: 'amt_dkn_memberships_v2',
  STORIES: 'amt_dkn_stories_v2',
  POSTS: 'amt_dkn_posts_v2',
  COMMENTS: 'amt_dkn_comments_v2',
  MENTORSHIP: 'amt_dkn_mentorship_v2',
  COMMUNITIES: 'amt_dkn_communities_v2',
  CONVERSATIONS: 'amt_dkn_conversations_v2',
  MESSAGES: 'amt_dkn_messages_v2',
  NOTIFICATIONS: 'amt_dkn_notifications_v2',
  REPORTS: 'amt_dkn_reports_v2',
};

class DataStore {
  private mem: Record<string, string> = {};

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private get<T>(key: string, defaultVal: T): T {
    try {
      if (this.hasStorage()) {
        const data = localStorage.getItem(key);
        if (!data) {
          localStorage.setItem(key, JSON.stringify(defaultVal));
          return defaultVal;
        }
        return JSON.parse(data);
      } else {
        if (!this.mem[key]) {
          this.mem[key] = JSON.stringify(defaultVal);
          return defaultVal;
        }
        return JSON.parse(this.mem[key]);
      }
    } catch {
      return defaultVal;
    }
  }

  private set<T>(key: string, val: T): void {
    try {
      if (this.hasStorage()) {
        localStorage.setItem(key, JSON.stringify(val));
      } else {
        this.mem[key] = JSON.stringify(val);
      }
    } catch {
      this.mem[key] = JSON.stringify(val);
    }
  }

  getProfiles(): DoctorProfile[] {
    return this.get<DoctorProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  }
  setProfiles(profiles: DoctorProfile[]): void {
    this.set(STORAGE_KEYS.PROFILES, profiles);
  }

  getInstitutions(): Institution[] {
    return this.get<Institution[]>(STORAGE_KEYS.INSTITUTIONS, INITIAL_INSTITUTIONS);
  }
  setInstitutions(insts: Institution[]): void {
    this.set(STORAGE_KEYS.INSTITUTIONS, insts);
  }

  getMemberships(): InstitutionMembership[] {
    return this.get<InstitutionMembership[]>(STORAGE_KEYS.MEMBERSHIPS, INITIAL_MEMBERSHIPS);
  }
  setMemberships(mems: InstitutionMembership[]): void {
    this.set(STORAGE_KEYS.MEMBERSHIPS, mems);
  }

  getStories(): Story[] {
    return this.get<Story[]>(STORAGE_KEYS.STORIES, INITIAL_STORIES);
  }
  setStories(stories: Story[]): void {
    this.set(STORAGE_KEYS.STORIES, stories);
  }

  getPosts(): Post[] {
    return this.get<Post[]>(STORAGE_KEYS.POSTS, INITIAL_POSTS);
  }
  setPosts(posts: Post[]): void {
    this.set(STORAGE_KEYS.POSTS, posts);
  }

  getComments(): Record<string, Comment[]> {
    return this.get<Record<string, Comment[]>>(STORAGE_KEYS.COMMENTS, INITIAL_COMMENTS);
  }
  setComments(comments: Record<string, Comment[]>): void {
    this.set(STORAGE_KEYS.COMMENTS, comments);
  }

  getMentorshipRequests(): MentorshipRequest[] {
    return this.get<MentorshipRequest[]>(STORAGE_KEYS.MENTORSHIP, INITIAL_MENTORSHIP_REQUESTS);
  }
  setMentorshipRequests(reqs: MentorshipRequest[]): void {
    this.set(STORAGE_KEYS.MENTORSHIP, reqs);
  }

  getCommunities(): Community[] {
    return this.get<Community[]>(STORAGE_KEYS.COMMUNITIES, INITIAL_COMMUNITIES);
  }
  setCommunities(comms: Community[]): void {
    this.set(STORAGE_KEYS.COMMUNITIES, comms);
  }

  getConversations(): Conversation[] {
    return this.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  }
  setConversations(convs: Conversation[]): void {
    this.set(STORAGE_KEYS.CONVERSATIONS, convs);
  }

  getMessages(): Record<string, Message[]> {
    return this.get<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
  }
  setMessages(msgs: Record<string, Message[]>): void {
    this.set(STORAGE_KEYS.MESSAGES, msgs);
  }

  getNotifications(): AppNotification[] {
    return this.get<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  setNotifications(n: AppNotification[]): void {
    this.set(STORAGE_KEYS.NOTIFICATIONS, n);
  }

  getReports(): ModerationReport[] {
    return this.get<ModerationReport[]>(STORAGE_KEYS.REPORTS, []);
  }
  addReport(report: ModerationReport): void {
    const list = this.getReports();
    list.unshift(report);
    this.set(STORAGE_KEYS.REPORTS, list);
  }

  getPhiPolicyAcceptance(userId: string): { accepted: boolean; version: string; acceptedAt?: string } {
    return this.get(`amt_phi_policy_${userId}`, { accepted: false, version: '1.0.0' });
  }
  setPhiPolicyAcceptance(userId: string, data: { accepted: boolean; version: string; acceptedAt: string }): void {
    this.set(`amt_phi_policy_${userId}`, data);
  }

  getTermsAcceptance(userId: string): { accepted: boolean; version: string; acceptedAt?: string } {
    return this.get(`amt_terms_${userId}`, { accepted: false, version: '1.0.0' });
  }
  setTermsAcceptance(userId: string, data: { accepted: boolean; version: string; acceptedAt: string }): void {
    this.set(`amt_terms_${userId}`, data);
  }
}

export const dataStore = new DataStore();

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
    timestamp: string;
    version: string;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AuthSession {
  token: string;
  user: DoctorProfile;
  expiresAt: string;
}

export interface SendMessageDTO {
  conversationId: string;
  text: string;
  attachmentType?: 'article' | 'case_ref' | 'image';
  attachmentMetadata?: {
    title: string;
    summary?: string;
    url?: string;
  };
}

class ApiClient {
  private token: string | null = null;
  private currentUserId: string = 'AMT-DOC-10024';
  private apiVersion: string = 'v1';

  constructor() {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        this.token = localStorage.getItem(STORAGE_KEYS.TOKEN) || 'amt-jwt-token-tnmc-2026';
        const storedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
        if (storedUser) this.currentUserId = storedUser;
      } else {
        this.token = 'amt-jwt-token-tnmc-2026';
      }
    } catch {
      this.token = 'amt-jwt-token-tnmc-2026';
    }
  }

  public getCurrentUserId(): string {
    return this.currentUserId;
  }

  public setCurrentUserId(id: string): void {
    this.currentUserId = id;
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
      }
    } catch {}
  }

  // --- Auth & Identity ---
  async getCurrentUser(): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const user = profiles.find((p) => p.id === this.currentUserId) || profiles[0];
    return {
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async getDoctorById(id: string): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const user = profiles.find((p) => p.id === id);
    if (!user) {
      return { success: false, data: {} as DoctorProfile, error: { code: 'NOT_FOUND', message: 'Doctor not found' } };
    }
    return {
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async switchDoctorPersona(id: string): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const user = profiles.find((p) => p.id === id) || profiles[0];
    this.setCurrentUserId(user.id);
    return {
      success: true,
      data: user,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async submitVerificationRequest(dto: {
    licenseNumber: string;
    issuingCouncil: string;
    documentName?: string;
  }): Promise<ApiResponse<DoctorProfile>> {
    return this.submitVerificationProof(this.currentUserId, {
      council: dto.issuingCouncil,
      regNumber: dto.licenseNumber,
      documentUrl: dto.documentName,
    });
  }

  async login(emailOrReg: string): Promise<ApiResponse<AuthSession>> {
    const profiles = dataStore.getProfiles();
    const cleanQuery = emailOrReg.trim().toLowerCase();
    const user =
      profiles.find(
        (p) =>
          p.email.toLowerCase() === cleanQuery ||
          p.medicalRegistrationNumber.toLowerCase() === cleanQuery ||
          p.id.toLowerCase() === cleanQuery
      ) || profiles[0];

    this.currentUserId = user.id;
    this.token = `amt-jwt-${Date.now()}-${user.id}`;
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    } catch {}

    return {
      success: true,
      data: {
        token: this.token,
        user,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async register(dto: RegisterDTO): Promise<ApiResponse<AuthSession>> {
    const profiles = dataStore.getProfiles();
    // Unique backend ID format: AMT-DOC-<generated>
    const newId = `AMT-DOC-${Math.floor(10000 + Math.random() * 90000)}`;

    const initialStatus: VerificationStatus = dto.verificationDocumentProvided
      ? 'SUBMITTED'
      : dto.medicalRegistrationNumber
      ? 'PENDING_REVIEW'
      : 'NOT_STARTED';

    const newProfile: DoctorProfile = {
      id: newId,
      fullName: dto.fullName,
      email: dto.email,
      mobileNumber: dto.mobileNumber,
      country: dto.country,
      medicalProfession: dto.medicalProfession || 'Allopathic Physician',
      primarySpecialty: dto.primarySpecialty,
      additionalSpecialties: dto.additionalSpecialties || [],
      qualification: dto.qualification,
      medicalCollege: dto.medicalCollege,
      institution: dto.institution,
      registrationCouncil: dto.registrationCouncil,
      medicalRegistrationNumber: dto.medicalRegistrationNumber,
      graduationYear: dto.graduationYear,
      yearsOfExperience: Math.max(0, 2026 - dto.graduationYear),
      verificationStatus: initialStatus,
      verificationAuditTrail: [
        {
          status: initialStatus,
          timestamp: new Date().toISOString(),
          remarks: `Account created with ${dto.registrationCouncil} registration number: ${dto.medicalRegistrationNumber}`,
        },
      ],
      preferredLanguage: dto.preferredLanguage || 'English',
      bio: `${dto.primarySpecialty} specialist at ${dto.institution}.`,
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      mentorshipAvailable: false,
      mentorshipTopics: [],
      areasOfInterest: [dto.primarySpecialty],
      publicationsCount: 0,
      followersCount: 0,
      followingCount: 0,
      isCurrentUser: true,
    };

    profiles.push(newProfile);
    dataStore.setProfiles(profiles);

    this.currentUserId = newId;
    this.token = `amt-jwt-${Date.now()}-${newId}`;
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, newId);
    } catch {}

    return {
      success: true,
      data: {
        token: this.token,
        user: newProfile,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async updateProfile(id: string, updates: Partial<DoctorProfile>): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const index = profiles.findIndex((p) => p.id === id);
    if (index === -1) {
      return {
        success: false,
        data: {} as DoctorProfile,
        error: { code: 'NOT_FOUND', message: 'Doctor profile not found' },
      };
    }
    profiles[index] = { ...profiles[index], ...updates };
    dataStore.setProfiles(profiles);
    return {
      success: true,
      data: profiles[index],
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Strict Separation: Following & Followers vs Institution Membership ---
  async toggleFollowDoctor(targetDoctorId: string): Promise<ApiResponse<{ isFollowing: boolean; followersCount: number }>> {
    const profiles = dataStore.getProfiles();
    const target = profiles.find((p) => p.id === targetDoctorId);
    const currentUser = profiles.find((p) => p.id === this.currentUserId);

    if (!target || !currentUser) {
      return {
        success: false,
        data: { isFollowing: false, followersCount: 0 },
        error: { code: 'NOT_FOUND', message: 'Doctor not found' },
      };
    }

    target.isFollowing = !target.isFollowing;
    target.followersCount += target.isFollowing ? 1 : -1;
    currentUser.followingCount += target.isFollowing ? 1 : -1;

    dataStore.setProfiles(profiles);

    return {
      success: true,
      data: { isFollowing: target.isFollowing, followersCount: target.followersCount },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Professional Verification (TNMC & State Medical Councils) ---
  async submitVerificationProof(
    doctorId: string,
    details: { council: string; regNumber: string; documentUrl?: string }
  ): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const doc = profiles.find((p) => p.id === doctorId);
    if (!doc) {
      return { success: false, data: {} as DoctorProfile, error: { code: 'NOT_FOUND', message: 'Doctor not found' } };
    }

    doc.registrationCouncil = details.council;
    doc.medicalRegistrationNumber = details.regNumber;
    doc.verificationStatus = 'PENDING_REVIEW';
    if (!doc.verificationAuditTrail) doc.verificationAuditTrail = [];
    doc.verificationAuditTrail.push({
      status: 'PENDING_REVIEW',
      timestamp: new Date().toISOString(),
      remarks: `Submitted verification request for council ${details.council} (Reg No: ${details.regNumber}). In administrative review.`,
    });

    dataStore.setProfiles(profiles);
    return {
      success: true,
      data: doc,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async adminApproveVerification(doctorId: string, adminRemarks: string): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const doc = profiles.find((p) => p.id === doctorId);
    if (!doc) {
      return { success: false, data: {} as DoctorProfile, error: { code: 'NOT_FOUND', message: 'Doctor not found' } };
    }
    doc.verificationStatus = 'VERIFIED';
    if (!doc.verificationAuditTrail) doc.verificationAuditTrail = [];
    doc.verificationAuditTrail.push({
      status: 'VERIFIED',
      timestamp: new Date().toISOString(),
      remarks: adminRemarks || 'Official medical register verification completed.',
      reviewedBy: 'AMT Medical Director',
    });
    dataStore.setProfiles(profiles);
    return {
      success: true,
      data: doc,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Stories: With 23:59:59 Local Midnight Daily Expiry ---
  async getActiveStories(): Promise<ApiResponse<Story[]>> {
    const allStories = dataStore.getStories();
    const now = new Date();
    // Filter out stories that have crossed the 23:59:59 daily boundary
    const validStories = allStories.filter((s) => new Date(s.expiresAt) > now);
    return {
      success: true,
      data: validStories,
      meta: { total: validStories.length, timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async createStory(dto: CreateStoryDTO & { category?: string }): Promise<ApiResponse<Story>> {
    const userRes = await this.getCurrentUser();
    const user = userRes.data;

    // Daily Expiry Requirement: 23:59:59 local boundary followed by midnight reset
    const dailyExpiryTimestamp = getLocalMidnightExpiry();

    const storyType = (
      dto.storyType ||
      (dto.category?.toUpperCase() === 'PROFESSIONAL' ? 'PROFESSIONAL' : 'PERSONAL')
    ) as 'PERSONAL' | 'PROFESSIONAL';

    const newStory: Story = {
      id: `story-${Date.now()}`,
      authorId: user.id,
      authorName: user.fullName,
      authorAvatarUrl: user.avatarUrl,
      authorSpecialty: user.primarySpecialty,
      authorVerificationStatus: user.verificationStatus,
      storyType,
      caption: dto.caption,
      mediaUrl: dto.mediaUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
      mediaType: dto.mediaType || 'image',
      audience: dto.audience || 'FOLLOWERS',
      createdAt: new Date().toISOString(),
      expiresAt: dailyExpiryTimestamp,
      viewCount: 1,
      moderationStatus: 'APPROVED',
    };

    const stories = dataStore.getStories();
    stories.unshift(newStory);
    dataStore.setStories(stories);

    return {
      success: true,
      data: newStory,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async deleteStory(storyId: string): Promise<ApiResponse<boolean>> {
    const stories = dataStore.getStories().filter((s) => s.id !== storyId);
    dataStore.setStories(stories);
    return { success: true, data: true, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Institutions & Hospital Accounts ---
  async getInstitutions(): Promise<ApiResponse<Institution[]>> {
    const insts = dataStore.getInstitutions();
    return {
      success: true,
      data: insts,
      meta: { total: insts.length, timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async getInstitutionMemberships(doctorId?: string): Promise<ApiResponse<InstitutionMembership[]>> {
    const id = doctorId || this.currentUserId;
    const all = dataStore.getMemberships();
    const filtered = all.filter((m) => m.doctorId === id);
    return {
      success: true,
      data: filtered,
      meta: { total: filtered.length, timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async requestJoinInstitution(institutionId: string, department: string): Promise<ApiResponse<InstitutionMembership>> {
    const userRes = await this.getCurrentUser();
    const user = userRes.data;
    const insts = dataStore.getInstitutions();
    const targetInst = insts.find((i) => i.id === institutionId);

    if (!targetInst) {
      return {
        success: false,
        data: {} as InstitutionMembership,
        error: { code: 'NOT_FOUND', message: 'Hospital not found' },
      };
    }

    const newMem: InstitutionMembership = {
      id: `mem-${Date.now()}`,
      doctorId: user.id,
      institutionId: targetInst.id,
      institutionName: targetInst.name,
      institutionLogo: targetInst.logoUrl,
      department,
      role: 'PENDING_MEMBER',
      status: 'PENDING_APPROVAL',
      joinedAt: new Date().toISOString(),
    };

    const mems = dataStore.getMemberships();
    mems.push(newMem);
    dataStore.setMemberships(mems);

    return {
      success: true,
      data: newMem,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Feed & Posts ---
  async getFeed(params?: { specialty?: string; postType?: string; filterScope?: string }): Promise<ApiResponse<Post[]>> {
    let posts = dataStore.getPosts();
    if (params?.specialty && params.specialty !== 'All') {
      posts = posts.filter((p) => p.specialty.toLowerCase().includes(params.specialty!.toLowerCase()));
    }
    if (params?.postType && params.postType !== 'all') {
      posts = posts.filter((p) => p.postType === params.postType);
    }
    if (params?.filterScope === 'institutions') {
      posts = posts.filter((p) => Boolean(p.institutionId));
    }
    return {
      success: true,
      data: posts,
      meta: { total: posts.length, timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async createPost(dto: CreatePostDTO & { topicTags?: string[]; postType?: string }): Promise<ApiResponse<Post>> {
    if (dto.confirmedNoPatientPHI === false) {
      return {
        success: false,
        data: {} as Post,
        error: {
          code: 'PHI_DISCLAIMER_UNCONFIRMED',
          message: 'Author must acknowledge zero patient PHI compliance before publishing.',
        },
      };
    }
    const userRes = await this.getCurrentUser();
    const currentUser = userRes.data;

    let pollData: Post['poll'] = undefined;
    if (dto.poll && dto.poll.options.length >= 2) {
      pollData = {
        question: dto.poll.question,
        options: dto.poll.options.map((opt, i) => ({ id: `opt-${Date.now()}-${i}`, text: opt, votes: 0 })),
        totalVotes: 0,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      };
    }

    const rawType = dto.postType as string;
    const postType = (
      rawType === 'Case Discussion'
        ? 'case_discussion'
        : rawType === 'Clinical Question'
        ? 'clinical_question'
        : rawType === 'Diagnostic Poll'
        ? 'poll'
        : dto.postType || 'knowledge_post'
    ) as PostType;

    const tags = dto.tags || dto.topicTags || [];

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      author: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        specialty: currentUser.primarySpecialty,
        institution: currentUser.institution,
        avatarUrl: currentUser.avatarUrl,
        verificationStatus: currentUser.verificationStatus,
      },
      title: dto.title,
      body: dto.body,
      postType,
      specialty: dto.specialty,
      institutionId: dto.institutionId,
      institutionName: dto.institutionName,
      tags,
      references: dto.references,
      poll: pollData,
      mediaUrl: dto.mediaUrl,
      mediaType: dto.mediaType,
      likesCount: 0,
      commentsCount: 0,
      bookmarksCount: 0,
      isLiked: false,
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      hasPatientSafetyDisclaimer: true,
      isClinicalGuideline: false,
    };

    const posts = dataStore.getPosts();
    posts.unshift(newPost);
    dataStore.setPosts(posts);

    return {
      success: true,
      data: newPost,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async toggleLikePost(postId: string): Promise<ApiResponse<{ isLiked: boolean; likesCount: number }>> {
    const posts = dataStore.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return { success: false, data: { isLiked: false, likesCount: 0 }, error: { code: 'NOT_FOUND', message: 'Post not found' } };
    }
    post.isLiked = !post.isLiked;
    post.likesCount += post.isLiked ? 1 : -1;
    dataStore.setPosts(posts);
    return {
      success: true,
      data: { isLiked: post.isLiked, likesCount: post.likesCount },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async toggleBookmarkPost(postId: string): Promise<ApiResponse<{ isBookmarked: boolean; bookmarksCount: number }>> {
    const posts = dataStore.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post) {
      return { success: false, data: { isBookmarked: false, bookmarksCount: 0 }, error: { code: 'NOT_FOUND', message: 'Post not found' } };
    }
    post.isBookmarked = !post.isBookmarked;
    post.bookmarksCount += post.isBookmarked ? 1 : -1;
    dataStore.setPosts(posts);
    return {
      success: true,
      data: { isBookmarked: post.isBookmarked, bookmarksCount: post.bookmarksCount },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async votePoll(postId: string, optionIdOrIndex: string | number): Promise<ApiResponse<Post>> {
    const posts = dataStore.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (!post || !post.poll) {
      return { success: false, data: {} as Post, error: { code: 'POLL_NOT_FOUND', message: 'Poll does not exist' } };
    }
    const option = typeof optionIdOrIndex === 'number'
      ? post.poll.options[optionIdOrIndex]
      : post.poll.options.find((o) => o.id === optionIdOrIndex);
    if (!option) {
      return { success: false, data: post, error: { code: 'OPTION_NOT_FOUND', message: 'Option not found' } };
    }
    if (post.poll.userVotedOptionId) {
      return { success: false, data: post, error: { code: 'ALREADY_VOTED', message: 'Already voted' } };
    }
    option.votes += 1;
    post.poll.totalVotes += 1;
    post.poll.userVotedOptionId = option.id;
    dataStore.setPosts(posts);
    return { success: true, data: post, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Comments ---
  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    const allComments = dataStore.getComments();
    const list = allComments[postId] || [];
    return { success: true, data: list, meta: { total: list.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async addComment(postId: string, content: string): Promise<ApiResponse<Comment>> {
    const user = (await this.getCurrentUser()).data;
    const newComment: Comment = {
      id: `com-${Date.now()}`,
      postId,
      author: {
        id: user.id,
        fullName: user.fullName,
        specialty: user.primarySpecialty,
        avatarUrl: user.avatarUrl,
        verificationStatus: user.verificationStatus,
      },
      content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };
    const allComments = dataStore.getComments();
    if (!allComments[postId]) allComments[postId] = [];
    allComments[postId].push(newComment);
    dataStore.setComments(allComments);

    const posts = dataStore.getPosts();
    const post = posts.find((p) => p.id === postId);
    if (post) {
      post.commentsCount += 1;
      dataStore.setPosts(posts);
    }

    return { success: true, data: newComment, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Doctors Directory & Search ---
  async getDoctors(filter?: { specialty?: string; mentorshipOnly?: boolean; search?: string; query?: string }): Promise<ApiResponse<DoctorProfile[]>> {
    let profiles = dataStore.getProfiles();
    if (filter?.specialty && filter.specialty !== 'All') {
      profiles = profiles.filter((p) => p.primarySpecialty.toLowerCase().includes(filter.specialty!.toLowerCase()));
    }
    if (filter?.mentorshipOnly) {
      profiles = profiles.filter((p) => p.mentorshipAvailable);
    }
    const q = (filter?.search || filter?.query || '').trim().toLowerCase();
    if (q) {
      profiles = profiles.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.primarySpecialty.toLowerCase().includes(q) ||
          p.institution.toLowerCase().includes(q) ||
          p.medicalCollege.toLowerCase().includes(q) ||
          p.registrationCouncil.toLowerCase().includes(q)
      );
    }
    return { success: true, data: profiles, meta: { total: profiles.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Chat & Messages ---
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const convs = dataStore.getConversations();
    return { success: true, data: convs, meta: { total: convs.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    const msgs = dataStore.getMessages();
    const list = msgs[conversationId] || [];
    return { success: true, data: list, meta: { total: list.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async sendMessage(dto: SendMessageDTO): Promise<ApiResponse<Message>> {
    const user = (await this.getCurrentUser()).data;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: dto.conversationId,
      senderId: user.id,
      senderName: user.fullName,
      senderAvatar: user.avatarUrl,
      text: dto.text,
      createdAt: new Date().toISOString(),
      status: 'sent',
      attachmentType: dto.attachmentType,
      attachmentMetadata: dto.attachmentMetadata,
    };

    const allMsgs = dataStore.getMessages();
    if (!allMsgs[dto.conversationId]) allMsgs[dto.conversationId] = [];
    allMsgs[dto.conversationId].push(newMsg);
    dataStore.setMessages(allMsgs);

    const convs = dataStore.getConversations();
    const conv = convs.find((c) => c.id === dto.conversationId);
    if (conv) {
      conv.lastMessage = { text: dto.text, createdAt: newMsg.createdAt, senderId: user.id };
      dataStore.setConversations(convs);
    }

    return { success: true, data: newMsg, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Notifications ---
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    const notifs = dataStore.getNotifications();
    return { success: true, data: notifs, meta: { total: notifs.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    const list = dataStore.getNotifications();
    const notif = list.find((n) => n.id === id);
    if (notif) notif.read = true;
    dataStore.setNotifications(list);
    return { success: true, data: undefined as unknown as void, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Communities ---
  async getCommunities(): Promise<ApiResponse<Community[]>> {
    const comms = dataStore.getCommunities();
    return { success: true, data: comms, meta: { total: comms.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async toggleJoinCommunity(communityId: string): Promise<ApiResponse<Community>> {
    const comms = dataStore.getCommunities();
    const c = comms.find((item) => item.id === communityId);
    if (!c) {
      return { success: false, data: {} as Community, error: { code: 'NOT_FOUND', message: 'Community not found' } };
    }
    c.isJoined = !c.isJoined;
    c.memberCount += c.isJoined ? 1 : -1;
    dataStore.setCommunities(comms);
    return { success: true, data: c, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Mentorship ---
  async getMentorshipRequests(): Promise<ApiResponse<MentorshipRequest[]>> {
    const reqs = dataStore.getMentorshipRequests();
    return { success: true, data: reqs, meta: { total: reqs.length, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async createMentorshipRequest(dto: { mentorId: string; learningObjective: string }): Promise<ApiResponse<MentorshipRequest>> {
    const requester = (await this.getCurrentUser()).data;
    const profiles = dataStore.getProfiles();
    const mentor = profiles.find((p) => p.id === dto.mentorId);

    if (!mentor) {
      return { success: false, data: {} as MentorshipRequest, error: { code: 'NOT_FOUND', message: 'Mentor not found' } };
    }

    const newReq: MentorshipRequest = {
      id: `ment-${Date.now()}`,
      mentorId: mentor.id,
      mentorName: mentor.fullName,
      mentorSpecialty: mentor.primarySpecialty,
      mentorAvatarUrl: mentor.avatarUrl,
      requesterId: requester.id,
      requesterName: requester.fullName,
      requesterSpecialty: requester.primarySpecialty,
      requesterAvatarUrl: requester.avatarUrl,
      learningObjective: dto.learningObjective,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const reqs = dataStore.getMentorshipRequests();
    reqs.unshift(newReq);
    dataStore.setMentorshipRequests(reqs);
    return { success: true, data: newReq, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async updateMentorshipStatus(
    requestId: string,
    action: 'Accepted' | 'Declined' | 'Completed' | 'Cancelled'
  ): Promise<ApiResponse<MentorshipRequest>> {
    const reqs = dataStore.getMentorshipRequests();
    const req = reqs.find((r) => r.id === requestId);
    if (!req) {
      return { success: false, data: {} as MentorshipRequest, error: { code: 'NOT_FOUND', message: 'Request not found' } };
    }
    req.status = action;
    dataStore.setMentorshipRequests(reqs);
    return { success: true, data: req, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async toggleMilestone(requestId: string, milestoneId: string): Promise<ApiResponse<MentorshipRequest>> {
    const reqs = dataStore.getMentorshipRequests();
    const req = reqs.find((r) => r.id === requestId);
    if (!req || !req.learningPlan) {
      return { success: false, data: {} as MentorshipRequest, error: { code: 'NOT_FOUND', message: 'Mentorship learning plan not found' } };
    }
    const ms = req.learningPlan.milestones.find((m) => m.id === milestoneId);
    if (ms) {
      ms.completed = !ms.completed;
      dataStore.setMentorshipRequests(reqs);
    }
    return { success: true, data: req, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Clinical Shorts (Videos) ---
  async getShorts(): Promise<ApiResponse<any[]>> {
    return { success: true, data: [], meta: { total: 0, timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async toggleLikeShort(id: string): Promise<ApiResponse<any>> {
    return { success: true, data: { id, isLiked: true, likesCount: 1 }, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  async toggleBookmarkShort(id: string): Promise<ApiResponse<any>> {
    return { success: true, data: { id, isBookmarked: true, bookmarksCount: 1 }, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Reports & Moderation ---
  async submitReport(report: Omit<ModerationReport, 'id' | 'reportedAt' | 'status'>): Promise<ApiResponse<ModerationReport>> {
    const newReport: ModerationReport = {
      ...report,
      id: `rep-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      status: 'submitted',
    };
    dataStore.addReport(newReport);
    return { success: true, data: newReport, meta: { timestamp: new Date().toISOString(), version: this.apiVersion } };
  }

  // --- Strict PHI Policy & Terms Acceptance Lifecycle ---
  async getPhiPolicyStatus(userId?: string): Promise<
    ApiResponse<{
      accepted: boolean;
      version: string;
      currentRequiredVersion: string;
      acceptedAt?: string;
    }>
  > {
    const uid = userId || this.currentUserId;
    const currentRequiredVersion = '1.2.0';
    const record = dataStore.getPhiPolicyAcceptance(uid);
    const accepted = Boolean(record.accepted && record.version === currentRequiredVersion);
    return {
      success: true,
      data: {
        accepted,
        version: record.version,
        currentRequiredVersion,
        acceptedAt: record.acceptedAt,
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async acceptPhiPolicy(
    version = '1.2.0',
    userId?: string
  ): Promise<ApiResponse<{ accepted: boolean; version: string; acceptedAt: string }>> {
    const uid = userId || this.currentUserId;
    const acceptedAt = new Date().toISOString();
    dataStore.setPhiPolicyAcceptance(uid, {
      accepted: true,
      version,
      acceptedAt,
    });

    // Mirror to active profile
    const profiles = dataStore.getProfiles();
    const idx = profiles.findIndex((p) => p.id === uid);
    if (idx !== -1) {
      profiles[idx] = {
        ...profiles[idx],
        acceptedPhiPolicyVersion: version,
        acceptedPhiPolicyAt: acceptedAt,
      };
      dataStore.setProfiles(profiles);
    }

    return {
      success: true,
      data: {
        accepted: true,
        version,
        acceptedAt,
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async getTermsStatus(userId?: string): Promise<
    ApiResponse<{
      accepted: boolean;
      version: string;
      currentRequiredVersion: string;
      acceptedAt?: string;
    }>
  > {
    const uid = userId || this.currentUserId;
    const currentRequiredVersion = '2.0.0';
    const record = dataStore.getTermsAcceptance(uid);
    const accepted = Boolean(record.accepted && record.version === currentRequiredVersion);
    return {
      success: true,
      data: {
        accepted,
        version: record.version,
        currentRequiredVersion,
        acceptedAt: record.acceptedAt,
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async acceptTerms(
    version = '2.0.0',
    userId?: string
  ): Promise<ApiResponse<{ accepted: boolean; version: string; acceptedAt: string }>> {
    const uid = userId || this.currentUserId;
    const acceptedAt = new Date().toISOString();
    dataStore.setTermsAcceptance(uid, {
      accepted: true,
      version,
      acceptedAt,
    });

    const profiles = dataStore.getProfiles();
    const idx = profiles.findIndex((p) => p.id === uid);
    if (idx !== -1) {
      profiles[idx] = {
        ...profiles[idx],
        acceptedTermsVersion: version,
        acceptedTermsAt: acceptedAt,
      };
      dataStore.setProfiles(profiles);
    }

    return {
      success: true,
      data: {
        accepted: true,
        version,
        acceptedAt,
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }
}

export const api = new ApiClient();

export const OPENAPI_SPECIFICATION = {
  openapi: '3.0.3',
  info: {
    title: 'AMT Tech Nova — Doctor Knowledge Network REST API',
    version: '1.0.0',
    description:
      'Shared, secure, versioned API for Doctor Knowledge Network mobile and web clients. Powers peer learning, verified professional credentials (TNMC/NMC/GMC), daily 23:59:59 boundary stories, institution accounts, and strict separation between followers and hospital membership.',
  },
  servers: [{ url: '/api/v1', description: 'Primary API Gateway' }],
  paths: {
    '/auth/register': {
      post: { summary: 'Register doctor with registration council and certificate number' },
    },
    '/auth/login': {
      post: { summary: 'Authenticate doctor via email, phone, or verified registration ID' },
    },
    '/stories': {
      get: { summary: 'Active stories with 23:59:59 local boundary filtering' },
      post: { summary: 'Publish Personal or Professional Story with audience scope' },
    },
    '/institutions': {
      get: { summary: 'List verified hospital and medical college institutions' },
    },
    '/institutions/{id}/members': {
      get: { summary: 'List verified doctor members and department roles' },
      post: { summary: 'Request to join hospital department' },
    },
    '/following/{id}': {
      post: { summary: 'Toggle follow doctor (Strictly separated from hospital membership)' },
    },
    '/verification/submit': {
      post: { summary: 'Submit TNMC / State Medical Council registration details for review' },
    },
    '/feed': {
      get: { summary: 'Paginated clinical knowledge feed' },
    },
    '/posts': {
      post: { summary: 'Create knowledge post with patient PHI de-identification certification' },
    },
    '/conversations': {
      get: { summary: 'List 1-to-1, group, and institution conversations' },
    },
    '/notifications': {
      get: { summary: 'List clinical, mentorship, and institution notifications' },
    },
    '/reports': {
      post: { summary: 'Submit audit report for patient privacy or unverified claim' },
    },
  },
};
