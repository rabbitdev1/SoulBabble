package id.bangkit.soulbabble.adapter

import androidx.fragment.app.Fragment
import androidx.viewpager2.adapter.FragmentStateAdapter
import id.bangkit.soulbabble.ui.TopTab.MonthFragment
import id.bangkit.soulbabble.ui.TopTab.WeekFragment

class ViewPagerAdapter(fragment: Fragment) : FragmentStateAdapter(fragment) {

    // Daftar fragment untuk setiap tab
    private val fragments: List<Fragment> = listOf(
        WeekFragment(), // Fragment untuk tab 1
        MonthFragment(), // Fragment untuk tab 2
    )

    // Jumlah tab
    override fun getItemCount(): Int = fragments.size

    // Fragment untuk setiap posisi tab
    override fun createFragment(position: Int): Fragment {
        if (position in fragments.indices) {
            return fragments[position]
        } else {
            throw IllegalStateException("Invalid position $position")
        }
    }
}
