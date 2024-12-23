package id.bangkit.soulbabble.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.EmotionItem
import id.bangkit.soulbabble.ui.TrackingMood.InputTrackingMood1Activity

class EmotionAdapter(
    private val context: Context,
    private var emotions: List<EmotionItem>
) : RecyclerView.Adapter<EmotionAdapter.EmotionViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val view = LayoutInflater.from(context)
            .inflate(R.layout.item_emotion, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, position: Int) {
        val emotionItem = emotions[position]
        holder.bind(emotionItem)

        // Set listener untuk klik pada CardView
        holder.cardView.setOnClickListener {
            handleEmotionClick(emotionItem)
        }
    }

    override fun getItemCount(): Int = emotions.size

    /**
     * ViewHolder untuk EmotionAdapter.
     */
    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardEmotion)
        private val emotionTextView: TextView = itemView.findViewById(R.id.tvEmotionItem)
        private val titleTextView: TextView = itemView.findViewById(R.id.tvTitleEmotion)

        fun bind(emotionItem: EmotionItem) {
            emotionTextView.text = emotionItem.emotion
            titleTextView.text = emotionItem.title
        }
    }

    /**
     * Menangani klik pada item emosi.
     */
    private fun handleEmotionClick(emotionItem: EmotionItem) {
        val intent = Intent(context, InputTrackingMood1Activity::class.java).apply {
            putExtra("emotion", emotionItem.emotion)
            putExtra("title", emotionItem.title)
        }
        context.startActivity(intent)
    }
}
