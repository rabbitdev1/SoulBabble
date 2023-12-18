package id.soulbabble.bangkit.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class NotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (context != null) {
            NotificationUtil.createNotificationChannel(context)
            NotificationUtil.showNotification(context)
        }
    }
}
