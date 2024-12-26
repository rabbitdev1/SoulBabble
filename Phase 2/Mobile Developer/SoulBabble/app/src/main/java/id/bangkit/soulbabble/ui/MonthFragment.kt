package id.bangkit.soulbabble.ui

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.View
import android.widget.Toast
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.github.mikephil.charting.charts.BarChart
import com.github.mikephil.charting.components.XAxis
import com.github.mikephil.charting.data.BarData
import com.github.mikephil.charting.data.BarDataSet
import com.github.mikephil.charting.data.BarEntry
import com.github.mikephil.charting.formatter.IndexAxisValueFormatter
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionTotalAdapter
import id.bangkit.soulbabble.data.EmotionTotalItem
import id.bangkit.soulbabble.viewmodel.WeekViewModel
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.DateUtils.getOneWeekRange

class MonthFragment : Fragment(R.layout.fragment_month) {
    private val viewModel: WeekViewModel by viewModels()
    private lateinit var recyclerViewEmotionTotal: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var barChart: BarChart

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        println("View Created, initializing RecyclerView...")
        setupViews(view)
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
            viewModel.fetchTrackingMoodData(startDate, endDate, apiKey, token, requireContext())
        }

    }
    private fun setupViews(view: View) {
        // Inisialisasi Views
        recyclerViewEmotionTotal = view.findViewById(R.id.recyclerViewEmotionTotal)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)
        barChart = view.findViewById(R.id.bar_chart)

    }
    private fun observeViewModel() {
        viewModel.emotionMonthList.observe(viewLifecycleOwner) { emotionList ->
            if (emotionList != null) {
                recyclerViewEmotionTotal.adapter = EmotionTotalAdapter(requireContext(), emotionList)
                setupBarChart(emotionList)

            }
            swipeRefreshLayout.isRefreshing = false
        }
        viewModel.error.observe(viewLifecycleOwner) { errorMessage ->
            if (errorMessage != null) {
                Toast.makeText(requireContext(), errorMessage, Toast.LENGTH_SHORT).show()
            }
            swipeRefreshLayout.isRefreshing = false
        }
    }
    private fun setupRecyclerViews() {
        recyclerViewEmotionTotal.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )

    }

    private fun setupBarChart(emotions: List<EmotionTotalItem>) {
        // Buat BarEntry dari data
        val entries = emotions.mapIndexed { index, item ->
            BarEntry(index.toFloat(), item.total.replace("Total pada bulan ini: ", "").toFloat())
        }

        // Label untuk X-Axis
        val labels = emotions.map { it.emotion }

        // Dataset untuk BarChart
        val dataSet = BarDataSet(entries, "Emotions")
        dataSet.color = resources.getColor(R.color.primary, null)

        // Data untuk BarChart
        val barData = BarData(dataSet)
        barData.barWidth = 0.9f // Lebar Bar

        // Atur data ke BarChart
        barChart.data = barData
        barChart.setFitBars(true)
        barChart.description.isEnabled = false

        // Konfigurasi X-Axis
        val xAxis = barChart.xAxis
        xAxis.valueFormatter = IndexAxisValueFormatter(labels) // Label X-Axis
        xAxis.position = XAxis.XAxisPosition.BOTTOM
        xAxis.setDrawGridLines(false)
        xAxis.granularity = 1f
        xAxis.isGranularityEnabled = true

        // Konfigurasi Y-Axis
        barChart.axisLeft.setDrawGridLines(false)
        barChart.axisRight.isEnabled = false

        // Animasi
        barChart.animateY(1000)

        // Refresh chart
        barChart.invalidate()
    }
}