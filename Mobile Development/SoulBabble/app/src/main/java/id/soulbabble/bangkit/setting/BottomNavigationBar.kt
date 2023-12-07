package id.soulbabble.bangkit.setting

import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Icon
import androidx.compose.material.BottomNavigation
import androidx.compose.material.BottomNavigationItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import id.soulbabble.bangkit.R

@Composable
fun BottomNavigationBar(navController: NavHostController) {
    BottomNavigation(
        modifier = Modifier.height(56.dp),
        backgroundColor = Color.White
    ) {
        BottomNavigationItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.ic_home),
                    contentDescription = "Home",
                    modifier = Modifier.size(30.dp),
                    tint = if (navController.currentDestination?.route == "home") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "home",
            onClick = { navController.navigate("home") },
            selectedContentColor = MaterialTheme.colorScheme.primary
        )
        BottomNavigationItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.ic_tracker),
                    contentDescription = "Tracker",
                    modifier = Modifier.size(30.dp),
                    tint = if (navController.currentDestination?.route == "tracker") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "tracker",
            onClick = { navController.navigate("tracker") },
            selectedContentColor =MaterialTheme.colorScheme.primary
        )
        BottomNavigationItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.ic_community),
                    contentDescription = "Community",
                    modifier = Modifier.size(30.dp),
                    tint = if (navController.currentDestination?.route == "community") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "community",
            onClick = { navController.navigate("community") },
            selectedContentColor =MaterialTheme.colorScheme.primary
        )
        BottomNavigationItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.ic_consultation),
                    contentDescription = "Consultation",
                    modifier = Modifier.size(30.dp),
                    tint = if (navController.currentDestination?.route == "consultation") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "consultation",
            onClick = { navController.navigate("consultation") },
            selectedContentColor =MaterialTheme.colorScheme.primary
        )
        BottomNavigationItem(
            icon = {
                Icon(
                    painter = painterResource(id = R.drawable.ic_profile),
                    contentDescription = "Profile",
                    modifier = Modifier.size(30.dp),
                    tint = if (navController.currentDestination?.route == "profile") MaterialTheme.colorScheme.primary else Color.Gray
                )
            },
            selected = navController.currentDestination?.route == "profile",
            onClick = { navController.navigate("profile") },
            selectedContentColor =MaterialTheme.colorScheme.primary
        )
    }
}

