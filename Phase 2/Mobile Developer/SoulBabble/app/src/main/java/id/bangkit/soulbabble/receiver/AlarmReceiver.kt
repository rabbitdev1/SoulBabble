package id.bangkit.soulbabble.receiver

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import id.bangkit.soulbabble.utils.NotificationHelper

class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        // Tampilkan notifikasi ketika alarm diterima
        NotificationHelper.showNotification(
            context,
            title = "Good Morning!",
            message = "This is your daily reminder at 7:00 AM."
        )
    }
}
