package id.bangkit.soulbabble.ui

import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.widget.NestedScrollView
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
    private lateinit var nestedScrollView: NestedScrollView

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupViews(view)
        setupRecyclerViews()
        setupScrollListener()
    }

    /**
     * Menginisialisasi tampilan utama.
     */
    private fun setupViews(view: View) {
        nestedScrollView = view.findViewById(R.id.nestedScrollView)
        scrollLinearView = view.findViewById(R.id.scrollLinearView)
        recyclerViewEmotion = view.findViewById(R.id.recyclerViewEmotion)
        recyclerViewJournal = view.findViewById(R.id.recyclerViewJournal)
        recyclerViewRecommended = view.findViewById(R.id.recyclerViewRecommended)

        // Atur padding untuk scrollLinearView berdasarkan tinggi status bar
        scrollLinearView.setPadding(16, getStatusBarHeight(), 16, 16)
    }

    /**
     * Mengatur RecyclerViews untuk Emotion, Journal, dan Recommendation.
     */
    private fun setupRecyclerViews() {
        // Emotion RecyclerView
        recyclerViewEmotion.layoutManager = GridLayoutManager(requireContext(), 5)
        recyclerViewEmotion.adapter = EmotionAdapter(requireContext(), generateEmotionList())

        // Journal RecyclerView
        recyclerViewJournal.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.HORIZONTAL,
            false
        )
        recyclerViewJournal.adapter = JournalAdapter(requireContext(), generateJournalList())

        // Recommendation RecyclerView
        recyclerViewRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
        recyclerViewRecommended.adapter = RecommendationAdapter(requireContext(), generateRecommendationList())

        // Tambahkan efek Snap untuk RecyclerView Journal
        LinearSnapHelper().attachToRecyclerView(recyclerViewJournal)
    }

    /**
     * Mengatur listener untuk NestedScrollView.
     */
    private fun setupScrollListener() {
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
    }

    /**
     * Membuat daftar dummy untuk Emotion.
     */
    private fun generateEmotionList(): List<EmotionItem> = listOf(
        EmotionItem("\uD83E\uDD72", "Sangat Buruk"),
        EmotionItem("\uD83E\uDD72", "Buruk"),
        EmotionItem("\uD83E\uDD72", "Netral"),
        EmotionItem("\uD83E\uDD72", "Baik"),
        EmotionItem("\uD83E\uDD72", "Sangat Baik")
    )

    /**
     * Membuat daftar dummy untuk Journal.
     */
    private fun generateJournalList(): List<JournalItem> = listOf(
        JournalItem(
            "\uD83E\uDD72",
            "Reflection",
            "Minggu Lalu, 15:00",
            "Hari ini aku belajar sesuatu yang penting tentang kehidupan..."
        )
    )

    /**
     * Membuat daftar dummy untuk Recommendation.
     */
    private fun generateRecommendationList(): List<RecommendationItem> = listOf(
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

    /**
     * Mendapatkan tinggi status bar.
     */
    private fun getStatusBarHeight(): Int {
        val resourceId = resources.getIdentifier("status_bar_height", "dimen", "android")
        return if (resourceId > 0) {
            resources.getDimensionPixelSize(resourceId)
        } else {
            24.dpToPx() // Default tinggi status bar dalam dp
        }
    }

    /**
     * Ekstensi untuk konversi dp ke px.
     */
    private fun Int.dpToPx(): Int = (this * resources.displayMetrics.density).toInt()
}
