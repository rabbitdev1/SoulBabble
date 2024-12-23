package id.bangkit.soulbabble.ui.TrackingMood

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.RecyclerView
import com.google.android.flexbox.FlexboxLayoutManager
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionTypeAdapter
import id.bangkit.soulbabble.model.EmotionTypeItem
import id.bangkit.soulbabble.utils.setupToolbar

class InputTrackingMood1Activity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var emotions: List<EmotionTypeItem>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_tracking_mood1)

        setupToolbar()
        initializeEmotions()
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
     * Inisialisasi daftar emosi secara acak.
     */
    private fun initializeEmotions() {
        emotions = listOf(
            EmotionTypeItem("Kecewa", false),
            EmotionTypeItem("Frustrasi", false),
            EmotionTypeItem("Bingung", false),
            EmotionTypeItem("Bahagia", true),
            EmotionTypeItem("Cemas", false),
            EmotionTypeItem("Marah", false),
            EmotionTypeItem("Kesal", false),
            EmotionTypeItem("Sedih", false),
            EmotionTypeItem("Tertarik", true),
            EmotionTypeItem("Optimis", true),
            EmotionTypeItem("Tenang", true),
            EmotionTypeItem("Gembira", true),
            EmotionTypeItem("Puas", true),
            EmotionTypeItem("Nyaman", true),
            EmotionTypeItem("Bergairah", true),
            EmotionTypeItem("Aneh", false),
            EmotionTypeItem("Euforis", true),
            EmotionTypeItem("Tertantang", true),
            EmotionTypeItem("Penuh Harapan", true),
            EmotionTypeItem("Terinspirasi", true),
            EmotionTypeItem("Panik", false),
            EmotionTypeItem("Rindu", false),
            EmotionTypeItem("Takut", false),
            EmotionTypeItem("Senyum", true),
            EmotionTypeItem("Terharu", true),
            EmotionTypeItem("Bersyukur", true),
            EmotionTypeItem("Malu", false),
            EmotionTypeItem("Tersenyum", true),
            EmotionTypeItem("Terkejut", false),
            EmotionTypeItem("Gugup", false),
            EmotionTypeItem("Gemas", true),
            EmotionTypeItem("Terluka", false)
        ).shuffled()
    }

    /**
     * Mengatur RecyclerView dan EmotionTypeAdapter.
     */
    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerViewEmotion)
        recyclerView.layoutManager = FlexboxLayoutManager(this)

        val emoticon = intent.getStringExtra("emotion") ?: "Unknown Emotion"
        val emoticonTitle = intent.getStringExtra("title") ?: "No Title"

        val adapter = EmotionTypeAdapter(this, emotions) { emotion ->
            navigateToNextScreen(emoticon, emoticonTitle, emotion.name)
        }
        recyclerView.adapter = adapter
    }

    /**
     * Navigasi ke InputTrackingMood2Activity dengan data yang diteruskan.
     */
    private fun navigateToNextScreen(emoticon: String, emoticonTitle: String, emotionType: String) {
        val intent = Intent(this, InputTrackingMood2Activity::class.java).apply {
            putExtra("emoticon", emoticon)
            putExtra("emoticonTitle", emoticonTitle)
            putExtra("emotiontype", emotionType)
        }
        startActivity(intent)
    }
}
