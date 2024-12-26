
package id.bangkit.soulbabble.ui

import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.widget.NestedScrollView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.squareup.picasso.Picasso
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionAdapter
import id.bangkit.soulbabble.adapter.JournalAdapter
import id.bangkit.soulbabble.adapter.RecommendationAdapter
import id.bangkit.soulbabble.data.EmotionItem
import id.bangkit.soulbabble.data.JournalItem
import id.bangkit.soulbabble.model.TrackingMoodViewModel
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getTodayDate
import id.bangkit.soulbabble.utils.LocalStorage
import id.bangkit.soulbabble.utils.getStatusBarHeight

class HomeFragment : Fragment(R.layout.fragment_home) {

    private val trackingMoodViewModel: TrackingMoodViewModel by activityViewModels()
    private lateinit var recyclerViewEmotion: RecyclerView
    private lateinit var recyclerViewJournal: RecyclerView
    private lateinit var recyclerViewRecommended: RecyclerView
    private lateinit var scrollLinearView: ConstraintLayout
    private lateinit var nestedScrollView: NestedScrollView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var detailTrackingMood: CardView
    private lateinit var insertTrackingMood: CardView
    private lateinit var detailRecommendationMEmpty: LinearLayout
    private lateinit var tvApiramation: TextView
    private lateinit var tvemoji: TextView
    private lateinit var tvEmotionMsg: TextView
    private lateinit var tvEmotionTitle: TextView
    private lateinit var tvFullName: TextView
    private lateinit var tvFullnameTopBar: TextView
    private lateinit var imgProfile: ImageView

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        setupViews(view)
        setupRecyclerViews()
        setupRefreshListener()
        observeViewModel()

        // Load Data jika belum ada
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""
        val today = getTodayDate()

        trackingMoodViewModel.loadRecommendations(apiKey, token)
        trackingMoodViewModel.loadEmotionData(apiKey, token, today, today)
    }

    private fun setupViews(view: View) {
        // Inisialisasi Views
        nestedScrollView = view.findViewById(R.id.nestedScrollView)
        scrollLinearView = view.findViewById(R.id.scrollLinearView)
        recyclerViewEmotion = view.findViewById(R.id.recyclerViewEmotion)
        recyclerViewJournal = view.findViewById(R.id.recyclerViewJournal)
        recyclerViewRecommended = view.findViewById(R.id.recyclerViewRecommended)
        detailTrackingMood = view.findViewById(R.id.detailTrackingMood)
        insertTrackingMood = view.findViewById(R.id.insertTrackingMood)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)
        tvApiramation = view.findViewById(R.id.tvApiramation)
        tvemoji = view.findViewById(R.id.tvEmoji)
        tvEmotionMsg = view.findViewById(R.id.tvEmotionMsg)
        tvEmotionTitle = view.findViewById(R.id.tvEmotionTitle)
        tvFullName = view.findViewById(R.id.tvFullname)
        tvFullnameTopBar = view.findViewById(R.id.tvFullnameTopBar)
        imgProfile = view.findViewById(R.id.imgProfile)
        detailRecommendationMEmpty = view.findViewById(R.id.detailRecommendationMEmpty)

        // Atur padding untuk scrollLinearView berdasarkan tinggi status bar
        scrollLinearView.setPadding(16, getStatusBarHeight(requireContext()), 16, 16)

        // Atur SwipeRefreshLayout
        swipeRefreshLayout.setProgressViewOffset(true, 100, 200)
    }

    private fun setupRecyclerViews() {
        // Mengatur adapter dan layout manager untuk RecyclerViews
        recyclerViewEmotion.layoutManager = GridLayoutManager(requireContext(), 5)
        recyclerViewEmotion.adapter = EmotionAdapter(requireContext(), generateEmotionList())

        recyclerViewJournal.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.HORIZONTAL,
            false
        )
        recyclerViewJournal.adapter = JournalAdapter(requireContext(), generateJournalList())

        recyclerViewRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
        LinearSnapHelper().attachToRecyclerView(recyclerViewJournal)
    }
    private fun setupRefreshListener() {
        swipeRefreshLayout.setOnRefreshListener {
            val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
            val token = AuthStorage.getToken(requireContext()) ?: ""
            val today = getTodayDate()

            // Refresh emotion data dan rekomendasi
            trackingMoodViewModel.loadEmotionData(apiKey, token, today, today)
            trackingMoodViewModel.loadRecommendations(apiKey, token)

            // Tunggu hingga data selesai dimuat
            trackingMoodViewModel.emotionData.observe(viewLifecycleOwner) {
                if (swipeRefreshLayout.isRefreshing) {
                    swipeRefreshLayout.isRefreshing = false
                }
            }

            trackingMoodViewModel.recommendations.observe(viewLifecycleOwner) {
                if (swipeRefreshLayout.isRefreshing) {
                    swipeRefreshLayout.isRefreshing = false
                }
            }
        }
    }
    private fun observeViewModel() {
        // Observasi data emotion
        trackingMoodViewModel.emotionData.observe(viewLifecycleOwner) { emotionData ->
            tvApiramation.text = emotionData?.get("msgEmotion") ?: "No Message"
            tvEmotionMsg.text = emotionData?.get("msgEmotion") ?: "No Message"
            tvEmotionTitle.text = emotionData?.get("emotionName") ?: "No Emotion"
            tvemoji.text = emotionData?.get("emoji") ?: "😊"

            detailTrackingMood.visibility = View.VISIBLE
            insertTrackingMood.visibility = View.GONE
        }

        // Observasi rekomendasi
        trackingMoodViewModel.recommendations.observe(viewLifecycleOwner) { recommendations ->
            recyclerViewRecommended.adapter = RecommendationAdapter(requireContext(), recommendations)
            if (recommendations.isNotEmpty()) {
                detailRecommendationMEmpty.visibility = View.GONE
                recyclerViewRecommended.visibility = View.VISIBLE
            } else {
                detailRecommendationMEmpty.visibility = View.VISIBLE
                recyclerViewRecommended.visibility = View.GONE
            }
        }
    }

    private fun generateEmotionList(): List<EmotionItem> = listOf(
        EmotionItem("\uD83E\uDD72", "Sangat Buruk"),
        EmotionItem("\uD83E\uDD72", "Buruk"),
        EmotionItem("\uD83E\uDD72", "Netral"),
        EmotionItem("\uD83E\uDD72", "Baik"),
        EmotionItem("\uD83E\uDD72", "Sangat Baik")
    )

    private fun generateJournalList(): List<JournalItem> = listOf(
        JournalItem("\uD83E\uDD72", "Reflection", "Minggu Lalu, 15:00", "Belajar tentang kehidupan...")
    )
}
