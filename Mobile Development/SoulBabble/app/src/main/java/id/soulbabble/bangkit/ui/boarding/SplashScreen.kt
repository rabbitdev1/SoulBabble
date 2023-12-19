@file:Suppress("DEPRECATION")

package id.soulbabble.bangkit.ui.boarding

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.airbnb.lottie.compose.*
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.notification.NotificationViewModel
import id.soulbabble.bangkit.utils.PreferenceManager
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(navController: NavController) {
    val notificationViewModel: NotificationViewModel = viewModel()
    val context = LocalContext.current
    LaunchedEffect(key1 = true) {
        notificationViewModel.startShowingNotifications(
            context = context,
        )
    }
    val composition by rememberLottieComposition(
        spec = LottieCompositionSpec.Asset("lottie_splash.json")
    )

    val progress by animateLottieCompositionAsState(
        composition = composition,
        iterations = LottieConstants.IterateForever
    )
    val token = PreferenceManager.getToken(context)
    LaunchedEffect(key1 = true) {
        delay(3000L)
        println(token)
        val isFirstRun = PreferenceManager.isFirstRun(navController.context)
        if (isFirstRun) {
            navController.navigate("onboarding") {
                popUpTo("splashScreen") { inclusive = true }
            }
            PreferenceManager.setFirstRun(navController.context, false)
        } else {
            if (token != null) {
                navController.navigate("home") {
                    popUpTo("splashScreen") { inclusive = true }
                }
            } else {
                navController.navigate("auth") {
                    popUpTo("splashScreen") { inclusive = true }
                }
            }
        }

    }
    Box(
        modifier = Modifier
            .background(color = MaterialTheme.colorScheme.primary)
            .fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
//        LottieAnimation(
//            composition = composition,
//            progress = progress,
//            modifier = Modifier
//                .size(200.dp)
//        )
        Image(
            painter = painterResource(id =  R.drawable.iconlogo),
            contentDescription = "Image1",
            modifier = Modifier
                .width(200.dp)
                .height(200.dp)
        )

    }
}


@Preview(showBackground = true)
@Composable
fun SplashPreview() {
    val navController = rememberNavController()
    SplashScreen(navController)
}
