package id.bangkit.soulbabble.ui.TrackingMood

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.RecyclerView
import com.google.android.flexbox.FlexboxLayoutManager
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.EmotionTypeAdapter
import id.bangkit.soulbabble.model.EmotionType

class InputTrackingMood1Activity : AppCompatActivity() {

    // RecyclerView and Data Initialization
    private lateinit var recyclerView: RecyclerView
    private val emotions = listOf(
        EmotionType("Kecewa", false),
        EmotionType("Frustrasi", false),
        EmotionType("Bingung", false),
        EmotionType("Bahagia", true),
        EmotionType("Cemas", false),
        EmotionType("Marah", false),
        EmotionType("Kesal", false),
        EmotionType("Sedih", false),
        EmotionType("Tertarik", true),
        EmotionType("Optimis", true),
        EmotionType("Tenang", true),
        EmotionType("Gembira", true),
        EmotionType("Puas", true),
        EmotionType("Nyaman", true),
        EmotionType("Bergairah", true),
        EmotionType("Aneh", false),
        EmotionType("Euforis", true),
        EmotionType("Tertantang", true),
        EmotionType("Penuh Harapan", true),
        EmotionType("Terinspirasi", true),
        EmotionType("Panik", false),
        EmotionType("Rindu", false),
        EmotionType("Takut", false),
        EmotionType("Senyum", true),
        EmotionType("Terharu", true),
        EmotionType("Bersyukur", true),
        EmotionType("Malu", false),
        EmotionType("Tersenyum", true),
        EmotionType("Terkejut", false),
        EmotionType("Gugup", false),
        EmotionType("Gemas", true),
        EmotionType("Terluka", false)
    ).shuffled()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.fragment_tracking_mood)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        id.bangkit.soulbabble.utils.setupToolbar(this, toolbar, title = "")
        setupRecyclerView()
    }

    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerViewEmotion)
        recyclerView.layoutManager = FlexboxLayoutManager(this)

        val emoticon = intent.getStringExtra("emotion") ?: "Unknown Emotion"
        val emoticonTitle = intent.getStringExtra("title") ?: "No Title"

        val adapter = EmotionTypeAdapter(this, emotions) { emotion ->
            // Handle click and navigate to InputTrackingMood2Activity
            val intent = Intent(this, InputTrackingMood2Activity::class.java).apply {
                putExtra("emoticon", emoticon)
                putExtra("emoticonTitle", emoticonTitle)
                putExtra("emotiontype", emotion.name)
            }
            startActivity(intent)
        }
        recyclerView.adapter = adapter
    }
}
