package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.AnswerItem

class AnswerAdapter(
    private val context: Context,
    private var answers: List<AnswerItem>
) : RecyclerView.Adapter<AnswerAdapter.AnswerViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AnswerViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_answer, parent, false)
        return AnswerViewHolder(view)
    }

    override fun onBindViewHolder(holder: AnswerViewHolder, position: Int) {
        holder.bind(answers[position])
    }

    override fun getItemCount(): Int = answers.size

    /**
     * ViewHolder class for AnswerAdapter.
     */
    class AnswerViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val questionView: TextView = itemView.findViewById(R.id.tvQuestionTitle)
        private val answerView: TextView = itemView.findViewById(R.id.tvAnswerTitle)

        fun bind(answerItem: AnswerItem) {
            questionView.text = answerItem.question
            answerView.text = answerItem.answer
        }
    }
}
