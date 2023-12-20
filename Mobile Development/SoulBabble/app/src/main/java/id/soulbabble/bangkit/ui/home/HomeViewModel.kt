package id.soulbabble.bangkit.ui.home

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import id.soulbabble.bangkit.data.ApiService
import id.soulbabble.bangkit.data.PredictionRequest
import id.soulbabble.bangkit.data.PredictionResponse
import id.soulbabble.bangkit.data.PredictionwithKataRequest
import id.soulbabble.bangkit.data.RetrofitClient
import id.soulbabble.bangkit.ui.journaling.Result
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = RetrofitClient.createService1(ApiService::class.java)

    fun getpredict(id: Int, param: (Result<PredictionResponse>) -> Unit) {
        val application = getApplication<Application>()
        val request = PredictionRequest(data = id)
        apiService.predict(request, number = id).enqueue(object : Callback<PredictionResponse> {
            override fun onResponse(call: Call<PredictionResponse>, response: Response<PredictionResponse>) {
                if (response.isSuccessful) {
                    val predictionResponse = response.body()
                    if (predictionResponse != null) {
                        param(Result.Success(predictionResponse))
                    }
                } else {
                    val errorMessage = "Failed to predict: ${response.message()}"
                    Log.e("API Call", errorMessage)
                    param(Result.Error(Exception(errorMessage)))
                }
            }
            override fun onFailure(call: Call<PredictionResponse>, t: Throwable) {
                val error = "Failed to predict: ${t.message}"
                Log.e("API Call", error, t)
                param(Result.Error(t))
            }
        })
    }
    fun getPredictWithKatakata(katakata: String, param: (Result<PredictionResponse>) -> Unit) {
        val request = PredictionwithKataRequest(data = katakata)

        apiService.predictMSG(request, katakata).enqueue(object : Callback<PredictionResponse> {
            override fun onResponse(call: Call<PredictionResponse>, response: Response<PredictionResponse>) {
                if (response.isSuccessful) {
                    val predictionResponse = response.body()
                    if (predictionResponse != null) {
                        param(Result.Success(predictionResponse))
                    }
                } else {
                    val errorMessage = "Failed to predict: ${response.message()}"
                    Log.e("API Call", errorMessage)
                    param(Result.Error(Exception(errorMessage)))
                }
            }
            override fun onFailure(call: Call<PredictionResponse>, t: Throwable) {
                val error = "Failed to predict: ${t.message}"
                Log.e("API Call", error, t)
                param(Result.Error(t))
            }
        })
    }

}
