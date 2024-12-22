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
import id.bangkit.soulbabble.ui.SplashScreenActivity
import id.bangkit.soulbabble.ui.TrackingMoodFragment
import id.bangkit.soulbabble.utils.setupToolbar

class InputQuestionsActivity : AppCompatActivity() {


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_input_questions)

        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setupToolbar(this, toolbar, title = "")

        val questions = listOf(
            "Apa yang membuat kamu merasa frustrasi di Kesehatan Mental?",
            "Apa yang bisa menyebabkan perasaan frustrasi kamu di Kesehatan Mental?",
            "Bagaimana situasi di Kesehatan Mental mempengaruhi perasaan kamu yang frustrasi?",
            "Apa yang mempengaruhi perasaan frustrasi kamu di Kesehatan Mental?",
            "Bagaimana kamu mengatasi rasa frustrasi saat mengalami hambatan di Kesehatan Mental?"
        )

        val recyclerView: RecyclerView = findViewById(R.id.recyclerViewQuestions)
        val answers = mutableMapOf<Int, String>() // Jawaban disimpan di sini

        val adapter = QuestionsAdapter(questions) { updatedAnswers ->
            answers.clear()
            answers.putAll(updatedAnswers)
        }
        recyclerView.layoutManager = LinearLayoutManager(this)
        recyclerView.adapter = adapter

        val btnSubmit: Button = findViewById(R.id.btnSubmit)
        btnSubmit.setOnClickListener {
            if (answers.size < questions.size) {
                Toast.makeText(this, "Semua pertanyaan harus dijawab.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            if (validateAnswers(answers, questions)) {
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

                // Pindah ke Activity yang memuat TrackingMoodFragment
                val intent = Intent(this, HomeActivity::class.java)
                startActivity(intent)

                Toast.makeText(this, "Data berhasil divalidasi!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Semua pertanyaan harus dijawab.", Toast.LENGTH_SHORT).show()
            }
        }


    }

    private fun validateAnswers(answers: Map<Int, String>, questions: List<String>): Boolean {
        return answers.size == questions.size && answers.values.none { it.isBlank() }
    }
}