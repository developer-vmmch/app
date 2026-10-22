package com.amt.doctorknowledge.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = PrimaryNavy,
    onPrimary = SurfaceColor,
    primaryContainer = PaleBlue,
    onPrimaryContainer = PrimaryNavy,
    secondary = PrimaryBlue,
    onSecondary = SurfaceColor,
    secondaryContainer = PaleBlue,
    onSecondaryContainer = PrimaryNavy,
    tertiary = SecondaryBlue,
    background = LightClinicalBackground,
    onBackground = PrimaryText,
    surface = SurfaceColor,
    onSurface = PrimaryText,
    surfaceVariant = PaleBlue,
    onSurfaceVariant = SecondaryText,
    outline = BorderColor,
    error = ErrorColor,
    onError = SurfaceColor
)

@Composable
fun DoctorKnowledgeTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = SurfaceColor.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = true
        }
    }

    MaterialTheme(
        colorScheme = LightColorScheme,
        content = content
    )
}
