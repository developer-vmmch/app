package com.amt.doctorknowledge

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.amt.doctorknowledge.ui.components.BottomNavBar
import com.amt.doctorknowledge.ui.components.TopAppHeader
import com.amt.doctorknowledge.ui.theme.DoctorKnowledgeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            DoctorKnowledgeTheme {
                val navController = rememberNavController()
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route ?: "home"

                var unreadChatCount by remember { mutableStateOf(2) }
                var unreadNotifCount by remember { mutableStateOf(3) }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = {
                        // Top Header with clear Feed title and independent Chat + Notifications
                        if (currentRoute in listOf("home", "discover", "communities", "profile")) {
                            TopAppHeader(
                                feedTitle = when (currentRoute) {
                                    "home" -> "Feed"
                                    "discover" -> "Discover"
                                    "communities" -> "Communities"
                                    "profile" -> "Doctor Profile"
                                    else -> "Feed"
                                },
                                unreadChatCount = unreadChatCount,
                                unreadNotificationCount = unreadNotifCount,
                                onChatClick = {
                                    navController.navigate("chat") {
                                        launchSingleTop = true
                                    }
                                },
                                onNotificationClick = {
                                    navController.navigate("notifications") {
                                        launchSingleTop = true
                                    }
                                }
                            )
                        }
                    },
                    bottomBar = {
                        // Bottom Navigation: Exactly five options
                        if (currentRoute in listOf("home", "discover", "create", "communities", "profile")) {
                            BottomNavBar(
                                currentRoute = currentRoute,
                                onNavigateToDestination = { destination ->
                                    navController.navigate(destination.route) {
                                        popUpTo("home") { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            )
                        }
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("home") {
                            // Home Knowledge Feed & Stories with 23:59:59 daily boundary
                        }
                        composable("discover") {
                            // Discover Doctors, Specialties, Institutions
                        }
                        composable("create") {
                            // Knowledge Composer with PHI Warning
                        }
                        composable("communities") {
                            // Hospital & Specialty Communities
                        }
                        composable("profile") {
                            // Doctor Profile, TNMC Verification & Separate Followers/Institutions
                        }
                        composable("chat") {
                            // Independent Chat Inbox & Consultations
                        }
                        composable("notifications") {
                            // Independent Notifications Screen
                        }
                        composable("story_viewer/{storyId}") {
                            // Interactive Story Viewer with Pause, Reply, Mute
                        }
                    }
                }
            }
        }
    }
}
