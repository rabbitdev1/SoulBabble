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
import id.bangkit.soulbabble.data.RecommendationItem
import id.bangkit.soulbabble.model.TrackingMoodViewModel
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getTodayDate
import id.bangkit.soulbabble.utils.LocalStorage
import id.bangkit.soulbabble.utils.getStatusBarHeight
import org.json.JSONException
import org.json.JSONObject

class HomeFragment : Fragment(R.layout.fragment_home) {

    // View Components
    private lateinit var recyclerViewEmotion: RecyclerView
    private lateinit var recyclerViewJournal: RecyclerView
    private lateinit var recyclerViewRecommended: RecyclerView
    private lateinit var scrollLinearView: ConstraintLayout
    private lateinit var nestedScrollView: NestedScrollView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var detailTrackingMood: CardView
    private lateinit var insertTrackingMood: CardView
    private lateinit var detailRecommendationMEmpty: LinearLayout

    // TextViews
    private lateinit var tvApiramation: TextView
    private lateinit var tvemoji: TextView
    private lateinit var tvEmotionMsg: TextView
    private lateinit var tvEmotionTitle: TextView
    private lateinit var tvFullName: TextView
    private lateinit var tvFullnameTopBar: TextView

    // ImageView
    private lateinit var imgProfile: ImageView

    // ViewModel
    private val trackingMoodViewModel: TrackingMoodViewModel by activityViewModels()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Setup Views and Listeners
        setupViews(view)
        setupRecyclerViews()
        setupScrollListener()
        displayUserData()

        // Load Data
        loadData()
        setupRefreshListener()
    }

    /**
     * Menginisialisasi komponen View.
     */
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
     * Memuat data dari API atau sumber lainnya.
     */
    private fun loadData() {
        val startDate = getTodayDate()
        val endDate = startDate
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""

        trackingMoodViewModel.sendTrackingMoodData(startDate, endDate, apiKey, token, ) { response ->
            if (response != null) {
                try {
                    val jsonResponse = JSONObject(response)
                    val dataArray = jsonResponse.getJSONArray("data")
                    if (dataArray.length() > 0) {
                        val dataObject = dataArray.getJSONObject(0)
                        val resultedEmotionString = dataObject.getString("resultedEmotion")
                        val resultedEmotion = JSONObject(resultedEmotionString)

                        tvApiramation.text = resultedEmotion.getString("msgEmotion")
                        tvEmotionMsg.text = resultedEmotion.getString("msgEmotion")
                        tvEmotionTitle.text = dataObject.getString("emotionName")
                        tvemoji.text = resultedEmotion.getString("emoji")
                    }
                } catch (e: JSONException) {
                    e.printStackTrace()
                }

                detailTrackingMood.visibility = View.VISIBLE
                insertTrackingMood.visibility = View.GONE
            } else {
                detailTrackingMood.visibility = View.GONE
                insertTrackingMood.visibility = View.VISIBLE
            }
        }
        trackingMoodViewModel.sendRecommendation(apiKey, token) { result ->
            activity?.runOnUiThread {
                if (result != null) {
                    try {
                        val recommendations = parseRecommendationResult(result)
                        updateRecommendationList(recommendations)
                        println(recommendations)
                        detailRecommendationMEmpty.visibility = View.GONE
                        recyclerViewRecommended.visibility =View.VISIBLE
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        println("Error parsing recommendations: ${e.message}")
                        detailRecommendationMEmpty.visibility = View.VISIBLE
                        recyclerViewRecommended.visibility =View.GONE
                    }
                } else {
                    println("Failed to fetch recommendations.")
                    detailRecommendationMEmpty.visibility = View.VISIBLE
                    recyclerViewRecommended.visibility =View.GONE
                }
            }
        }
    }
    private fun updateRecommendationList(recommendations: List<RecommendationItem>) {
        recyclerViewRecommended.adapter = RecommendationAdapter(requireContext(), recommendations)
    }

    private fun parseRecommendationResult(result: String): List<RecommendationItem> {
        val recommendations = mutableListOf<RecommendationItem>()
        val jsonResponse = JSONObject(result)
        println(jsonResponse)

        // Check if "data" key exists and is a JSONObject
        if (jsonResponse.has("data")) {
            val dataObject = jsonResponse.getJSONObject("data")
            // Extract the "recommendedAction" field as a JSON string
            val recommendedActionString = dataObject.optString("recommendedAction", "")
            if (recommendedActionString.isNotEmpty()) {
                try {
                    // Parse "recommendedAction" as a JSONObject
                    val recommendedAction = JSONObject(recommendedActionString)

                    // Extract title, desc, and image from the "recommendedAction" object
                    val title = recommendedAction.optString("title", "No Title")
                    val desc = recommendedAction.optString("desc", "No Description")
                    val imageUrl = recommendedAction.optString("image", "")

                    // Add the recommendation to the list
                    recommendations.add(
                        RecommendationItem(
                            image = imageUrl,
                            title = title,
                            description = desc
                        )
                    )
                } catch (e: Exception) {
                    println("Error parsing recommendedAction: ${e.message}")
                }
            }
        } else {
            println("No 'data' key found in JSON response")
        }

        return recommendations
    }

    /**
     * Menyegarkan konten pada SwipeRefreshLayout.
     */
    private fun setupRefreshListener() {
        swipeRefreshLayout.setOnRefreshListener {
            refreshContent()
        }
    }

    private fun refreshContent() {
        loadData()
        swipeRefreshLayout.isRefreshing = false
    }

    /**
     * Menampilkan data pengguna.
     */
    private fun displayUserData() {
        val userData = LocalStorage.getAuthData(requireContext())
        val fullName = userData[LocalStorage.FULL_NAME]
        val photoUrl = userData[LocalStorage.PHOTO_URL]

        tvFullName.text = fullName ?: "Nama Tidak Tersedia"
        tvFullnameTopBar.text = fullName ?: "Nama Tidak Tersedia"

        if (!photoUrl.isNullOrEmpty()) {
            Picasso.get()
                .load(photoUrl)
                .placeholder(R.drawable.ic_launcher_background)
                .into(imgProfile)
        } else {
            imgProfile.setImageResource(R.drawable.ic_launcher_background)
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
        JournalItem("\uD83E\uDD72", "Reflection", "Minggu Lalu, 15:00", "Belajar tentang kehidupan...")
    )

}
