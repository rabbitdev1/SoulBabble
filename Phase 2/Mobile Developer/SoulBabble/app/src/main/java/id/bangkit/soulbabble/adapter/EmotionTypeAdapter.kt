package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.data.EmotionTypeItem

class EmotionTypeAdapter(
    private val context: Context,
    private val emotions: List<EmotionTypeItem>,
    private val onClick: (EmotionTypeItem) -> Unit
) : RecyclerView.Adapter<EmotionTypeAdapter.EmotionViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_type_emotion, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, position: Int) {
        val emotion = emotions[position]
        holder.bind(emotion)

        // Set click listener untuk button
        holder.button.setOnClickListener {
            onClick(emotion)
        }
    }

    override fun getItemCount(): Int = emotions.size

    /**
     * ViewHolder untuk EmotionTypeAdapter.
     */
    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val button: Button = itemView.findViewById(R.id.btnEmotionType)

        /**
         * Mengikat data emosi ke tombol.
         */
        fun bind(emotion: EmotionTypeItem) {
            button.text = emotion.name
            val context = itemView.context

            // Ubah tampilan berdasarkan sifat emosi
            if (emotion.isPositive) {
                button.setBackgroundTintList(
                    ContextCompat.getColorStateList(context, R.color.primary)
                )
                button.setTextColor(ContextCompat.getColor(context, R.color.background_light))
            } else {
                button.setBackgroundTintList(
                    ContextCompat.getColorStateList(context, R.color.red_accent)
                )
                button.setTextColor(ContextCompat.getColor(context, R.color.background_light))
            }
        }
    }
}
