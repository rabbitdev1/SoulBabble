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
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.AnswerAdapter
import id.bangkit.soulbabble.adapter.EmotionWeekAdapter
import id.bangkit.soulbabble.model.AnswerItem
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getOneWeekRange
import id.bangkit.soulbabble.viewmodel.CheckInViewModel
import java.util.Calendar

class CheckInFragment : Fragment(R.layout.fragment_check_in) {

    private val viewModel: CheckInViewModel by viewModels()
    private lateinit var recyclerViewEmotionWeek: RecyclerView
    private lateinit var recyclerViewAnswer: RecyclerView
    private lateinit var emotionWeekAdapter: EmotionWeekAdapter
    private lateinit var tvEmotionDetail: TextView
    private lateinit var progressBar: LinearLayout

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tvEmotionDetail = view.findViewById(R.id.tvEmotionDetail)
        progressBar = view.findViewById(R.id.progressBar)

        setupStatusBar()
        setupRecyclerViews(view)

        val (startDate, endDate) = getOneWeekRange()
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""

        observeViewModel()

        // Fetch data only if LiveData is empty
        if (viewModel.emotionWeekList.value.isNullOrEmpty()) {
            viewModel.fetchTrackingMoodData(startDate, endDate, apiKey, token)
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

    private fun setupRecyclerViews(view: View) {
        recyclerViewEmotionWeek = view.findViewById(R.id.recyclerViewEmotionWeek)
        recyclerViewEmotionWeek.layoutManager = GridLayoutManager(requireContext(), 7)
        emotionWeekAdapter = EmotionWeekAdapter(requireContext(), listOf()) { emoji, _, _, _, _, _, _, _ ->
            tvEmotionDetail.text = emoji
        }
        recyclerViewEmotionWeek.adapter = emotionWeekAdapter

        recyclerViewAnswer = view.findViewById(R.id.recyclerViewEmotionAnswer)
        recyclerViewAnswer.layoutManager = LinearLayoutManager(requireContext())
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
