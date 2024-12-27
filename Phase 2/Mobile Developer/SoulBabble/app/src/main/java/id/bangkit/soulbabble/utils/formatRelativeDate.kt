import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

fun formatRelativeDate(inputDate: String): String {
    val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
    inputFormat.timeZone = TimeZone.getTimeZone("UTC")
    val outputFormat = SimpleDateFormat("d MMMM yyyy", Locale.getDefault())

    return try {
        val date = inputFormat.parse(inputDate)
        val now = Calendar.getInstance().time
        val differenceInMillis = now.time - date!!.time

        val minutes = TimeUnit.MILLISECONDS.toMinutes(differenceInMillis)
        val hours = TimeUnit.MILLISECONDS.toHours(differenceInMillis)
        val days = TimeUnit.MILLISECONDS.toDays(differenceInMillis)

        when {
            minutes < 1 -> "Baru saja"
            minutes == 1L -> "1 menit yang lalu"
            minutes < 60 -> "$minutes menit yang lalu"
            hours == 1L -> "1 jam yang lalu"
            hours < 24 -> "$hours jam yang lalu"
            days == 1L -> "Kemarin"
            days < 7 -> "$days hari yang lalu"
            else -> outputFormat.format(date)
        }
    } catch (e: Exception) {
        e.printStackTrace()
        "Invalid Date"
    }
}
