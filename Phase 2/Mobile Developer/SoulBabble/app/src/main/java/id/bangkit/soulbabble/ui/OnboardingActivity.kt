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

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_onboarding)

        viewPager = findViewById(R.id.viewPager)
        val buttonNext: Button = findViewById(R.id.buttonNext)
        val textSkip: TextView = findViewById(R.id.textSkip)
        val dotsIndicator: DotsIndicator = findViewById(R.id.dotsIndicator)

        val items = listOf(
            OnboardingItem(
                R.drawable.onboarding_image_1,
                "Mulai Perjalanan Kamu dengan SoulBabble",
                "Langkah pertama menuju pemahaman diri yang lebih baiki dimulai disini. Soul Babble membantu kamu mengidentifikasi dan mengelola emosi setiap hari dengan mudah. Catat perasaan kamu, dan biarkan kami membantu kamu dalam memahami pola emosi."
            ),
            OnboardingItem(
                R.drawable.onboarding_image_2,
                "Analisis Emosi yang Mendalam",
                "Dapatkan wawasan yang lebih dalam tentang emosi kamu. Soul Babble menganalisis perubahan mood kamu dari waktu ke waktu. Memberikan gambaran tentang kesehatan mental kamu dan membantu mengenali pemicu kecemasan."
            ),
            OnboardingItem(
                R.drawable.onboarding_image_3,
                "Tips Personalisasi untuk Kesejahteraan Mental",
                "Setiap orang unik, dan begitu pula perjalanan kesehatan mental mereka. Dapatkan saran dan kegiatan yang disesuaikan berdasarkan analisi emosi kamu untuk meningkatkan kesehatan mental dan kesejahteraan emosional."
            )
        )

        adapter = OnboardingAdapter(items)
        viewPager.adapter = adapter
        dotsIndicator.setViewPager2(viewPager)

        viewPager.registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
            override fun onPageSelected(position: Int) {
                super.onPageSelected(position)
                if (position == items.size - 1) {
                    textSkip.visibility= View.INVISIBLE
                    buttonNext.visibility = View.VISIBLE
                } else {
                    textSkip.visibility= View.VISIBLE
                    buttonNext.visibility = View.INVISIBLE
                }
            }
        })

        buttonNext.setOnClickListener {
            val intent = Intent(this@OnboardingActivity, LoginActivity::class.java)
            startActivity(intent)
            finish()
        }
    }
}
