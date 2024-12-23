package id.bangkit.soulbabble.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.core.widget.addTextChangedListener
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R

class QuestionsAdapter(
    private val questions: List<String>,
    private val onAnswersReady: (Map<Int, String>) -> Unit // Callback untuk jawaban
) : RecyclerView.Adapter<QuestionsAdapter.QuestionViewHolder>() {

    // Map untuk menyimpan jawaban dari pengguna
    private val answers = mutableMapOf<Int, String>()

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): QuestionViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val view = inflater.inflate(R.layout.item_question, parent, false)
        return QuestionViewHolder(view)
    }

    override fun onBindViewHolder(holder: QuestionViewHolder, position: Int) {
        val question = questions[position]
        holder.bind(question, position)
    }

    override fun getItemCount(): Int = questions.size

    /**
     * ViewHolder untuk QuestionsAdapter.
     */
    inner class QuestionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val questionTitleTextView: TextView = itemView.findViewById(R.id.tvQuestionTitle)
        private val answerEditText: EditText = itemView.findViewById(R.id.etQuestionDetail)

        /**
         * Mengikat data pertanyaan ke tampilan.
         */
        fun bind(question: String, index: Int) {
            questionTitleTextView.text = question
            answerEditText.hint = "Masukkan jawaban"

            // Listener untuk perubahan teks pada EditText
            answerEditText.addTextChangedListener { editable ->
                answers[index] = editable.toString()
                onAnswersReady(answers) // Callback untuk memperbarui jawaban
            }

            // Mengatur ulang teks jawaban jika sebelumnya diisi
            answerEditText.setText(answers[index] ?: "")
        }
    }
}
