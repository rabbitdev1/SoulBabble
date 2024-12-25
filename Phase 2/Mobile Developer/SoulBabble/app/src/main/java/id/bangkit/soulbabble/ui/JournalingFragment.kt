package id.bangkit.soulbabble.ui

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsetsController
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
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

class JournalingFragment : Fragment(R.layout.fragment_journaling) {

    private lateinit var recyclerViewRecommended: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    private val trackingMoodViewModel: TrackingMoodViewModel by activityViewModels()
    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Ambil referensi MaterialToolbar
        val toolbar: androidx.appcompat.widget.Toolbar = view.findViewById(R.id.topAppBar)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)

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
        toolbar.setOnApplyWindowInsetsListener { v, insets ->
            val statusBarHeight = insets.systemWindowInsetTop // Tinggi status bar
            val layoutParams = v.layoutParams as ViewGroup.MarginLayoutParams
            layoutParams.topMargin = statusBarHeight // Set margin top sesuai tinggi status bar
            v.layoutParams = layoutParams
            insets // Kembalikan insets
        }
        toolbar.requestApplyInsets()
        setupViews(view)
        setupRecyclerViews()

        // Load Data
        loadData()
        setupRefreshListener()
    }

    private fun setupViews(view: View) {
        // Inisialisasi Views
        recyclerViewRecommended = view.findViewById(R.id.recyclerViewRecommended)
    }

    /**
     * Mengatur RecyclerViews untuk Emotion, Journal, dan Recommendation.
     */
    private fun setupRecyclerViews() {
        // Emotion RecyclerView
        // Recommendation RecyclerView
        recyclerViewRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
    }


    /**
     * Memuat data dari API atau sumber lainnya.
     */
    private fun loadData() {
        val startDate = getTodayDate()
        val endDate = startDate
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""

        trackingMoodViewModel.sendRecommendation(apiKey, token) { result ->
            activity?.runOnUiThread {
                if (result != null) {
                    try {
                        val recommendations = parseRecommendationResult(result)
                        updateRecommendationList(recommendations)
                        println(recommendations)
                        recyclerViewRecommended.visibility =View.VISIBLE
                    } catch (e: JSONException) {
                        e.printStackTrace()
                        println("Error parsing recommendations: ${e.message}")
                        recyclerViewRecommended.visibility =View.VISIBLE
                    }
                } else {
                    println("Failed to fetch recommendations.")
                    recyclerViewRecommended.visibility =View.VISIBLE
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

}
