package id.bangkit.soulbabble.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.model.EmotionWeekItem
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class CheckInViewModel : ViewModel() {
    private val apiClient = ApiClient()

    private val _emotionWeekList = MutableLiveData<List<EmotionWeekItem>>()
    val emotionWeekList: LiveData<List<EmotionWeekItem>> = _emotionWeekList

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _error = MutableLiveData<String?>()
    val error: LiveData<String?> = _error

    fun fetchTrackingMoodData(startDate: String, endDate: String, apiKey: String, token: String) {
        _isLoading.value = true
        viewModelScope.launch {
            try {
                val response = apiClient.sendTrackingMoodDataSuspend(startDate, endDate, apiKey, token)
                if (response != null) {
                    val updatedEmotionList = generateEmotionWeekListFromResponse(response)
                    _emotionWeekList.postValue(updatedEmotionList)
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
        calendar.time = date

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
