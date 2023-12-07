package id.soulbabble.bangkit.ui.profile

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.liveData
import com.google.firebase.auth.FirebaseAuth
import id.soulbabble.bangkit.ui.auth.AuthenticationViewModel
import org.json.JSONArray
import org.json.JSONObject

class ProfileViewModel : ViewModel() {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val _authenticationState = MutableLiveData<AuthenticationViewModel.AuthenticationState>()

    fun getPersonalData() = liveData {
        emit(jsonDataPersonal())
    }

    fun getGeneralData() = liveData {
        emit(jsonDataGeneral())
    }


    fun logOut() {
        auth.signOut()
        _authenticationState.value = AuthenticationViewModel.AuthenticationState.UNAUTHENTICATED
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
            put("path", "post")
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
            put("url", "https://github.com/react-native-webview/react-native-webview/issues/1619")
        }
        jsonArray.put(pusatBantuan)

        val syaratKetentuan = JSONObject().apply {
            put("label", "Syarat & Ketentuan")
            put("url", "https://example.com/syarat-ketentuan")
        }
        jsonArray.put(syaratKetentuan)

        val kebijakanPrivasi = JSONObject().apply {
            put("label", "Kebijakan Privasi")
            put("url", "https://example.com/kebijakan-privasi")
        }
        jsonArray.put(kebijakanPrivasi)

        return jsonArray
    }

}
