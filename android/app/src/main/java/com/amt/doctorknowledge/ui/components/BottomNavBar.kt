package com.amt.doctorknowledge.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.amt.doctorknowledge.ui.theme.*

sealed class BottomNavDestination(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    object Home : BottomNavDestination("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    object Discover : BottomNavDestination("discover", "Discover", Icons.Filled.Search, Icons.Outlined.Search)
    object Create : BottomNavDestination("create", "Create", Icons.Filled.AddCircle, Icons.Outlined.AddCircleOutline)
    object Communities : BottomNavDestination("communities", "Communities", Icons.Filled.Groups, Icons.Outlined.Groups)
    object Profile : BottomNavDestination("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
}

val bottomNavDestinations = listOf(
    BottomNavDestination.Home,
    BottomNavDestination.Discover,
    BottomNavDestination.Create,
    BottomNavDestination.Communities,
    BottomNavDestination.Profile
)

@Composable
fun BottomNavBar(
    currentRoute: String,
    onNavigateToDestination: (BottomNavDestination) -> Unit
) {
    NavigationBar(
        containerColor = SurfaceColor,
        tonalElevation = 4.dp
    ) {
        bottomNavDestinations.forEach { destination ->
            val isSelected = currentRoute == destination.route

            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigateToDestination(destination) },
                icon = {
                    Icon(
                        imageVector = if (isSelected) destination.selectedIcon else destination.unselectedIcon,
                        contentDescription = destination.title
                    )
                },
                label = { Text(destination.title) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = PrimaryNavy,
                    selectedTextColor = PrimaryNavy,
                    indicatorColor = PaleBlue,
                    unselectedIconColor = SecondaryText,
                    unselectedTextColor = SecondaryText
                )
            )
        }
    }
}
