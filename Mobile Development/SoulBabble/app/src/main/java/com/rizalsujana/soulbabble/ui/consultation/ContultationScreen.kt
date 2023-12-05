package com.rizalsujana.soulbabble.ui.consultation

import android.annotation.SuppressLint
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.rizalsujana.soulbabble.setting.BottomNavigationBar

@ExperimentalMaterial3Api
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun ConsultationScreen(navController: NavHostController) {
    Scaffold(
        bottomBar = { BottomNavigationBar(navController) }
    ) {

    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ConcultationPreview() {
    val navController = rememberNavController()
    ConsultationScreen(navController)
}
