package id.bangkit.soulbabble.ui.BottomTab

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsetsController
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.RecommendationAdapter
import id.bangkit.soulbabble.data.RecommendationItem
import id.bangkit.soulbabble.viewmodel.TrackingMoodViewModel
import id.bangkit.soulbabble.ui.Journaling.InputJournaling1Activity
import id.bangkit.soulbabble.ui.Journaling.ListJournalingActivity
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.StatusBarUtils

class JournalingFragment : Fragment(R.layout.fragment_journaling) {

    private lateinit var recyclerViewRecommended: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout

    // Inisialisasi ViewModel
    private val trackingMoodViewModel: TrackingMoodViewModel by activityViewModels()

    @RequiresApi(Build.VERSION_CODES.R)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val toolbar: androidx.appcompat.widget.Toolbar = view.findViewById(R.id.topAppBar)
        swipeRefreshLayout = view.findViewById(R.id.swipeRefreshLayout)

        activity?.window?.let { window ->
            StatusBarUtils.setupStatusBar(window, requireContext(), R.color.primary)
        }
        val listJournalingCard: View = view.findViewById(R.id.list_journaling)
        listJournalingCard.setOnClickListener {
            val intent = Intent(requireContext(), ListJournalingActivity::class.java)
            startActivity(intent)
        }

        toolbar.setOnApplyWindowInsetsListener { v, insets ->
            val statusBarHeight = insets.systemWindowInsetTop
            val layoutParams = v.layoutParams as ViewGroup.MarginLayoutParams
            layoutParams.topMargin = statusBarHeight
            v.layoutParams = layoutParams
            insets
        }
        toolbar.requestApplyInsets()
        setupViews(view)
        setupRecyclerViews()

        // Observe data di ViewModel
        trackingMoodViewModel.recommendations.observe(viewLifecycleOwner) { recommendations ->
            updateRecommendationList(recommendations)
        }

        // Muat data jika belum dimuat
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""
        trackingMoodViewModel.loadRecommendations(apiKey, token)

        setupRefreshListener()

        val inputJournalingButton: View = view.findViewById(R.id.inputJournaling)
        inputJournalingButton.setOnClickListener {
            val intent = Intent(requireContext(), InputJournaling1Activity::class.java)
            startActivity(intent)
        }
    }

    private fun setupViews(view: View) {
        recyclerViewRecommended = view.findViewById(R.id.recyclerViewRecommended)
    }

    private fun setupRecyclerViews() {
        recyclerViewRecommended.layoutManager = LinearLayoutManager(
            requireContext(),
            LinearLayoutManager.VERTICAL,
            false
        )
    }

    private fun updateRecommendationList(recommendations: List<RecommendationItem>) {
        recyclerViewRecommended.adapter = RecommendationAdapter(requireContext(), recommendations)
    }

    private fun setupRefreshListener() {
        swipeRefreshLayout.setOnRefreshListener {
            refreshContent()
        }
    }

    private fun refreshContent() {
        val apiKey = AuthStorage.getApiKey(requireContext()) ?: ""
        val token = AuthStorage.getToken(requireContext()) ?: ""
        trackingMoodViewModel.loadRecommendations(apiKey, token)
        swipeRefreshLayout.isRefreshing = false
    }
}
