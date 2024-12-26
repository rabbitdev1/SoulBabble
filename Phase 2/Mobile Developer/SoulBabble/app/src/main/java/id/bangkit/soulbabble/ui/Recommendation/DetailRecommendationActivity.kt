package id.bangkit.soulbabble.ui.Recommendation

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import id.bangkit.soulbabble.R

class DetailRecommendationActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detail_recommendation)

        // Mendapatkan data dari Intent
        val recommendationId = intent.getStringExtra("RECOMMENDATION_ID")

        println("yaya ${recommendationId}")

        setupToolbar()
    }
    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = "")
    }
}
