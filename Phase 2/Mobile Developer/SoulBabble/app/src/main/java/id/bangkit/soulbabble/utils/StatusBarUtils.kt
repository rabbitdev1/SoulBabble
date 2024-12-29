package id.bangkit.soulbabble.utils

import android.os.Build
import android.view.Window
import android.view.WindowInsetsController
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import android.content.Context

object StatusBarUtils {
    @RequiresApi(Build.VERSION_CODES.R)
    fun setupStatusBar(window: Window, context: Context, colorResId: Int) {
        window.statusBarColor = ContextCompat.getColor(context, colorResId)
        window.insetsController?.setSystemBarsAppearance(
            WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
            WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
        )
    }
}
