package id.bangkit.soulbabble.api

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
    fun sendTrackingMoodData(startDate: String, endDate: String, apiKey: String, token: String, callback: (String?) -> Unit) {
        val mediaType = "application/x-www-form-urlencoded".toMediaTypeOrNull()
        val body = RequestBody.create(mediaType, "startDate=$startDate&endDate=$endDate")

        val request = Request.Builder()
            .url("${baseUrl}getTrackingMoodData")  // Endpoint API untuk tracking mood
            .method("POST", body)
            .addHeader("Authorization", "Bearer $token")  // Menggunakan token di header
            .addHeader("api-key", apiKey)  // Menambahkan API Key ke header
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
}
