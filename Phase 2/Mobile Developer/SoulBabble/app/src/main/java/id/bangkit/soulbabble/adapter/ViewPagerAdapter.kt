package id.bangkit.soulbabble.adapter

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import id.bangkit.soulbabble.CheckInFragment

class ViewPagerAdapter(fragment: Fragment) : FragmentStateAdapter(fragment) {

    // Jumlah tab
    override fun getItemCount(): Int = 2

    // Fragment untuk setiap tab
    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> CheckInFragment()
            1 -> CheckInFragment()
            else -> throw IllegalStateException("Invalid position $position")
        }
    }
}
