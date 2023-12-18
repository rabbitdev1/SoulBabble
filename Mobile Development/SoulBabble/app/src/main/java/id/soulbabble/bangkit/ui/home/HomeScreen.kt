package id.soulbabble.bangkit.ui.home

import android.net.Uri
import android.util.Log
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Card
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
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
import com.google.accompanist.swiperefresh.SwipeRefresh
import com.google.accompanist.swiperefresh.rememberSwipeRefreshState
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.JournalEntry
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.data.dataDummyIntersting
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.ui.journaling.JorunalingViewModel
import id.soulbabble.bangkit.ui.journaling.Result
import id.soulbabble.bangkit.ui.utils.ItemInterest
import id.soulbabble.bangkit.ui.utils.formatDate
import id.soulbabble.bangkit.utils.PreferenceManager
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Composable
fun HomeScreen(
    navController: NavHostController
) {
    val viewModel: HomeViewModel = viewModel()
    val viewModelJournal: JorunalingViewModel = viewModel()
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }
    var isLoading by remember { mutableStateOf(false) }
    val swipeRefreshState = rememberSwipeRefreshState(isRefreshing = isLoading)
    val coroutineScope = rememberCoroutineScope()
    var journalEntries by remember { mutableStateOf<List<JournalEntry>>(emptyList()) }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }

    val refreshJournal = {
        userProfile.value = PreferenceManager.getUserProfile(context)
        userProfile.value.displayName?.let { displayName ->
            viewModelJournal.getJournal(displayName) { result ->
                when (result) {
                    is Result.Success -> {
                        val entries = result.data
                        if (entries.isNotEmpty()) {
                            val entryToShow = entries.last()
                            journalEntries = listOf(entryToShow)
                        }
                    }

                    is Result.Error -> {
                        val errorMessage = "Failed to fetch journal: ${result.exception.message}"
                        Log.e("API Call", errorMessage)
                    }
                }
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        isLoading = true
        refreshJournal()
        delay(3000)
        isLoading = false
    }

    Scaffold(
        bottomBar = { BottomNavigationBar(navController) },
    ) { innerPadding ->
        SwipeRefresh(
            state = swipeRefreshState,
            onRefresh = {
                coroutineScope.launch {
                    isLoading = true
                    refreshJournal()
                }
            }
        ) {
            LazyVerticalGrid(
                columns = GridCells.Fixed(1),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier
                    .background(Color(0xFFF5F5F6))
                    .fillMaxSize()
                    .padding(innerPadding)

            ) {
                item(span = { GridItemSpan(2) }) {
                    Box(
                        modifier = Modifier
                            .background(
                                MaterialTheme.colorScheme.primary,
                            )
                            .fillMaxWidth()
                            .height(170.dp)
                    )
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                        ) {
                            Row(
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier.padding(
                                    start = 16.dp,
                                    end = 16.dp,
                                    top = 40.dp,
                                    bottom = 16.dp
                                ),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(80.dp)
                                        .clip(shape = CircleShape)
                                ) {
                                    Image(
                                        painter = rememberAsyncImagePainter(model = userProfile.value.photoUrl),
                                        contentDescription = "Profile Image",
                                        modifier = Modifier.fillMaxSize(),
                                        contentScale = ContentScale.Crop
                                    )
                                }
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .weight(1f)
                                ) {
                                    Text(
                                        text = userProfile.value.displayName.toString(),
                                        color = MaterialTheme.colorScheme.onPrimary,
                                        textAlign = TextAlign.Center,
                                        letterSpacing = 1.sp,
                                        style = TextStyle(
                                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 20.sp
                                        )
                                    )
                                    Text(
                                        color = Color.White,
                                        text = userProfile.value.email.toString(),
                                        style = TextStyle(
                                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                            fontWeight = FontWeight.Light,
                                            fontSize = 14.sp
                                        )
                                    )
                                }
                                Box(
                                    modifier = Modifier
                                ) {
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
                                }
                            }
                        }
                        Box(
                            modifier = Modifier
                                .padding(start = 16.dp, end = 16.dp, top = 0.dp, bottom = 0.dp)
                                .fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .background(
                                        MaterialTheme.colorScheme.onPrimary,
                                        shape = RoundedCornerShape(8.dp)
                                    )
                                    .fillMaxWidth()
                                    .border(
                                        width = 1.dp,
                                        color = Color(0xFFDADADA),
                                        shape = RoundedCornerShape(8.dp)
                                    )
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(50.dp)
                                            .background(
                                                MaterialTheme.colorScheme.secondary,
                                                shape = RoundedCornerShape(4.dp)
                                            )
                                    ) {
                                        Box(
                                            modifier = Modifier
                                                .padding(8.dp)
                                                .clip(shape = CircleShape)
                                                .background(
                                                    Color.Blue,
                                                    shape = RoundedCornerShape(4.dp)
                                                )
                                        ) {
                                            Image(
                                                painter = rememberAsyncImagePainter(model = userProfile.value.photoUrl),
                                                contentDescription = "Emot Image",
                                                modifier = Modifier.fillMaxSize(),
                                                contentScale = ContentScale.Crop
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .weight(1f)
                                    ) {
                                        Text(
                                            text = "Lorem Ipsum",
                                            color = MaterialTheme.colorScheme.primary,
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 16.sp
                                            )
                                        )
                                        Text(
                                            color = Color.Black,
                                            text = "Lorem Ipsum",
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                                fontWeight = FontWeight.Light,
                                                fontSize = 12.sp
                                            )
                                        )
                                    }
                                    Icon(
                                        painter = painterResource(id = R.drawable.ic_arrow_right),
                                        contentDescription = "Icon",
                                        modifier = Modifier.size(22.dp),
                                        tint = Color.Black
                                    )
                                }
                            }
                        }

                    }
                }
                item(span = { GridItemSpan(2) }) {
                    Spacer(
                        modifier = Modifier
                            .fillMaxSize()
                            .height(5.dp)
                            .background(Color(0xFFEDEEF0))
                    )
                }
                if (isLoading) {
                    item(span = { GridItemSpan(2) }) {
                        Column(
                            modifier = Modifier
                                .fillMaxSize()
                                .height(300.dp),
                            verticalArrangement = Arrangement.Center,
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            CircularProgressIndicator()
                            Text(
                                text = "Loading...",
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp)
                            )
                        }
                    }
                } else {
                    if (journalEntries.isEmpty()) {

                    } else {

                        item(span = { GridItemSpan(1) }) {
                            Column(
                                verticalArrangement = Arrangement.spacedBy(8.dp),
                                modifier = Modifier
                                    .padding(start = 16.dp, end = 16.dp)
                                    .fillMaxWidth()
                            ) {
                                Text(
                                    text = "Postingan Terbaru",
                                    color = MaterialTheme.colorScheme.onBackground,
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 16.sp
                                    )
                                )
                            }
                        }
                    }
                    items(journalEntries) { entry ->
                        Card(
                            modifier = Modifier
                                .padding(start = 16.dp, end = 16.dp, top = 2.dp, bottom = 2.dp)
                                .fillMaxWidth(),
                            elevation = 4.dp,
                            shape = RoundedCornerShape(8.dp),
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(12.dp)
                            ) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(40.dp)
                                            .clip(shape = CircleShape)
                                            .background(MaterialTheme.colorScheme.secondary)
                                    ) {
                                        Image(
                                            painter = rememberAsyncImagePainter(model = userProfile.value.photoUrl),
                                            contentDescription = "Profile Image",
                                            modifier = Modifier.fillMaxSize(),
                                            contentScale = ContentScale.Crop
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(
                                        modifier = Modifier.weight(1f)
                                    ) {
                                        Text(
                                            text = entry.fullname,
                                            color = MaterialTheme.colorScheme.primary,
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                                fontWeight = FontWeight.Bold,
                                                fontSize = 14.sp
                                            )
                                        )
                                        Text(
                                            color = Color.Black,
                                            text = entry.timestamp.formatDate(),
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                                fontWeight = FontWeight.Light,
                                                fontSize = 12.sp
                                            )
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = entry.message,
                                    color = MaterialTheme.colorScheme.onBackground,
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 14.sp
                                    )
                                )
                            }
                        }
                    }
                    item(span = { GridItemSpan(2) }) {
                        Spacer(
                            modifier = Modifier
                                .fillMaxSize()
                                .height(5.dp)
                                .background(Color(0xFFEDEEF0))
                        )
                    }
                }
                item(span = { GridItemSpan(2) }) {
                    Column(
                        modifier = Modifier
                            .padding(start = 16.dp, end = 16.dp)
                            .fillMaxWidth()
                    ) {
                        Text(
                            text = "Interesting in Soul Babble",
                            color = MaterialTheme.colorScheme.onBackground,
                            style = TextStyle(
                                fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp
                            )
                        )
                    }
                }
                items(dataDummyIntersting.length()) { index ->
                    val item = dataDummyIntersting.getJSONObject(index)
                    val title = item.getString("title")
                    val description = item.getString("description")
                    val date = item.getString("date")
                    val image = item.getString("image")
                    val url = item.getString("url")

                    ItemInterest(
                        title = title,
                        description = description,
                        date = date,
                        image = image,
                        onClick = {
                            val encodedUrl = Uri.encode(url)
                            navController.navigate("webview/$title/$encodedUrl")
                        },
                    )
                }
            }
        }
    }
}

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    val navController = rememberNavController()

    HomeScreen(navController)
}
