@file:Suppress("DEPRECATION")
package com.rizalsujana.soulbabble.ui.boarding

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.airbnb.lottie.compose.*
import com.rizalsujana.soulbabble.ui.theme.SoulBabbleTheme
import com.rizalsujana.soulbabble.utils.PreferenceManager
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(navController: NavController) {
        val composition by rememberLottieComposition(
            spec = LottieCompositionSpec.Asset("lottie_splash.json")
        )

        val progress by animateLottieCompositionAsState(
            composition = composition,
            iterations = LottieConstants.IterateForever
        )

        LaunchedEffect(key1 = true) {
            delay(500000L)
            val isFirstRun = PreferenceManager.isFirstRun(navController.context)
            if (isFirstRun) {
                navController.navigate("onboarding") {
                    popUpTo("splashScreen") { inclusive = true }
                }
                PreferenceManager.setFirstRun(navController.context, false)
            } else {
                navController.navigate("auth") {
                    popUpTo("splashScreen") { inclusive = true }
                }
            }

        }
        Box(
            modifier = Modifier
                .background(color = Color(0xFF146C94))
                .fillMaxSize(),
            contentAlignment = Alignment.Center,
        ) {
            LottieAnimation(
                composition = composition,
                progress = progress,
                modifier = Modifier
                    .size(200.dp)
            )
        }
    }


@Preview(showBackground = true)
@Composable
fun SplashPreview() {
    val navController = rememberNavController()
    SplashScreen(navController)
}
