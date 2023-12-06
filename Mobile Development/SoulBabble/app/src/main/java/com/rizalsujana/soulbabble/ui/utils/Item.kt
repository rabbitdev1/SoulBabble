package com.rizalsujana.soulbabble.ui.utils

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
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
import androidx.navigation.compose.rememberNavController
import com.google.accompanist.pager.ExperimentalPagerApi
import com.rizalsujana.soulbabble.R
import com.rizalsujana.soulbabble.data.OnBoardingItems
import com.rizalsujana.soulbabble.ui.boarding.OnBoarding


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
                fontSize = 18.sp
            )
        )
        Text(
            text = description,
            style = TextStyle(
                fontSize = 16.sp
            ),
            modifier = Modifier.padding(top = 4.dp)
        )
        Text(
            text = date,
            style = TextStyle(
                color = Color.Gray,
                fontSize = 14.sp
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


@OptIn(ExperimentalPagerApi::class)
@Preview(showBackground = true)
@Composable
fun OnBoardingPreview() {
    val navController = rememberNavController()
    OnBoarding(navController)
}
