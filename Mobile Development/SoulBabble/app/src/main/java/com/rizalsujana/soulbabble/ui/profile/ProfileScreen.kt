package com.rizalsujana.soulbabble.ui.profile

import android.annotation.SuppressLint
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import com.rizalsujana.soulbabble.setting.BottomNavigationBar
import com.rizalsujana.soulbabble.ui.auth.AuthenticationViewModel

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@ExperimentalMaterial3Api
@Composable
fun ProfileScreen(navController: NavHostController,viewModel:AuthenticationViewModel) {
    Scaffold(
        bottomBar = { BottomNavigationBar(navController) }
    ) {
        Button(
            onClick = {
                viewModel.logOut()
                navController.navigate("auth") {
                    popUpTo("home") { inclusive = true }
                }
            }
        ) {
            Text("Log Out")
        }
    }
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    val navController = rememberNavController()
    val viewModel: AuthenticationViewModel = viewModel()
    ProfileScreen(navController,viewModel)
}
