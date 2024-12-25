package id.bangkit.soulbabble.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.data.EmotionWeekItem
import id.bangkit.soulbabble.utils.getEmotionalFactorByIndex
import org.json.JSONObject

class EmotionWeekAdapter(
    private val context: Context,
    private var emotions: List<EmotionWeekItem>,
    private val onItemClick: (
        isSelected: Boolean,
        emoji: String,
        emotionalFactors1: String,
        emotionalFactors2: String,
        emotionalFactors3: String,
        createAt: String,
        msgEmotion: String,
        resultQuestions: List<Pair<String, String>>,
        recommendations: List<Triple<String, String, String>>
    ) -> Unit
) : RecyclerView.Adapter<EmotionWeekAdapter.EmotionViewHolder>() {

    // Menyimpan posisi item yang dipilih
    private var selectedPosition: Int = RecyclerView.NO_POSITION

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): EmotionViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_emotion_week, parent, false)
        return EmotionViewHolder(view)
    }

    override fun onBindViewHolder(holder: EmotionViewHolder, @SuppressLint("RecyclerView") position: Int) {
        val emotion = emotions[position]
        holder.bind(emotion)

        // Set background color or tint based on selection
        val isSelected = position == selectedPosition
        holder.emojiContainer.backgroundTintList = if (isSelected) {
            ContextCompat.getColorStateList(context, R.color.primary)
        } else {
            ContextCompat.getColorStateList(context, R.color.gray)
        }

        // Handle click event
        holder.itemView.setOnClickListener {
                val previousPosition = selectedPosition
                selectedPosition = position

                // Update only the previous and current position
                notifyItemChanged(previousPosition)
                notifyItemChanged(selectedPosition)

                val isEmojiEmpty = emotion.resultedEmotion.isNullOrEmpty()

                try {
                    val resultedEmotionJson = emotion.resultedEmotion?.let { JSONObject(it) }
                    if (resultedEmotionJson != null) {
                        val emoji = resultedEmotionJson.getString("emoji")
                        val emotionalFactors = resultedEmotionJson.getJSONArray("emotionalFactor")
                        val emotionalFactors1 = getEmotionalFactorByIndex(emotionalFactors, 0)
                        val emotionalFactors2 = getEmotionalFactorByIndex(emotionalFactors, 1)
                        val emotionalFactors3 = getEmotionalFactorByIndex(emotionalFactors, 2)
                        val resultQuestions = mutableListOf<Pair<String, String>>()
                        val recommendations = mutableListOf<Triple<String, String, String>>()

                        // Extract questions and answers
                        val questionsArray = resultedEmotionJson.getJSONArray("resultQuestion")
                        for (i in 0 until questionsArray.length()) {
                            val questionObj = questionsArray.getJSONObject(i)
                            resultQuestions.add(
                                questionObj.getString("question") to questionObj.getString("answer")
                            )
                        }

                        // Extract recommendations
                        val recommendationsArray = resultedEmotionJson.getJSONArray("recommendations")
                        for (i in 0 until recommendationsArray.length()) {
                            val recommendationObj = recommendationsArray.getJSONObject(i)
                            recommendations.add(
                                Triple(
                                    recommendationObj.getString("title"),
                                    recommendationObj.getString("image"),
                                    recommendationObj.getString("desc")
                                )
                            )
                        }

                        // Pass data back via callback
                        onItemClick(
                            isEmojiEmpty,
                            emoji,
                            emotionalFactors1,
                            emotionalFactors2,
                            emotionalFactors3,
                            emotion.createdAt,
                            resultedEmotionJson.getString("msgEmotion"),
                            resultQuestions,
                            recommendations
                        )
                    }
                } catch (e: Exception) {
                    e.printStackTrace()
                    onItemClick(
                        isEmojiEmpty,
                        "No Emoji",
                        "No Emotional Factor 1",
                       "No Emotional Factor 2",
                        "No Emotional Factor 3",
                       emotion.createdAt,
                        "Error",
                        emptyList(),
                         emptyList()
                    )
                }
        }
    }

    override fun getItemCount(): Int = emotions.size

    /**
     * ViewHolder untuk EmotionWeekAdapter.
     */
    class EmotionViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val emotionTextView: TextView = itemView.findViewById(R.id.tvEmotionItem)
        private val titleTextView: TextView = itemView.findViewById(R.id.tvTitleEmotion)
        val emojiContainer: LinearLayout = itemView.findViewById(R.id.emojiContainer)

        fun bind(emotion: EmotionWeekItem) {
            emotionTextView.text = emotion.emotion
            titleTextView.text = emotion.dayOfWeek
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    fun updateEmotionList(newEmotions: List<EmotionWeekItem>) {
        emotions = newEmotions
        notifyDataSetChanged()
    }

    @SuppressLint("NotifyDataSetChanged")
    fun selectItemByDay(dayOfWeek: String) {
        val index = emotions.indexOfFirst { it.dayOfWeek == dayOfWeek }
        if (index != -1) {
            selectedPosition = index
            notifyDataSetChanged() // Update RecyclerView
        }
    }
}
