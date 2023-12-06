package com.rizalsujana.soulbabble.ui.home

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import com.rizalsujana.soulbabble.R
import com.rizalsujana.soulbabble.data.UserProfile
import com.rizalsujana.soulbabble.setting.BottomNavigationBar
import com.rizalsujana.soulbabble.utils.PreferenceManager

@ExperimentalMaterial3Api
@Composable
fun HomeScreen(
    navController: NavHostController
) {
    val viewModel: HomeViewModel = viewModel()
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }

    Scaffold(
        bottomBar = { BottomNavigationBar(navController) },
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxWidth()
                .fillMaxHeight()
                .padding(innerPadding)
        ) {
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
                    .fillMaxSize()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                ) {
                    Row(
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
                        Spacer(modifier = Modifier.width(8.dp))
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
                        Spacer(modifier = Modifier.width(8.dp))
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
                            Spacer(modifier = Modifier.width(4.dp))
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
                Spacer(modifier = Modifier.height(12.dp))
                Box(
                    modifier = Modifier
                        .background(
                            Color(0xFFEDEEF0),
                        )
                        .fillMaxWidth()
                        .height(5.dp)
                )
                Column(
                    modifier = Modifier
                        .padding(16.dp)
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
                    Spacer(modifier = Modifier.height(12.dp))
                    Column(
                        modifier = Modifier
                            .background(
                                Color(0xFFFDEFAA),
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
                            modifier = Modifier.padding(
                                start = 12.dp,
                                end = 12.dp,
                                top = 12.dp,
                                bottom = 8.dp
                            ),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(shape = CircleShape)
                                    .background(
                                        MaterialTheme.colorScheme.secondary,
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
                            Spacer(modifier = Modifier.width(4.dp))
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
                                        fontSize = 14.sp
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
                        }
                        Column(
                            modifier = Modifier.padding(
                                start = 12.dp,
                                end = 12.dp,
                                top = 0.dp,
                                bottom = 12.dp
                            ),
                        ) {
                            Text(
                                text = "Lorem Ipsum",
                                color = MaterialTheme.colorScheme.onBackground,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "You and 126 others Appreciate this.",
                                color = MaterialTheme.colorScheme.onBackground,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                    fontWeight = FontWeight.Light,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }
                }
                Box(
                    modifier = Modifier
                        .background(
                            Color(0xFFEDEEF0),
                        )
                        .fillMaxWidth()
                        .height(5.dp)
                )

                Column(
                    modifier = Modifier
                        .padding(16.dp)
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
                    Spacer(modifier = Modifier.height(12.dp))
                    Column(
                        modifier = Modifier
                            .background(
                                Color(0xFFFDEFAA),
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
                            modifier = Modifier.padding(
                                start = 12.dp,
                                end = 12.dp,
                                top = 12.dp,
                                bottom = 8.dp
                            ),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(shape = CircleShape)
                                    .background(
                                        MaterialTheme.colorScheme.secondary,
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
                            Spacer(modifier = Modifier.width(4.dp))
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
                                        fontSize = 14.sp
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
                        }
                        Column(
                            modifier = Modifier.padding(
                                start = 12.dp,
                                end = 12.dp,
                                top = 0.dp,
                                bottom = 12.dp
                            ),
                        ) {
                            Text(
                                text = "Lorem Ipsum",
                                color = MaterialTheme.colorScheme.onBackground,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "You and 126 others Appreciate this.",
                                color = MaterialTheme.colorScheme.onBackground,
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
    }
}

@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun HomeScreenPreview() {
    val navController = rememberNavController()

    HomeScreen(navController)
}
