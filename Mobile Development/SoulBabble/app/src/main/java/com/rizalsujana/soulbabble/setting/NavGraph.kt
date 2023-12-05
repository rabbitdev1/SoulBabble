package com.rizalsujana.soulbabble.setting

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.livedata.observeAsState
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.google.accompanist.pager.ExperimentalPagerApi
import com.rizalsujana.soulbabble.ui.auth.Authentication
import com.rizalsujana.soulbabble.ui.auth.AuthenticationViewModel
import com.rizalsujana.soulbabble.ui.boarding.OnBoarding
import com.rizalsujana.soulbabble.ui.boarding.SplashScreen
import com.rizalsujana.soulbabble.ui.community.CommunityScreen
import com.rizalsujana.soulbabble.ui.consultation.ConsultationScreen
import com.rizalsujana.soulbabble.ui.home.HomeScreen
import com.rizalsujana.soulbabble.ui.profile.ProfileScreen
import com.rizalsujana.soulbabble.ui.tracker.TrackerScreen
import com.rizalsujana.soulbabble.ui.utils.WebviewScreen

@OptIn(ExperimentalPagerApi::class, ExperimentalMaterial3Api::class)
@Composable
fun NavGraph() {
    val navController = rememberNavController()
    val viewModel: AuthenticationViewModel = viewModel()
    NavHost(navController = navController, startDestination = "splashScreen") {
        composable("splashScreen") { SplashScreen(navController) }
        composable("onboarding") { OnBoarding(navController) }
        composable("auth") { Authentication(navController) }
        composable("home") { HomeScreen(navController) }
        composable("tracker") { TrackerScreen(navController) }
        composable("community") { CommunityScreen(navController) }
        composable("consultation") { ConsultationScreen(navController) }

        composable("profile") { ProfileScreen(navController,viewModel) }
        composable(
            route = "webview/{url}/{title}",
            arguments = listOf(
                navArgument("url") { type = NavType.StringType },
                navArgument("title") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val url = backStackEntry.arguments?.getString("url") ?: ""
            val title = backStackEntry.arguments?.getString("title") ?: ""
            WebviewScreen(navController,url, title)
        }

    }
}
