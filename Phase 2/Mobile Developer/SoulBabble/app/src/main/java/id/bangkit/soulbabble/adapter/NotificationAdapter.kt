package id.bangkit.soulbabble.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import formatRelativeDate
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.data.NotificationItem

class NotificationAdapter(
    private val context: Context,
    private var notificationList: List<NotificationItem>
) : RecyclerView.Adapter<NotificationAdapter.NotificationViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.item_notification, parent, false)
        return NotificationViewHolder(view)
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        val notificationItem = notificationList[position]
        holder.bind(notificationItem)
    }

    override fun getItemCount(): Int = notificationList.size

    inner class NotificationViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val titleTextView: TextView = itemView.findViewById(R.id.tvNotificationTitle)
        private val contentTextView: TextView = itemView.findViewById(R.id.tvNotificationContent)
        private val timeTextView: TextView = itemView.findViewById(R.id.tvNotificationTime)

        /**
         * Mengikat data jurnal ke item layout.
         */
        fun bind(notificationItem: NotificationItem) {
            titleTextView.text = notificationItem.title
            contentTextView.text = notificationItem.content
            timeTextView.text = formatRelativeDate(notificationItem.time)
        }
    }

    @SuppressLint("NotifyDataSetChanged")
    fun updateData(newNotificationList: List<NotificationItem>) {
        notificationList = newNotificationList
        notifyDataSetChanged()
    }
}
