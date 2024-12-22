package id.bangkit.soulbabble.utils

import android.app.Activity
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import id.bangkit.soulbabble.R

fun setupToolbar(activity: Activity, toolbar: Toolbar, title: String = "") {
    (activity as? AppCompatActivity)?.apply {
        setSupportActionBar(toolbar)
        supportActionBar?.apply {
            setDisplayHomeAsUpEnabled(true)
            setHomeAsUpIndicator(R.drawable.ic_arrow_back)
            this.title = title
        }
        toolbar.setNavigationOnClickListener {
            activity.finish()
        }
    }
}
