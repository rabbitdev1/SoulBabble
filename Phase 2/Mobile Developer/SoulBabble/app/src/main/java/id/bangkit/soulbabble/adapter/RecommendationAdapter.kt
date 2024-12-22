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
import id.bangkit.soulbabble.adapter.JournalAdapter.JournalViewHolder
import id.bangkit.soulbabble.model.RecommendationItem

class RecommendationAdapter(
    private val context: Context,
    private val recommendations: List<RecommendationItem>
) : RecyclerView.Adapter<RecommendationAdapter.RecommendationViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecommendationViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_recommendation, parent, false)
        return RecommendationViewHolder(view)
    }

    override fun onBindViewHolder(holder: RecommendationViewHolder, position: Int) {
        val recommendation = recommendations[position]
        holder.bind(recommendation)
        holder.cardView.setOnClickListener {
//            val intent = Intent(context, NextActivity::class.java).apply {
//                putExtra("emotion", emotion.emotion)
//                putExtra("title", emotion.title)
//            }
//            context.startActivity(intent)
            Toast.makeText(context, "Clicked: ${recommendation.title}", Toast.LENGTH_SHORT).show()
        }

    }
    override fun getItemCount(): Int = recommendations.size

    inner class RecommendationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val cardView: CardView = itemView.findViewById(R.id.cardRecommendation)
        private val imageView: ImageView = itemView.findViewById(R.id.ivRecommendationImage)
        private val titleView: TextView = itemView.findViewById(R.id.tvRecommendationTitle)
        private val descriptionView: TextView = itemView.findViewById(R.id.tvRecommendationDescription)

        fun bind(recommendation: RecommendationItem) {
            imageView.setImageResource(recommendation.imageResId)
            titleView.text = recommendation.title
            descriptionView.text = recommendation.description
        }
    }
}
