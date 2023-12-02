package com.rizalsujana.soulbabble.setting

import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.google.accompanist.pager.ExperimentalPagerApi
import com.rizalsujana.soulbabble.ui.auth.Authentication
import com.rizalsujana.soulbabble.ui.boarding.OnBoarding
import com.rizalsujana.soulbabble.ui.boarding.SplashScreen

@OptIn(ExperimentalPagerApi::class)
@Composable
fun NavGraph() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "splashScreen") {
        composable("splashScreen") { SplashScreen(navController) }
        composable("onboarding") { OnBoarding(navController) }
        composable("auth") { Authentication(navController) }

    }
}