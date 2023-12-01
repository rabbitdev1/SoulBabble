package com.rizalsujana.soulbabble

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.rizalsujana.soulbabble.ui.theme.SoulBabbleTheme

@Composable
fun Authentication(navController: NavHostController) {
    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
        Text(text = "Auth Page")

    }
}

@Preview(showBackground = true)
@Composable
fun AuthenticationPreview() {
    SoulBabbleTheme {
        val navController = rememberNavController()
        Authentication(navController)
    }
}