package id.bangkit.soulbabble.ui.Journaling

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.JournalAdapter
import id.bangkit.soulbabble.data.JournalItem

class ListJournalingActivity : AppCompatActivity() {
    private lateinit var recyclerViewListJournal: RecyclerView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_list_journaling)

        // Inisialisasi Views
        recyclerViewListJournal = findViewById(R.id.recyclerViewListJournal)

        // Mengatur RecyclerView
        setupRecyclerViews()
    }

    private fun setupRecyclerViews() {
        recyclerViewListJournal.layoutManager = LinearLayoutManager(
            this, // Gunakan 'this' untuk konteks di Activity
            LinearLayoutManager.VERTICAL,
            false
        )
        recyclerViewListJournal.adapter = JournalAdapter(this, generateJournalList())
    }

    private fun generateJournalList(): List<JournalItem> = listOf(
        JournalItem("\uD83D\uDE42", "Refleksi", "Minggu Lalu, 15:00", "Belajar tentang kehidupan..."),
        JournalItem("\uD83D\uDE0A", "Motivasi", "Kemarin, 12:00", "Bersemangat untuk mencapai tujuan."),
        JournalItem("\uD83D\uDE0D", "Kebahagiaan", "Hari Ini, 09:00", "Menghabiskan waktu bersama keluarga.")
    )
}
