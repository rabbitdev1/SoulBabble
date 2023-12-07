package id.soulbabble.bangkit.setting

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.runtime.Composable
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.google.accompanist.pager.ExperimentalPagerApi
import id.soulbabble.bangkit.notification.NotificationScreen
import id.soulbabble.bangkit.ui.auth.Authentication
import id.soulbabble.bangkit.ui.boarding.OnBoarding
import id.soulbabble.bangkit.ui.boarding.SplashScreen
import id.soulbabble.bangkit.ui.community.CommunityScreen
import id.soulbabble.bangkit.ui.consultation.ConsultationScreen
import id.soulbabble.bangkit.ui.home.HomeScreen
import id.soulbabble.bangkit.ui.home.TrackingMoodScreen
import id.soulbabble.bangkit.ui.profile.DetailUserScreen
import id.soulbabble.bangkit.ui.profile.ProfileScreen
import id.soulbabble.bangkit.ui.tracker.TrackerScreen
import id.soulbabble.bangkit.ui.utils.WebviewScreen

@ExperimentalFoundationApi
@OptIn(ExperimentalPagerApi::class, ExperimentalMaterial3Api::class)
@Composable
fun NavGraph() {
    val navController = rememberNavController()
    NavHost(navController = navController, startDestination = "splashScreen") {
        composable("splashScreen") { SplashScreen(navController) }
        composable("onboarding") { OnBoarding(navController) }
        composable("auth") { Authentication(navController) }
        composable("home") { HomeScreen(navController) }
        composable("tracker") { TrackerScreen(navController) }
        composable("community") { CommunityScreen(navController) }
        composable("consultation") { ConsultationScreen(navController) }

        composable("profile") { ProfileScreen(navController) }
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
        composable("detail-profile") { DetailUserScreen(navController) }
        composable("notification") { NotificationScreen(navController) }
        composable(
            "tracking-mood/{id}/{name}",
            arguments = listOf(navArgument("id") { type = NavType.StringType },
                navArgument("name") { type = NavType.StringType })
        ) {
            TrackingMoodScreen(navController)
        }


    }
}
