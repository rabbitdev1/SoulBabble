package id.bangkit.soulbabble.viewmodel

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.data.EmotionTotalItem
import id.bangkit.soulbabble.data.EmotionWeekItem
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

class WeekViewModel : ViewModel() {
    private val apiClient = ApiClient()

    private val _emotionWeekList = MutableLiveData<List<EmotionWeekItem>>()
    val emotionWeekList: LiveData<List<EmotionWeekItem>> = _emotionWeekList

    private val _emotionMonthList = MutableLiveData<List<EmotionTotalItem>>()
    val emotionMonthList: LiveData<List<EmotionTotalItem>> = _emotionMonthList


    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error
    fun fetchTrackingMoodData(startDate: String, endDate: String, apiKey: String, token: String,
                              context: Context
    ) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val response = apiClient.sendTrackingMoodDataSuspend(startDate, endDate, apiKey, token)
                if (response != null) {
                    val updatedEmotionList = generateEmotionWeekListFromResponse(response)
                    _emotionWeekList.postValue(updatedEmotionList)

                    val emotionList = parseTrackingMoodData(response)
                    _emotionMonthList.postValue(emotionList)
                } else {
                    _error.postValue("Failed to get data")
                }
            } catch (e: Exception) {
                _error.postValue(e.message)
            } finally {
                _isLoading.postValue(false)
            }
        }
    }
    private fun parseTrackingMoodData(result: String): List<EmotionTotalItem> {
        val jsonResponse = JSONObject(result)
        val emotionMap = mutableMapOf<String, Int>() // Map untuk menyimpan total setiap emosi
        val emotionDetails = mutableMapOf<String, String>() // Map untuk menyimpan detail emosi (nama dan pesan)

        if (jsonResponse.has("data")) {
            val dataArray = jsonResponse.getJSONArray("data")

            for (i in 0 until dataArray.length()) {
                val dataObject = dataArray.getJSONObject(i)

                // Mendapatkan resultedEmotion sebagai string JSON
                val resultedEmotionString = dataObject.getString("resultedEmotion")

                // Parse resultedEmotion menjadi JSONObject
                val resultedEmotion = JSONObject(resultedEmotionString)

                // Ambil emoji dan nama emosi
                val emoji = resultedEmotion.getString("emoji")
                val emotionName = dataObject.getString("emotionName")
                val msgEmotion = resultedEmotion.getString("msgEmotion")

                // Tambahkan atau tingkatkan jumlah total emosi
                val key = "$emoji|$emotionName" // Kunci gabungan emoji dan nama emosi untuk menghindari duplikasi
                emotionMap[key] = (emotionMap[key] ?: 0) + 1
                emotionDetails[key] = emotionName
            }
        } else {
            println("No 'data' key found in JSON response")
        }

        // Konversi hasil dari Map ke List<EmotionTotalItem>
        val emotionList = emotionMap.map { (key, total) ->
            val (emoji, emotionName) = key.split("|") // Pisahkan emoji dan nama emosi
            EmotionTotalItem(
                emotion = emoji,
                name = emotionDetails[key] ?: emotionName,
                total = "Total pada bulan ini: $total"
            )
        }

        return emotionList
    }


    private fun generateEmotionWeekListFromResponse(apiResponse: String): List<EmotionWeekItem> {
        val jsonObject = JSONObject(apiResponse)
        val data = jsonObject.getJSONArray("data")

        val emotionList = mutableListOf(
            EmotionWeekItem("❌", "Minggu", "", ""),
            EmotionWeekItem("❌", "Senin", "", ""),
            EmotionWeekItem("❌", "Selasa", "", ""),
            EmotionWeekItem("❌", "Rabu", "", ""),
            EmotionWeekItem("❌", "Kamis", "", ""),
            EmotionWeekItem("❌", "Jumat", "", ""),
            EmotionWeekItem("❌", "Sabtu", "", "")
        )

        for (i in 0 until data.length()) {
            val item = data.getJSONObject(i)
            val resultedEmotion = item.getString("resultedEmotion") // Raw JSON string
            val createdAt = item.getString("createdAt")

            val resultedEmotion1 = JSONObject(item.getString("resultedEmotion"))
            val emotionName = resultedEmotion1.getString("emoji")

            // Extract the day of the week from the date (createdAt)
            val dayOfWeek = getDayOfWeekFromDate(createdAt)

            // Find the corresponding day in the emotionList and update the emoji
            emotionList.forEachIndexed { index, emotionWeekItem ->
                if (emotionWeekItem.dayOfWeek == dayOfWeek) {
                    emotionList[index] = EmotionWeekItem(emotionName, emotionWeekItem.dayOfWeek, resultedEmotion, createdAt)
                }
            }
        }

        return emotionList
    }

    private fun getDayOfWeekFromDate(dateString: String): String {
        val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val date = format.parse(dateString)
        val calendar = Calendar.getInstance()
        calendar.time = date as Date

        return when (calendar.get(Calendar.DAY_OF_WEEK)) {
            Calendar.SUNDAY -> "Minggu"
            Calendar.MONDAY -> "Senin"
            Calendar.TUESDAY -> "Selasa"
            Calendar.WEDNESDAY -> "Rabu"
            Calendar.THURSDAY -> "Kamis"
            Calendar.FRIDAY -> "Jumat"
            Calendar.SATURDAY -> "Sabtu"
            else -> "Unknown"
        }
    }
}
