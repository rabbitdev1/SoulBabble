package id.bangkit.soulbabble.utils

import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Calendar
import java.util.Locale

/**
 * Utilitas untuk pengelolaan tanggal.
 */
object DateUtils {
    /**
     * Mendapatkan rentang tanggal satu minggu dari hari ini.
     * @return Pair yang berisi startDate dan endDate dalam format "yyyy-MM-dd".
     */
    fun getOneWeekRange(): Pair<String, String> {
        val calendar = Calendar.getInstance()
        val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

        // Set tanggal untuk startDate (hari ini)
        val startDate = dateFormat.format(calendar.time)

        // Set tanggal untuk endDate (7 hari dari hari ini)
        calendar.add(Calendar.DAY_OF_YEAR, 6) // Tambahkan 6 hari (1 minggu total)
        val endDate = dateFormat.format(calendar.time)

        return Pair(startDate, endDate)
    }

    fun getTodayDate(): String {
        val currentDate = LocalDate.now()  // Mendapatkan tanggal hari ini
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")  // Format yang diinginkan
        return currentDate.format(formatter)  // Mengembalikan tanggal dalam format string
    }
}
