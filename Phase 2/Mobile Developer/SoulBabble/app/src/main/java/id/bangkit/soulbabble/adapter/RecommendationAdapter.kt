package id.bangkit.soulbabble.adapter

import android.content.Context
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.squareup.picasso.Picasso
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.data.RecommendationItem
import id.bangkit.soulbabble.ui.Recommendation.DetailRecommendationActivity // Ganti dengan nama aktivitas detail Anda

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
        val item = recommendations[position]
        holder.bind(item)
    }

    override fun getItemCount(): Int = recommendations.size

    /**
     * ViewHolder untuk RecommendationAdapter.
     */
    inner class RecommendationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val recommendationImageView: ImageView = itemView.findViewById(R.id.ivRecommendationImage)
        private val recommendationTitleTextView: TextView = itemView.findViewById(R.id.tvRecommendationTitle)
        private val recommendationDescriptionTextView: TextView = itemView.findViewById(R.id.tvRecommendationDescription)

        /**
         * Mengikat data rekomendasi ke tampilan.
         */
        fun bind(recommendation: RecommendationItem) {
            println(recommendation.image)
            // Menggunakan Picasso untuk memuat gambar
            Picasso.get()
                .load(recommendation.image)
                .placeholder(R.drawable.ic_launcher_background)  // Gambar placeholder
                .error(R.drawable.ic_launcher_background)        // Gambar jika terjadi error
                .into(recommendationImageView)

            recommendationTitleTextView.text = recommendation.title
            recommendationDescriptionTextView.text = recommendation.description

            // Menambahkan listener untuk navigasi ke halaman detail
            itemView.setOnClickListener {
                val intent = Intent(context, DetailRecommendationActivity::class.java)
                intent.putExtra("RECOMMENDATION_ID", recommendation.id) // Kirim data yang diperlukan
                context.startActivity(intent)
            }
        }
    }
}
