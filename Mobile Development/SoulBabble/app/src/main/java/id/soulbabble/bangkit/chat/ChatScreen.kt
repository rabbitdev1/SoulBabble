package id.soulbabble.bangkit.chat

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
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
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.OnBoardingData.items
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.data.dummyMessages
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.utils.PreferenceManager

@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Composable
fun ChatScreen(
    navController: NavHostController
) {
    val viewModel: ChatViewModel = viewModel()
    val context = LocalContext.current
    val userProfile = remember { mutableStateOf(UserProfile("", "", "", null)) }

    val messages = remember {
        mutableListOf<Pair<String, Boolean>>()
    }

    val messageState = remember {
        mutableStateOf("")
    }

    if (messages.isEmpty()) {
        messages.addAll(dummyMessages)
    }

    LaunchedEffect(Unit) {
        userProfile.value = PreferenceManager.getUserProfile(context)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Chat Dengan AI",
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
    )
    {
        run {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(it)
            ) {
                LazyColumn(
                    modifier = Modifier
                        .weight(1f).padding(8.dp)
                ) {
                    items(messages) { (message, isSentByUser) ->
                        MessageBubble(message = message, isSentByUser = isSentByUser)
                    }
                }

                Row(
                    verticalAlignment = Alignment.Bottom,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(8.dp)
                ) {
                    BasicTextField(
                        value = messageState.value,
                        onValueChange = {
                            messageState.value = it
                        },
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 8.dp)
                    )

                    IconButton(
                        onClick = {
                            if (messageState.value.isNotBlank()) {
                                messages.add(messageState.value to true)
                                messageState.value = ""
                            }
                        },
                        modifier = Modifier.align(Alignment.Bottom)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Send,
                            contentDescription = "Send",
                            modifier = Modifier
                                .size(24.dp)
                                .padding(4.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MessageBubble(message: String, isSentByUser: Boolean) {
    val bubbleColor = if (isSentByUser) Color.Blue else Color.LightGray
    val textColor = if (isSentByUser) Color.White else Color.Black
    val alignment = if (isSentByUser) Alignment.CenterEnd else Alignment.CenterStart

    val shape = bubbleShape(isSentByUser)

    Box(
        contentAlignment = alignment,
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth()
    ) {
        Surface(
            shape = shape,
            color = bubbleColor,
        ) {
            Text(
                text = message,
                color = textColor,
                fontSize = 18.sp,
                modifier = Modifier.padding(10.dp)
            )
        }
    }
}

fun bubbleShape(isSentByUser: Boolean): Shape {
    return if (isSentByUser) {
        RoundedCornerShape(bottomStart = 16.dp, topStart = 16.dp, bottomEnd = 16.dp)
    } else {
        RoundedCornerShape(bottomStart = 16.dp, topEnd = 16.dp, bottomEnd = 16.dp)
    }
}




@ExperimentalFoundationApi
@ExperimentalMaterial3Api
@Preview(showBackground = true)
@Composable
fun ChatScreenPreview() {
    val navController = rememberNavController()
    ChatScreen(navController)
}