package id.bangkit.soulbabble.ui.Notification

import NotificationViewModel
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.NotificationAdapter
import id.bangkit.soulbabble.data.NotificationItem
import id.bangkit.soulbabble.utils.AuthStorage
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

class NotificationActivity : AppCompatActivity() {
    private lateinit var recyclerViewListNotification: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private val notificationViewModel: NotificationViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_notification)

        // Inisialisasi Views
        recyclerViewListNotification = findViewById(R.id.recyclerViewListNotification)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        setupRecyclerViews()
        setupSwipeRefresh()

        // Observasi data dari ViewModel
        notificationViewModel.notificationData.observe(this) { data ->
            val notificationItems = parseNotificationData(data)
            updateRecyclerView(notificationItems)
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh setelah selesai
        }

        notificationViewModel.error.observe(this) { errorMsg ->
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh jika ada kesalahan
        }

        // Muat data pertama kali
        loadNotificationData()
        setupToolbar()
    }
    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = "Notifikasi")
    }
    private fun setupRecyclerViews() {
        recyclerViewListNotification.layoutManager = LinearLayoutManager(this)
        recyclerViewListNotification.adapter = NotificationAdapter(this, emptyList())
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            // Ketika pengguna menarik untuk refresh, muat ulang data
            loadNotificationData()
        }
    }

    private fun loadNotificationData() {
        swipeRefreshLayout.isRefreshing = true // Tampilkan animasi refresh
        val apiKey = AuthStorage.getApiKey(this) ?: ""
        val token = AuthStorage.getToken(this) ?: ""
        notificationViewModel.fetchNotificationData(apiKey, token)
    }

    private fun updateRecyclerView(notificationItems: List<NotificationItem>) {
        (recyclerViewListNotification.adapter as? NotificationAdapter)?.updateData(notificationItems)
    }
    private fun parseNotificationData(data: JSONArray): List<NotificationItem> {
        val items = mutableListOf<NotificationItem>()
        // Iterasi melalui setiap elemen dalam JSONArray
        for (i in 0 until data.length()) {
            val journalData = data.getJSONObject(i) // Ambil JSONObject di indeks tertentu
            val journalId = journalData.optString("id", "")
            val journalTitle = journalData.optString("content", "No Content")
            val createdAt = journalData.optString("createdAt", "Unknown Date")
            println(journalId)
            println(journalTitle)
            println(createdAt)
//            // Tambahkan data ke daftar NotificationItem
            items.add(
                NotificationItem(
                    journalId,
                    "Pemberitahuan",
                    createdAt,
                    journalTitle
                )
            )
        }
        return items
    }

}
