package id.bangkit.soulbabble.ui

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.appcompat.app.AppCompatActivity
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.utils.AuthStorage // Import AuthStorage

@SuppressLint("CustomSplashScreen")
class SplashScreenActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash_screen)

        val splashDuration = 3000L // Duration for the splash screen to show (3 seconds)

        // Handler untuk menunggu beberapa waktu sebelum berpindah aktivitas
        Handler(Looper.getMainLooper()).postDelayed({
            // Mengecek apakah data autentikasi sudah ada
            if (isUserLoggedIn()) {
                // Jika sudah login, arahkan ke HomeActivity
                val intent = Intent(this@SplashScreenActivity, HomeActivity::class.java)
                startActivity(intent)
            } else {
                // Jika belum login, arahkan ke OnboardingActivity
                val intent = Intent(this@SplashScreenActivity, OnboardingActivity::class.java)
                startActivity(intent)
            }
            finish() // Tutup SplashScreenActivity
        }, splashDuration)
    }

    // Fungsi untuk mengecek apakah data autentikasi sudah ada
    private fun isUserLoggedIn(): Boolean {
        // Mengecek apakah UID, API Key, dan Token ada di SharedPreferences
        val uid = AuthStorage.getUid(this)
        val apiKey = AuthStorage.getApiKey(this)
        val token = AuthStorage.getToken(this)

        return !(uid.isNullOrEmpty() || apiKey.isNullOrEmpty() || token.isNullOrEmpty())
    }
}
