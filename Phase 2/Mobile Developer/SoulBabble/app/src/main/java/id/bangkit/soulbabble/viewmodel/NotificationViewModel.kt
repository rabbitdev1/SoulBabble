import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.utils.DateUtils.getOneWeekRange
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

class NotificationViewModel : ViewModel() {
    private val apiClient = ApiClient()
    private val _notificationData = MutableLiveData<JSONArray>()
    val notificationData: LiveData<JSONArray> get() = _notificationData

    private val _error = MutableLiveData<String>()
    val error: LiveData<String> get() = _error

    fun fetchNotificationData(apiKey: String, token: String) {
        val (startDate, endDate) = getOneWeekRange()
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val responseString = apiClient.getNotificationData(startDate, endDate, apiKey, token)
                if (responseString != null) {
                    val jsonObject = JSONObject(responseString) // Ubah respons menjadi JSONObject
                    val jsonArray = jsonObject.getJSONArray("data") // Ambil JSONArray dari kunci "data"
                    withContext(Dispatchers.Main) { _notificationData.value = jsonArray }
                } else {
                    withContext(Dispatchers.Main) { _error.value = "Failed to fetch data from server." }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    _error.value = e.message ?: "Unknown error occurred."
                    e.printStackTrace() // Untuk debugging
                }
            }
        }
    }
}
