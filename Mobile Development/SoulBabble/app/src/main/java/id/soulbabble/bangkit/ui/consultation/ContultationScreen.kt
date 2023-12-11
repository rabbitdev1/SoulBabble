package id.soulbabble.bangkit.ui.journaling

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import coil.compose.rememberAsyncImagePainter
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.utils.PreferenceManager
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.dataDummyJournaling
import id.soulbabble.bangkit.ui.consultation.ChatViewModel
import id.soulbabble.bangkit.ui.home.HomeViewModel
import id.soulbabble.bangkit.ui.utils.ItemJournaling
import id.soulbabble.bangkit.ui.utils.ItemListChat

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Composable
fun ConsultationScreen(
    navController: NavHostController
) {
    val viewModel: ChatViewModel = viewModel()
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Consultation Bot",
                        color = MaterialTheme.colorScheme.onPrimary,
                        textAlign = TextAlign.Center,
                        letterSpacing = 1.sp,
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                            fontWeight = FontWeight.Normal,
                            fontSize = 18.sp
                        )
                    )
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = MaterialTheme.colorScheme.primary),
                actions = {
                    IconButton(
                        onClick = {
                            navController.navigate("notification")
                        }
                    ) {
                        Icon(
                            Icons.Default.Notifications,
                            contentDescription = "Notifications",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primary)
            )
        },
        bottomBar = { BottomNavigationBar(navController) },
    ) { innerPadding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(1),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxSize()
                .padding(innerPadding)

        ) {
            items(dataDummyJournaling.length()) { index ->
                val item = dataDummyJournaling.getJSONObject(index)
                val userID = item.getString("userid")
                val date = item.getString("date")
                val post = item.getString("post")

                ItemListChat(
                    username =userProfile.value.displayName.toString(),
                    image = userProfile.value.photoUrl,
                    date = date,
                    post = post,
                ) {
                        navController.navigate("chat-bot")
                }
            }
        }
    }
}

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ConsultationPreview() {
    val navController = rememberNavController()
    ConsultationScreen(navController)
}
