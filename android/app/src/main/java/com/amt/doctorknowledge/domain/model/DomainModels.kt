package com.amt.doctorknowledge.domain.model

import kotlinx.serialization.Serializable

@Serializable
enum class VerificationStatus {
    NOT_STARTED,
    SUBMITTED,
    PENDING_REVIEW,
    VERIFIED,
    REJECTED,
    REQUIRES_MORE_INFORMATION,
    EXPIRED
}

@Serializable
enum class StoryType {
    PERSONAL,
    PROFESSIONAL
}

@Serializable
enum class StoryAudience {
    FOLLOWERS,
    APPROVED_CONNECTIONS,
    INSTITUTION,
    PRIVATE
}

@Serializable
enum class InstitutionRole {
    INSTITUTION_OWNER,
    INSTITUTION_ADMIN,
    DEPARTMENT_ADMIN,
    DOCTOR_MEMBER,
    PENDING_MEMBER
}

@Serializable
data class Story(
    val id: String,
    val authorId: String,
    val authorName: String,
    val authorAvatarUrl: String,
    val authorSpecialty: String,
    val authorVerificationStatus: VerificationStatus,
    val isInstitution: Boolean = false,
    val institutionName: String? = null,
    val storyType: StoryType,
    val caption: String,
    val mediaUrl: String? = null,
    val mediaType: String = "image",
    val audience: StoryAudience,
    val createdAt: String,
    val expiresAt: String, // Server-calculated 23:59:59 local boundary
    val viewCount: Int = 0,
    val moderationStatus: String = "APPROVED"
)

@Serializable
data class Institution(
    val id: String, // e.g. AMT-INST-VMMC-001
    val name: String,
    val verifiedWebsite: String,
    val address: String,
    val city: String,
    val state: String,
    val country: String,
    val institutionType: String,
    val officialContactEmail: String,
    val officialPhone: String,
    val departments: List<String>,
    val isVerified: Boolean,
    val logoUrl: String,
    val memberDoctorsCount: Int,
    val authorizedAdmins: List<String>
)

@Serializable
data class InstitutionMembership(
    val id: String,
    val doctorId: String,
    val institutionId: String,
    val institutionName: String,
    val institutionLogo: String,
    val department: String,
    val role: InstitutionRole,
    val status: String, // ACTIVE, PENDING_APPROVAL
    val joinedAt: String? = null
)

@Serializable
data class DoctorProfile(
    val id: String, // Stable internal account ID format: AMT-DOC-xxxx
    val fullName: String,
    val email: String,
    val mobileNumber: String? = null,
    val country: String,
    val medicalProfession: String,
    val primarySpecialty: String,
    val additionalSpecialties: List<String> = emptyList(),
    val qualification: String,
    val medicalCollege: String,
    val institution: String,
    val registrationCouncil: String, // e.g. Tamil Nadu Medical Council (TNMC)
    val medicalRegistrationNumber: String,
    val graduationYear: Int,
    val yearsOfExperience: Int,
    val verificationStatus: VerificationStatus,
    val preferredLanguage: String,
    val bio: String,
    val avatarUrl: String,
    val mentorshipAvailable: Boolean,
    val publicationsCount: Int,
    // Mandatory separation: Following and Followers are distinct from institution membership
    val followersCount: Int,
    val followingCount: Int,
    val isFollowing: Boolean = false,
    val isCurrentUser: Boolean = false
)

@Serializable
data class Post(
    val id: String,
    val authorId: String,
    val authorName: String,
    val authorSpecialty: String,
    val authorInstitution: String,
    val authorAvatarUrl: String,
    val authorVerificationStatus: VerificationStatus,
    val title: String? = null,
    val body: String,
    val postType: String,
    val specialty: String,
    val institutionId: String? = null,
    val institutionName: String? = null,
    val tags: List<String>,
    val likesCount: Int,
    val commentsCount: Int,
    val bookmarksCount: Int,
    val isLiked: Boolean = false,
    val isBookmarked: Boolean = false,
    val createdAt: String,
    val hasPatientSafetyDisclaimer: Boolean = true
)
