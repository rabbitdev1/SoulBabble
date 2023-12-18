package id.soulbabble.bangkit

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.google.firebase.FirebaseApp
import id.soulbabble.bangkit.setting.NavGraph
import id.soulbabble.bangkit.ui.theme.SoulBabbleTheme

@ExperimentalMaterialApi
@ExperimentalFoundationApi
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        setContent {
            SoulBabbleTheme {
                NavGraph()
            }
        }
    }
}

@ExperimentalMaterialApi
@ExperimentalFoundationApi
@Preview(showBackground = true)
@Composable
fun MainPreview() {
    SoulBabbleTheme {
        NavGraph()
    }
}