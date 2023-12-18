package id.soulbabble.bangkit

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import androidx.core.app.ActivityCompat
import com.google.firebase.FirebaseApp
import id.soulbabble.bangkit.notification.NotificationUtil
import id.soulbabble.bangkit.setting.NavGraph
import id.soulbabble.bangkit.ui.theme.SoulBabbleTheme

@ExperimentalMaterialApi
@ExperimentalFoundationApi
class MainActivity : ComponentActivity() {
    private val NOTIFICATION_PERMISSION_REQUEST = 1001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        checkNotificationPermission()
        setContent {
            SoulBabbleTheme {
                NavGraph()
            }
        }
    }
    private fun checkNotificationPermission() {
        val permission = Manifest.permission.VIBRATE

        val permissionGranted = (packageManager.checkPermission(permission, packageName)
                == PackageManager.PERMISSION_GRANTED)

        if (!permissionGranted) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(permission),
                NOTIFICATION_PERMISSION_REQUEST
            )
        }
    }
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == NOTIFICATION_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                NotificationUtil.scheduleNotification(this)
            } else {
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