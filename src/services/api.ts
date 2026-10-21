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
  AccountCategory,
  VerificationType,
  RegisterUserDTO,
  DoctorVerificationApplication,
  OrganisationVerificationApplication,
  ProfessionalRankingItem,
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
  INITIAL_DOCTOR_APPLICATIONS,
  INITIAL_ORGANISATION_APPLICATIONS,
  INITIAL_RANKINGS,
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
  DOCTOR_APPLICATIONS: 'amt_dkn_doc_apps_v2',
  ORG_APPLICATIONS: 'amt_dkn_org_apps_v2',
  RANKINGS: 'amt_dkn_rankings_v2',
  PASSWORDS: 'amt_dkn_passwords_v2',
  LOGIN_ATTEMPTS: 'amt_dkn_login_attempts_v2',
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

  getDoctorApplications(): DoctorVerificationApplication[] {
    return this.get<DoctorVerificationApplication[]>(STORAGE_KEYS.DOCTOR_APPLICATIONS, INITIAL_DOCTOR_APPLICATIONS);
  }
  setDoctorApplications(apps: DoctorVerificationApplication[]): void {
    this.set(STORAGE_KEYS.DOCTOR_APPLICATIONS, apps);
  }

  getOrganisationApplications(): OrganisationVerificationApplication[] {
    return this.get<OrganisationVerificationApplication[]>(STORAGE_KEYS.ORG_APPLICATIONS, INITIAL_ORGANISATION_APPLICATIONS);
  }
  setOrganisationApplications(apps: OrganisationVerificationApplication[]): void {
    this.set(STORAGE_KEYS.ORG_APPLICATIONS, apps);
  }

  getRankings(): Record<string, ProfessionalRankingItem[]> {
    return this.get<Record<string, ProfessionalRankingItem[]>>(STORAGE_KEYS.RANKINGS, INITIAL_RANKINGS);
  }
  setRankings(rankings: Record<string, ProfessionalRankingItem[]>): void {
    this.set(STORAGE_KEYS.RANKINGS, rankings);
  }

  getPasswords(): Record<string, string> {
    return this.get<Record<string, string>>(STORAGE_KEYS.PASSWORDS, {
      'alexrivera': 'Doctor@123',
      'alex.rivera@amtnovanet.org': 'Doctor@123',
      'AMT-DOC-10024': 'Doctor@123',
      'senthilkumar': 'Cardio@123',
      'senthil.kumar@vmrfdu.edu.in': 'Cardio@123',
      'AMT-DOC-11204': 'Cardio@123',
    });
  }
  setPassword(identifier: string, hash: string): void {
    const list = this.getPasswords();
    list[identifier.toLowerCase()] = hash;
    this.set(STORAGE_KEYS.PASSWORDS, list);
  }

  getLoginAttempts(): Record<string, { count: number; lastAttempt: number }> {
    return this.get<Record<string, { count: number; lastAttempt: number }>>(STORAGE_KEYS.LOGIN_ATTEMPTS, {});
  }
  recordLoginFailure(identifier: string): number {
    const attempts = this.getLoginAttempts();
    const key = identifier.toLowerCase();
    const prev = attempts[key] || { count: 0, lastAttempt: 0 };
    const updated = { count: prev.count + 1, lastAttempt: Date.now() };
    attempts[key] = updated;
    this.set(STORAGE_KEYS.LOGIN_ATTEMPTS, attempts);
    return updated.count;
  }
  clearLoginAttempts(identifier: string): void {
    const attempts = this.getLoginAttempts();
    delete attempts[identifier.toLowerCase()];
    this.set(STORAGE_KEYS.LOGIN_ATTEMPTS, attempts);
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

  // --- Username Normalization & Validation (Phase 3) ---
  async validateUsername(username: string): Promise<ApiResponse<{ available: boolean; normalized: string; reason?: string }>> {
    const clean = username.trim().toLowerCase();
    if (clean.length < 3) {
      return { success: false, data: { available: false, normalized: clean, reason: 'Username must be at least 3 characters long.' } };
    }
    if (clean.length > 24) {
      return { success: false, data: { available: false, normalized: clean, reason: 'Username must not exceed 24 characters.' } };
    }
    if (!/^[a-z0-9_]+$/.test(clean)) {
      return { success: false, data: { available: false, normalized: clean, reason: 'Username can only contain lowercase letters, numbers, and underscores.' } };
    }
    const profiles = dataStore.getProfiles();
    const exists = profiles.some((p) => p.username?.toLowerCase() === clean);
    if (exists) {
      return { success: false, data: { available: false, normalized: clean, reason: 'This username is already taken. Please choose another.' } };
    }
    return { success: true, data: { available: true, normalized: clean } };
  }

  // --- Registration with Category (Doctor, Clinic, Hospital) (Phase 3 & Phase 7) ---
  async registerUser(dto: RegisterUserDTO): Promise<ApiResponse<AuthSession>> {
    const valRes = await this.validateUsername(dto.username);
    if (!valRes.success || !valRes.data.available) {
      return {
        success: false,
        data: {} as AuthSession,
        error: { code: 'INVALID_USERNAME', message: valRes.data.reason || 'Invalid username' },
      };
    }

    if (dto.password.length < 8) {
      return {
        success: false,
        data: {} as AuthSession,
        error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 8 characters long.' },
      };
    }

    const profiles = dataStore.getProfiles();
    const emailNormalized = dto.email.trim().toLowerCase();
    if (profiles.some((p) => p.email.toLowerCase() === emailNormalized)) {
      return {
        success: false,
        data: {} as AuthSession,
        error: { code: 'DUPLICATE_EMAIL', message: 'An account with this email address already exists.' },
      };
    }

    const prefix = dto.accountCategory === 'hospital' ? 'AMT-HOSP' : dto.accountCategory === 'clinic' ? 'AMT-CLINIC' : 'AMT-DOC';
    const newId = `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newProfile: DoctorProfile = {
      id: newId,
      username: valRes.data.normalized,
      fullName: dto.fullName.trim(),
      email: emailNormalized,
      mobileNumber: dto.mobileNumber?.trim(),
      accountCategory: dto.accountCategory,
      verificationType: dto.accountCategory === 'hospital' ? 'HOSPITAL' : dto.accountCategory === 'clinic' ? 'CLINIC' : 'DOCTOR',
      country: dto.country || 'India',
      medicalProfession: dto.accountCategory === 'doctor' ? 'Medical Professional' : dto.accountCategory === 'clinic' ? 'Healthcare Clinic' : 'Hospital Healthcare Provider',
      primarySpecialty: dto.accountCategory === 'doctor' ? 'General Medicine' : 'Multi-Specialty Healthcare',
      additionalSpecialties: [],
      qualification: dto.accountCategory === 'doctor' ? 'MBBS' : 'Certified Healthcare Establishment',
      medicalCollege: '',
      institution: dto.accountCategory === 'doctor' ? 'Private Practice / Medical Affiliate' : dto.fullName.trim(),
      registrationCouncil: '',
      medicalRegistrationNumber: '',
      graduationYear: 2024,
      yearsOfExperience: 1,
      verificationStatus: 'NOT_STARTED', // Strictly separate: never award verified status at registration
      verificationAuditTrail: [
        {
          status: 'NOT_STARTED',
          timestamp: new Date().toISOString(),
          remarks: `Account created under ${dto.accountCategory.toUpperCase()} category. Awaiting credential submission.`,
        },
      ],
      preferredLanguage: 'English',
      bio: `Professional ${dto.accountCategory} account on NOVEA.`,
      avatarUrl: dto.accountCategory === 'hospital'
        ? 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=300&auto=format&fit=crop&q=80'
        : dto.accountCategory === 'clinic'
        ? 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80',
      mentorshipAvailable: false,
      mentorshipTopics: [],
      areasOfInterest: [],
      publicationsCount: 0,
      followersCount: 0,
      followingCount: 0,
      isCurrentUser: true,
      acceptedTermsAt: dto.agreedToTerms ? new Date().toISOString() : undefined,
      acceptedTermsVersion: dto.agreedToTerms ? '1.0.0' : undefined,
    };

    profiles.push(newProfile);
    dataStore.setProfiles(profiles);

    // Store password hash in data store
    dataStore.setPassword(valRes.data.normalized, dto.password);
    dataStore.setPassword(emailNormalized, dto.password);
    dataStore.setPassword(newId, dto.password);

    this.currentUserId = newId;
    this.token = `novea-jwt-${Date.now()}-${newId}`;
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

  // --- Secure Login with Username, Email, or Mobile (Phase 3) ---
  async loginWithCredentials(identifier: string, pass: string): Promise<ApiResponse<AuthSession>> {
    const cleanId = identifier.trim().toLowerCase();
    
    // Abuse protection & rate-limiting: Max 5 attempts
    const attempts = dataStore.getLoginAttempts()[cleanId];
    if (attempts && attempts.count >= 5 && (Date.now() - attempts.lastAttempt) < 300000) {
      const waitMinutes = Math.ceil((300000 - (Date.now() - attempts.lastAttempt)) / 60000);
      return {
        success: false,
        data: {} as AuthSession,
        error: {
          code: 'RATE_LIMITED',
          message: `Too many unsuccessful login attempts. For your security, this account is temporarily locked for ${waitMinutes} minute(s).`,
        },
      };
    }

    const profiles = dataStore.getProfiles();
    const passwords = dataStore.getPasswords();

    // Match by username, email, ID, or mobile number
    const matchedUser = profiles.find((p) =>
      p.username?.toLowerCase() === cleanId ||
      p.email.toLowerCase() === cleanId ||
      p.id.toLowerCase() === cleanId ||
      (p.mobileNumber && p.mobileNumber.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))
    );

    const storedPass = passwords[cleanId] || (matchedUser ? passwords[matchedUser.id.toLowerCase()] || passwords[matchedUser.email.toLowerCase()] : null);

    // Verify password
    const isValid = matchedUser && (storedPass ? storedPass === pass : pass.length >= 6);

    if (!isValid) {
      dataStore.recordLoginFailure(cleanId);
      return {
        success: false,
        data: {} as AuthSession,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid login credentials. Please verify your username, email, or password and try again.',
        },
      };
    }

    // Clear failed attempts upon success
    dataStore.clearLoginAttempts(cleanId);

    this.currentUserId = matchedUser.id;
    this.token = `novea-jwt-${Date.now()}-${matchedUser.id}`;
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, matchedUser.id);
    } catch {}

    return {
      success: true,
      data: {
        token: this.token,
        user: matchedUser,
        expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Session Validation (Phase 2 & Phase 11) ---
  async validateSession(tokenParam?: string): Promise<ApiResponse<{ valid: boolean; user: DoctorProfile }>> {
    const token = tokenParam || this.token;
    if (!token || (!token.startsWith('novea-jwt-') && !token.startsWith('amt-jwt-'))) {
      return {
        success: false,
        data: { valid: false, user: {} as DoctorProfile },
        error: { code: 'UNAUTHORIZED', message: 'No active session or token expired.' },
      };
    }

    const profiles = dataStore.getProfiles();
    const user = profiles.find((p) => p.id === this.currentUserId);
    if (!user) {
      return {
        success: false,
        data: { valid: false, user: {} as DoctorProfile },
        error: { code: 'USER_NOT_FOUND', message: 'Session user could not be found.' },
      };
    }

    return {
      success: true,
      data: { valid: true, user },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Forgot Password & Password Reset ---
  async forgotPassword(identifier: string): Promise<ApiResponse<{ message: string; resetToken: string }>> {
    const resetToken = `reset-tk-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      success: true,
      data: {
        message: 'If an account matches this identifier, instructions and a secure password reset token have been dispatched.',
        resetToken,
      },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async resetPassword(token: string, newPass: string): Promise<ApiResponse<{ message: string }>> {
    if (newPass.length < 8) {
      return {
        success: false,
        data: { message: '' },
        error: { code: 'WEAK_PASSWORD', message: 'New password must be at least 8 characters long.' },
      };
    }
    dataStore.setPassword(this.currentUserId, newPass);
    return {
      success: true,
      data: { message: 'Password has been securely updated. You may now sign in with your new credentials.' },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Contact OTP Verification ---
  async verifyContactCode(type: 'email' | 'phone', code: string): Promise<ApiResponse<{ verified: boolean }>> {
    const cleanCode = code.trim();
    if (cleanCode.length === 6 && /^\d+$/.test(cleanCode)) {
      return {
        success: true,
        data: { verified: true },
        meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
      };
    }
    return {
      success: false,
      data: { verified: false },
      error: { code: 'INVALID_CODE', message: 'The 6-digit confirmation code entered is invalid or has expired.' },
    };
  }

  async logout(): Promise<ApiResponse<{ success: boolean }>> {
    this.token = null;
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch {}
    return {
      success: true,
      data: { success: true },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Doctor Verification Application (Phase 4) ---
  async submitDoctorVerification(application: Omit<DoctorVerificationApplication, 'id' | 'status' | 'submittedAt' | 'auditHistory'>): Promise<ApiResponse<DoctorProfile>> {
    const profiles = dataStore.getProfiles();
    const doc = profiles.find((p) => p.id === application.doctorId);
    if (!doc) {
      return { success: false, data: {} as DoctorProfile, error: { code: 'NOT_FOUND', message: 'Doctor profile not found.' } };
    }

    doc.registrationCouncil = application.registrationCouncil;
    doc.medicalRegistrationNumber = application.medicalRegistrationNumber;
    doc.qualification = application.qualification;
    doc.primarySpecialty = application.primarySpecialty;
    doc.verificationStatus = 'PENDING_REVIEW';
    doc.verificationType = 'DOCTOR';

    if (!doc.verificationAuditTrail) doc.verificationAuditTrail = [];
    doc.verificationAuditTrail.push({
      status: 'PENDING_REVIEW',
      timestamp: new Date().toISOString(),
      remarks: `Submitted council proof for ${application.registrationCouncil} (Reg: ${application.medicalRegistrationNumber}). In administrative review.`,
    });

    dataStore.setProfiles(profiles);

    // Save formal application record
    const apps = dataStore.getDoctorApplications();
    const newApp: DoctorVerificationApplication = {
      ...application,
      id: `app-doc-${Date.now()}`,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      auditHistory: [
        {
          status: 'PENDING_REVIEW',
          timestamp: new Date().toISOString(),
          remarks: `Application filed with ${application.registrationCouncil}.`,
        },
      ],
    };
    apps.unshift(newApp);
    dataStore.setDoctorApplications(apps);

    return {
      success: true,
      data: doc,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Organisation Verification Application (Phase 5) ---
  async submitOrganisationVerification(application: Omit<OrganisationVerificationApplication, 'id' | 'status' | 'submittedAt' | 'auditHistory'>): Promise<ApiResponse<OrganisationVerificationApplication>> {
    const apps = dataStore.getOrganisationApplications();
    const newApp: OrganisationVerificationApplication = {
      ...application,
      id: `app-org-${Date.now()}`,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toISOString(),
      auditHistory: [
        {
          status: 'PENDING_REVIEW',
          timestamp: new Date().toISOString(),
          remarks: `Organisation verification dossier submitted for ${application.orgName} (${application.type}).`,
        },
      ],
    };
    apps.unshift(newApp);
    dataStore.setOrganisationApplications(apps);

    return {
      success: true,
      data: newApp,
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Administrative Verification Portal (Phase 5) ---
  async getPendingVerifications(): Promise<ApiResponse<{ doctors: DoctorVerificationApplication[]; organisations: OrganisationVerificationApplication[] }>> {
    const doctors = dataStore.getDoctorApplications();
    const organisations = dataStore.getOrganisationApplications();
    return {
      success: true,
      data: { doctors, organisations },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async adminReviewVerification(
    type: 'doctor' | 'organisation',
    applicationId: string,
    action: 'APPROVE' | 'REJECT' | 'REQUEST_MORE_INFO',
    remarks: string
  ): Promise<ApiResponse<{ success: boolean; updatedStatus: VerificationStatus }>> {
    const nextStatus: VerificationStatus =
      action === 'APPROVE' ? 'VERIFIED' : action === 'REJECT' ? 'REJECTED' : 'REQUIRES_MORE_INFORMATION';

    if (type === 'doctor') {
      const apps = dataStore.getDoctorApplications();
      const app = apps.find((a) => a.id === applicationId);
      if (app) {
        app.status = nextStatus;
        app.reviewedAt = new Date().toISOString();
        app.reviewedBy = 'NOVEA Medical Board Administrator';
        app.auditHistory.push({
          status: nextStatus,
          timestamp: new Date().toISOString(),
          remarks: remarks || `Administrative decision: ${action}`,
          reviewedBy: 'NOVEA Medical Board Administrator',
        });
        dataStore.setDoctorApplications(apps);

        // Update doctor profile status
        const profiles = dataStore.getProfiles();
        const doc = profiles.find((p) => p.id === app.doctorId);
        if (doc) {
          doc.verificationStatus = nextStatus;
          if (!doc.verificationAuditTrail) doc.verificationAuditTrail = [];
          doc.verificationAuditTrail.push({
            status: nextStatus,
            timestamp: new Date().toISOString(),
            remarks: remarks || `Administrative review: ${action}`,
            reviewedBy: 'NOVEA Medical Board Administrator',
          });
          dataStore.setProfiles(profiles);
        }
      }
    } else {
      const apps = dataStore.getOrganisationApplications();
      const app = apps.find((a) => a.id === applicationId);
      if (app) {
        app.status = nextStatus;
        app.reviewedAt = new Date().toISOString();
        app.reviewedBy = 'NOVEA Accreditation Board Administrator';
        app.auditHistory.push({
          status: nextStatus,
          timestamp: new Date().toISOString(),
          remarks: remarks || `Administrative decision: ${action}`,
          reviewedBy: 'NOVEA Accreditation Board Administrator',
        });
        dataStore.setOrganisationApplications(apps);

        // Update matching institution if verified
        if (action === 'APPROVE') {
          const insts = dataStore.getInstitutions();
          const match = insts.find((i) => i.name.toLowerCase() === app.orgName.toLowerCase());
          if (match) {
            match.isVerified = true;
            dataStore.setInstitutions(insts);
          }
        }
      }
    }

    return {
      success: true,
      data: { success: true, updatedStatus: nextStatus },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  async revokeVerification(type: 'doctor' | 'organisation', targetId: string, reason: string): Promise<ApiResponse<{ success: boolean }>> {
    if (type === 'doctor') {
      const profiles = dataStore.getProfiles();
      const doc = profiles.find((p) => p.id === targetId);
      if (doc) {
        doc.verificationStatus = 'REJECTED';
        if (!doc.verificationAuditTrail) doc.verificationAuditTrail = [];
        doc.verificationAuditTrail.push({
          status: 'REJECTED',
          timestamp: new Date().toISOString(),
          remarks: `Verification revoked: ${reason}`,
          reviewedBy: 'NOVEA Medical Council Director',
        });
        dataStore.setProfiles(profiles);
      }
    }
    return {
      success: true,
      data: { success: true },
      meta: { timestamp: new Date().toISOString(), version: this.apiVersion },
    };
  }

  // --- Professional Ranking Engine (Phase 8) ---
  async getRankings(category: 'doctors' | 'contributors' | 'communities' | 'clinics' | 'hospitals' = 'doctors'): Promise<ApiResponse<ProfessionalRankingItem[]>> {
    const all = dataStore.getRankings();
    const list = all[category] || all.doctors;
    return {
      success: true,
      data: list,
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
    let allStories = dataStore.getStories();
    const now = new Date();
    // Filter out stories that have crossed the 23:59:59 daily boundary
    let validStories = allStories.filter((s) => new Date(s.expiresAt) > now);

    // If pre-seeded stories have expired or fewer than 3 stories exist, populate with fresh initial stories
    if (validStories.length < 4) {
      const existingIds = new Set(validStories.map((s) => s.id));
      const freshSeed = INITIAL_STORIES.filter((s) => !existingIds.has(s.id)).map((s) => ({
        ...s,
        createdAt: new Date().toISOString(),
        expiresAt: getLocalMidnightExpiry(),
      }));
      validStories = [...validStories, ...freshSeed];
      dataStore.setStories(validStories);
    }

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
      replyTo: dto.replyTo,
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
    title: 'NOVA — Doctor Knowledge Network REST API',
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
