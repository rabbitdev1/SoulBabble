package id.bangkit.soulbabble.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import id.bangkit.soulbabble.databinding.ItemOnboardingBinding
import id.bangkit.soulbabble.model.OnboardingItem

class OnboardingAdapter(private val onboardingList: List<OnboardingItem>) : RecyclerView.Adapter<OnboardingAdapter.OnboardingViewHolder>() {

    // ViewHolder menggunakan ViewBinding
    class OnboardingViewHolder(private val binding: ItemOnboardingBinding) : RecyclerView.ViewHolder(binding.root) {
        fun bind(currentItem: OnboardingItem) {
            // Mengikat data ke tampilan menggunakan binding
            binding.onboardingTitle.text = currentItem.title
            binding.onboardingDescription.text = currentItem.description
            binding.onboardingImage.setImageResource(currentItem.imageResId)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): OnboardingViewHolder {
        // Menggunakan ViewBinding untuk inflating layout
        val binding = ItemOnboardingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return OnboardingViewHolder(binding)
    }

    override fun onBindViewHolder(holder: OnboardingViewHolder, position: Int) {
        val currentItem = onboardingList[position]
        holder.bind(currentItem)  // Mengikat data ke tampilan
    }

    override fun getItemCount(): Int {
        return onboardingList.size
    }
}
