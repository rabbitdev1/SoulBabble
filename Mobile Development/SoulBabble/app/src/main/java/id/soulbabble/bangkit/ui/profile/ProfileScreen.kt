package id.soulbabble.bangkit.ui.profile

import android.net.Uri
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
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
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.ui.utils.ItemGeneralProfile
import id.soulbabble.bangkit.utils.PreferenceManager
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.ui.utils.ToastUtils
import org.json.JSONArray

@ExperimentalMaterial3Api
@Composable
fun ProfileScreen(
    navController: NavHostController
) {
    val viewModel: ProfileViewModel = viewModel()
    val dataGeneral by viewModel.getGeneralData().observeAsState(JSONArray())
    val dataPersonal by viewModel.getPersonalData().observeAsState(JSONArray())
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }
    val navigateToAuth by viewModel.navigateToAuth.observeAsState()
    val toastMessage by viewModel.toastMessage.observeAsState()

    toastMessage?.let {
        ToastUtils.showToast(LocalContext.current, it)
        viewModel.resetToastMessage()
    }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }
    LaunchedEffect(navigateToAuth) {
        if (navigateToAuth == true) {
            navController.navigate("auth") {
                popUpTo("home") { inclusive = true }
            }
        }
    }
    Scaffold(
        topBar = {
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
        },
        bottomBar = { BottomNavigationBar(navController) },
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
                            Column(modifier = Modifier.fillMaxWidth()) {
                                Text(
                                    text = userProfile.value.displayName.toString(),
                                    color = MaterialTheme.colorScheme.primary,
                                    textAlign = TextAlign.Center,
                                    letterSpacing = 1.sp,
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                        fontWeight = FontWeight.Normal,
                                        fontSize = 20.sp
                                    )
                                )
                                Text(
                                    color = Color.Black,
                                    text = userProfile.value.email.toString(),
                                    style = TextStyle(
                                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                                        fontWeight = FontWeight.Light,
                                        fontSize = 14.sp
                                    )
                                )
                            }
                        }
                    }

                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        color = Color.Black,
                        text = "Akun",
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Light,
                            fontSize = 14.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }
                items(dataPersonal.length()) { index ->
                    val item = dataPersonal.getJSONObject(index)
                    val label = item.getString("label")
                    val path = item.getString("path")
                    if (index > 0) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                    ItemGeneralProfile(
                        modifier = Modifier.fillMaxWidth(),
                        label = label,
                        onClick = { navController.navigate(path) },
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        color = Color.Black,
                        text = "General Info",
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Light,
                            fontSize = 14.sp
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                }
                items(dataGeneral.length()) { index ->
                    val item = dataGeneral.getJSONObject(index)
                    val label = item.getString("label")
                    val url = item.getString("url")
                    if (index > 0) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                    ItemGeneralProfile(
                        modifier = Modifier.fillMaxWidth(),
                        label = label,
                        onClick = {
                            val encodedUrl = Uri.encode(url)
                            navController.navigate("webview/$label/$encodedUrl")
                        },
                    )
                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = 1.dp,
                                color = Color(0xFFF83B00),
                                shape = RoundedCornerShape(40.dp)
                            )
                            .height(50.dp)
                            .padding(0.dp),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        onClick = {
                            viewModel.logOut()
                        }
                    ) {
                        Text(
                            color = Color(0xFFF83B00),
                            text = "Keluar Akun",
                            style = TextStyle(
                                fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                                fontWeight = FontWeight.Normal,
                                fontSize = 16.sp
                            )
                        )
                    }
                    Spacer(modifier = Modifier.height(100.dp))
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

    ProfileScreen(navController)
}
