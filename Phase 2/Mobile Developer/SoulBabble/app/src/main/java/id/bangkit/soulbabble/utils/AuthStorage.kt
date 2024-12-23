package id.bangkit.soulbabble.utils

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKeys

object AuthStorage {

    private const val PREFS_NAME = "auth_prefs"
    private const val KEY_UID = "uid"
    private const val KEY_API_KEY = "api_key"
    private const val KEY_TOKEN = "token"

    // Initialize EncryptedSharedPreferences using the correct MasterKey
    private fun getSharedPreferences(context: Context) = EncryptedSharedPreferences.create(
        PREFS_NAME,
        MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC), // AES256_GCM_SPEC is the correct spec here
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV, // Default AES256_SIV encryption for key
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM // AES256_GCM encryption for value
    )

    // Save authentication data securely
    fun saveAuthData(context: Context, uid: String, apiKey: String, token: String) {
        val sharedPreferences = getSharedPreferences(context)
        with(sharedPreferences.edit()) {
            putString(KEY_UID, uid)
            putString(KEY_API_KEY, apiKey)
            putString(KEY_TOKEN, token)
            apply()
        }
    }

    // Retrieve UID from SharedPreferences
    fun getUid(context: Context): String? {
        val sharedPreferences = getSharedPreferences(context)
        return sharedPreferences.getString(KEY_UID, null)
    }

    // Retrieve API Key from SharedPreferences
    fun getApiKey(context: Context): String? {
        val sharedPreferences = getSharedPreferences(context)
        return sharedPreferences.getString(KEY_API_KEY, null)
    }

    // Retrieve Token from SharedPreferences
    fun getToken(context: Context): String? {
        val sharedPreferences = getSharedPreferences(context)
        return sharedPreferences.getString(KEY_TOKEN, null)
    }

    // Clear saved authentication data
    fun clearAuthData(context: Context) {
        val sharedPreferences = getSharedPreferences(context)
        with(sharedPreferences.edit()) {
            clear()
            apply()
        }
    }
}
