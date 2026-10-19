export const JETPACK_COMPOSE_ARCHITECTURE = {
  overview: `
# AMT Tech Nova — Doctor Knowledge Network
## Native Android (Kotlin + Jetpack Compose) Architecture Specification

### 1. Technology Stack
- **Language**: Kotlin 2.0+
- **UI Toolkit**: Jetpack Compose (Material3 Medical Theme)
- **Architecture**: Clean Architecture + MVVM (Model-View-ViewModel) + Unidirectional Data Flow (UDF)
- **Dependency Injection**: Hilt / Dagger
- **Networking**: Retrofit 2 + OkHttp 4 (with Bearer Token Authenticator & Offline Interceptor)
- **Serialization**: Kotlinx Serialization (strict type safety)
- **Coroutines & Reactive State**: Kotlin Coroutines + StateFlow / SharedFlow
- **Local Cache & Storage**: Room Database + Jetpack DataStore (Encrypted for auth session)
- **Navigation**: Jetpack Compose Navigation (\`androidx.navigation:navigation-compose\`)
- **Image & Media**: Coil Compose (asynchronous de-identified clinical image caching)
`,

  fileTree: `
app/
 ├── src/main/java/com/amtnct/doctorknowledge/
 │    ├── data/
 │    │    ├── local/
 │    │    │    ├── AppDatabase.kt
 │    │    │    ├── dao/ (PostDao.kt, ProfileDao.kt, MentorshipDao.kt)
 │    │    │    └── preferences/UserSessionStore.kt
 │    │    ├── remote/
 │    │    │    ├── ApiClient.kt
 │    │    │    ├── DoctorApiService.kt (Retrofit interface for /api/v1/*)
 │    │    │    ├── AuthInterceptor.kt
 │    │    │    └── dto/ (PostDto.kt, DoctorProfileDto.kt, MentorshipDto.kt)
 │    │    └── repository/
 │    │         ├── PostRepositoryImpl.kt
 │    │         ├── MentorshipRepositoryImpl.kt
 │    │         └── ProfileRepositoryImpl.kt
 │    ├── domain/
 │    │    ├── model/ (DoctorProfile.kt, Post.kt, MentorshipRequest.kt)
 │    │    └── usecase/
 │    │         ├── GetKnowledgeFeedUseCase.kt
 │    │         ├── SubmitPostUseCase.kt
 │    │         └── RequestMentorshipUseCase.kt
 │    ├── ui/
 │    │    ├── theme/ (Color.kt, Type.kt, Theme.kt)
 │    │    ├── navigation/ (NavRoutes.kt, AppNavHost.kt, BottomNavBar.kt)
 │    │    ├── components/
 │    │    │    ├── ClinicalSafetyBanner.kt
 │    │    │    ├── VerificationBadge.kt
 │    │    │    └── PostCard.kt
 │    │    ├── screens/
 │    │    │    ├── home/ (HomeScreen.kt, HomeViewModel.kt)
 │    │    │    ├── discover/ (DiscoverScreen.kt, DiscoverViewModel.kt)
 │    │    │    ├── composer/ (PostComposerScreen.kt, ComposerViewModel.kt)
 │    │    │    ├── mentorship/ (MentorshipScreen.kt, MentorshipViewModel.kt)
 │    │    │    ├── communities/ (CommunitiesScreen.kt, CommunitiesViewModel.kt)
 │    │    │    ├── messages/ (MessagesScreen.kt, MessagesViewModel.kt)
 │    │    │    ├── shorts/ (ClinicalShortsScreen.kt, ShortsViewModel.kt)
 │    │    │    └── profile/ (ProfileScreen.kt, ProfileViewModel.kt)
 │    └── di/ (AppModule.kt, NetworkModule.kt, RepositoryModule.kt)
`,

  retrofitInterface: `
package com.amtnct.doctorknowledge.data.remote

import com.amtnct.doctorknowledge.data.remote.dto.*
import retrofit2.Response
import retrofit2.http.*

interface DoctorApiService {
    @POST("api/v1/auth/register")
    suspend fun register(@Body request: RegisterRequestDto): Response<AuthResponseDto>

    @POST("api/v1/auth/login")
    suspend fun login(@Body request: LoginRequestDto): Response<AuthResponseDto>

    @GET("api/v1/feed")
    suspend fun getFeed(
        @Query("specialty") specialty: String?,
        @Query("postType") postType: String?,
        @Query("page") page: Int,
        @Query("limit") limit: Int
    ): Response<FeedResponseDto>

    @POST("api/v1/posts")
    suspend fun createPost(@Body request: CreatePostRequestDto): Response<PostDto>

    @POST("api/v1/posts/{id}/like")
    suspend fun toggleLike(@Path("id") postId: String): Response<LikeResponseDto>

    @GET("api/v1/mentorship/requests")
    suspend fun getMentorshipRequests(): Response<List<MentorshipRequestDto>>

    @POST("api/v1/mentorship/requests")
    suspend fun createMentorshipRequest(@Body request: CreateMentorshipDto): Response<MentorshipRequestDto>

    @PATCH("api/v1/mentorship/requests/{id}/status")
    suspend fun updateMentorshipStatus(
        @Path("id") requestId: String,
        @Body request: MentorshipStatusUpdateDto
    ): Response<MentorshipRequestDto>

    @POST("api/v1/reports")
    suspend fun submitReport(@Body request: ReportRequestDto): Response<ReportResponseDto>
}
`,

  composeSnippet: `
package com.amtnct.doctorknowledge.ui.screens.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.amtnct.doctorknowledge.ui.components.ClinicalSafetyBanner
import com.amtnct.doctorknowledge.ui.components.PostCard

@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onNavigateToPostDetail: (String) -> Unit,
    onNavigateToDoctorProfile: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Doctor Knowledge Network") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {
            // Patient PHI Safety Reminder
            ClinicalSafetyBanner(
                message = "Protected Health Information Warning: Never publish identifiable patient records, DICOM names, or institutional case identifiers."
            )

            // Specialty selector chips
            SpecialtyFilterRow(
                selectedSpecialty = uiState.selectedSpecialty,
                onSelectSpecialty = { viewModel.setSpecialty(it) }
            )

            // Knowledge Feed
            when {
                uiState.isLoading -> {
                    Box(modifier = Modifier.fillMaxSize()) {
                        CircularProgressIndicator()
                    }
                }
                uiState.posts.isEmpty() -> {
                    EmptyFeedState()
                }
                else -> {
                    LazyColumn(
                        contentPadding = PaddingValues(16.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        items(uiState.posts, key = { it.id }) { post ->
                            PostCard(
                                post = post,
                                onLikeClick = { viewModel.toggleLike(post.id) },
                                onBookmarkClick = { viewModel.toggleBookmark(post.id) },
                                onAuthorClick = { onNavigateToDoctorProfile(post.author.id) },
                                onClick = { onNavigateToPostDetail(post.id) }
                            )
                        }
                    }
                }
            }
        }
    }
}
`,

  flutterArchitectureComparison: `
# Cross-Platform Architecture: Flutter Specification (Alternative Client)

If AMT Tech Nova deploys a secondary Flutter client for iOS or desktop:
1. **API Parity**:
   - Exactly identical REST contract targeting \`/api/v1/*\`.
   - Dio HTTP client with interceptor pipeline matching OkHttp.
2. **State Management**:
   - Bloc / Cubit or Riverpod with Freezed immutable models.
   - Separation of Presentation, Domain (Entities + UseCases), Data (Models + DataSources).
3. **No Code Mixing**:
   - Kotlin/Compose and Flutter code are never mixed inside the same Android build target.
   - Distinct repo directories or standalone app shell consuming the unified backend.
`,
};
