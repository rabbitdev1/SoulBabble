package id.bangkit.soulbabble.ui.Recommendation

import android.os.Bundle
import android.view.View
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import com.squareup.picasso.Picasso
import formatRelativeDate
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.utils.AuthStorage
import org.json.JSONObject

class DetailRecommendationActivity : AppCompatActivity() {
    private lateinit var tvTitle: TextView
    private lateinit var tvCreatedAt: TextView
    private lateinit var tvContent: TextView
    private lateinit var imgContent: ImageView
    private lateinit var dataShow: ConstraintLayout


    private lateinit var refreshLayout: SwipeRefreshLayout
    private lateinit var toolbar: Toolbar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_recommendation)
        tvTitle = findViewById(R.id.tvRecommendationTitle)
        tvCreatedAt = findViewById(R.id.tvRecommendationTime)
        tvContent = findViewById(R.id.tvRecommendationContent)
        refreshLayout = findViewById(R.id.swipeRefreshLayoutDetailRecommendation)
        imgContent = findViewById(R.id.imgContent)
        toolbar = findViewById(R.id.toolbar)
        dataShow = findViewById(R.id.dataShow)

        // Mendapatkan data dari Intent
        val recommendationId = intent.getStringExtra("RECOMMENDATION_ID")
        if (recommendationId != null) {
            fetchRecommendedDetails(recommendationId)
        } else {
            Toast.makeText(this, "Invalid ID", Toast.LENGTH_SHORT).show()
            finish()
        }

        setupSwipeRefresh(recommendationId)
    }

    private fun setupSwipeRefresh(recommendationId: String?) {
        refreshLayout.setOnRefreshListener {
            if (recommendationId != null) {
                fetchRecommendedDetails(recommendationId)
            }
        }
    }

    private fun fetchRecommendedDetails(recommendedId: String) {
        val apiClient = ApiClient()
        val apiKey = AuthStorage.getApiKey(this) ?: ""
        val token = AuthStorage.getToken(this) ?: ""

        refreshLayout.isRefreshing = true // Tampilkan loading
        dataShow.visibility = View.GONE
        apiClient.getDetailRecommended(apiKey, token, recommendedId) { result, error ->
            runOnUiThread {
                refreshLayout.isRefreshing = false // Sembunyikan loading setelah data selesai diambil
                dataShow.visibility = View.VISIBLE

                if (error != null) {
                    Toast.makeText(this, "Error: $error", Toast.LENGTH_SHORT).show()
                } else if (result != null) {
                    try {
                        val json = JSONObject(result)
                        val data = json.getJSONObject("data")
                        val content = data.getString("recommendedAction")
                        val createdAt = data.getString("createdAt")

                        // Hilangkan trailing comma dari "content"
                        val sanitizedContent = content.trim()
                            .removeSuffix("}")
                            .removeSuffix(",")
                            .plus("}")
                        // Parse string JSON di "content"
                        val contentJson = JSONObject(sanitizedContent)
                        val title = contentJson.optString("title", "No content for title.")
                        val desc = contentJson.optString("desc", "No content for desc.")
                        val image = contentJson.optString("image", "No content for image.")

                        // Tampilkan data di TextViews
                        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = title)

                        tvTitle.text = title
                        tvCreatedAt.text = formatRelativeDate(createdAt)
                        tvContent.text = desc
//                        image.text = image
                        Picasso.get()
                            .load(image)
                            .placeholder(R.drawable.ic_launcher_background)  // Gambar placeholder
                            .error(R.drawable.ic_launcher_background)        // Gambar jika terjadi error
                            .into(imgContent)
                    } catch (e: Exception) {
                        e.printStackTrace()
                        Toast.makeText(this, "Failed to parse response", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
