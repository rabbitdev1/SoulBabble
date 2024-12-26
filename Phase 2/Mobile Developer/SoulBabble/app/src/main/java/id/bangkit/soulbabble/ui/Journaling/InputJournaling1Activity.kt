package id.bangkit.soulbabble.ui.Journaling

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.utils.setupToolbar

class InputJournaling1Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_journaling1)

        // Setup Toolbar
        val toolbar: Toolbar = findViewById(R.id.topAppBar)
        setupToolbar(this, toolbar, title = "")

        // Get references to UI elements
        val etTitleJournaling: EditText = findViewById(R.id.etTittleJournaling)
        val buttonNext: Button = findViewById(R.id.buttonNext)

        // Set click listener for buttonNext
        buttonNext.setOnClickListener {
            val inputText = etTitleJournaling.text.toString().trim()

            if (isValidTitle(inputText)) {
                // Navigate to the next page if valid
                val intent = Intent(this, InputJournaling2Activity::class.java) // Replace with your target activity
                startActivity(intent)
            } else {
                // Show error message
                Toast.makeText(
                    this,
                    "Judul Jurnal setidaknya harus 2 Kata hingga 6 Kata",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }

    /**
     * Validate title to ensure it contains between 2 and 6 words.
     */
    private fun isValidTitle(title: String): Boolean {
        val wordCount = title.split("\\s+".toRegex()).filter { it.isNotEmpty() }.size
        return wordCount in 2..6
    }
}
