package id.soulbabble.bangkit.ui.consultation

import android.annotation.SuppressLint
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Canvas
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.nativeCanvas
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalDensity
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
import id.soulbabble.bangkit.data.UserProfile
import id.soulbabble.bangkit.data.dummyMessages
import id.soulbabble.bangkit.setting.BottomNavigationBar
import id.soulbabble.bangkit.utils.PreferenceManager

@SuppressLint("UnusedMaterial3ScaffoldPaddingParameter")
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

    var messageState = remember {
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
        bottomBar = { BottomNavigationBar(navController) },
    )
    { innerPadding ->
        Column(
            modifier = Modifier
                .background(Color(0xFFF5F5F6))
                .fillMaxSize(1f)
                .padding(innerPadding)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .weight(1f)
            ) {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    items(messages) { (message, isSentByUser) ->
                        MessageBubble(message = message, isSentByUser = isSentByUser)
                    }
                }
            }
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .background(Color.White)
                    .fillMaxWidth()
                    .drawWithContent {
                        drawContent()
                        drawIntoCanvas { canvas: Canvas ->
                            canvas.nativeCanvas?.translate(0f, (-8).dp.toPx())
                        }
                    }
            ) {
                TextField(
                    value =  messageState.value,
                    onValueChange = { newTextValue ->
                        messageState.value = newTextValue
                    },
                    colors = TextFieldDefaults.textFieldColors(
                        disabledTextColor = Color.Transparent,
                        containerColor = Color.White,
                        focusedIndicatorColor = Color.Transparent,
                        unfocusedIndicatorColor = Color.Transparent,
                        disabledIndicatorColor = Color.Transparent
                    ),
                    modifier = Modifier
                        .fillMaxWidth(1f)
                        .weight(1f)
                        .padding(start = 8.dp, end = 8.dp)
                        .heightIn(min = 10.dp),
                    textStyle = TextStyle(
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Normal,
                        fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                        color = Color.Black
                    ),
                    singleLine = false,
                    placeholder = {
                        Text("Masukkan teks di sini",
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Light,
                            fontSize = 16.sp
                        )
                    }
                )
                IconButton(
                    onClick = {
                        if (messageState.value.isNotBlank()) {
                            messages.add(messageState.value to true)
                            messageState.value = ""
                        }
                    },
                    modifier = Modifier.align(Alignment.CenterVertically)
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

@Composable
fun MessageBubble(message: String, isSentByUser: Boolean) {
    val bubbleColor =
        if (isSentByUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.secondary
    val textColor = if (isSentByUser) Color.White else Color.Black
    val alignment = if (isSentByUser) Alignment.CenterEnd else Alignment.CenterStart

    val shape = bubbleShape(isSentByUser)

    Box(
        contentAlignment = alignment,
        modifier = Modifier
            .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 4.dp)
            .fillMaxWidth()
    ) {
        Surface(
            shape = shape,
            color = bubbleColor,
        ) {
            Text(
                text = message,
                color = textColor,
                fontSize = 14.sp,
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