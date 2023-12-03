package com.rizalsujana.soulbabble.setting

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavHostController

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    BottomNavigation(
        backgroundColor = Color.White
    ) {
        BottomNavigationItem(
            icon = {
                Icon(
                    imageVector = Icons.Default.Home,
                    contentDescription = "Home",
                    tint = if (navController.currentDestination?.route == "home") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            label = {
                Text(
                    text = "Home",
                    color = if (navController.currentDestination?.route == "home") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "home",
            onClick = { navController.navigate("home") },
            selectedContentColor = MaterialTheme.colorScheme.primary
        )
        BottomNavigationItem(
            icon = {
                Icon(
                    imageVector = Icons.Default.Settings,
                    contentDescription = "Settings",
                    tint = if (navController.currentDestination?.route == "settings") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            label = {
                Text(
                    text = "Settings",
                    color = if (navController.currentDestination?.route == "settings") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "settings",
            onClick = { navController.navigate("settings") },
            selectedContentColor =MaterialTheme.colorScheme.primary
        )
    }
}

