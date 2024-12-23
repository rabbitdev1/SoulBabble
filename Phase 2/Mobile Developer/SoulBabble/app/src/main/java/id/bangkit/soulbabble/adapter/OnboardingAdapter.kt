package id.bangkit.soulbabble.adapter

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.model.OnboardingItem

class OnboardingAdapter(
    private val items: List<OnboardingItem>
) : RecyclerView.Adapter<OnboardingAdapter.OnboardingViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OnboardingViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val view = inflater.inflate(R.layout.item_onboarding, parent, false)
        return OnboardingViewHolder(view)
    }

    override fun onBindViewHolder(holder: OnboardingViewHolder, position: Int) {
        val onboardingItem = items[position]
        holder.bind(onboardingItem)
    }

    override fun getItemCount(): Int = items.size

    /**
     * ViewHolder untuk OnboardingAdapter.
     */
    class OnboardingViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val imageView: ImageView = view.findViewById(R.id.imageView)
        private val titleTextView: TextView = view.findViewById(R.id.textTitle)
        private val descriptionTextView: TextView = view.findViewById(R.id.textDescription)

        /**
         * Mengikat data ke item onboarding.
         */
        fun bind(item: OnboardingItem) {
            imageView.setImageResource(item.image)
            titleTextView.text = item.title
            descriptionTextView.text = item.description
        }
    }
}
