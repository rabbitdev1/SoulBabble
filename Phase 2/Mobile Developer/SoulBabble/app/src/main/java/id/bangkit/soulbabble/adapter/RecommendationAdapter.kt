package id.bangkit.soulbabble.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.cardview.widget.CardView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.RecommendationItem

class RecommendationAdapter(
    private val context: Context,
    private val recommendations: List<RecommendationItem>,
) : RecyclerView.Adapter<RecommendationAdapter.RecommendationViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecommendationViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_recommendation, parent, false)
        return RecommendationViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecommendationViewHolder, position: Int) {
        val recommendation = recommendations[position]
        holder.bind(recommendation)


    }

    override fun getItemCount(): Int = recommendations.size

    /**
     * ViewHolder untuk RecommendationAdapter.
     */
    inner class RecommendationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardRecommendation)
        private val recommendationImageView: ImageView = itemView.findViewById(R.id.ivRecommendationImage)
        private val recommendationTitleTextView: TextView = itemView.findViewById(R.id.tvRecommendationTitle)
        private val recommendationDescriptionTextView: TextView = itemView.findViewById(R.id.tvRecommendationDescription)

        /**
         * Mengikat data rekomendasi ke tampilan.
         */
        fun bind(recommendation: RecommendationItem) {
            recommendationImageView.setImageResource(recommendation.imageResId)
            recommendationTitleTextView.text = recommendation.title
            recommendationDescriptionTextView.text = recommendation.description
        }
    }
}
