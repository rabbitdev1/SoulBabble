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

    private val answers: MutableMap<Int, String> = mutableMapOf() // Menyimpan jawaban

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): QuestionViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_question, parent, false)
        return QuestionViewHolder(view)
    }

    override fun onBindViewHolder(holder: QuestionViewHolder, position: Int) {
        holder.bind(questions[position], position)
    }

    override fun getItemCount(): Int = questions.size

    inner class QuestionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val tvQuestionTitle: TextView = itemView.findViewById(R.id.tvQuestionTitle)
        private val etAnswer: EditText = itemView.findViewById(R.id.etQuestionDetail)

        fun bind(question: String, index: Int) {
            tvQuestionTitle.text = question
            etAnswer.hint = "Masukkan jawaban"

            etAnswer.addTextChangedListener {
                answers[index] = it.toString()
                onAnswersReady(answers)
            }
        }
    }
}
