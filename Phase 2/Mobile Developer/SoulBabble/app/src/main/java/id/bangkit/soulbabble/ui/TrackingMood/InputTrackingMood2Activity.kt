package id.bangkit.soulbabble.ui.TrackingMood

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.recyclerview.widget.RecyclerView
import com.google.android.flexbox.FlexboxLayoutManager
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionTypeAdapter
import id.bangkit.soulbabble.model.EmotionType

class InputTrackingMood2Activity : AppCompatActivity() {

    // RecyclerView and Data Initialization
    private lateinit var recyclerView: RecyclerView
    private val emotionSource = listOf(
        EmotionType("Sekolah", true),
    ).shuffled()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_tracking_mood2)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = "")
        setupRecyclerView()
    }

    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerViewEmotion)
        recyclerView.layoutManager = FlexboxLayoutManager(this)

        val emoticon = intent.getStringExtra("emoticon") ?: "Unknown Emotion"
        val emoticonTitle = intent.getStringExtra("emoticonTitle") ?: "No Title"
        val emotiontype = intent.getStringExtra("emotiontype") ?: "No Title"

        val adapter = EmotionTypeAdapter(this, emotionSource) { emotionSource ->
            val intent = Intent(this, InputQuestionsActivity::class.java).apply {
                putExtra("emoticon", emoticon)
                putExtra("emoticonTitle", emoticonTitle)
                putExtra("emotiontype", emotiontype)
                putExtra("emotionSource", emotionSource.name)
            }
            startActivity(intent)
            println("${emoticon},${emoticonTitle},${emotiontype},${emotionSource.name}")
        }
        recyclerView.adapter = adapter
    }
}