package id.bangkit.soulbabble.ui.TrackingMood

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.RecyclerView
import com.google.android.flexbox.FlexboxLayoutManager
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionTypeAdapter
import id.bangkit.soulbabble.data.EmotionTypeItem
import id.bangkit.soulbabble.utils.setupToolbar

class InputTrackingMood2Activity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var emotionSources: List<EmotionTypeItem>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_tracking_mood2)

        setupToolbar()
        initializeEmotionSources()
        setupRecyclerView()
    }

    /**
     * Mengatur Toolbar.
     */
    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setupToolbar(this, toolbar, title = "")
    }

    /**
     * Inisialisasi sumber emosi.
     */
    private fun initializeEmotionSources() {
        emotionSources = listOf(
            EmotionTypeItem("Sekolah", true),
            EmotionTypeItem("Pekerjaan", true),
            EmotionTypeItem("Keluarga", true),
            EmotionTypeItem("Hubungan Sosial", true),
            EmotionTypeItem("Kesehatan", true)
        ).shuffled()
    }

    /**
     * Mengatur RecyclerView dan EmotionTypeAdapter.
     */
    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerViewEmotion)
        recyclerView.layoutManager = FlexboxLayoutManager(this)

        val emoticon = intent.getStringExtra("emoticon") ?: "Unknown Emotion"
        val emoticonTitle = intent.getStringExtra("emoticonTitle") ?: "No Title"
        val emotionType = intent.getStringExtra("emotiontype") ?: "No Title"

        val adapter = EmotionTypeAdapter(this, emotionSources) { selectedSource ->
            navigateToQuestionsActivity(emoticon, emoticonTitle, emotionType, selectedSource.name)
        }
        recyclerView.adapter = adapter
    }

    /**
     * Navigasi ke InputQuestionsActivity dengan data yang diteruskan.
     */
    private fun navigateToQuestionsActivity(
        emoticon: String,
        emoticonTitle: String,
        emotionType: String,
        emotionSource: String
    ) {
        val intent = Intent(this, InputQuestionsActivity::class.java).apply {
            putExtra("emoticon", emoticon)
            putExtra("emoticonTitle", emoticonTitle)
            putExtra("emotiontype", emotionType)
            putExtra("emotionSource", emotionSource)
        }
        startActivity(intent)

        // Logging data untuk debugging
        println("Emoticon: $emoticon, Title: $emoticonTitle, Type: $emotionType, Source: $emotionSource")
    }
}
