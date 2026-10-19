package com.amt.doctorknowledge.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.NotificationsNone
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.amt.doctorknowledge.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopAppHeader(
    feedTitle: String = "Feed",
    unreadChatCount: Int = 0,
    unreadNotificationCount: Int = 0,
    onChatClick: () -> Unit,
    onNotificationClick: () -> Unit
) {
    Surface(
        color = SurfaceColor,
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Left: Clear "Feed" Title
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = feedTitle,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryNavy
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "AMT",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimaryBlue,
                    modifier = Modifier
                        .background(PaleBlue, shape = CircleShape)
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                )
            }

            // Right: Independent Chat and Notification icons
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // 1. Chat icon
                IconButton(onClick = onChatClick) {
                    BadgedBox(
                        badge = {
                            if (unreadChatCount > 0) {
                                Badge(
                                    containerColor = ErrorColor,
                                    contentColor = Color.White
                                ) {
                                    Text(unreadChatCount.toString())
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.ChatBubbleOutline,
                            contentDescription = "Doctor Consults and Chat Inbox",
                            tint = PrimaryNavy
                        )
                    }
                }

                // 2. Notification bell
                IconButton(onClick = onNotificationClick) {
                    BadgedBox(
                        badge = {
                            if (unreadNotificationCount > 0) {
                                Badge(
                                    containerColor = ErrorColor,
                                    contentColor = Color.White
                                ) {
                                    Text(unreadNotificationCount.toString())
                                }
                            }
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.NotificationsNone,
                            contentDescription = "Notifications and Institutional Alerts",
                            tint = PrimaryNavy
                        )
                    }
                }
            }
        }
    }
}
