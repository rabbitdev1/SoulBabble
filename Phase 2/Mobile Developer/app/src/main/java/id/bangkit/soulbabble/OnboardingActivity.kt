package id.bangkit.soulbabble

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.viewpager2.widget.ViewPager2
import id.bangkit.soulbabble.adapter.OnboardingAdapter
import id.bangkit.soulbabble.databinding.ActivityOnboardingBinding
import id.bangkit.soulbabble.model.OnboardingItem

class OnboardingActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val binding = ActivityOnboardingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val onboardingItems = listOf(
            OnboardingItem("Selamat datang!", "Ini adalah aplikasi Soulbabble.", R.drawable.onboarding_image_1),
            OnboardingItem("Temukan fitur baru", "Gunakan fitur-fitur keren di aplikasi ini.", R.drawable.onboarding_image_2),
            OnboardingItem("Mulai sekarang!", "Segera mulai perjalananmu dengan Soulbabble.", R.drawable.onboarding_image_3)
        )

        val adapter = OnboardingAdapter(onboardingItems)
        binding.viewPager.adapter = adapter
    }
}
