package com.rizalsujana.soulbabble.ui.profile

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import coil.compose.rememberAsyncImagePainter
import com.rizalsujana.soulbabble.R
import com.rizalsujana.soulbabble.data.UserProfile
import com.rizalsujana.soulbabble.setting.BottomNavigationBar
import com.rizalsujana.soulbabble.utils.PreferenceManager


@ExperimentalMaterial3Api
@Composable
fun DetailUserScreen(
    navController: NavHostController
) {
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
                        text = "Detail Profile",
                        color = MaterialTheme.colorScheme.onPrimary,
                        textAlign = TextAlign.Center,
                        letterSpacing = 1.sp,
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                            fontWeight = FontWeight.Normal,
                            fontSize = 20.sp
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

            LazyColumn(
                modifier = Modifier.padding(start = 16.dp, end = 16.dp, top = 0.dp, bottom = 0.dp),
            ) {
                item {
                    Spacer(modifier = Modifier.height(16.dp))
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
                            Image(
                                painter = rememberAsyncImagePainter(model = userProfile.value.photoUrl),
                                contentDescription = "Profile Image",
                                Modifier
                                    .fillMaxSize()
                                    .aspectRatio(1f),
                               contentScale = ContentScale.Crop
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                }
                item {
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = 1.dp,
                                color = Color(0xFFDADADA),
                                shape = RoundedCornerShape(4.dp)
                            )
                            .height(50.dp)
                            .padding(0.dp),
                        shape = RoundedCornerShape(4.dp),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        contentPadding = PaddingValues(
                            start = 8.dp,
                            top = 4.dp,
                            end = 8.dp,
                            bottom = 4.dp,
                        ),
                        onClick = {
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                color = Color.Black,
                                text = userProfile.value.displayName.toString(),
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
                item {
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = 1.dp,
                                color = Color(0xFFDADADA),
                                shape = RoundedCornerShape(4.dp)
                            )
                            .height(50.dp)
                            .padding(0.dp),
                        shape = RoundedCornerShape(4.dp),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        contentPadding = PaddingValues(
                            start = 8.dp,
                            top = 4.dp,
                            end = 8.dp,
                            bottom = 4.dp,
                        ),
                        onClick = {
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                color = Color.Black,
                                text = userProfile.value.email.toString(),
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
                item {
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = 1.dp,
                                color = Color(0xFFDADADA),
                                shape = RoundedCornerShape(4.dp)
                            )
                            .height(50.dp)
                            .padding(0.dp),
                        shape = RoundedCornerShape(4.dp),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        contentPadding = PaddingValues(
                            start = 8.dp,
                            top = 4.dp,
                            end = 8.dp,
                            bottom = 4.dp,
                        ),
                        onClick = {
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                color = Color.Black,
                                text = userProfile.value.uid,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        color = Color.Black,
                        text = "data ini tidak bisa di ubah karena terintegrasi \n" +
                                "ke akun goggle anda",
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Normal,
                            fontSize = 12.sp,
                            textAlign = TextAlign.Center
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun DetailScreenPreview() {
    val navController = rememberNavController()
    DetailUserScreen(navController)
}
