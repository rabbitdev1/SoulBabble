package id.bangkit.soulbabble.model

import android.content.Context
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import kotlinx.coroutines.launch

class TrackingMoodViewModel : ViewModel() {

    private val apiClient = ApiClient() // Instance ApiClient untuk memanggil API

    /**
     * Fungsi untuk mengirim data tracking mood.
     */
    fun sendTrackingMoodData(
        startDate: String,
        endDate: String,
        apiKey: String,
        token: String,
        onResult: (String?) -> Unit
    ) {
        viewModelScope.launch {
            try {
                val result = apiClient.sendTrackingMoodDataSuspend(startDate, endDate, apiKey, token)
                onResult(result)
            } catch (e: Exception) {
                e.printStackTrace()
                onResult(null) // Mengembalikan null jika terjadi error
            }
        }
    }

    /**
     * Fungsi untuk mendapatkan rekomendasi.
     */
    fun sendRecommendation(
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
}
