package id.bangkit.soulbabble.ui

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager2.widget.ViewPager2
import com.tbuonomo.viewpagerdotsindicator.DotsIndicator
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.OnboardingAdapter
import id.bangkit.soulbabble.model.OnboardingItem

class OnboardingActivity : AppCompatActivity() {

    private lateinit var adapter: OnboardingAdapter
    private lateinit var viewPager: ViewPager2
    private lateinit var buttonNext: Button
    private lateinit var textSkip: TextView
    private lateinit var dotsIndicator: DotsIndicator

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_onboarding)

        initializeViews()
        setupViewPager()
        setupButtons()
    }

    /**
     * Menginisialisasi tampilan utama.
     */
    private fun initializeViews() {
        viewPager = findViewById(R.id.viewPager)
        buttonNext = findViewById(R.id.buttonNext)
        textSkip = findViewById(R.id.textSkip)
        dotsIndicator = findViewById(R.id.dotsIndicator)
    }

    /**
     * Mengatur ViewPager dengan adapter dan indikator.
     */
    private fun setupViewPager() {
        val items = generateOnboardingItems()

        adapter = OnboardingAdapter(items)
        viewPager.adapter = adapter
        dotsIndicator.setViewPager2(viewPager)

        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                updateUIForPage(position, items.size)
            }
        })
    }

    /**
     * Mengatur tombol "Next" dan "Skip".
     */
    private fun setupButtons() {
        buttonNext.setOnClickListener {
            navigateToLogin()
        }
    }

    /**
     * Mengatur tampilan berdasarkan halaman saat ini.
     */
    private fun updateUIForPage(position: Int, totalPages: Int) {
        if (position == totalPages - 1) {
            textSkip.visibility = View.INVISIBLE
            buttonNext.visibility = View.VISIBLE
        } else {
            textSkip.visibility = View.VISIBLE
            buttonNext.visibility = View.INVISIBLE
        }
    }

    /**
     * Navigasi ke LoginActivity.
     */
    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    /**
     * Membuat daftar item onboarding.
     */
    private fun generateOnboardingItems(): List<OnboardingItem> = listOf(
        OnboardingItem(
            R.drawable.onboarding_image_1,
            "Mulai Perjalanan Kamu dengan SoulBabble",
            "Langkah pertama menuju pemahaman diri yang lebih baik dimulai di sini. Soul Babble membantu kamu mengidentifikasi dan mengelola emosi setiap hari dengan mudah. Catat perasaan kamu, dan biarkan kami membantu kamu memahami pola emosi."
        ),
        OnboardingItem(
            R.drawable.onboarding_image_2,
            "Analisis Emosi yang Mendalam",
            "Dapatkan wawasan yang lebih dalam tentang emosi kamu. Soul Babble menganalisis perubahan mood kamu dari waktu ke waktu, memberikan gambaran tentang kesehatan mental kamu dan membantu mengenali pemicu kecemasan."
        ),
        OnboardingItem(
            R.drawable.onboarding_image_3,
            "Tips Personalisasi untuk Kesejahteraan Mental",
            "Setiap orang unik, dan begitu pula perjalanan kesehatan mental mereka. Dapatkan saran dan kegiatan yang disesuaikan berdasarkan analisis emosi kamu untuk meningkatkan kesehatan mental dan kesejahteraan emosional."
        )
    )
}
