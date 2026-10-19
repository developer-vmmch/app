export const DELIVERABLES_DATA = {
  roadmap: [
    {
      phase: 'Phase 1: Foundation (Current Release)',
      status: 'Implemented',
      items: [
        'Clean mobile architecture & responsive Android phone shell viewports',
        'Authentication and decoupled professional verification flow',
        'Doctor profiles with specialty, credentials, experience & verified status badges',
        'Knowledge feed with text, clinical pearls, questions, articles, polls',
        'Strict Protected Health Information (PHI) warnings & safety confirmation',
        'Post composer with tags, references, polls, and draft saving',
        'Mentorship discovery, objective-driven request submission & senior doctor review',
        '1-to-1 doctor messaging and educational resource attachment metadata',
        'Specialty communities & rules',
        'Healthcare safety reporting system (PHI breach, unverified claims)',
        'Full typed API service layer and OpenAPI 3.0 specification',
      ],
    },
    {
      phase: 'Phase 2: Community & Rich Media',
      status: 'In Progress / Ready for Backend Hookup',
      items: [
        'Vertical educational video player (Clinical Shorts) with captions and scrub controls',
        'Specialty group channel discussions',
        'Saved knowledge collections & tagging',
        'Push notifications connected to FCM / APNs gateway',
        'Medical board API automated credential verification checks',
      ],
    },
    {
      phase: 'Phase 3: Advanced Platform & Collaboration',
      status: 'Planned',
      items: [
        'Co-authored research publications & multi-author clinical guidelines',
        'Live expert Q&A rounds with interactive case polling',
        'Webinar replays with time-indexed anatomical chapters',
        'Server-side semantic search & vector embeddings for rare disease cases',
        'Automated CME (Continuing Medical Education) credit tracking',
      ],
    },
    {
      phase: 'Phase 4: Scale & Enterprise Governance',
      status: 'Planned',
      items: [
        'Global CDN for DICOM and high-resolution pathology slides',
        'Zero-trust audit logging for hospital regulatory compliance',
        'Strict data boundary isolation preventing AMT Nova HMS private EHR leaks',
        'Cross-region disaster recovery and end-to-end encrypted messaging',
      ],
    },
  ],

  screenInventory: [
    { name: 'Home / Knowledge Feed', route: 'home', description: 'Curated peer clinical feed, case discussions, polls, and questions with specialty filtering' },
    { name: 'Discover & Search', route: 'discover', description: 'Multi-facet doctor, topic, specialty, institution, and mentorship availability search' },
    { name: 'Clinical Shorts (Videos)', route: 'shorts', description: 'Vertical educational mobile video player with scrub controls, captions & clinical pearls' },
    { name: 'Create Post Composer', route: 'create', description: 'Safety-enforced composer with PHI warning, poll creator, tags, references & live preview' },
    { name: 'Communities', route: 'communities', description: 'Specialty peer hubs, member counts, departmental rules, and discussion threads' },
    { name: 'Messages & Consults', route: 'messages', description: 'Peer-to-peer and mentorship chat with attachment metadata, delivery states & retry' },
    { name: 'Mentorship Portal', route: 'mentorship', description: 'Browse mentors, submit learning objectives, senior doctor review, accept/decline, learning plan' },
    { name: 'Knowledge Library (Saved)', route: 'library', description: 'Bookmarked pearls, case discussions, polls, and educational video library' },
    { name: 'Doctor Profile & Credentials', route: 'profile', description: 'Verification badge, bio, qualifications, publications, mentorship capacity, profile editor' },
    { name: 'Notifications Center', route: 'notifications', description: 'Mentorship updates, responses, peer mentions, and credential status notices' },
  ],

  securityChecklist: [
    { rule: 'Patient PHI Zero-Tolerance', status: 'Enforced', detail: 'Mandatory checkbox acknowledgment that content contains no patient names, MRNs, dates, faces, or identifying metadata before any post submission.' },
    { rule: 'No Direct DB Exposure', status: 'Enforced', detail: 'Client never communicates directly with PostgreSQL or databases. All interactions go through typed REST /api/v1 endpoints with JWT authorization.' },
    { rule: 'Unverified Doctor Safeguards', status: 'Enforced', detail: 'Verification badges are strictly bound to backend confirmation. Unverified doctors cannot be labelled as verified.' },
    { rule: 'HMS Patient Data Isolation', status: 'Enforced', detail: 'Doctor Knowledge Network is separated by strict VPC boundary from hospital management system (AMT Nova HMS) EHR tables.' },
    { rule: 'Clinical Guideline Disclaimer', status: 'Enforced', detail: 'Prominent UI disclaimers that peer posts are for educational discussion and do not substitute for institutional protocols or emergency care.' },
    { rule: 'Content Reporting & Audit Trail', status: 'Enforced', detail: 'In-app reporting flow for privacy violations or medical misinformation with structured audit logging.' },
  ],

  incompleteFeaturesReport: [
    {
      feature: 'Production Push Notifications (FCM / APNs)',
      reason: 'Requires Google Cloud Firebase Cloud Messaging project credentials and Apple Push Notification Service certificates configured on server.',
      status: 'Simulated locally with in-app notification center and preference toggles.',
    },
    {
      feature: 'Real-time WebSocket Chat Server',
      reason: 'Requires active WebSocket daemon with SSL termination. Currently uses polling and REST message persistence.',
      status: 'REST message endpoints fully implemented with retry and delivery state metadata.',
    },
    {
      feature: 'Automated Government Medical Board Verification',
      reason: 'Requires direct API integration with national medical councils (GMC, NMC, US State Medical Boards).',
      status: 'Workflow implemented with manual/admin approval queue states: Unverified -> Pending -> Verified / Rejected.',
    },
    {
      feature: 'Cloud Media Transcoding Pipeline',
      reason: 'Raw 4K video transcoding to HLS/DASH requires background FFmpeg or AWS MediaConvert / GCP Transcoder.',
      status: 'Streams optimized web-compatible H.264/MP4 sample educational videos.',
    },
  ],
};
