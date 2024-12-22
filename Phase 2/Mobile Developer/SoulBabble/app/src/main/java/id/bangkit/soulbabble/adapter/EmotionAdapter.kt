package id.bangkit.soulbabble.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.EmotionItem
import id.bangkit.soulbabble.ui.TrackingMood.InputTrackingMood1Activity

class EmotionAdapter(
    private val context: Context, private var emotions: List<EmotionItem>) :
    RecyclerView.Adapter<EmotionAdapter.EmotionViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_emotion, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, position: Int) {
        val emotion = emotions[position]
        holder.bind(emotion)
        holder.cardView.setOnClickListener {
            val intent = Intent(context, InputTrackingMood1Activity::class.java).apply {
                putExtra("emotion", emotion.emotion)
                putExtra("title", emotion.title)
            }
            context.startActivity(intent)
        }

    }

    override fun getItemCount() = emotions.size

    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardEmotion)
        private val emotionView: TextView = itemView.findViewById(R.id.tvEmotionItem)
        private val textView: TextView = itemView.findViewById(R.id.tvTitleEmotion)

        fun bind(emotion: EmotionItem) {
            emotionView.text = emotion.emotion
            textView.text = emotion.title
        }
    }
}