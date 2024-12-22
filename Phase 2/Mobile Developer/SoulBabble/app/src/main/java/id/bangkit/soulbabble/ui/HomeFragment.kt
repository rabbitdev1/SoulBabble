package id.bangkit.soulbabble.ui

import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionAdapter
import id.bangkit.soulbabble.adapter.JournalAdapter
import id.bangkit.soulbabble.adapter.RecommendationAdapter
import id.bangkit.soulbabble.model.EmotionItem
import id.bangkit.soulbabble.model.JournalItem
import id.bangkit.soulbabble.model.RecommendationItem

class HomeFragment : Fragment(R.layout.fragment_home) {

    private lateinit var recyclerViewEmotion: RecyclerView
    private lateinit var recyclerViewJournal: RecyclerView
    private lateinit var recyclerViewRecommended: RecyclerView
    private lateinit var scrollLinearView: ConstraintLayout
    private lateinit var nestedScrollView: androidx.core.widget.NestedScrollView

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Inisialisasi NestedScrollView
        nestedScrollView = view.findViewById(R.id.nestedScrollView)

        // Inisialisasi LinearLayout untuk View yang muncul saat scroll
        scrollLinearView = view.findViewById(R.id.scrollLinearView)

        // Inisialisasi RecyclerView untuk Emotion
        recyclerViewEmotion = view.findViewById(R.id.recyclerViewEmotion)
        recyclerViewEmotion.layoutManager = GridLayoutManager(requireContext(), 5)

        // Inisialisasi RecyclerView untuk Journal
        recyclerViewJournal = view.findViewById(R.id.recyclerViewJournal)
        recyclerViewJournal.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.HORIZONTAL,
            false
        )

        // Inisialisasi RecyclerView untuk Recommendation
        recyclerViewRecommended = view.findViewById(R.id.recyclerViewRecommended)
        recyclerViewRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )

        // Data dummy untuk Emotion
        val EmotionList = listOf(
            EmotionItem(
                "\uD83E\uDD72",
                "Sangat Buruk",
            ),
            EmotionItem(
                "\uD83E\uDD72",
                "Buruk",
            ),
            EmotionItem(
                "\uD83E\uDD72",
                "Netral",
            ),
            EmotionItem(
                "\uD83E\uDD72",
                "Baik",
            ),
            EmotionItem(
                "\uD83E\uDD72",
                "Sangat Baik",
            ),
        )

        // Data dummy untuk Journal
        val journalList = listOf(
            JournalItem(
                "\uD83E\uDD72",
                "Minggu Lalu, 15:00",
                "Hari ini aku belajar sesuatu yang penting tentang kehidupan...",
                "Reflection"

            )
        )

        // Data dummy untuk Recommendation
        val recommendations = listOf(
            RecommendationItem(
                imageResId = R.drawable.ic_launcher_background,
                title = "OVT Apa Artinya?",
                description = "Ini penjelasan dan cara mengatasinya."
            ),
            RecommendationItem(
                imageResId = R.drawable.ic_launcher_background,
                title = "Cara Mengelola Stres",
                description = "Tips efektif untuk mengatasi stres."
            ),
            RecommendationItem(
                imageResId = R.drawable.ic_launcher_background,
                title = "Manfaat Tidur Cukup",
                description = "Tidur yang cukup dapat meningkatkan kesehatan Anda."
            )
        )

        // Pasang Adapter untuk Emotion
        val emotionAdapter = EmotionAdapter(requireContext(), EmotionList)
        recyclerViewEmotion.adapter = emotionAdapter

        // Pasang Adapter untuk Journal
        val journalAdapter = JournalAdapter(requireContext(),journalList)
        recyclerViewJournal.adapter = journalAdapter

        // Pasang Adapter untuk Recommendation
        val recommendationAdapter = RecommendationAdapter(requireContext(),recommendations)
        recyclerViewRecommended.adapter = recommendationAdapter

        // Tambahkan efek Snap untuk scrolling horizontal Journal
        val snapHelper = LinearSnapHelper()
        snapHelper.attachToRecyclerView(recyclerViewJournal)


        // Listener untuk NestedScrollView
        nestedScrollView.setOnScrollChangeListener { _, _, scrollY, _, _ ->
            if (scrollY > 200) {
                if (scrollLinearView.visibility == View.GONE) {
                    scrollLinearView.visibility = View.VISIBLE
                    scrollLinearView.animate()
                        .alpha(1f)
                        .setDuration(300)
                        .start()
                }
            } else {
                if (scrollLinearView.visibility == View.VISIBLE) {
                    scrollLinearView.animate()
                        .alpha(0f)
                        .setDuration(300)
                        .withEndAction {
                            scrollLinearView.visibility = View.GONE
                        }
                        .start()
                }
            }
        }
        // Hitung tinggi status bar
        val statusBarHeight = getStatusBarHeight()

        // Set padding pada scrollLinearView secara dinamis
        scrollLinearView.setPadding(16, statusBarHeight, 16, 16)
    }
    // Fungsi untuk mendapatkan tinggi status bar
    private fun getStatusBarHeight(): Int {
        val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
        return if (resourceId > 0) {
            resources.getDimensionPixelSize(resourceId)
        } else {
            24.dpToPx() // Default tinggi status bar dalam dp
        }
    }

    // Extension untuk konversi dp ke px
    private fun Int.dpToPx(): Int {
        return (this * resources.displayMetrics.density).toInt()
    }
}
