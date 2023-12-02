package com.rizalsujana.soulbabble

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.rizalsujana.soulbabble.setting.NavGraph
import com.rizalsujana.soulbabble.ui.theme.SoulBabbleTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SoulBabbleTheme {
                NavGraph()
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainPreview() {
    SoulBabbleTheme {
        NavGraph()
    }
}