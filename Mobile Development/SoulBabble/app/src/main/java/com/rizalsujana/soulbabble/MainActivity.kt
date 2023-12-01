package com.rizalsujana.soulbabble

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import androidx.compose.ui.tooling.preview.Preview
import com.rizalsujana.soulbabble.ui.theme.SoulBabbleTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SoulBabbleTheme {
                val navController = rememberNavController()
                SplashScreen(navController)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainPreview() {
    SoulBabbleTheme {
        val navController = rememberNavController()
        SplashScreen(navController)
    }
}