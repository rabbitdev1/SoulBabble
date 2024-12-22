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
import id.bangkit.soulbabble.adapter.EmotionAdapter.EmotionViewHolder
import id.bangkit.soulbabble.model.JournalItem

class JournalAdapter(
    private val context: Context,
    private val journal: List<JournalItem>
) : RecyclerView.Adapter<JournalAdapter.JournalViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): JournalViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_journal, parent, false)
        return JournalViewHolder(view)
    }

    override fun onBindViewHolder(holder: JournalViewHolder, position: Int) {
        val journal = journal[position]
        holder.bind(journal)
        holder.cardView.setOnClickListener {
//            val intent = Intent(context, NextActivity::class.java).apply {
//                putExtra("emotion", emotion.emotion)
//                putExtra("title", emotion.title)
//            }
//            context.startActivity(intent)
            Toast.makeText(context, "Clicked: ${journal.title}", Toast.LENGTH_SHORT).show()
        }

    }
    override fun getItemCount(): Int = journal.size

    inner class JournalViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardJournal)
        private val emotionView: TextView = itemView.findViewById(R.id.tvEmotionJournal)
        private val titleView: TextView = itemView.findViewById(R.id.tvJournalTitle)
        private val contentView: TextView = itemView.findViewById(R.id.tvJournalContent)
        private val timeView: TextView = itemView.findViewById(R.id.tvJournalTime)

        fun bind(journalItem: JournalItem) {
            emotionView.text = journalItem.emotion
            titleView.text = journalItem.title
            contentView.text = journalItem.content
            timeView.text = journalItem.time
        }
    }
}
