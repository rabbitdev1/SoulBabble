package id.soulbabble.bangkit.ui.utils

import android.net.Uri
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.rememberNavController
import coil.compose.rememberAsyncImagePainter
import id.soulbabble.bangkit.data.OnBoardingItems
import id.soulbabble.bangkit.ui.home.HomeScreen
import id.soulbabble.bangkit.R
import java.util.Locale


@Composable
fun OnBoardingItem(items: OnBoardingItems) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Bottom,
        modifier = Modifier
            .fillMaxSize()
    ) {
        Image(
            painter = painterResource(id = items.image),
            contentDescription = "Image1",
            modifier = Modifier
                .width(200.dp)
                .height(200.dp)
        )
        Spacer(modifier = Modifier.height(25.dp))
        Text(
            text =  items.title,
            style = MaterialTheme.typography.headlineMedium,
             fontSize = 24.sp,
            color = MaterialTheme.colorScheme.onBackground,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            letterSpacing = 1.sp,
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = items.desc,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onBackground.copy(alpha = 0.7f),
            fontWeight = FontWeight.Light,
            textAlign = TextAlign.Center,
            letterSpacing = 1.sp,
        )
    }
}
@Composable
fun ItemGeneralProfile(
    modifier: Modifier = Modifier,
    label: String,
    onClick: () -> Unit,
) {
    Button(
        modifier = modifier
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
            onClick()
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

@Composable
fun ItemNotification(
    title: String,
    description: String,
    date: String
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 4.dp)
    ) {
        Text(
            text = title,
            style = TextStyle(
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        )
        Text(
            text = description,
            style = TextStyle(
                fontSize = 12.sp
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
        Text(
            text = date,
            style = TextStyle(
                color = Color.Gray,
                fontSize = 12.sp
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
        Divider(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            color = Color(0xFFDADADA),
            thickness = 1.dp
        )
    }
}
@Composable
fun ItemInterest(
    title: String,
    description: String,
    date: String,
    image: String,
    onClick: () -> Unit
) {
    Column(
        verticalArrangement = Arrangement.spacedBy(4.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(start = 12.dp, end = 12.dp)
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
            .padding(12.dp)
            .clickable { onClick() }
    ) {
        Image(
            painter = rememberAsyncImagePainter(model = image),
            contentDescription = "Profile Image",
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(2f / 1f)
                .fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        Text(
            text = title,
            style = TextStyle(
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp
            )
        )
        Text(
            text = description,
            style = TextStyle(
                fontSize = 12.sp
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
        Text(
            text = date,
            style = TextStyle(
                fontSize = 12.sp
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
    }
}

@Composable
fun ItemJournaling(
    post: String,
    image: Uri?,
    username: String,
    date: String,
    onClick: () -> Unit
) {
        Column(
            modifier = Modifier
                .background(
                    Color(0xFFFFFFFF),
                )
                .fillMaxWidth()
                .clickable { onClick() }
        ) {
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
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
                        painter = rememberAsyncImagePainter(model =image),
                        contentDescription = "Emot Image",
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
                        text = username,
                        color = MaterialTheme.colorScheme.primary,
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    )
                    Text(
                        color = Color.Black,
                        text = date,
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_light)),
                            fontWeight = FontWeight.Light,
                            fontSize = 12.sp
                        )
                    )
                }
            }
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(
                    start = 12.dp,
                    end = 12.dp,
                    top = 0.dp,
                    bottom = 12.dp
                ),
            ) {
                Text(
                    text = post,
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
@Composable
fun ItemListEmoticonInterest(
    name: String,
    emoticon: String,
    total: Int,
    onClick: () -> Unit
){
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
                        .fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = emoticon,
                        style = TextStyle(
                            fontSize = 30.sp
                        ),
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f)
                ) {
                    Text(
                        text = name,
                        color = MaterialTheme.colorScheme.primary,
                        style = TextStyle(
                            fontFamily = FontFamily(Font(R.font.plus_jakarta_bold)),
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                    )
                    Text(
                        color = Color.Black,
                        text = "Total Emosi pada bulan ini : $total",
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


@Composable
fun ItemMoodWeekly(
    name: String,
    emoticon: String,
    cheking:Boolean,
    onClick: () -> Unit
){
    Column(
        verticalArrangement = Arrangement.spacedBy(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(50.dp)
                .background(
                    color = if (cheking) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onPrimary,
                    shape = RoundedCornerShape(4.dp)
                )
                .fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = emoticon,
                style = TextStyle(
                    fontSize = 30.sp
                ),
            )
        }
        Text(
            text = name,
            style = TextStyle(
                fontSize = 10.sp
            ),
        )
    }
}


@Composable
fun ItemWhyTrackMood(
    name: String,
    isSelected: Boolean,
    onClick: () -> Unit
){
    val backgroundColor = if (isSelected) {
        MaterialTheme.colorScheme.primary
    } else {
        Color(0x9A19A7CE)
    }
    val textColor = if (isSelected) {
        Color.White
    } else {
        MaterialTheme.colorScheme.primary
    }

    Column(
        modifier = Modifier
            .background(
                backgroundColor,
                shape = RoundedCornerShape(8.dp)
            )
            .fillMaxWidth()
            .border(
                width = 1.dp,
                color = Color(0xFF19A7CE),
                shape = RoundedCornerShape(8.dp)
            )
            .clickable { onClick() },
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = name.replaceFirstChar { if (it.isLowerCase()) it.titlecase(Locale.getDefault()) else it.toString() },
            style = TextStyle(
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                color = textColor
            ),
            modifier = Modifier.padding(8.dp)
        )
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
