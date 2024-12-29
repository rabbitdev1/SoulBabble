package id.bangkit.soulbabble.ui.Profile

import android.os.Build
import android.os.Bundle
import android.view.ViewGroup
import androidx.activity.enableEdgeToEdge
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.utils.StatusBarUtils
import id.bangkit.soulbabble.utils.setupToolbar

class KebijakanPrivacyActivity : AppCompatActivity() {
    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_kebijakan_privacy)
        val toolbar: androidx.appcompat.widget.Toolbar = findViewById(R.id.topAppBar)

        toolbar.setOnApplyWindowInsetsListener { v, insets ->
            val statusBarHeight = insets.systemWindowInsetTop
            val layoutParams = v.layoutParams as ViewGroup.MarginLayoutParams
            layoutParams.topMargin = statusBarHeight
            v.layoutParams = layoutParams
            insets
        }
        StatusBarUtils.setupStatusBar(window, this, R.color.primary)
        setupToolbar(this, toolbar, title = "Kebijakan Privasi")
    }
}