package com.rizalsujana.soulbabble.ui.profile

import android.annotation.SuppressLint
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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
import com.rizalsujana.soulbabble.R
import com.rizalsujana.soulbabble.setting.BottomNavigationBar
import com.rizalsujana.soulbabble.ui.auth.AuthenticationViewModel
import org.json.JSONArray
import org.json.JSONObject

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter", "PrivateResource")
@ExperimentalMaterial3Api
@Composable
fun ProfileScreen(
    navController: NavHostController
                  ,viewModel: AuthenticationViewModel
) {
    val dataGeneral = jsonDataGeneral()
    val dataPersonal = jsonDataPersonal()

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
                            fontSize = 20.sp
                        )
                    )
                },
                colors = TopAppBarDefaults.smallTopAppBarColors(containerColor = MaterialTheme.colorScheme.primary),
                actions = {
                    IconButton(
                        onClick = {
                            navController.popBackStack()
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

            LazyColumn (
                modifier = Modifier.padding(start=16.dp,end=16.dp,top=0.dp, bottom = 0.dp),
                ) {
                item {
                    Spacer(modifier = Modifier.height(16.dp))
                    Box(
                        modifier = Modifier
                            .background(MaterialTheme.colorScheme.onPrimary, shape = RoundedCornerShape(8.dp))
                            .fillMaxWidth()
                            .border(width = 1.dp, color = Color(0xFFDADADA), shape = RoundedCornerShape(8.dp))
                    ) {
                        Row(
                            modifier = Modifier.padding(8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Image(
                                painter = painterResource(id = R.drawable.ic_profile),
                                contentDescription = "Profile Image",
                                modifier = Modifier.size(100.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column(modifier = Modifier.fillMaxWidth()) {
                                Text(
                                    text = "Nama",
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
                                    text = "email@example.com",
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
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(width = 1.dp, color = Color(0xFFDADADA), shape = RoundedCornerShape(4.dp))
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
                            navController.navigate(path)
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                color = Color.Black,
                                text = label,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Icon(
                                painter = painterResource(id = R.drawable.ic_arrow_right),
                                contentDescription = "Icon",
                                modifier = Modifier.size(19.dp),
                                tint = Color.Black
                            )
                        }
                    }
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
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(width = 1.dp, color = Color(0xFFDADADA), shape = RoundedCornerShape(4.dp))
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
                            val encodedUrl = Uri.encode(url)
                            navController.navigate("webview/$label/$encodedUrl")
                        }
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                color = Color.Black,
                                text = label,
                                style = TextStyle(
                                    fontFamily = FontFamily(Font(R.font.plus_jakarta_sans)),
                                    fontWeight = FontWeight.Normal,
                                    fontSize = 16.sp
                                )
                            )
                            Spacer(modifier = Modifier.weight(1f))
                            Icon(
                                painter = painterResource(id = R.drawable.ic_arrow_right),
                                contentDescription = "Icon",
                                modifier = Modifier.size(19.dp),
                                tint = Color.Black
                            )
                        }
                    }
                }
                item {
                    Spacer(modifier = Modifier.height(8.dp))
                    Button(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(width = 1.dp, color = Color(0xFFF83B00), shape = RoundedCornerShape(40.dp))
                            .height(50.dp)
                            .padding(0.dp),
                        colors = ButtonDefaults.buttonColors(Color.White),
                        onClick = {
                            //                viewModel.logOut()
                            navController.navigate("auth") {
                                popUpTo("home") { inclusive = true }
                            }
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


fun jsonDataPersonal(): JSONArray {
    val jsonArray = JSONArray()

    val detailPengguna = JSONObject()
    detailPengguna.put("label", "Detail Pengguna")
    detailPengguna.put("path", "detail-profile")
    jsonArray.put(detailPengguna)

    val postingan = JSONObject()
    postingan.put("label", "Postingan")
    postingan.put("path", "post")
    jsonArray.put(postingan)

    val notifikasi = JSONObject()
    notifikasi.put("label", "Notifikasi")
    notifikasi.put("path", "notification")
    jsonArray.put(notifikasi)

    return jsonArray
}
fun jsonDataGeneral(): JSONArray {
    val jsonArray = JSONArray()



    val pusatBantuan = JSONObject()
    pusatBantuan.put("label", "Pusat Bantuan")
    pusatBantuan.put("url", "https://github.com/react-native-webview/react-native-webview/issues/1619")
    jsonArray.put(pusatBantuan)

    val syaratKetentuan = JSONObject()
    syaratKetentuan.put("label", "Syarat & Ketentuan 2")
    syaratKetentuan.put("url", "https://example.com/syarat-ketentuan")
    jsonArray.put(syaratKetentuan)

    val kebijakanPrivasi = JSONObject()
    kebijakanPrivasi.put("label", "Kebijakan Privasi")
    kebijakanPrivasi.put("url", "https://example.com/kebijakan-privasi")
    jsonArray.put(kebijakanPrivasi)

    return jsonArray
}

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    val navController = rememberNavController()

    val viewModel: AuthenticationViewModel = viewModel()
    ProfileScreen(navController,viewModel)
}
