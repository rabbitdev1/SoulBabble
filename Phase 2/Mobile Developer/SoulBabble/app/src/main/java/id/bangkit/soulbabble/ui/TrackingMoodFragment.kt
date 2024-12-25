package id.bangkit.soulbabble.ui

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsetsController
import androidx.annotation.RequiresApi
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import com.google.android.material.tabs.TabLayoutMediator
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.ViewPagerAdapter

class TrackingMoodFragment : Fragment(R.layout.fragment_tracking_mood) {

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Ambil referensi MaterialToolbar
        val toolbar: androidx.appcompat.widget.Toolbar = view.findViewById(R.id.topAppBar)

        // Atur warna status bar agar sesuai dengan warna primary
        activity?.window?.apply {
            // Atur warna status bar
            statusBarColor = ContextCompat.getColor(requireContext(), R.color.primary)

            // Atur warna teks status bar menjadi putih
            insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        }

        // Gunakan WindowInsets untuk mendapatkan tinggi status bar dan atur margin top
        toolbar.setOnApplyWindowInsetsListener { v, insets ->
            val statusBarHeight = insets.systemWindowInsetTop // Tinggi status bar
            val layoutParams = v.layoutParams as ViewGroup.MarginLayoutParams
            layoutParams.topMargin = statusBarHeight // Set margin top sesuai tinggi status bar
            v.layoutParams = layoutParams
            insets // Kembalikan insets
        }
        toolbar.requestApplyInsets() // Terapkan insets

        // Inisialisasi Toolbar ke dalam Activity
        (activity as? AppCompatActivity)?.setSupportActionBar(toolbar)

        // Inisialisasi ViewPager2 dan Adapter
        val viewPager = view.findViewById<androidx.viewpager2.widget.ViewPager2>(R.id.viewPager)
        viewPager.adapter = ViewPagerAdapter(this)

        // Menghubungkan TabLayout dengan ViewPager2
        val tabLayout = view.findViewById<com.google.android.material.tabs.TabLayout>(R.id.tabLayout)
        TabLayoutMediator(tabLayout, viewPager) { tab, position ->
            tab.text = when (position) {
                0 -> "Week"
                1 -> "Month"
                else -> null
            }
        }.attach()
    }
}
