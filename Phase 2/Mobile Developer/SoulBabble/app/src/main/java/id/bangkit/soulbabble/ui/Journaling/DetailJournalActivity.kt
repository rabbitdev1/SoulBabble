package id.bangkit.soulbabble.ui.Journaling

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.utils.AuthStorage
import org.json.JSONObject
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class DetailJournalActivity : AppCompatActivity() {

    private lateinit var tvTitle: TextView
    private lateinit var tvCreatedAt: TextView
    private lateinit var tvJournalContent1: TextView
    private lateinit var tvJournalContent2: TextView
    private lateinit var dataShow: LinearLayout


    private lateinit var refreshLayout: SwipeRefreshLayout
    private lateinit var toolbar: Toolbar


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_journal)

        // Inisialisasi Views
        tvTitle = findViewById(R.id.tvJournalTitle)
        tvCreatedAt = findViewById(R.id.tvJournalCreatedAt)
        tvJournalContent1 = findViewById(R.id.tvJournalContent1)
        tvJournalContent2 = findViewById(R.id.tvJournalContent2)
        refreshLayout = findViewById(R.id.swipeRefreshLayoutDetailJournaling)
        toolbar = findViewById(R.id.toolbar)
        dataShow = findViewById(R.id.dataShow)

        // Ambil data dari Intent
        val journalId = intent.getStringExtra("JOURNAL_ID")

        if (journalId != null) {
            fetchJournalDetails(journalId)
        } else {
            Toast.makeText(this, "Invalid Journal ID", Toast.LENGTH_SHORT).show()
            finish()
        }

        setupSwipeRefresh(journalId)
    }

    private fun setupSwipeRefresh(journalId: String?) {
        refreshLayout.setOnRefreshListener {
            if (journalId != null) {
                fetchJournalDetails(journalId)
            }
        }
    }

    private fun fetchJournalDetails(journalId: String) {
        val apiClient = ApiClient()
        val apiKey = AuthStorage.getApiKey(this) ?: ""
        val token = AuthStorage.getToken(this) ?: ""

        refreshLayout.isRefreshing = true // Tampilkan loading
        dataShow.visibility =View.GONE
        apiClient.getDetailJournaling(apiKey, token, journalId) { result, error ->
            runOnUiThread {
                refreshLayout.isRefreshing = false // Sembunyikan loading setelah data selesai diambil
                dataShow.visibility =View.VISIBLE

                if (error != null) {
                    Toast.makeText(this, "Error: $error", Toast.LENGTH_SHORT).show()
                } else if (result != null) {
                    try {
                        val json = JSONObject(result)
                        val data = json.getJSONObject("data")
                        val title = data.getString("title")
                        val content = data.getString("content")
                        val createdAt = data.getString("createdAt")

                        // Hilangkan trailing comma dari "content"
                        val sanitizedContent = content.trim()
                            .removeSuffix("}")
                            .removeSuffix(",")
                            .plus("}")
                        // Parse string JSON di "content"
                        val contentJson = JSONObject(sanitizedContent)
                        val jurnal1 = contentJson.optString("jurnal1", "No content for jurnal1.")
                        val jurnal2 = contentJson.optString("jurnal2", "No content for jurnal2.")

                        // Tampilkan data di TextViews
                        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = title)

                        tvTitle.text = title
                        tvCreatedAt.text = createdAt
                        tvJournalContent1.text = jurnal1
                        tvJournalContent2.text = jurnal2
                    } catch (e: Exception) {
                        e.printStackTrace()
                        Toast.makeText(this, "Failed to parse response", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
