package id.bangkit.soulbabble.ui.Journaling

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowInsetsController
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.ui.HomeActivity // Ganti dengan nama class Home Anda

class SuccessJournalingActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_success_journaling)

        // Mengatur warna status bar
        setupStatusBar()

        // Inisialisasi Views
        val buttonNext: Button = findViewById(R.id.buttonDetail)

        // Tombol Lanjutkan
        buttonNext.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java) // Ganti ke HomeActivity
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish() // Tutup SuccessJournalingActivity
        }
    }

    private fun setupStatusBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.statusBarColor = ContextCompat.getColor(this, R.color.primary)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        }
    }

    @SuppressLint("MissingSuperCall")
    override fun onBackPressed() {
        // Kembali ke halaman Home
        val intent = Intent(this, HomeActivity::class.java) // Ganti ke HomeActivity
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
        startActivity(intent)
        finish() // Tutup SuccessJournalingActivity
    }
}
