package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.EmotionType
import id.bangkit.soulbabble.model.JournalItem

class EmotionTypeAdapter(
    private val context: Context,
    private val emotions: List<EmotionType>,
    private val onClick: (EmotionType) -> Unit
) : RecyclerView.Adapter<EmotionTypeAdapter.EmotionViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_type_emotion, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, position: Int) {
        val emotion = emotions[position]
        holder.bind(emotion)
        holder.button.setOnClickListener {
            onClick(emotion)
        }
    }

    override fun getItemCount() = emotions.size

    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val button: Button = itemView.findViewById(R.id.btnEmotionType)

        fun bind(emotion: EmotionType) {
            button.text = emotion.name
            if (emotion.isPositive) {
                button.setBackgroundTintList(
                    ContextCompat.getColorStateList(itemView.context, R.color.primary)
                )
                button.setTextColor(
                    ContextCompat.getColor(itemView.context, R.color.background_light)
                )
            } else {
                button.setBackgroundTintList(
                    ContextCompat.getColorStateList(itemView.context, R.color.red_accent)
                )
                button.setTextColor(
                    ContextCompat.getColor(itemView.context, R.color.background_light)
                )
            }
        }
    }
}
