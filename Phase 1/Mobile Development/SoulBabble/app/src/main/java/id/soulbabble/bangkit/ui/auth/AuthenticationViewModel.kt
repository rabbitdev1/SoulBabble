package id.soulbabble.bangkit.ui.auth

import android.app.Application
import android.util.Log
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import id.soulbabble.bangkit.data.ApiService
import id.soulbabble.bangkit.data.ErrorResponse
import id.soulbabble.bangkit.data.LoginRequest
import id.soulbabble.bangkit.data.LoginResponse
import id.soulbabble.bangkit.data.RegisterRequest
import id.soulbabble.bangkit.data.RegisterResponse
import id.soulbabble.bangkit.data.RetrofitClient
import id.soulbabble.bangkit.data.RetrofitClient.retrofit
import id.soulbabble.bangkit.utils.PreferenceManager
import kotlinx.coroutines.launch
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Converter
import retrofit2.Response
import java.io.IOException

class AuthenticationViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = RetrofitClient.createService(ApiService::class.java)

    private val _loginResponse = MutableLiveData<LoginResponse>()
    private val _registerResponse = MutableLiveData<RegisterResponse>()

    private val _navigateToHome = MutableLiveData<Boolean>()
    val navigateToHome: LiveData<Boolean> = _navigateToHome

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val _authenticationState = MutableLiveData<AuthenticationState>()
    val authenticationState: LiveData<AuthenticationState> = _authenticationState

    private val _toastMessage = MutableLiveData<String?>()
    val toastMessage: LiveData<String?> = _toastMessage

    enum class AuthenticationState {
        AUTHENTICATED, UNAUTHENTICATED, INVALID_AUTHENTICATION
    }

    init {
        checkIfUserIsLoggedIn()
    }

    private fun checkIfUserIsLoggedIn() {
        val currentUser = auth.currentUser
        if (currentUser != null) {
            _authenticationState.value = AuthenticationState.AUTHENTICATED
        } else {
            _authenticationState.value = AuthenticationState.UNAUTHENTICATED
        }
    }


    fun authenticateWithGoogle(account: GoogleSignInAccount) {
        viewModelScope.launch {
            try {
                val credential = GoogleAuthProvider.getCredential(account.idToken, null)
                auth.signInWithCredential(credential).addOnCompleteListener { task ->
                    if (task.isSuccessful) {
                        _authenticationState.value = AuthenticationState.AUTHENTICATED
                        val user = FirebaseAuth.getInstance().currentUser
                        if (user != null) {
                            user.displayName?.let {
                                user.email?.let { it1 ->
                                    loginUser(
                                        user.uid,
                                        it, it1, user.photoUrl.toString()
                                    )
                                }
                            }
                        }
                    } else {
                        task.exception?.let {
                            Log.w("TAG", "Firebase authentication failed: ${it.message}", it)
                        }
                        _authenticationState.value = AuthenticationState.INVALID_AUTHENTICATION
                    }
                }
            } catch (e: Exception) {
                Log.w("TAG", "Authentication failed: ${e.message}", e)
            }
        }
    }

    private fun loginUser(id_google: String, fullname: String, email: String, photoURL: String) {
        val request = LoginRequest(id_google)
        val application = getApplication<Application>()
        apiService.loginUser(request).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful) {
                    _loginResponse.value = response.body()
                    if (response.body()?.token != null) {
                        _navigateToHome.value = true
                        _toastMessage.value = "Login Successful"
                        setLoading(false)
                        PreferenceManager.saveToken(application, response.body()?.token!!)
                    }
                } else {
                    val errorResponse = parseError(response)
                    if (errorResponse?.error == "Google ID not found") {
                        register(id_google, fullname, email, photoURL)
                    } else {
                        val errorMessage =
                            "Login Failed: ${errorResponse?.error ?: "Unknown error"}"
                        _toastMessage.value = errorMessage
                        setLoading(false)
                    }
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                val error = "Login Failed: ${t.message}"
                Log.e("Authentication", error, t)
                setLoading(false)
                _toastMessage.value = error
            }
        })
    }

    private fun register(id_google: String, fullname: String, email: String, photoURL: String) {
        val request = RegisterRequest(id_google, fullname, email, photoURL)
        val application = getApplication<Application>()
        apiService.registerUser(request).enqueue(object : Callback<RegisterResponse> {
            override fun onResponse(
                call: Call<RegisterResponse>,
                response: Response<RegisterResponse>
            ) {
                if (response.isSuccessful) {
                    _registerResponse.value = response.body()
                    if (response.body()?.message != null) {
                        _navigateToHome.value = true
                        _toastMessage.value = response.body()?.message!!
                        PreferenceManager.saveToken(application, response.body()?.message!!)
                        setLoading(false)
                    }
                } else {
                    val errorResponse = parseError(response)
                    val errorMessage = "Login Failed: ${errorResponse?.error ?: "Unknown error"}"
                    _toastMessage.value = errorMessage
                    setLoading(false)
                }
            }

            override fun onFailure(call: Call<RegisterResponse>, t: Throwable) {
                val error = "Login Failed: ${t.message}"
                Log.e("Authentication", error, t)
                _toastMessage.value = error
                setLoading(false)
            }
        })
    }

    private fun parseError(response: Response<*>): ErrorResponse? {
        val converter: Converter<ResponseBody, ErrorResponse> =
            retrofit.responseBodyConverter(ErrorResponse::class.java, arrayOfNulls<Annotation>(0))
        return try {
            response.errorBody()?.let { converter.convert(it) }
        } catch (e: IOException) {
            null
        }
    }

    fun setLoading(loading: Boolean) {
        _isLoading.value = loading
    }

    fun resetToastMessage() {
        _toastMessage.value = null
    }
}
