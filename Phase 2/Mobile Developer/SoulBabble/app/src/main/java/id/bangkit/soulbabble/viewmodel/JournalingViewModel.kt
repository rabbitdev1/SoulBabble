import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONObject

class JournalingViewModel : ViewModel() {
    private val apiClient = ApiClient()
    private val _journalingData = MutableLiveData<JSONObject>()
    val journalingData: LiveData<JSONObject> get() = _journalingData

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    fun fetchJournalingData(apiKey: String, token: String) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val responseString = apiClient.getJournalingData(apiKey, token)
                if (responseString != null) {
                    val json = JSONObject(responseString)
                    println(json)
                    withContext(Dispatchers.Main) { _journalingData.value = json }
                } else {
                    withContext(Dispatchers.Main) { _error.value = "Failed to fetch data from server." }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) { _error.value = e.message ?: "Unknown error occurred." }
            }
        }
    }
}
