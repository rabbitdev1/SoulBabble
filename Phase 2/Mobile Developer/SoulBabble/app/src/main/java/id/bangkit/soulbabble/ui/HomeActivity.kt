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

        // Get the NavHostFragment
        val navHostFragment = supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as? NavHostFragment
            ?: throw NullPointerException("NavHostFragment not found!")

        // Get the NavController from the NavHostFragment
        val navController = navHostFragment.navController

        // Set up the BottomNavigationView with the NavController
        val bottomNavigationView: BottomNavigationView = findViewById(R.id.bottom_navigation)
        NavigationUI.setupWithNavController(bottomNavigationView, navController)
        window.setDecorFitsSystemWindows(false)
    }
}
