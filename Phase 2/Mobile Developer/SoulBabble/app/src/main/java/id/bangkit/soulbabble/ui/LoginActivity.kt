package id.bangkit.soulbabble.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContentProviderCompat.requireContext
import id.bangkit.soulbabble.R
import id.bangkit.soulbabble.api.ApiClient
import id.bangkit.soulbabble.utils.AuthStorage
import id.bangkit.soulbabble.utils.LocalStorage
import id.bangkit.soulbabble.utils.TextSpanUtil
import org.json.JSONObject

class LoginActivity : AppCompatActivity() {

    // Mendeklarasikan variabel String statis di companion object
    companion object {
        const val UID = "12345678"
        const val FULL_NAME = "John Doe"
        const val EMAIL = "johndoe@example.com"
        const val PHOTO_URL = "http://example.com/photo.jpg"
    }

    private lateinit var termsText: TextView
    private lateinit var buttonGoogle: Button
    private lateinit var progressBar: LinearLayout

    private val apiClient = ApiClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Inisialisasi tampilan
        initializeViews()
        setupTermsAndPrivacyText()
        setupGoogleButton()
    }

    private fun initializeViews() {
        termsText = findViewById(R.id.termsAndPrivacyText)
        buttonGoogle = findViewById(R.id.buttonGoogle)
        progressBar = findViewById(R.id.progressBar)
    }

    private fun setupTermsAndPrivacyText() {
        val spannable = TextSpanUtil.createTermsAndPrivacySpan(this) { clickablePart ->
            when (clickablePart) {
                TextSpanUtil.ClickablePart.TERMS -> {
                    Toast.makeText(this, "Klik pada Syarat Ketentuan", Toast.LENGTH_SHORT).show()
                }

                TextSpanUtil.ClickablePart.PRIVACY -> {
                    Toast.makeText(this, "Klik pada Kebijakan Privasi", Toast.LENGTH_SHORT).show()
                }
            }
        }
        termsText.text = spannable
        termsText.movementMethod = android.text.method.LinkMovementMethod.getInstance()
    }

    private fun setupGoogleButton() {
        buttonGoogle.setOnClickListener {
            progressBar.visibility = LinearLayout.VISIBLE
            // Menggunakan variabel statis yang dideklarasikan di companion object
            val uid = UID
            val fullName = FULL_NAME
            val email = EMAIL
            val photoUrl = PHOTO_URL

            // Kirim permintaan login ke API
            sendLoginRequest(uid, fullName, email, photoUrl)
        }
    }

    private fun sendLoginRequest(uid: String, fullName: String, email: String, photoUrl: String) {
        // Kirim permintaan ke API mock dengan data yang telah dideklarasikan statis
        apiClient.sendLoginRequest(uid, fullName, email, photoUrl) { response ->
            runOnUiThread {
                progressBar.visibility = LinearLayout.GONE
                if (response != null) {
                    try {
                        val jsonResponse = JSONObject(response)
                        val status = jsonResponse.getInt("status")
                        if (status == 200) {
                            // Extract UID, apiKey, token from the response data
                            val data = jsonResponse.getJSONObject("data")
                            val uid = data.getString("UID")
                            val apiKey = data.getString("apiKey")
                            val token = data.getString("token")

                            // Simpan data autentikasi ke SharedPreferences
                            AuthStorage.saveAuthData(this, uid, apiKey, token)

                            sendUserData(uid, apiKey, token)
                        } else {
                            // Jika status bukan 200, tampilkan error
                            Toast.makeText(
                                this,
                                "Login failed. Status: $status",
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                        Toast.makeText(this, "Failed to parse response", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this, "Login failed", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
    private fun sendUserData(uid: String, apiKey: String, token: String) {
        apiClient.sendUserData(uid, apiKey, token, ){ response ->
            runOnUiThread {
                if (response != null) {
                    // Tampilkan respon dari API
                    Toast.makeText(this, "Login Berhasil", Toast.LENGTH_LONG).show()

                    try {
                        // Parsing JSON response
                        val jsonResponse = JSONObject(response)
                        val status = jsonResponse.getInt("status")

                        if (status == 200) {
                            // Mengambil data user dari response JSON
                            val data = jsonResponse.getJSONObject("data")
                            val fullName = data.getString("fullName")
                            val email = data.getString("email")
                            val photoUrl = data.getString("photoUrl")

                            // Menyimpan data ke AuthStorage
                            LocalStorage.saveAuthData(this, fullName, email, photoUrl)

                            // Navigasi ke HomeActivity setelah berhasil
                            navigateToHome()
                        } else {
                            Toast.makeText(this, "Failed to retrieve user data", Toast.LENGTH_SHORT).show()
                        }
                    } catch (e: Exception) {
                        e.printStackTrace()
                        Toast.makeText(this, "Failed to parse user data", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this, "Failed to send user data", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
        finish()
    }
}
