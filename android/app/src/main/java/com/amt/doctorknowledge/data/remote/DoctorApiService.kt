package com.amt.doctorknowledge.data.remote

import com.amt.doctorknowledge.domain.model.*
import retrofit2.Response
import retrofit2.http.*

interface DoctorApiService {

    @GET("api/v1/doctors/me")
    suspend fun getCurrentUser(): Response<DoctorProfile>

    @GET("api/v1/stories")
    suspend fun getActiveStories(): Response<List<Story>>

    @POST("api/v1/stories")
    suspend fun createStory(@Body story: Story): Response<Story>

    @DELETE("api/v1/stories/{id}")
    suspend fun deleteStory(@Path("id") storyId: String): Response<Unit>

    @GET("api/v1/feed")
    suspend fun getFeed(
        @Query("specialty") specialty: String?,
        @Query("filterScope") filterScope: String?,
        @Query("page") page: Int = 1
    ): Response<List<Post>>

    @POST("api/v1/posts")
    suspend fun createPost(@Body post: Post): Response<Post>

    @POST("api/v1/posts/{id}/like")
    suspend fun toggleLike(@Path("id") postId: String): Response<Map<String, Boolean>>

    @GET("api/v1/institutions")
    suspend fun getInstitutions(): Response<List<Institution>>

    @GET("api/v1/institutions/{id}/members")
    suspend fun getInstitutionMembers(@Path("id") institutionId: String): Response<List<DoctorProfile>>

    @POST("api/v1/institutions/{id}/join")
    suspend fun requestJoinInstitution(
        @Path("id") institutionId: String,
        @Query("department") department: String
    ): Response<InstitutionMembership>

    @POST("api/v1/following/{id}")
    suspend fun toggleFollowDoctor(@Path("id") targetDoctorId: String): Response<Map<String, Any>>

    @POST("api/v1/verification/submit")
    suspend fun submitVerification(
        @Query("council") council: String,
        @Query("regNumber") regNumber: String,
        @Query("documentUrl") documentUrl: String?
    ): Response<DoctorProfile>
}
