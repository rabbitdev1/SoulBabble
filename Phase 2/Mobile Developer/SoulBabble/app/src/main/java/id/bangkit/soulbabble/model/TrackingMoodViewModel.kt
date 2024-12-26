package id.bangkit.soulbabble.model

import android.content.Context
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.data.RecommendationItem
import kotlinx.coroutines.launch
import org.json.JSONException
import org.json.JSONObject

class TrackingMoodViewModel : ViewModel() {

    private val apiClient = ApiClient() // Instance ApiClient untuk memanggil API
    private val _recommendations = MutableLiveData<List<RecommendationItem>>()
    val recommendations: LiveData<List<RecommendationItem>> get() = _recommendations

    private val _emotionData = MutableLiveData<Map<String, String>?>()
    val emotionData: MutableLiveData<Map<String, String>?> get() = _emotionData

    private fun sendRecommendation(
        apiKey: String,
        token: String,
        onResult: (String?) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val result = apiClient.fetchRecommendationData(apiKey, token)
                onResult(result)
            } catch (e: Exception) {
                e.printStackTrace()
                onResult(null) // Mengembalikan null jika terjadi error
            }
        }
    }

    fun loadRecommendations(apiKey: String, token: String) {
        // Jika data sudah ada, tidak perlu memuat ulang
        if (_recommendations.value != null) return

        // Simulasi panggilan API atau metode Anda untuk mengambil data
        sendRecommendation(apiKey, token) { result ->
            if (result != null) {
                try {
                    val parsedRecommendations = parseRecommendationResult(result)
                    _recommendations.postValue(parsedRecommendations)
                } catch (e: JSONException) {
                    e.printStackTrace()
                }
            }
        }
    }

    private fun parseRecommendationResult(result: String): List<RecommendationItem> {
        val recommendations = mutableListOf<RecommendationItem>()
        val jsonResponse = JSONObject(result)

        if (jsonResponse.has("data")) {
            val dataObject = jsonResponse.getJSONObject("data")
            val recommendedActionString = dataObject.optString("recommendedAction", "")
            if (recommendedActionString.isNotEmpty()) {
                try {
                    val recommendedAction = JSONObject(recommendedActionString)
                    val id = dataObject.optString("id", "No ID")
                    val title = recommendedAction.optString("title", "No Title")
                    val desc = recommendedAction.optString("desc", "No Description")
                    val imageUrl = recommendedAction.optString("image", "")

                    recommendations.add(
                        RecommendationItem(
                            id = id,
                            image = imageUrl,
                            title = title,
                            description = desc
                        )
                    )
                } catch (e: Exception) {
                    println("Error parsing recommendedAction: ${e.message}")
                }
            }
        }
        return recommendations
    }
    fun loadEmotionData(apiKey: String, token: String, startDate: String, endDate: String) {
        // Cegah pemuatan ulang data
        if (_emotionData.value != null) return

        viewModelScope.launch {
            try {
                val result = apiClient.sendTrackingMoodDataSuspend(startDate, endDate, apiKey, token)
                val parsedEmotionData = result?.let { parseEmotionResult(it) }
                _emotionData.postValue(parsedEmotionData)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    private fun parseEmotionResult(result: String): Map<String, String> {
        val emotionData = mutableMapOf<String, String>()
        val jsonResponse = JSONObject(result)
        val dataArray = jsonResponse.getJSONArray("data")
        if (dataArray.length() > 0) {
            val dataObject = dataArray.getJSONObject(0)
            val resultedEmotionString = dataObject.getString("resultedEmotion")
            val resultedEmotion = JSONObject(resultedEmotionString)

            emotionData["msgEmotion"] = resultedEmotion.getString("msgEmotion")
            emotionData["emoji"] = resultedEmotion.getString("emoji")
            emotionData["emotionName"] = dataObject.getString("emotionName")
        }
        return emotionData
    }
}
