package id.soulbabble.bangkit.ui.profile

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.liveData
import com.google.firebase.auth.FirebaseAuth
import id.soulbabble.bangkit.data.ApiService
import id.soulbabble.bangkit.data.ErrorResponse
import id.soulbabble.bangkit.data.LogOutResponse
import id.soulbabble.bangkit.data.RetrofitClient
import id.soulbabble.bangkit.ui.auth.AuthenticationViewModel
import id.soulbabble.bangkit.utils.PreferenceManager
import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Converter
import retrofit2.Response
import java.io.IOException

class ProfileViewModel(application: Application) : AndroidViewModel(application) {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val _authenticationState =
        MutableLiveData<AuthenticationViewModel.AuthenticationState>()
    private val apiService = RetrofitClient.createService(ApiService::class.java)

    private val token = PreferenceManager.getToken(application)

    private val _navigateToAuth = MutableLiveData<Boolean>()
    val navigateToAuth: LiveData<Boolean> = _navigateToAuth

    private val _toastMessage = MutableLiveData<String?>()
    val toastMessage: LiveData<String?> = _toastMessage

    fun getPersonalData() = liveData {
        emit(jsonDataPersonal())
    }

    fun getGeneralData() = liveData {
        emit(jsonDataGeneral())
    }

    fun logOut() {
        if (token != null) {
            logoutUser(token)
        }
        println(token)
    }

    private fun logoutUser(authorization: String) {
        val application = getApplication<Application>()
        apiService.logoutUser(authorization).enqueue(object : Callback<LogOutResponse> {
            override fun onResponse(
                call: Call<LogOutResponse>,
                response: Response<LogOutResponse>
            ) {
                auth.signOut()
                _authenticationState.value =
                    AuthenticationViewModel.AuthenticationState.UNAUTHENTICATED
                _navigateToAuth.value = true
                if (response.isSuccessful) {
                    PreferenceManager.clearToken(application)
                    _toastMessage.value = response.body()?.message!!
                } else {
//                    val errorResponse = parseError(response)
//                    val errorMessage = "Logout Failed: ${errorResponse?.error ?: "Unknown error"}"
//                    _toastMessage.value = errorMessage
                }
            }

            override fun onFailure(call: Call<LogOutResponse>, t: Throwable) {
                val error = "Logout Failed: ${t.message}"
                Log.e("Authentication", error, t)
                _toastMessage.value = error
            }
        })
    }

    private fun parseError(response: Response<*>): ErrorResponse? {
        val converter: Converter<ResponseBody, ErrorResponse> =
            RetrofitClient.retrofit.responseBodyConverter(
                ErrorResponse::class.java,
                arrayOfNulls<Annotation>(0)
            )
        return try {
            response.errorBody()?.let { converter.convert(it) }
        } catch (e: IOException) {
            null
        }
    }

    fun resetToastMessage() {
        _toastMessage.value = null
    }

    private fun jsonDataPersonal(): JSONArray {
        val jsonArray = JSONArray()

        val detailPengguna = JSONObject().apply {
            put("label", "Detail Pengguna")
            put("path", "detail-profile")
        }
        jsonArray.put(detailPengguna)

        val postingan = JSONObject().apply {
            put("label", "Postingan")
            put("path", "journaling")
        }
        jsonArray.put(postingan)

        val notifikasi = JSONObject().apply {
            put("label", "Notifikasi")
            put("path", "notification")
        }
        jsonArray.put(notifikasi)

        return jsonArray
    }

    private fun jsonDataGeneral(): JSONArray {
        val jsonArray = JSONArray()

        val pusatBantuan = JSONObject().apply {
            put("label", "Pusat Bantuan")
            put("url", "https://soubabble.com/help")
        }
        jsonArray.put(pusatBantuan)

        val syaratKetentuan = JSONObject().apply {
            put("label", "Syarat & Ketentuan")
            put("url", "https://soubabble.com/syarat-ketentuan")
        }
        jsonArray.put(syaratKetentuan)

        val kebijakanPrivasi = JSONObject().apply {
            put("label", "Kebijakan Privasi")
            put("url", "https://soubabble.com/kebijakan-privasi")
        }
        jsonArray.put(kebijakanPrivasi)

        return jsonArray
    }

}
