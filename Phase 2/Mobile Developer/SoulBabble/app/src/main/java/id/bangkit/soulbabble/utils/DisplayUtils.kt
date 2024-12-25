package id.bangkit.soulbabble.utils

import android.content.Context
import android.os.Build
import android.view.WindowInsets
import android.view.WindowManager

// Fungsi untuk mendapatkan tinggi status bar
fun getStatusBarHeight(context: Context): Int {
    val resourceId = context.resources.getIdentifier("status_bar_height", "dimen", "android")
    return if (resourceId > 0) {
        context.resources.getDimensionPixelSize(resourceId)
    } else {
        24.dpToPx(context) // Default tinggi status bar dalam dp
    }
}

// Ekstensi untuk mengkonversi dp ke px
fun Int.dpToPx(context: Context): Int {
    return (this * context.resources.displayMetrics.density).toInt()
}
