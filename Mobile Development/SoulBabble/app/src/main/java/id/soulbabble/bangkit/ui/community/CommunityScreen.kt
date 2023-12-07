package id.soulbabble.bangkit.ui.community

import android.annotation.SuppressLint
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import id.soulbabble.bangkit.setting.BottomNavigationBar

@ExperimentalMaterial3Api
@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@Composable
fun CommunityScreen(navController: NavHostController) {
    Scaffold(
        bottomBar = { BottomNavigationBar(navController) }
    ) {

    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ComunnityScreenPreview() {
    val navController = rememberNavController()
    CommunityScreen(navController)
}
