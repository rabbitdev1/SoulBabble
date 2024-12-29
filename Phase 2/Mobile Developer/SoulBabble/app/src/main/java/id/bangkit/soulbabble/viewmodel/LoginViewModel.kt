package id.bangkit.soulbabble.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.LocalStorage
import org.json.JSONObject

class LoginViewModel : ViewModel() {

    private val apiClient = ApiClient()

    private val _loginStatus = MutableLiveData<String>()
    val loginStatus: LiveData<String> get() = _loginStatus

    private val _userData = MutableLiveData<Map<String, String>>()
    val userData: LiveData<Map<String, String>> get() = _userData

    fun sendLoginRequest(
        uid: String,
        fullName: String,
        email: String,
        photoUrl: String
    ) {
        apiClient.sendLoginRequest(uid, fullName, email, photoUrl) { response ->
            if (response != null) {
                try {
                    val jsonResponse = JSONObject(response)
                    val status = jsonResponse.getInt("status")
                    if (status == 200) {
                        val data = jsonResponse.getJSONObject("data")
                        val uid = data.getString("UID")
                        val apiKey = data.getString("apiKey")
                        val token = data.getString("token")

                        // Simpan data autentikasi
                        _loginStatus.postValue("Login Success")
                        sendUserData(uid, apiKey, token)
                    } else {
                        _loginStatus.postValue("Login Failed: Status $status")
                    }
                } catch (e: Exception) {
                    Log.e("LoginViewModel", "Failed to parse response", e)
                    _loginStatus.postValue("Failed to parse response")
                }
            } else {
                _loginStatus.postValue("Login Failed: No Response")
            }
        }
    }

    private fun sendUserData(uid: String, apiKey: String, token: String) {
        apiClient.sendUserData(uid, apiKey, token) { response ->
            if (response != null) {
                try {
                    val jsonResponse = JSONObject(response)
                    val status = jsonResponse.getInt("status")
                    if (status == 200) {
                        val data = jsonResponse.getJSONObject("data")
                        val fullName = data.getString("fullName")
                        val email = data.getString("email")
                        val photoUrl = data.getString("photoUrl")

                        // Simpan data user
                        _userData.postValue(
                            mapOf(
                                "fullName" to fullName,
                                "email" to email,
                                "photoUrl" to photoUrl
                            )
                        )
                    } else {
                        _loginStatus.postValue("Failed to retrieve user data")
                    }
                } catch (e: Exception) {
                    Log.e("LoginViewModel", "Failed to parse user data", e)
                    _loginStatus.postValue("Failed to parse user data")
                }
            } else {
                _loginStatus.postValue("Failed to send user data")
            }
        }
    }
}
