package id.soulbabble.bangkit.notification

import android.app.AlarmManager
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationCompat.PRIORITY_DEFAULT
import id.soulbabble.bangkit.R

object NotificationUtil {

    private const val NOTIFICATION_CHANNEL_ID = "MyNotificationChannel"
    private const val NOTIFICATION_ID = 1
    private const val INTERVAL = 10000

    fun createNotificationChannel(context: Context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val channel = NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "My Notification Channel",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            val notificationManager =
                context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    fun scheduleNotification(context: Context) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, NotificationReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(
            context,
            0,
            intent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_MUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
        )

        alarmManager.setRepeating(
            AlarmManager.RTC_WAKEUP,
            System.currentTimeMillis(),
            INTERVAL.toLong(),
            pendingIntent
        )
    }


    class NotificationReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            if (context != null) {
                createNotificationChannel(context)
                showNotification(context)
            }
        }
    }

    fun showNotification(context: Context) {
        val builder = NotificationCompat.Builder(context, NOTIFICATION_CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle("Pesan Penting")
            .setContentText("Ini adalah pesan penting setiap 10 detik")
            .setPriority(PRIORITY_DEFAULT)
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            createNotificationChannel(context)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val channel = notificationManager.getNotificationChannel(NOTIFICATION_CHANNEL_ID)
            if (channel.importance != NotificationManager.IMPORTANCE_NONE) {
                notificationManager.notify(NOTIFICATION_ID, builder.build())
            }
        } else {
            notificationManager.notify(NOTIFICATION_ID, builder.build())
        }
    }

}
