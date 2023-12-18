package id.soulbabble.bangkit.ui.utils

import java.text.SimpleDateFormat
import java.util.Date
import java.util.TimeZone

fun String.formatDate(): String {
    val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    val outputFormat = SimpleDateFormat("dd-MM-yyyy 'Pukul' HH:mm")

    val parsedDate = inputFormat.parse(this)
    return outputFormat.format(parsedDate)
}
