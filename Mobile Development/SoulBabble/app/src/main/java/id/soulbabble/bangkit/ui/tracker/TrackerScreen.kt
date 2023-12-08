package id.soulbabble.bangkit.ui.tracker

import android.net.Uri
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.TabRow
import androidx.compose.material3.TabRowDefaults
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.data.dataDummyEmoticon
import id.soulbabble.bangkit.data.dataDummyIntersting
import id.soulbabble.bangkit.data.dataDummyWeeklyMood
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.ui.home.HomeViewModel
import id.soulbabble.bangkit.ui.utils.ItemInterest
import id.soulbabble.bangkit.ui.utils.ItemMoodWeekly
import id.soulbabble.bangkit.ui.utils.ItemNewTrackMood
import id.soulbabble.bangkit.utils.PreferenceManager

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Composable
fun TrackerScreen(
    navController: NavHostController
) {
    val tabs = listOf("Check-in", "Insights")
    var selectedTab by remember { mutableIntStateOf(0) }

    val viewModel: HomeViewModel = viewModel()
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }

    Scaffold(
        topBar = {
            Column {
                TopAppBar(
                    title = {
                        Text(
                            text = "Profile",
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
                TabRow(
                    selectedTabIndex = selectedTab,
                    indicator = { tabPositions ->
                        TabRowDefaults.Indicator(
                            modifier = Modifier.tabIndicatorOffset(tabPositions[selectedTab]),
                            color = Color.White
                        )
                    }
                ) {
                    tabs.forEachIndexed { index, title ->
                        val isSelected = selectedTab == index
                        Tab(
                            selected = isSelected,
                            onClick = { selectedTab = index },
                            text = {
                                Text(
                                    text = title,
                                    color = if (isSelected) Color.White else MaterialTheme.colorScheme.primary
                                )
                            },
                            modifier = if (isSelected) Modifier.background(MaterialTheme.colorScheme.primary) else Modifier
                        )
                    }
                }
                // Konten aplikasi Anda di sini

            }
        },
        bottomBar = { BottomNavigationBar(navController) },
    ) { innerPadding ->
        when (selectedTab) {
            0 -> {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier
                        .background(Color(0xFFF5F5F6))
                        .fillMaxSize()
                        .padding(innerPadding)

                ) {
                    item(span = { GridItemSpan(2) }){
                        Column(
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                        ) {
                            Text(
                                modifier = Modifier.padding(start = 12.dp, end = 12.dp, top = 12.dp),
                                text = "Mood Mingguan",
                                color = MaterialTheme.colorScheme.onBackground,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                            )
                            LazyRow(
                                modifier = Modifier.padding(start = 12.dp, end = 12.dp, bottom = 12.dp)
                                    .fillMaxWidth(),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement =Arrangement.SpaceBetween,
                            ) {
                                items(dataDummyWeeklyMood.length()) { index ->
                                    val item = dataDummyWeeklyMood.getJSONObject(index)
                                    val days = item.getString("days")
                                    val date = item.getString("date")
                                    val cheking = item.getBoolean("cheking")
                                    val emoticon = item.getString("emoticon")
                                    ItemMoodWeekly(
                                        name = days,
                                        emoticon = emoticon,
                                        cheking=cheking,
                                        onClick = {

                                        },
                                    )
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
                    item(span = { GridItemSpan(2) }) {
                        Column(
                            verticalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 8.dp)
                        ) {
                            Row(
                                modifier = Modifier,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(50.dp)
                                        .background(
                                            MaterialTheme.colorScheme.onPrimary,
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
                                Spacer(modifier = Modifier.width(4.dp))
                                Column(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .weight(1f)
                                ) {
                                    Text(
                                        color = Color.Black,
                                        text = "Senin, 01 Desember 2024",
                                        style = TextStyle(
                                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                            fontWeight = FontWeight.Light,
                                            fontSize = 12.sp
                                        )
                                    )
                                    Text(
                                        text = "Lorem Ipsum",
                                        color = MaterialTheme.colorScheme.primary,
                                        style = TextStyle(
                                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 16.sp
                                        )
                                    )
                                }
                            }
                            Row(
                                modifier = Modifier,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    color = Color.Black,
                                    text = "Emosi Positif : ",
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                        fontWeight = FontWeight.Light,
                                        fontSize = 12.sp
                                    )
                                )
                                Box(modifier = Modifier
                                    .background(
                                        Color(0x9A19A7CE),
                                        shape = RoundedCornerShape(4.dp)
                                    )){
                                    Box(modifier = Modifier.padding(4.dp)
                                    ){
                                        Text(
                                            color = Color.Black,
                                            text = "Emosi 1, Emosi 2, Emosi 4",
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                                fontWeight = FontWeight.Light,
                                                fontSize = 10.sp
                                            )
                                        )
                                    }
                                }
                            }
                            Row(
                                modifier = Modifier,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    color = Color.Black,
                                    text = "Emosi Negatif : ",
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                        fontWeight = FontWeight.Light,
                                        fontSize = 12.sp
                                    )
                                )
                                Box(modifier = Modifier
                                    .background(
                                        Color(0x9A19A7CE),
                                        shape = RoundedCornerShape(4.dp)
                                    )){
                                    Box(modifier = Modifier.padding(4.dp)
                                    ){
                                        Text(
                                            color = Color.Black,
                                            text = "Emosi 1, Emosi 2, Emosi 4",
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                                fontWeight = FontWeight.Light,
                                                fontSize = 10.sp
                                            )
                                        )
                                    }
                                }
                            }
                            Row(
                                modifier = Modifier,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    color = Color.Black,
                                    text = "Faktor Emosi : ",
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                        fontWeight = FontWeight.Light,
                                        fontSize = 12.sp
                                    )
                                )
                                Box(modifier = Modifier
                                    .background(
                                        Color(0x9A19A7CE),
                                        shape = RoundedCornerShape(4.dp)
                                    )){
                                    Box(modifier = Modifier.padding(4.dp)
                                    ){
                                        Text(
                                            color = Color.Black,
                                            text = "Emosi 1, Emosi 2, Emosi 4",
                                            style = TextStyle(
                                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                                fontWeight = FontWeight.Light,
                                                fontSize = 10.sp
                                            )
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
                    item(span = { GridItemSpan(2) }) {
                        Column(
                            modifier = Modifier
                                .padding(start = 16.dp, end = 16.dp)
                                .fillMaxWidth()
                        ) {
                            Text(
                                text = "Rekomendasi Untukmu Hari Ini",
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

            1 -> {
                // Tampilkan konten untuk Tab 2
            }
        }

    }
}

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun TrackScreenPreview() {
    val navController = rememberNavController()

    TrackerScreen(navController)
}
