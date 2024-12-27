package id.bangkit.soulbabble.viewmodel

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
                onResult(result) // Berhasil
            } catch (e: Exception) {
                e.printStackTrace()
                onResult(null) // Gagal
            }
        }
    }


    fun loadRecommendations(apiKey: String, token: String) {
        if (_recommendations.value != null) return // Jika data sudah ada, tidak perlu memuat ulang

        sendRecommendation(apiKey, token) { result ->
            if (result != null) {
                try {
                    val jsonData = JSONObject(result)
                    val parsedRecommendations = parseRecommendationResult(jsonData)
                    _recommendations.postValue(parsedRecommendations) // Memperbarui LiveData
                } catch (e: JSONException) {
                    e.printStackTrace()
                    println("Error parsing recommendations: ${e.message}")
                }
            } else {
                println("No result from API or an error occurred.")
            }
        }
    }

    private fun parseRecommendationResult(data: JSONObject): List<RecommendationItem> {
        val recommendations = mutableListOf<RecommendationItem>()

        // Ambil array data dari JSON
        val recommendationArray = data.getJSONArray("data")

        for (i in 0 until recommendationArray.length()) {
            val recommendationData = recommendationArray.getJSONObject(i)
            val recommendationId = recommendationData.optInt("id").toString()
            val url = recommendationData.optString("url", "No URL")
            val type = recommendationData.optString("type", "Unknown Type")
            val createdAt = recommendationData.optString("createdAt", "")

            // Parsing recommendedAction yang berupa JSON string
            val recommendedActionString = recommendationData.optString("recommendedAction", "")
            val (title, desc, image) = try {
                if (recommendedActionString.isNotEmpty()) {
                    val recommendedAction = JSONObject(recommendedActionString)
                    Triple(
                        recommendedAction.optString("title", "No Title"),
                        recommendedAction.optString("desc", "No Description"),
                        recommendedAction.optString("image", "")
                    )
                } else {
                    Triple("No Title", "No Description", "")
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Triple("Error Title", "Error Description", "")
            }

            // Tambahkan data ke daftar RecommendationItem
            recommendations.add(
                RecommendationItem(
                    recommendationId,
                    title,
                    desc,
                    image,
                )
            )
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
