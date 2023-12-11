package id.soulbabble.bangkit.notification

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import id.soulbabble.bangkit.data.dataDummyNotification
import id.soulbabble.bangkit.ui.utils.ItemNotification
import id.soulbabble.bangkit.R
@ExperimentalMaterial3Api
@Composable
fun NotificationScreen(
    navController: NavHostController
) {

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Notifikasi",
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
                navigationIcon = {
                    IconButton(
                        onClick = {
                            navController.popBackStack()
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Kembali",
                            tint = MaterialTheme.colorScheme.onPrimary
                        )
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primary)
            )
        },
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxWidth()
                .fillMaxHeight()
                .padding(innerPadding)
        ) {

            LazyColumn {
                items(dataDummyNotification.length()) { index ->
                    val item = dataDummyNotification.getJSONObject(index)
                    val title = item.getString("title")
                    val description = item.getString("description")
                    val date = item.getString("date")
                    ItemNotification(
                        title = title,
                        description = description,
                        date = date
                    )
                }
            }
        }
    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    val navController = rememberNavController()

    NotificationScreen(navController)
}
