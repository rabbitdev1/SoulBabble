package id.bangkit.soulbabble.ui.TrackingMood

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.adapter.QuestionsAdapter
import id.bangkit.soulbabble.ui.HomeActivity
import id.bangkit.soulbabble.utils.setupToolbar

class InputQuestionsActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var btnSubmit: Button
    private lateinit var questions: List<String>
    private val answers = mutableMapOf<Int, String>() // Jawaban disimpan di sini

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_questions)

        setupToolbar()
        setupQuestions()
        setupRecyclerView()
        setupSubmitButton()
    }

    /**
     * Mengatur Toolbar.
     */
    private fun setupToolbar() {
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setupToolbar(this, toolbar, title = "")
    }

    /**
     * Menyediakan data pertanyaan.
     */
    private fun setupQuestions() {
        questions = listOf(
            "Apa yang membuat kamu merasa frustrasi di Kesehatan Mental?",
            "Apa yang bisa menyebabkan perasaan frustrasi kamu di Kesehatan Mental?",
            "Bagaimana situasi di Kesehatan Mental mempengaruhi perasaan kamu yang frustrasi?",
            "Apa yang mempengaruhi perasaan frustrasi kamu di Kesehatan Mental?",
            "Bagaimana kamu mengatasi rasa frustrasi saat mengalami hambatan di Kesehatan Mental?"
        )
    }

    /**
     * Mengatur RecyclerView untuk menampilkan pertanyaan.
     */
    private fun setupRecyclerView() {
        recyclerView = findViewById(R.id.recyclerViewQuestions)
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = QuestionsAdapter(questions) { updatedAnswers ->
            answers.clear()
            answers.putAll(updatedAnswers)
        }
    }

    /**
     * Mengatur tombol Submit dan validasi data.
     */
    private fun setupSubmitButton() {
        btnSubmit = findViewById(R.id.btnSubmit)
        btnSubmit.setOnClickListener {
            if (validateAnswers()) {
                processAnswers()
                navigateToHome()
            } else {
                Toast.makeText(this, "Semua pertanyaan harus dijawab.", Toast.LENGTH_SHORT).show()
            }
        }
    }

    /**
     * Memvalidasi jawaban dari pengguna.
     */
    private fun validateAnswers(): Boolean {
        return answers.size == questions.size && answers.values.none { it.isBlank() }
    }

    /**
     * Memproses dan menampilkan data jawaban pengguna.
     */
    private fun processAnswers() {
        val emoticon = intent.getStringExtra("emoticon") ?: "Unknown Emotion"
        val emoticonTitle = intent.getStringExtra("emoticonTitle") ?: "No Title"
        val emotionType = intent.getStringExtra("emotiontype") ?: "No Title"
        val emotionSource = intent.getStringExtra("emotionSource") ?: "No Title"

        println("Emoticon: $emoticon")
        println("Emoticon Title: $emoticonTitle")
        println("Emotion Type: $emotionType")
        println("Emotion Source: $emotionSource")

        questions.forEachIndexed { index, question ->
            val answer = answers[index] ?: "Belum dijawab"
            println("Pertanyaan: $question")
            println("Jawaban: $answer")
        }

        Toast.makeText(this, "Data berhasil divalidasi!", Toast.LENGTH_SHORT).show()
    }

    /**
     * Menavigasi pengguna ke HomeActivity setelah data tervalidasi.
     */
    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
    }
}
