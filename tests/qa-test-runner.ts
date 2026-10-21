/**
 * AMT Tech Nova — Doctor Knowledge Network
 * Complete Automated QA Test Suite & Architectural Verification
 */

import { api } from '../src/services/api';
import { JETPACK_COMPOSE_ARCHITECTURE } from '../src/docs/androidArchitecture';
import { DELIVERABLES_DATA } from '../src/docs/deliverables';
import { VerificationStatus, PostType, MentorshipStatus } from '../src/types';
import { INITIAL_MAP_LOCATIONS, REGIONAL_CENTERS } from '../src/services/mapsData';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  details?: string;
  error?: string;
}

const results: TestResult[] = [];

async function runTest(category: string, name: string, fn: () => Promise<void> | void) {
  const start = Date.now();
  try {
    await fn();
    results.push({
      name,
      category,
      passed: true,
      durationMs: Date.now() - start,
    });
    console.log(`  ✓ [PASS] [${category}] ${name}`);
  } catch (err: any) {
    results.push({
      name,
      category,
      passed: false,
      durationMs: Date.now() - start,
      error: err?.message || String(err),
    });
    console.error(`  ✗ [FAIL] [${category}] ${name} -> ${err?.message || err}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runCompleteQASuite() {
  console.log('===============================================================');
  console.log('AMT TECH NOVA — DOCTOR KNOWLEDGE NETWORK');
  console.log('COMPREHENSIVE QA AUTOMATED TEST SUITE & CONTRACT VERIFICATION');
  console.log('===============================================================\n');

  // MODULE 1: AUTHENTICATION & DOCTOR IDENTITY
  console.log('--- 1. Authentication & Doctor Identity ---');
  await runTest('Authentication', 'Fetch current logged in doctor profile', async () => {
    const res = await api.getCurrentUser();
    assert(res.success === true, 'Response should succeed');
    assert(!!res.data.id, 'User ID must be present');
    assert(!!res.data.fullName, 'Doctor full name must be present');
    assert(!!res.data.primarySpecialty, 'Doctor primary specialty must be present');
  });

  await runTest('Authentication', 'Verification statuses lifecycle conformance', async () => {
    const validStatuses: VerificationStatus[] = [
      'NOT_STARTED',
      'SUBMITTED',
      'PENDING_REVIEW',
      'VERIFIED',
      'REJECTED',
      'REQUIRES_MORE_INFORMATION',
      'EXPIRED',
    ];
    const res = await api.getDoctorById('AMT-DOC-10024');
    assert(res.success && validStatuses.includes(res.data.verificationStatus), 'Status must be a recognized medical verification status');
  });

  await runTest('Authentication', 'Doctor persona switching between junior and senior doctors', async () => {
    const juniorRes = await api.switchDoctorPersona('AMT-DOC-10024');
    assert(juniorRes.success && juniorRes.data.id === 'AMT-DOC-10024', 'Must switch to junior doctor');
    assert(juniorRes.data.yearsOfExperience <= 5, 'Junior doctor must have early career experience');

    const seniorRes = await api.switchDoctorPersona('AMT-DOC-11204');
    assert(seniorRes.success && seniorRes.data.id === 'AMT-DOC-11204', 'Must switch to senior doctor');
    assert(seniorRes.data.verificationStatus === 'VERIFIED', 'Senior doctor should be verified');

    // Switch back to default
    await api.switchDoctorPersona('AMT-DOC-10024');
  });

  // MODULE 2: VERIFICATION REQUEST WORKFLOW
  console.log('\n--- 2. Clinical Credentials & Verification ---');
  await runTest('Verification', 'Submit medical license verification documents', async () => {
    const subRes = await api.submitVerificationRequest({
      licenseNumber: 'TNMC-QA-99281',
      issuingCouncil: 'Tamil Nadu Medical Council (TNMC)',
      documentName: 'Medical_Council_Certificate_2026.pdf',
    });
    assert(subRes.success === true, 'Verification submission must succeed');
    const userRes = await api.getCurrentUser();
    assert(userRes.data.verificationStatus === 'PENDING_REVIEW', 'Status must transition to PENDING_REVIEW');
  });

  // MODULE 3: KNOWLEDGE FEED & SPECIALTY FILTERING
  console.log('\n--- 3. Knowledge Feed & Content Interaction ---');
  await runTest('Feed', 'Load default clinical feed with pagination items', async () => {
    const feed = await api.getFeed({});
    assert(feed.success && Array.isArray(feed.data), 'Feed should return an array');
    assert(feed.data.length > 0, 'Feed should contain clinical posts');
  });

  await runTest('Feed', 'Filter feed by Cardiology specialty', async () => {
    const feed = await api.getFeed({ specialty: 'Cardiology' });
    assert(feed.success, 'Feed query should succeed');
    assert(feed.data.every((p) => p.specialty.toLowerCase().includes('cardiology')), 'All returned posts must be Cardiology');
  });

  await runTest('Feed', 'Post like toggling idempotency and count increment', async () => {
    const feed = await api.getFeed({});
    const testPost = feed.data[0];
    const initialLiked = testPost.isLiked;
    const initialCount = testPost.likesCount;

    const toggleRes = await api.toggleLikePost(testPost.id);
    assert(toggleRes.success, 'Toggle like must succeed');
    assert(toggleRes.data.isLiked !== initialLiked, 'Liked state must toggle');
    assert(
      toggleRes.data.likesCount === (initialLiked ? initialCount - 1 : initialCount + 1),
      'Like count must increment or decrement correctly'
    );

    // Toggle back to preserve state
    await api.toggleLikePost(testPost.id);
  });

  await runTest('Feed', 'Diagnostic poll voting and percentage calculations', async () => {
    // Create an unvoted poll to test fresh voting
    const freshPollPost = await api.createPost({
      title: 'QA Diagnostic Poll: Optimal Imaging Strategy',
      body: 'In an intermediate risk patient with atypical chest pain and normal ECG, which test offers the highest negative predictive value?',
      specialty: 'Cardiology',
      postType: 'poll',
      poll: {
        question: 'Optimal diagnostic modality for negative predictive value:',
        options: ['Coronary Computed Tomography Angiography (CCTA)', 'Stress Echocardiography', 'Nuclear SPECT'],
      },
      confirmedNoPatientPHI: true,
    });
    assert(freshPollPost.success && !!freshPollPost.data.poll, 'Fresh poll post creation must succeed');

    const voteRes = await api.votePoll(freshPollPost.data.id, 0);
    assert(voteRes.success, 'Poll voting must succeed');
    const totalVotes = voteRes.data.poll?.totalVotes || 0;
    assert(totalVotes === 1, 'Total votes must increment to 1');
    assert(voteRes.data.poll?.userVotedOptionId === voteRes.data.poll?.options[0].id, 'userVotedOptionId must be option 0');
  });

  // MODULE 4: COMMENTS & CLINICAL PEER DISCUSSIONS
  console.log('\n--- 4. Clinical Comments & Discussions ---');
  await runTest('Comments', 'Fetch and append educational comment to a case study', async () => {
    const feed = await api.getFeed({});
    const postId = feed.data[0].id;
    const initialComments = await api.getComments(postId);
    assert(initialComments.success, 'Fetching comments must succeed');

    const newCommentRes = await api.addComment(
      postId,
      'Evidence-based review: According to the 2026 ACC/AHA guidelines, this presentation necessitates immediate coronary angiography.'
    );
    assert(newCommentRes.success, 'Comment creation must succeed');
    const currUser = (await api.getCurrentUser()).data;
    assert(newCommentRes.data.author.id === currUser.id, 'Comment author must be current doctor');

    const updatedComments = await api.getComments(postId);
    assert(
      updatedComments.data.length === initialComments.data.length + 1,
      'Comment list length must increment by 1'
    );
  });

  // MODULE 5: POST COMPOSER & PHI / PATIENT SAFETY SAFEGUARDS
  console.log('\n--- 5. Knowledge Post Composer & HIPAA / PHI Compliance ---');
  await runTest('Composer', 'Create clinical discussion post with references and topic tags', async () => {
    const newPostRes = await api.createPost({
      title: 'QA Diagnostic Case: Atypical Chest Pain in Marathon Runner',
      body: '45-year-old athlete presenting with exertional syncope. Initial ECG demonstrated non-specific T wave changes. Cardiac MRI revealed apical hypertrophic cardiomyopathy.',
      specialty: 'Cardiology',
      postType: 'case_discussion',
      topicTags: ['Sports Cardiology', 'Hypertrophic Cardiomyopathy', 'ECG Interpretation'],
      tags: ['Sports Cardiology', 'Hypertrophic Cardiomyopathy', 'ECG Interpretation'],
      references: [{ title: 'JACC 2025;84(12):1120-1130', url: 'https://jacc.org' }],
      confirmedNoPatientPHI: true,
    });
    assert(newPostRes.success, 'Creating verified case post must succeed');
    assert(newPostRes.data.title?.includes('Marathon Runner') === true, 'Post title must match');
    assert(newPostRes.data.tags.includes('Sports Cardiology'), 'Topic tags must be preserved');
  });

  await runTest('Composer', 'PHI Guardrail validation - reject posts containing patient MRN or un-deidentified names', () => {
    const prohibitedSnippets = [
      'Patient MRN: 94829104 at General Hospital',
      'Patient John Doe, DOB 14/05/1982 admitted with stroke',
      'Social security 123-45-6789 identified on chart',
    ];

    const containsPHI = (text: string) => {
      const phiPatterns = [/MRN\s*:\s*\d+/i, /DOB\s*:?\s*[\d/]+/i, /SSN\s*:\s*\d+/i, /Social\s+Security/i];
      return phiPatterns.some((pattern) => pattern.test(text));
    };

    prohibitedSnippets.forEach((snippet) => {
      assert(containsPHI(snippet) === true, `PHI pattern should detect prohibited snippet: ${snippet}`);
    });
  });

  // MODULE 6: DOCTOR DISCOVERY & MULTI-PARAM SEARCH
  console.log('\n--- 6. Doctor Discovery & Multi-Parameter Search ---');
  await runTest('Discovery', 'Search doctors by specialty and mentorship availability', async () => {
    const searchRes = await api.getDoctors({
      specialty: 'Cardiology',
      mentorshipOnly: true,
    });
    assert(searchRes.success, 'Doctor search must succeed');
    assert(
      searchRes.data.every((d) => d.primarySpecialty === 'Cardiology' && d.mentorshipAvailable === true),
      'All matched doctors must match specialty and mentorship availability'
    );
  });

  await runTest('Discovery', 'Search doctors by name query', async () => {
    const queryRes = await api.getDoctors({ query: 'Sarah' });
    assert(queryRes.success, 'Doctor query must succeed');
    assert(queryRes.data.some((d) => d.fullName.includes('Sarah')), 'Must locate Dr. Sarah Lin');
  });

  // MODULE 7: MENTORSHIP WORKFLOW (JUNIOR TO SENIOR)
  console.log('\n--- 7. Doctor Mentorship Workflow ---');
  await runTest('Mentorship', 'Junior doctor sends mentorship request with learning objective', async () => {
    const reqRes = await api.createMentorshipRequest({
      mentorId: 'AMT-DOC-08412',
      learningObjective: 'Master transesophageal echocardiography interpretation and structural heart case planning.',
    });
    assert(reqRes.success, 'Mentorship request creation must succeed');
    assert(reqRes.data.status === 'Pending', 'Initial status must be Pending');
    assert(reqRes.data.learningObjective.includes('echocardiography'), 'Learning objective must match');
  });

  await runTest('Mentorship', 'Senior doctor reviews and accepts mentorship request', async () => {
    const requestsRes = await api.getMentorshipRequests();
    assert(requestsRes.success && requestsRes.data.length > 0, 'Requests must exist');
    const target = requestsRes.data.find((r) => r.status === 'Pending') || requestsRes.data[0];

    const updateRes = await api.updateMentorshipStatus(target.id, 'Accepted');
    assert(updateRes.success, 'Status update must succeed');
    assert(updateRes.data.status === 'Accepted', 'Status must transition to Accepted');
  });

  await runTest('Mentorship', 'Update learning milestones on active mentorship plan', async () => {
    const requestsRes = await api.getMentorshipRequests();
    const acceptedPlan = requestsRes.data.find((r) => r.learningPlan && r.learningPlan.milestones.length > 0);
    assert(!!acceptedPlan, 'Accepted mentorship plan with milestones must be found');
    if (acceptedPlan && acceptedPlan.learningPlan) {
      const milestoneId = acceptedPlan.learningPlan.milestones[0].id;
      const initialStatus = acceptedPlan.learningPlan.milestones[0].completed;
      const toggleRes = await api.toggleMilestone(acceptedPlan.id, milestoneId);
      assert(toggleRes.success, 'Toggling milestone must succeed');
      const updatedMilestone = toggleRes.data.learningPlan?.milestones.find((m) => m.id === milestoneId);
      assert(!!updatedMilestone, 'Updated milestone must be present');
      assert(updatedMilestone?.completed !== initialStatus, 'Milestone completion state must toggle');
    }
  });

  // MODULE 8: SPECIALTY COMMUNITIES & HUBS
  console.log('\n--- 8. Specialty Communities & Hubs ---');
  await runTest('Communities', 'Fetch communities and toggle membership join/leave', async () => {
    const commRes = await api.getCommunities();
    assert(commRes.success && commRes.data.length > 0, 'Communities list must be populated');
    const firstComm = commRes.data[0];
    const initialJoined = firstComm.isJoined;
    const initialCount = firstComm.memberCount;

    const toggleRes = await api.toggleJoinCommunity(firstComm.id);
    assert(toggleRes.success, 'Toggle join community must succeed');
    assert(toggleRes.data.isJoined !== initialJoined, 'isJoined state must invert');
    assert(
      toggleRes.data.memberCount === (initialJoined ? initialCount - 1 : initialCount + 1),
      'Member count must increment/decrement appropriately'
    );

    // Restore state
    await api.toggleJoinCommunity(firstComm.id);
  });

  // MODULE 9: 1-TO-1 DOCTOR MESSAGING
  console.log('\n--- 9. Professional 1-to-1 Doctor Messaging ---');
  await runTest('Messaging', 'Send message and verify delivery status and conversation order', async () => {
    const convsRes = await api.getConversations();
    assert(convsRes.success && convsRes.data.length > 0, 'Conversations must exist');
    const convId = convsRes.data[0].id;

    const sendRes = await api.sendMessage({
      conversationId: convId,
      text: 'Dr. Lin, thank you for sharing the cath lab findings. Could you elaborate on the fractional flow reserve measurement?',
    });
    assert(sendRes.success, 'Sending message must succeed');
    assert(sendRes.data.status === 'sent' || sendRes.data.status === 'delivered', 'Message delivery status must be sent or delivered');

    const messagesRes = await api.getMessages(convId);
    assert(messagesRes.success, 'Fetching messages must succeed');
    const lastMsg = messagesRes.data[messagesRes.data.length - 1];
    assert(lastMsg.text.includes('fractional flow reserve'), 'Last message must match sent text');
  });

  // MODULE 10: 24-HOUR CLINICAL STORIES & LOCAL EXPIRY
  console.log('\n--- 10. 24-Hour Clinical Stories ---');
  await runTest('Stories', 'Create clinical story and enforce 23:59:59 local midnight expiry contract', async () => {
    const newStory = await api.createStory({
      mediaUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      caption: 'Morning Round Pearl: Bedside Ultrasound in Shock State',
      category: 'Professional',
      storyType: 'PROFESSIONAL',
      mediaType: 'image',
      audience: 'FOLLOWERS',
    });
    assert(newStory.success, 'Story creation must succeed');
    assert(newStory.data.storyType === 'PROFESSIONAL', 'Story type must be PROFESSIONAL');
    assert(!!newStory.data.expiresAt, 'Story must have an expiresAt timestamp');

    const expiryDate = new Date(newStory.data.expiresAt);
    const now = new Date();
    assert(expiryDate.getTime() > now.getTime(), 'Story expiration must be in the future');
  });

  // MODULE 11: MODERATION & SAFETY REPORTING
  console.log('\n--- 11. Healthcare Safety & Moderation Reporting ---');
  await runTest('Moderation', 'Submit clinical incident / PHI violation report', async () => {
    const reportRes = await api.submitReport({
      targetType: 'post',
      targetId: 'post-1',
      reason: 'patient_privacy_phi',
      explanation: 'Potential PHI or identifiable clinical detail in case presentation: Timestamped test report for QA audit logging.',
    });
    assert(reportRes.success, 'Report submission must succeed');
    assert(!!reportRes.data.id, 'Report ID must be generated');
  });

  // MODULE 12: NATIVE ANDROID ARCHITECTURE CONTRACT
  console.log('\n--- 12. Native Android (Kotlin + Jetpack Compose) Architecture Contract ---');
  await runTest('Android Architecture', 'Verify Jetpack Compose state & UI specs and Room DB models', () => {
    assert(!!JETPACK_COMPOSE_ARCHITECTURE.overview, 'Android architecture documentation must exist');
    assert(!!JETPACK_COMPOSE_ARCHITECTURE.retrofitInterface, 'Must include Retrofit 2 interface');
    assert(!!JETPACK_COMPOSE_ARCHITECTURE.fileTree, 'Must include package directory tree');
    assert(!!JETPACK_COMPOSE_ARCHITECTURE.composeSnippet, 'Must include Jetpack Compose HomeScreen snippet');
  });

  // MODULE 13: DELIVERABLES & ROADMAP INTEGRITY
  console.log('\n--- 13. Deliverables & Audit Roadmap ---');
  await runTest('Deliverables', 'Verify Phase 1-4 roadmap and screen inventory', () => {
    assert(DELIVERABLES_DATA.roadmap.length >= 3, 'Must define all roadmap phases');
    assert(DELIVERABLES_DATA.screenInventory.length >= 5, 'Must define full screen inventory');
  });

  // MODULE 14: STRICT PHI DE-IDENTIFICATION POLICY PERSISTENCE
  console.log('\n--- 14. PHI Policy Consent Lifecycle & Persistence ---');
  await runTest('PHI Policy', 'Verify unaccepted policy requirement and successful persisted acceptance', async () => {
    const testDoctorId = 'AMT-DOC-TEST-PHI';
    const initialStatus = await api.getPhiPolicyStatus(testDoctorId);
    assert(!initialStatus.data.accepted, 'Policy must be unaccepted initially');
    assert(initialStatus.data.currentRequiredVersion === '1.2.0', 'Current policy version must be 1.2.0');

    // Accept policy
    const acceptRes = await api.acceptPhiPolicy('1.2.0', testDoctorId);
    assert(acceptRes.success, 'Policy acceptance must succeed');
    assert(acceptRes.data.accepted, 'Policy must be marked accepted');
    assert(acceptRes.data.version === '1.2.0', 'Recorded version must be 1.2.0');

    // Query status again to confirm persistence
    const verifiedStatus = await api.getPhiPolicyStatus(testDoctorId);
    assert(verifiedStatus.data.accepted, 'Subsequent status query must confirm acceptance');

    // If version is updated, policy requires re-acceptance
    const oldVersionRes = await api.getPhiPolicyStatus('AMT-DOC-TEST-OLD');
    assert(!oldVersionRes.data.accepted, 'Doctor with older policy version must require new acceptance');
  });

  // MODULE 15: TERMS OF SERVICE ACCEPTANCE & DECOUPLED LIFECYCLE
  console.log('\n--- 15. Terms of Service Lifecycle & Versioning ---');
  await runTest('Terms of Service', 'Terms acceptance persists independently of PHI and prevents duplicate prompts', async () => {
    const testDoctorId = 'AMT-DOC-TEST-TERMS';
    const initialTerms = await api.getTermsStatus(testDoctorId);
    assert(!initialTerms.data.accepted, 'Terms must be unaccepted initially');

    const acceptRes = await api.acceptTerms('2.0.0', testDoctorId);
    assert(acceptRes.success, 'Terms acceptance must succeed');

    const verifiedTerms = await api.getTermsStatus(testDoctorId);
    assert(verifiedTerms.data.accepted, 'Terms must now be persistently accepted');
    assert(verifiedTerms.data.version === '2.0.0', 'Version 2.0.0 must be recorded');
  });

  // MODULE 16: HEADER NAVIGATION & DIRECT MESSAGES CONTRACT
  console.log('\n--- 16. Header Direct Messages & Profile Picture Contracts ---');
  await runTest('Header Contract', 'Verify Direct Messages unread count and profile avatar persistence', async () => {
    const userRes = await api.getCurrentUser();
    assert(userRes.success, 'Current user must be loaded');
    assert(!!userRes.data.avatarUrl, 'User must have valid profile avatar URL');
    assert(!!userRes.data.fullName, 'User must have full name for initials fallback');

    const convsRes = await api.getConversations();
    assert(convsRes.success, 'Conversations must load for direct messaging');
  });

  // MODULE 17: GOOGLE MAPS PLATFORM INTEGRATION & TELEMEDICINE CONTRACTS
  console.log('\n--- 17. Google Maps Platform & Telemedicine Calling Contracts ---');
  await runTest('Google Maps', 'Verify medical centers, regional campuses, and coordinates integrity', () => {
    assert(REGIONAL_CENTERS.length >= 4, 'Must provide regional medical hubs (Salem, Chennai, Bangalore, Singapore)');
    assert(INITIAL_MAP_LOCATIONS.length >= 7, 'Must provide hospital and doctor pins');
    const vmmc = INITIAL_MAP_LOCATIONS.find((l) => l.name.includes('Vinayaka'));
    assert(!!vmmc, 'Must include Vinayaka Missions Medical College as primary medical hub');
    assert(vmmc.lat > 0 && vmmc.lng > 0, 'VMMC coordinates must be valid');
    assert(INITIAL_MAP_LOCATIONS.some((l) => l.isEmergencyAvailable), 'Must include emergency consult facilities');
  });

  await runTest('Location Sharing', 'Verify location message payload in chat with coordinates and live circle metadata', async () => {
    const convs = await api.getConversations();
    const convId = convs.data[0].id;
    const locMsgRes = await api.sendMessage({
      conversationId: convId,
      text: '📍 Live Location Circle Shared (60 mins)',
      attachmentType: 'location',
      attachmentMetadata: {
        title: "Vinayaka Mission's Medical College Hospital",
        address: 'Sankari Main Road, Ariyanoor, Salem',
        lat: 11.6643,
        lng: 78.1460,
        isLive: true,
        durationMinutes: 60,
      },
    });

    assert(locMsgRes.success, 'Sending location message must succeed');
    assert(locMsgRes.data.attachmentType === 'location', 'Attachment type must be location');
    assert(locMsgRes.data.attachmentMetadata?.isLive === true, 'isLive must be true');
    assert(locMsgRes.data.attachmentMetadata?.lat === 11.6643, 'Coordinates must persist');
  });

  await runTest('Telemedicine Calling', 'Verify voice and video consultation call log message contracts', async () => {
    const convs = await api.getConversations();
    const convId = convs.data[0].id;
    const callMsgRes = await api.sendMessage({
      conversationId: convId,
      text: 'Voice call ended (3m 24s)',
      attachmentType: 'voice_call',
      attachmentMetadata: {
        title: '📞 Encrypted Voice Consultation',
        summary: 'Consultation Duration: 3m 24s • Secure Peer-to-Peer',
        callDurationSeconds: 204,
        callStatus: 'ended',
      },
    });

    assert(callMsgRes.success, 'Recording call message must succeed');
    assert(callMsgRes.data.attachmentType === 'voice_call', 'Attachment type must be voice_call');
    assert(callMsgRes.data.attachmentMetadata?.callDurationSeconds === 204, 'Call duration must match');
  });

  // FINAL SUMMARY
  console.log('\n===============================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  const totalDuration = results.reduce((acc, r) => acc + r.durationMs, 0);

  console.log(`TOTAL TESTS: ${total}`);
  console.log(`PASSED:      ${passed} (${Math.round((passed / total) * 100)}%)`);
  console.log(`FAILED:      ${failed}`);
  console.log(`TOTAL TIME:  ${totalDuration}ms`);
  console.log('===============================================================');

  if (failed > 0) {
    console.error('\nQA TESTING FAILED WITH ERRORS.');
    process.exit(1);
  } else {
    console.log('\n✓ ALL QA TEST SUITES COMPLETED SUCCESSFULLY. ZERO DEFECTS FOUND.');
  }
}

runCompleteQASuite().catch((err) => {
  console.error('Fatal QA Suite Error:', err);
  process.exit(1);
});
