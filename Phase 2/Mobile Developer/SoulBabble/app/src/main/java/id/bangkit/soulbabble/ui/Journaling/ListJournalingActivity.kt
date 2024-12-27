package id.bangkit.soulbabble.ui.Journaling

import JournalingViewModel
import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.JournalAdapter
import id.bangkit.soulbabble.data.JournalItem
import id.bangkit.soulbabble.utils.AuthStorage
import org.json.JSONException
import org.json.JSONObject

class ListJournalingActivity : AppCompatActivity() {
    private lateinit var recyclerViewListJournal: RecyclerView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private val journalingViewModel: JournalingViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_list_journaling)

        // Inisialisasi Views
        recyclerViewListJournal = findViewById(R.id.recyclerViewListJournal)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        setupRecyclerViews()
        setupSwipeRefresh()

        // Observasi data dari ViewModel
        journalingViewModel.journalingData.observe(this) { data ->
            val journalItems = parseJournalData(data)
            updateRecyclerView(journalItems)
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh setelah selesai
        }

        journalingViewModel.error.observe(this) { errorMsg ->
            Toast.makeText(this, errorMsg, Toast.LENGTH_SHORT).show()
            swipeRefreshLayout.isRefreshing = false // Hentikan animasi refresh jika ada kesalahan
        }

        // Muat data pertama kali
        loadJournalingData()
        setupToolbar()
    }
    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = "Catatan Jurnal Kamu")
    }
    private fun setupRecyclerViews() {
        recyclerViewListJournal.layoutManager = LinearLayoutManager(this)
        recyclerViewListJournal.adapter = JournalAdapter(this, emptyList())
    }

    private fun setupSwipeRefresh() {
        swipeRefreshLayout.setOnRefreshListener {
            // Ketika pengguna menarik untuk refresh, muat ulang data
            loadJournalingData()
        }
    }

    private fun loadJournalingData() {
        swipeRefreshLayout.isRefreshing = true // Tampilkan animasi refresh
        val apiKey = AuthStorage.getApiKey(this) ?: ""
        val token = AuthStorage.getToken(this) ?: ""
        journalingViewModel.fetchJournalingData(apiKey, token)
    }

    private fun updateRecyclerView(journalItems: List<JournalItem>) {
        (recyclerViewListJournal.adapter as? JournalAdapter)?.updateData(journalItems)
    }

    private fun parseJournalData(data: JSONObject): List<JournalItem> {
        val items = mutableListOf<JournalItem>()

        // Ambil data utama dari JSON
        val journalData = data.getJSONObject("data")
        val journalId = data.optString("id", "default_value")
        val journalTitle = journalData.optString("title")
        val journalContent = journalData.optString("content")
        val analysisResult = journalData.optString("analysisResult")
        val createdAt = journalData.optString("createdAt")


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
                "$parsedContent"
            )
        )
        return items
    }
}
