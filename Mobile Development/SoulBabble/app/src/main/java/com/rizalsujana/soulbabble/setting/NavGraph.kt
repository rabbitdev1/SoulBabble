package com.rizalsujana.soulbabble.setting

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.compose.runtime.livedata.observeAsState
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.accompanist.pager.ExperimentalPagerApi
import com.rizalsujana.soulbabble.ui.auth.Authentication
import com.rizalsujana.soulbabble.ui.auth.AuthenticationViewModel
import com.rizalsujana.soulbabble.ui.boarding.OnBoarding
import com.rizalsujana.soulbabble.ui.boarding.SplashScreen
import com.rizalsujana.soulbabble.ui.home.HomeScreen
import com.rizalsujana.soulbabble.ui.profile.ProfileScreen

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
        composable("settings") { ProfileScreen(navController,viewModel) }
    }
}
