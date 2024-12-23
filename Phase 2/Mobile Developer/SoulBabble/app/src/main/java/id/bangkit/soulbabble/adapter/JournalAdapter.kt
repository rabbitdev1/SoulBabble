package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.JournalItem

class JournalAdapter(
    private val context: Context,
    private val journals: List<JournalItem>,
) : RecyclerView.Adapter<JournalAdapter.JournalViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JournalViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_journal, parent, false)
        return JournalViewHolder(view)
    }

    override fun onBindViewHolder(holder: JournalViewHolder, position: Int) {
        val journalItem = journals[position]
        holder.bind(journalItem)

    }

    override fun getItemCount(): Int = journals.size

    /**
     * ViewHolder untuk JournalAdapter.
     */
    inner class JournalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardJournal)
        private val emotionTextView: TextView = itemView.findViewById(R.id.tvEmotionJournal)
        private val titleTextView: TextView = itemView.findViewById(R.id.tvJournalTitle)
        private val contentTextView: TextView = itemView.findViewById(R.id.tvJournalContent)
        private val timeTextView: TextView = itemView.findViewById(R.id.tvJournalTime)

        /**
         * Mengikat data jurnal ke item layout.
         */
        fun bind(journalItem: JournalItem) {
            emotionTextView.text = journalItem.emotion
            titleTextView.text = journalItem.title
            contentTextView.text = journalItem.content
            timeTextView.text = journalItem.time
        }
    }
}
