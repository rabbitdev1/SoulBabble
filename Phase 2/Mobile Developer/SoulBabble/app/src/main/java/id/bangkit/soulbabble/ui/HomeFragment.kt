
package id.bangkit.soulbabble.ui

import JournalingViewModel
import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.cardview.widget.CardView
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.widget.NestedScrollView
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.LinearSnapHelper
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionAdapter
import id.bangkit.soulbabble.adapter.JournalAdapter
import id.bangkit.soulbabble.adapter.RecommendationAdapter
import id.bangkit.soulbabble.data.EmotionItem
import id.bangkit.soulbabble.data.JournalItem
import id.bangkit.soulbabble.viewmodel.TrackingMoodViewModel
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getTodayDate
import id.bangkit.soulbabble.utils.getStatusBarHeight
import org.json.JSONException
import org.json.JSONObject

class HomeFragment : Fragment(R.layout.fragment_home) {

    private val trackingMoodViewModel: TrackingMoodViewModel by activityViewModels()
    private val journalingViewModel: JournalingViewModel by viewModels()
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
        journalingViewModel.fetchJournalingData(apiKey, token)
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

        journalingViewModel.journalingData.observe(viewLifecycleOwner) { data ->
            val journalItems = parseJournalData(data)
            updateRecyclerView(journalItems)

            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh setelah selesai
        }

        journalingViewModel.error.observe(viewLifecycleOwner) { errorMsg ->
            Toast.makeText(requireContext(), errorMsg, Toast.LENGTH_SHORT).show()
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh jika ada kesalahan
        }

    }

    private fun generateEmotionList(): List<EmotionItem> = listOf(
        EmotionItem("\uD83E\uDD72", "Sangat Buruk"),
        EmotionItem("\uD83E\uDD72", "Buruk"),
        EmotionItem("\uD83E\uDD72", "Netral"),
        EmotionItem("\uD83E\uDD72", "Baik"),
        EmotionItem("\uD83E\uDD72", "Sangat Baik")
    )

    private fun updateRecyclerView(journalItems: List<JournalItem>) {
        recyclerViewJournal.adapter = JournalAdapter(requireContext(), journalItems)

    }
    private fun parseJournalData(data: JSONObject): List<JournalItem> {
        val items = mutableListOf<JournalItem>()
        val journalData = data.getJSONObject("data")

        val journalId = data.optString("id", "default_value")
        val journalTitle = journalData.optString("title")
        val journalContent = journalData.optString("content")
        val createdAt = journalData.optString("createdAt")

        println("Raw content: $journalContent") // Debugging untuk memeriksa konten mentah

        // Parsing content yang berupa JSON string
        val parsedContent = try {
            if (journalContent.isNullOrEmpty()) {
                throw JSONException("Content is empty or null.")
            }
            // Hilangkan trailing comma dengan manipulasi string
            val sanitizedContent = journalContent.trim()
                .removeSuffix("}")
                .removeSuffix(",")
                .plus("}")

            println("Sanitized content: $sanitizedContent") // Debugging untuk memeriksa konten yang telah dibersihkan

            // Parsing JSON
            val contentJson = JSONObject(sanitizedContent)

            // Ambil hanya `jurnal1`
            val jurnal1 = contentJson.optString("jurnal1")

            // Batasi teks hingga 30 kata
            if (jurnal1.isNotEmpty()) {
                val words = jurnal1.split(" ")
                if (words.size > 30) {
                    words.take(30).joinToString(" ") + "..."
                } else {
                    jurnal1
                }
            } else {
                "No content for jurnal1."
            }
        } catch (e: Exception) {
            e.printStackTrace()
            "Unable to parse content: ${e.message}"
        }
        // Tambahkan data ke daftar JournalItem
        items.add(
            JournalItem(
                journalId,
                "\uD83D\uDE0A", // Emoji sebagai contoh
                journalTitle,
                createdAt,
                parsedContent
            )
        )
        return items
    }
}
