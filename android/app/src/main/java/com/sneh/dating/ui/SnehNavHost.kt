package com.sneh.dating.ui

import androidx.compose.runtime.*
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.sneh.dating.domain.model.Profile
import com.sneh.dating.ui.screens.discovery.DiscoveryScreen
import com.sneh.dating.ui.screens.safety.SafetyCenterScreen
import com.sneh.dating.ui.screens.privacy.PrivacyDashboardScreen

sealed class Screen(val route: String) {
    object Onboarding : Screen("onboarding")
    object Auth : Screen("auth")
    object ProfileBuilder : Screen("profile_builder")
    object Discovery : Screen("discovery")
    object Matches : Screen("matches")
    object Chat : Screen("chat/{conversationId}") {
        fun createRoute(conversationId: String) = "chat/$conversationId"
    }
    object Safety : Screen("safety")
    object Privacy : Screen("privacy")
    object Settings : Screen("settings")
    object Premium : Screen("premium")
}

@Composable
fun SnehNavHost(
    navController: NavHostController,
    startDestination: String = Screen.Discovery.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        composable(Screen.Discovery.route) {
            DiscoveryScreen(
                profiles = emptyList(),
                onLike = { /* Trigger like flow */ },
                onPass = { /* Pass */ },
                onSuperLike = { /* Super Like */ },
                onReport = { /* Open report dialog */ },
                onBlock = { /* Block user */ }
            )
        }
        composable(Screen.Safety.route) {
            SafetyCenterScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }
        composable(Screen.Privacy.route) {
            PrivacyDashboardScreen(
                approximateDistanceOnly = true,
                onToggleApproximateDistance = {},
                incognitoMode = false,
                onToggleIncognito = {},
                readReceiptsEnabled = true,
                onToggleReadReceipts = {},
                onRequestDataExport = {},
                onDeleteAccount = {},
                onNavigateBack = { navController.popBackStack() }
            )
        }
    }
}
