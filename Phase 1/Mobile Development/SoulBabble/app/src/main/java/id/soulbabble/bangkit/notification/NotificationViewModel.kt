package id.soulbabble.bangkit.notification

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.soulbabble.bangkit.R
import id.soulbabble.bangkit.data.dataDummyNotification
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import org.json.JSONArray

class NotificationViewModel : ViewModel() {


    data class NotificationData(
        val title: String,
        val description: String,
        val date: String
    )


    private var notificationJob: Job? = null
    private val data: List<NotificationData>

    init {
        val jsonArray = JSONArray(dataDummyNotification)
        data = parseJsonArray(jsonArray)
    }

    private fun parseJsonArray(jsonArray: JSONArray): List<NotificationData> {
        val dataList = mutableListOf<NotificationData>()
        for (i in 0 until jsonArray.length()) {
            val jsonObject = jsonArray.getJSONObject(i)
            dataList.add(NotificationData(
                title = jsonObject.getString("title"),
                description = jsonObject.getString("description"),
                date = jsonObject.getString("date")
            ))
        }
        return dataList
    }
        fun startShowingNotifications(context: Context) {
        notificationJob = viewModelScope.launch(Dispatchers.IO) {
            while (isActive) {
                val randomNotification = data.random()
                showNotification(context, randomNotification.title, randomNotification.description)
                delay(60000)
            }
        }
    }
    private fun showNotification(context: Context, title: String, content: String) {
        val channelId = "my_channel_id"
        val notificationId = 1
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    channelId,
                    "My Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
                )
                val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.createNotificationChannel(channel)
            }

            val builder = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)

            with(NotificationManagerCompat.from(context)) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
                    ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    return
                }
                notify(notificationId, builder.build())
            }
        } catch (e: Exception) {
            Log.e("NotificationViewModel", "Error showing notification", e)
        }

    }
}
