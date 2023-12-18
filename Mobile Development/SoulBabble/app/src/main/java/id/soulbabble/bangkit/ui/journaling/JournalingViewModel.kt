package id.soulbabble.bangkit.ui.journaling

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import id.soulbabble.bangkit.data.ApiService
import id.soulbabble.bangkit.data.ErrorResponse
import id.soulbabble.bangkit.data.JournalEntry
import id.soulbabble.bangkit.data.JournalResponse
import id.soulbabble.bangkit.data.PostJournalRequest
import id.soulbabble.bangkit.data.RetrofitClient
import okhttp3.ResponseBody

import retrofit2.Call
import retrofit2.Callback
import retrofit2.Converter
import retrofit2.Response
import java.io.IOException


sealed class Result<out T> {
    data class Success<out T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
}

class JorunalingViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = RetrofitClient.createService(ApiService::class.java)

    private val _journalResponse = MutableLiveData<JournalResponse>()
    val journalResponse: LiveData<JournalResponse> = _journalResponse

    private val _navigateToCommunity = MutableLiveData<Boolean>()
    val navigateToCommunity: LiveData<Boolean> = _navigateToCommunity

    private val _toastMessage = MutableLiveData<String?>()
    val toastMessage: LiveData<String?> = _toastMessage

    fun getJournal(fullname: String, param: (Result<List<JournalEntry>>) -> Unit) {
        val application = getApplication<Application>()
        Log.d("API Call", "Fetching journal for fullname: $fullname")

        apiService.getJournal(fullname).enqueue(object : Callback<List<JournalEntry>> { // Update the response type
            override fun onResponse(call: Call<List<JournalEntry>>, response: Response<List<JournalEntry>>) { // Update the response type
                if (response.isSuccessful) {
                    val journalEntries = response.body() // Retrieve the list of journal entries
                    if (journalEntries != null) {
                        param(Result.Success(journalEntries))
                    }
                } else {
                    val errorMessage = "Failed to fetch journal: ${response.message()}"
                    Log.e("API Call", errorMessage)
                    param(Result.Error(Exception(errorMessage))) // Pass the error result to the callback
                }
            }

            override fun onFailure(call: Call<List<JournalEntry>>, t: Throwable) { // Update the response type
                val error = "Failed to fetch journal: ${t.message}"
                Log.e("API Call", error, t)
                param(Result.Error(t)) // Pass the error result to the callback
            }
        })
    }

    fun postJournal(fullname: String, message: String) {
        val request = PostJournalRequest(fullname, message)
        apiService.postJournal(request).enqueue(object : Callback<JournalResponse> {
            override fun onResponse(call: Call<JournalResponse>, response: Response<JournalResponse>) {
                if (response.isSuccessful) {
                    _journalResponse.value = response.body()
                }
                _navigateToCommunity.value = true
                _toastMessage.value = "Journal posted successfully"
            }

            override fun onFailure(call: Call<JournalResponse>, t: Throwable) {
                _navigateToCommunity.value = true
                _toastMessage.value = "Journal posted successfully"
            }
        })
    }
    fun resetToastMessage() {
        _toastMessage.value = null
    }
}
