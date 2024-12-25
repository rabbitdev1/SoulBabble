package id.bangkit.soulbabble.utils

import android.content.Context

object LocalStorage {

    private const val PREF_NAME = "auth_preferences"
    const val FULL_NAME = "full_name"
    const val EMAIL = "email"
    const val PHOTO_URL = "photo_url"

    fun saveAuthData(context: Context, fullName: String, email: String, photoUrl: String) {
        val sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putString(FULL_NAME, fullName)
        editor.putString(EMAIL, email)
        editor.putString(PHOTO_URL, photoUrl)
        editor.apply()
    }

    fun getAuthData(context: Context): Map<String, String?> {
        val sharedPreferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
        return mapOf(
            FULL_NAME to sharedPreferences.getString(FULL_NAME, null),
            EMAIL to sharedPreferences.getString(EMAIL, null),
            PHOTO_URL to sharedPreferences.getString(PHOTO_URL, null)
        )
    }
}
