package id.bangkit.soulbabble.ui

import android.os.Build
import android.os.Bundle
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.NavigationUI
import com.google.android.material.bottomnavigation.BottomNavigationView
import id.bangkit.soulbabble.R

class HomeActivity : AppCompatActivity() {

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        setupNavigation()
        setupEdgeToEdgeDisplay()
    }

    /**
     * Mengatur Navigation Component dengan BottomNavigationView.
     */
    private fun setupNavigation() {
        // Mengambil NavHostFragment dari layout
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
            ?: throw IllegalStateException("NavHostFragment not found in activity_home.xml")

        // Menghubungkan BottomNavigationView dengan NavController
        val navController = navHostFragment.navController
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)
        NavigationUI.setupWithNavController(bottomNavigationView, navController)
    }

    /**
     * Mengaktifkan tampilan edge-to-edge untuk aplikasi.
     */
    @RequiresApi(Build.VERSION_CODES.R)
    private fun setupEdgeToEdgeDisplay() {
        window.setDecorFitsSystemWindows(false)
    }
}
