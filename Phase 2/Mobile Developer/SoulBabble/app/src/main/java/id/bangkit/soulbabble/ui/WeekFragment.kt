package id.bangkit.soulbabble.ui

import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsetsController
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import formatRelativeDate
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.AnswerAdapter
import id.bangkit.soulbabble.adapter.EmotionWeekAdapter
import id.bangkit.soulbabble.data.AnswerItem
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getOneWeekRange
import id.bangkit.soulbabble.viewmodel.WeekViewModel
import org.json.JSONObject
import java.util.Calendar

class WeekFragment : Fragment(R.layout.fragment_week) {

    private val viewModel: WeekViewModel by viewModels()
    private lateinit var recyclerViewEmotionWeek: RecyclerView
    private lateinit var recyclerViewAnswer: RecyclerView
    private lateinit var emotionWeekAdapter: EmotionWeekAdapter
    private lateinit var tvEmotionDetail: TextView
    private lateinit var tvEmotionDetailTime: TextView
    private lateinit var tvEmotionDetailTitle: TextView
    private lateinit var tvFactorialEmotion1: TextView
    private lateinit var tvFactorialEmotion2: TextView
    private lateinit var tvFactorialEmotion3: TextView
    private lateinit var progressBar: LinearLayout
    private lateinit var detailTrackingMoodEmpty: LinearLayout
    private lateinit var detailTrackingMood: LinearLayout
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tvEmotionDetail = view.findViewById(R.id.tvEmotionDetail)
        progressBar = view.findViewById(R.id.progressBar)
        tvEmotionDetailTime = view.findViewById(R.id.tvEmotionDetailTime)
        tvEmotionDetailTitle = view.findViewById(R.id.tvEmotionDetailTitle)
        tvFactorialEmotion1 = view.findViewById(R.id.tvFactorialEmotion1)
        tvFactorialEmotion2 = view.findViewById(R.id.tvFactorialEmotion2)
        tvFactorialEmotion3 = view.findViewById(R.id.tvFactorialEmotion3)
        recyclerViewAnswer = view.findViewById(R.id.recyclerViewEmotionAnswer)
        recyclerViewEmotionWeek = view.findViewById(R.id.recyclerViewEmotionWeek)
        detailTrackingMoodEmpty = view.findViewById(R.id.detailTrackingMoodEmpty)
        detailTrackingMood = view.findViewById(R.id.detailTrackingMood)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)

        setupStatusBar()
        setupRecyclerViews()
        val (startDate, endDate) = getOneWeekRange()
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""

        observeViewModel()

        // Fetch data only if LiveData is empty
        if (viewModel.emotionWeekList.value.isNullOrEmpty()) {
            viewModel.fetchTrackingMoodData(startDate, endDate, apiKey, token, requireContext())
        }
        swipeRefreshLayout.setOnRefreshListener {
            val (startDate, endDate) = getOneWeekRange()
            val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
            val token = AuthStorage.getToken(requireContext()) ?: ""

            // Panggil fungsi untuk memuat ulang data
            viewModel.fetchTrackingMoodData(startDate, endDate, apiKey, token, requireContext())
            observeViewModel()

            // Hentikan animasi refresh setelah data dimuat
            observeViewModelForRefresh()
        }
    }
    private fun observeViewModelForRefresh() {
        viewModel.emotionWeekList.observe(viewLifecycleOwner) {
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh
        }

        viewModel.error.observe(viewLifecycleOwner) {
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh jika ada error
            if (it != null) {
                Toast.makeText(requireContext(), it, Toast.LENGTH_SHORT).show()
            }
        }
    }
    private fun observeViewModel() {
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        }

        viewModel.emotionWeekList.observe(viewLifecycleOwner) { emotionList ->
            emotionWeekAdapter.updateEmotionList(emotionList)
            val today = getTodayDayOfWeek()
            emotionWeekAdapter.selectItemByDay(today)
            val todayEmotion = emotionList.find { it.dayOfWeek == today }

            if (todayEmotion != null && todayEmotion.resultedEmotion.isNotEmpty()) {
                val resultedEmotionJson = JSONObject(todayEmotion.resultedEmotion)

                val emoji = resultedEmotionJson?.optString("emoji", "No Emoji") ?: "No Emoji"
                val msgEmotion = resultedEmotionJson?.optString("msgEmotion", "") ?: ""
                val emotionalFactors = resultedEmotionJson?.optJSONArray("emotionalFactor") ?: null
                val emotionalFactors1 = emotionalFactors?.optString(0) ?: "Factor 1 not available"
                val emotionalFactors2 = emotionalFactors?.optString(1) ?: "Factor 2 not available"
                val emotionalFactors3 = emotionalFactors?.optString(2) ?: "Factor 3 not available"

                val resultQuestions = mutableListOf<Pair<String, String>>()
                val recommendations = mutableListOf<Triple<String, String, String>>()

                resultedEmotionJson?.optJSONArray("resultQuestion")?.let { questionsArray ->
                    for (i in 0 until questionsArray.length()) {
                        val questionObj = questionsArray.getJSONObject(i)
                        resultQuestions.add(
                            questionObj.getString("question") to questionObj.getString("answer")
                        )
                    }
                }

                // Extract recommendations
                resultedEmotionJson?.optJSONArray("recommendations")?.let { recommendationsArray ->
                    for (i in 0 until recommendationsArray.length()) {
                        val recommendationObj = recommendationsArray.getJSONObject(i)
                        recommendations.add(
                            Triple(
                                recommendationObj.getString("title"),
                                recommendationObj.getString("image"),
                                recommendationObj.getString("desc")
                            )
                        )
                    }
                }

                tvEmotionDetail.text = emoji
                tvEmotionDetailTime.text = todayEmotion.createdAt
                tvEmotionDetailTitle.text = msgEmotion
                tvFactorialEmotion1.text = emotionalFactors1
                tvFactorialEmotion2.text = emotionalFactors2
                tvFactorialEmotion3.text = emotionalFactors3

                val isEmojiEmpty = emoji == "No Emoji"
                detailTrackingMoodEmpty.visibility = if (isEmojiEmpty) View.VISIBLE else View.GONE
                detailTrackingMood.visibility = if (isEmojiEmpty) View.GONE else View.VISIBLE

                // Update Answer Adapter
                val answerList = generateAnswerList(resultQuestions, recommendations)
                recyclerViewAnswer.adapter = AnswerAdapter(requireContext(), answerList)
            } else {
                detailTrackingMoodEmpty.visibility = View.VISIBLE
                detailTrackingMood.visibility = View.GONE
                swipeRefreshLayout.isRefreshing = false
            }
        }

        viewModel.error.observe(viewLifecycleOwner) { errorMessage ->
            if (errorMessage != null) {
                Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_SHORT).show()
            }
        }

    }

    @RequiresApi(Build.VERSION_CODES.R)
    private fun setupStatusBar() {
        activity?.window?.apply {
            statusBarColor = ContextCompat.getColor(requireContext(), R.color.primary)

            insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        }
    }

    private fun setupRecyclerViews() {
        recyclerViewEmotionWeek.layoutManager = GridLayoutManager(requireContext(), 7)
        emotionWeekAdapter = EmotionWeekAdapter(requireContext(), listOf()) { isEmojiEmpty, emoji, emotionalFactors1,emotionalFactors2,emotionalFactors3,createAt, msgEmotion, resultQuestions, recommendations ->
            tvEmotionDetail.text = emoji
            tvEmotionDetailTime.text = formatRelativeDate(createAt)
            tvEmotionDetailTitle.text = msgEmotion
            tvFactorialEmotion1.text = emotionalFactors1
            tvFactorialEmotion2.text = emotionalFactors2
            tvFactorialEmotion3.text = emotionalFactors3

            detailTrackingMoodEmpty.visibility = if (isEmojiEmpty) View.VISIBLE else View.GONE
            detailTrackingMood.visibility = if (isEmojiEmpty) View.GONE else View.VISIBLE

            val answerList = generateAnswerList(resultQuestions, recommendations)
            recyclerViewAnswer.adapter = AnswerAdapter(requireContext(), answerList)
        }
        recyclerViewEmotionWeek.adapter = emotionWeekAdapter

        recyclerViewAnswer.layoutManager = LinearLayoutManager(requireContext())
        recyclerViewAnswer.adapter = AnswerAdapter(requireContext(), listOf())
    }
    private fun generateAnswerList(
        resultQuestions: List<Pair<String, String>>,
        recommendations: List<Triple<String, String, String>>
    ): List<AnswerItem> {
        val answers = resultQuestions.map { (question, answer) ->
            AnswerItem(question, answer)
        }
        val recs = recommendations.map { (title,  desc) ->
            AnswerItem("Recommendation: $title", "Description: $desc")
        }
        return answers
    }
    private fun getTodayDayOfWeek(): String {
        val calendar = Calendar.getInstance()
        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.SUNDAY -> "Minggu"
            Calendar.MONDAY -> "Senin"
            Calendar.TUESDAY -> "Selasa"
            Calendar.WEDNESDAY -> "Rabu"
            Calendar.THURSDAY -> "Kamis"
            Calendar.FRIDAY -> "Jumat"
            Calendar.SATURDAY -> "Sabtu"
            else -> "Unknown"
        }
    }
}
