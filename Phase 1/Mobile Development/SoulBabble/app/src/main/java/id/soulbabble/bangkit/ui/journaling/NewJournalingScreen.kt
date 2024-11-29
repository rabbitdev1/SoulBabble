package id.soulbabble.bangkit.ui.journaling

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
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
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
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.rememberNavController
import coil.compose.rememberAsyncImagePainter
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.ui.utils.ToastUtils
import id.soulbabble.bangkit.utils.PreferenceManager

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Composable
fun NewJournalingScreen(
    navController: NavHostController
) {
    val viewModel: JorunalingViewModel = viewModel()
    val context = LocalContext.current
    val navigateToCommunity by viewModel.navigateToCommunity.observeAsState()
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }
    var textValue by remember { mutableStateOf("") }
    var isPosting by remember { mutableStateOf(false) }

    val toastMessage by viewModel.toastMessage.observeAsState()

    toastMessage?.let {
        ToastUtils.showToast(LocalContext.current, it)
        viewModel.resetToastMessage()
    }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }
    LaunchedEffect(navigateToCommunity) {
        if (navigateToCommunity == true) {
            navController.popBackStack()
        }
    }
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Tambah Journaling",
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
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = MaterialTheme.colorScheme.primary),
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primary)
            )
        },
    ) { innerPadding ->
        LazyVerticalGrid(
            columns = GridCells.Fixed(1),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxSize()
                .padding(innerPadding)

        ) {
            item() {
                Column(
                    modifier = Modifier
                        .background(
                            MaterialTheme.colorScheme.onPrimary,
                        )
                        .fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier
                            .padding(start = 16.dp, end = 16.dp, top = 16.dp),
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
                                text = userProfile.value.displayName.toString(),
                                color = MaterialTheme.colorScheme.primary,
                                textAlign = TextAlign.Center,
                                letterSpacing = 1.sp,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 16.sp
                                )
                            )
                            Text(
                                color = Color.Black,
                                text = "Apa yang kamu curahkan?",
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                    fontWeight = FontWeight.Light,
                                    fontSize = 12.sp
                                )
                            )
                        }
                    }
                    Spacer(
                        modifier = Modifier
                            .fillMaxSize()
                            .height(10.dp)
                    )
                    TextField(
                        value = textValue,
                        onValueChange = { newTextValue ->
                            textValue = newTextValue
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 16.dp, end = 16.dp)
                            .background(Color.Gray, RoundedCornerShape(8.dp))
                            .heightIn(min = 200.dp),
                        textStyle = TextStyle(
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Normal,
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            color = Color.Black
                        ),
                        singleLine = false,
                        placeholder = {
                            Text(
                                "Masukkan teks di sini",
                                fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                fontWeight = FontWeight.Light,
                                fontSize = 16.sp
                            )
                        }
                    )
                    Spacer(
                        modifier = Modifier
                            .fillMaxSize()
                            .height(4.dp)
                    )
                    Text(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(start = 12.dp, end = 12.dp, bottom = 16.dp),
                        color = Color.Black,
                        text = "Maksimal 300 Karakter",
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Light,
                            fontSize = 12.sp
                        )
                    )
                }
            }
            item() {
                Spacer(
                    modifier = Modifier
                        .fillMaxSize()
                        .height(5.dp)
                        .background(Color(0xFFEDEEF0))
                )
            }

            item {
                Spacer(modifier = Modifier.height(8.dp))
                Box(
                    modifier = Modifier.padding(16.dp)
                ) {
                    if (isPosting) {
                        CircularProgressIndicator(
                            modifier = Modifier
                                .size(50.dp)
                                .align(Alignment.Center)
                        )
                    } else {
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
                                if (textValue.isNotBlank()) {
                                    isPosting = true // Set isPosting to true when the button is clicked
                                    val fullname = userProfile.value.displayName ?: "Anonymous"
                                    viewModel.postJournal(fullname, textValue)
                                }
                            }
                        ) {
                            Text(
                                color = MaterialTheme.colorScheme.primary,
                                text = "Posting Journaling",
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(100.dp))
            }
        }
    }
}

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun NewJournalingScreenPreview() {
    val navController = rememberNavController()
    NewJournalingScreen(navController)
}
