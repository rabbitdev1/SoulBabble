package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.data.EmotionTotalItem

class EmotionTotalAdapter(
    private val context: Context,
    private val emotions: List<EmotionTotalItem>,
) : RecyclerView.Adapter<EmotionTotalAdapter.EmotionViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val view = LayoutInflater.from(context)
            .inflate(R.layout.item_total_emotion, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, position: Int) {
        val emotion = emotions[position]
        holder.bind(emotion)
    }


    override fun getItemCount(): Int = emotions.size

    /**
     * ViewHolder untuk EmotionTypeAdapter.
     */
    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val nameView: TextView = itemView.findViewById(R.id.tvEmotionTitleTotal)
        val emotionView: TextView = itemView.findViewById(R.id.tvEmojiTotal)
        val totalView: TextView = itemView.findViewById(R.id.tvEmotionMsgTotal)

        /**
         * Mengikat data emosi ke tombol.
         */
        fun bind(emotion: EmotionTotalItem) {
            nameView.text = emotion.name
            emotionView.text = emotion.emotion
            totalView.text = emotion.total

        }
    }
}
