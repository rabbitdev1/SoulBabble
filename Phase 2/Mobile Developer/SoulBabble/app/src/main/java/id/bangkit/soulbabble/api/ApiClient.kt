package id.bangkit.soulbabble.api

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import java.io.IOException

class ApiClient {

    private val client = OkHttpClient()
    private val baseUrl = "https://abdf46bd-86ab-4f32-8785-86be0b804574.mock.pstmn.io/"  // Ganti dengan URL server Anda

    // Fungsi untuk mengirimkan data login (POST request)
    fun sendLoginRequest(uid: String, fullName: String, email: String, photoUrl: String, callback: (String?) -> Unit) {
        val mediaType = "application/x-www-form-urlencoded".toMediaTypeOrNull()
        val body = RequestBody.create(mediaType, "UID=$uid&fullName=$fullName&email=$email&photoUrl=$photoUrl")

        val request = Request.Builder()
            .url("${baseUrl}handleLogin")  // Endpoint API untuk login
            .method("POST", body)
            .addHeader("x-api-key", "")  // Jika ada API key
            .addHeader("Content-Type", "application/x-www-form-urlencoded")
            .build()

        // Mengirimkan permintaan di thread background
        Thread {
            try {
                val response: Response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    callback(response.body?.string())  // Mengembalikan data respons
                } else {
                    callback("Error: ${response.code}")  // Menangani status error
                }
            } catch (e: IOException) {
                e.printStackTrace()
                callback("Network error occurred")
            }
        }.start()  // Eksekusi permintaan di thread terpisah
    }


    // Fungsi untuk mengirimkan data tracking mood (POST request)
    suspend fun sendTrackingMoodDataSuspend(
        startDate: String,
        endDate: String,
        apiKey: String,
        token: String
    ): String? {
        val mediaType = "application/x-www-form-urlencoded".toMediaTypeOrNull()
        val body = RequestBody.create(mediaType, "startDate=$startDate&endDate=$endDate")

        val request = Request.Builder()
            .url("${baseUrl}getTrackingMoodData")  // Endpoint API untuk tracking mood
            .method("POST", body)
            .addHeader("Authorization", "Bearer $token")  // Menambahkan token di header
            .addHeader("api-key", apiKey)  // Menambahkan API Key ke header
            .addHeader("Content-Type", "application/x-www-form-urlencoded")
            .build()

        return withContext(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()

                if (response.isSuccessful) {
                    response.body?.string()  // Mengembalikan data respons
                } else {
                    throw IOException("Error: ${response.code} - ${response.message}")
                }
            } catch (e: IOException) {
                e.printStackTrace()
                throw e  // Melempar ulang exception untuk ditangani di ViewModel
            }
        }
    }

}
