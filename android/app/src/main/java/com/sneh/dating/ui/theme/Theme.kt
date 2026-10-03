package com.sneh.dating.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Sneh Brand Palette: Royal Indian Luxury & Warmth
val SnehRosePrimary = Color(0xFFE11D48) // Royal Gulab / Ruby Rose
val SnehRoseDark = Color(0xFFBE123C)
val SnehRoseLight = Color(0xFFFB7185)

val SnehGoldSecondary = Color(0xFFF59E0B) // Kesari / Festive Amber Gold
val SnehGoldLight = Color(0xFFFDE68A)

val SnehMidnightDark = Color(0xFF0D0814) // Deep Velvet Night
val SnehSurfaceDark = Color(0xFF171022) // Elevated Card Midnight
val SnehSurfaceElevated = Color(0xFF241A33)

val SnehCreamLight = Color(0xFFFAF7F2) // Warm Indian Ivory Cream
val SnehSurfaceLight = Color(0xFFFFFFFF)
val SnehTextPrimaryDark = Color(0xFFF8FAFC)
val SnehTextSecondaryDark = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = SnehRoseLight,
    onPrimary = Color(0xFF4C0519),
    primaryContainer = SnehRoseDark,
    onPrimaryContainer = Color(0xFFFFE4E6),
    secondary = SnehGoldSecondary,
    onSecondary = Color(0xFF451A03),
    background = SnehMidnightDark,
    onBackground = SnehTextPrimaryDark,
    surface = SnehSurfaceDark,
    onSurface = SnehTextPrimaryDark,
    surfaceVariant = SnehSurfaceElevated,
    onSurfaceVariant = SnehTextSecondaryDark,
    error = Color(0xFFF87171),
    onError = Color(0xFF450A0A)
)

private val LightColorScheme = lightColorScheme(
    primary = SnehRoseDark,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFFFE4E6),
    onPrimaryContainer = Color(0xFF881337),
    secondary = SnehGoldSecondary,
    onSecondary = Color.White,
    background = SnehCreamLight,
    onBackground = Color(0xFF1E293B),
    surface = SnehSurfaceLight,
    onSurface = Color(0xFF1E293B),
    surfaceVariant = Color(0xFFF1EDE6),
    onSurfaceVariant = Color(0xFF64748B),
    error = Color(0xFFDC2626),
    onError = Color.White
)

@Composable
fun SnehTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = false, // Set to true if Material You dynamic theming is desired
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = colorScheme.background.toArgb()
                window.navigationBarColor = colorScheme.background.toArgb()
                WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = !darkTheme
                WindowCompat.getInsetsController(window, view).isAppearanceLightNavigationBars = !darkTheme
            }
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography(),
        content = content
    )
}
