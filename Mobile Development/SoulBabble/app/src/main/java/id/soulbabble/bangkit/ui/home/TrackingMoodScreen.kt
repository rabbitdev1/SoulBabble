package id.soulbabble.bangkit.ui.home

import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
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
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import id.soulbabble.bangkit.data.dataDummyTrackEmotionNegative
import id.soulbabble.bangkit.data.dataDummyTrackEmotionPositive
import id.soulbabble.bangkit.data.dataDummyTrackSourceEmotion
import id.soulbabble.bangkit.ui.utils.ItemWhyTrackMood
import id.soulbabble.bangkit.R

@ExperimentalMaterial3Api
@Composable
fun TrackingMoodScreen(
    navController: NavHostController
) {
    val context = LocalContext.current
    val currentBackStackEntry by navController.currentBackStackEntryAsState()
    val idNav = currentBackStackEntry?.arguments?.getString("id")
    val nameNav = currentBackStackEntry?.arguments?.getString("name")

    val viewModel: TrackingMoodViewModel = viewModel()
    val positiveEmotions = viewModel.userListEmotionPositiveTrack.observeAsState(listOf())
    val negativeEmotions = viewModel.userListEmotionNegativeTrack.observeAsState(listOf())
    val sourceEmotions = viewModel.userListSourceEmotionTrack.observeAsState(listOf())

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        modifier = Modifier.fillMaxWidth(),
                        text = "Penyebab Emosi $nameNav",
                        color = MaterialTheme.colorScheme.onPrimary,
                        textAlign = TextAlign.Start,
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
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxSize()
                .padding(start = 16.dp, end = 16.dp)
                .padding(innerPadding)

        ) {
            item(span = { GridItemSpan(4) }) {
                Text(
                    text = "Apa saja emosi yang sering kamu rasakan sekarang?",
                    color = MaterialTheme.colorScheme.onBackground,
                    style = TextStyle(
                        fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
            }
            item(span = { GridItemSpan(4) }) {
                Text(
                    text = "Positif",
                    color = MaterialTheme.colorScheme.onBackground,
                    style = TextStyle(
                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                        fontWeight = FontWeight.Light,
                        fontSize = 14.sp
                    )
                )
            }
            items(dataDummyTrackEmotionPositive.length()) { index ->
                val item = dataDummyTrackEmotionPositive.getJSONObject(index)
                val name = item.getString("name")
                ItemWhyTrackMood(
                    name = name,
                    isSelected = positiveEmotions.value?.contains(name) ?: false,
                    onClick = {
                        viewModel.toggleEmotion(name, true)
                    },
                )
            }

            item(span = { GridItemSpan(4) }) {
                Text(
                    text = "Negatif",
                    color = MaterialTheme.colorScheme.onBackground,
                    style = TextStyle(
                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                        fontWeight = FontWeight.Light,
                        fontSize = 14.sp
                    )
                )
            }
            items(dataDummyTrackEmotionNegative.length()) { index ->
                val item = dataDummyTrackEmotionNegative.getJSONObject(index)
                val name = item.getString("name")
                ItemWhyTrackMood(
                    name = name,
                    isSelected = negativeEmotions.value?.contains(name) ?: false,
                    onClick = {
                        viewModel.toggleEmotion(name, false)
                    },
                )
            }
            item(span = { GridItemSpan(4) }) {
                Spacer(modifier = Modifier.height(16.dp))
            }
            item(span = { GridItemSpan(4) }) {
                Text(
                    text = "Menurut kamu, Emosi tersebut datangnya darimana",
                    color = MaterialTheme.colorScheme.onBackground,
                    style = TextStyle(
                        fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                )
            }
            items(dataDummyTrackSourceEmotion.length()) { index ->
                val item = dataDummyTrackSourceEmotion.getJSONObject(index)
                val name = item.getString("name")
                ItemWhyTrackMood(
                    name = name,
                    isSelected = sourceEmotions.value?.contains(name) ?: false,
                    onClick = {
                        viewModel.toggleSourceEmotion(name)
                    },
                )
            }
            item(span = { GridItemSpan(4) }) {
                Spacer(modifier = Modifier.height(16.dp))
            }
            item(span = { GridItemSpan(4) }) {
                Button(
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(
                            width = 1.dp,
                            color = MaterialTheme.colorScheme.primary,
                            shape = RoundedCornerShape(40.dp)
                        )
                        .height(50.dp)
                        .padding(0.dp),
                    colors = ButtonDefaults.buttonColors(Color.White),
                    onClick = {
                        if (positiveEmotions.value!!.isEmpty() || negativeEmotions.value!!.isEmpty() || sourceEmotions.value!!.isEmpty()) {
                            Toast.makeText(context, "Harus memilih semua tiga list", Toast.LENGTH_SHORT).show()
                        } else {
                            val emotionData = idNav?.let { viewModel.getEmotionData(it) }
                            Log.d("UserEmotionTrack", "$emotionData")
                            navController.navigate("home")
                            Toast.makeText(context, "Berhasil menyimpan data", Toast.LENGTH_SHORT).show()

                        }
                    }
                ) {
                    Text(
                        color = MaterialTheme.colorScheme.primary,
                        text = "Selannjutnya",
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                            fontWeight = FontWeight.Normal,
                            fontSize = 16.sp
                        )
                    )
                }
            }
            item(span = { GridItemSpan(4) }) {
                Spacer(modifier = Modifier.height(110.dp))
            }
        }

    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun TrackingMoodPreview() {
    val navController = rememberNavController()
    TrackingMoodScreen(navController)
}
