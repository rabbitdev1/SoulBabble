package id.bangkit.soulbabble.ui.Journaling

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.view.WindowInsetsController
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import id.bangkit.soulbabble.R

class InputJournaling3Activity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_journaling3)

        // Mengatur warna status bar
        setupStatusBar()

        // Inisialisasi Views
        val etInputJournaling: TextInputEditText = findViewById(R.id.etInputJournaling)
        val textInputLayout: TextInputLayout = findViewById(R.id.textInputLayout)
        val buttonNext: Button = findViewById(R.id.buttonNext)

        // Terima data dari Intent
        val journalTitle = intent.getStringExtra("JOURNAL_TITLE") ?: "Judul tidak tersedia"
        val journalContent1 = intent.getStringExtra("JOURNAL_CONTENT") ?: "Judul tidak tersedia"

        // Tombol Lanjutkan
        buttonNext.setOnClickListener {
            val inputText = etInputJournaling.text.toString().trim()
            if (inputText.isEmpty()) {
                // Tampilkan error jika kosong
                textInputLayout.error = "Silakan isi jurnal harian Anda."
            } else {
                // Reset error
                textInputLayout.error = null

                println("${journalTitle}=${journalContent1}=${inputText}")

                val intent = Intent(this, SuccessJournalingActivity::class.java)
                startActivity(intent)
            }
        }
    }

    private fun setupStatusBar() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.statusBarColor = ContextCompat.getColor(this, R.color.primary)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.setSystemBarsAppearance(
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS.inv(),
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
            )
        }
    }
}
