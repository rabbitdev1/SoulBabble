package id.soulbabble.bangkit.utils

import android.content.Context
import android.net.Uri
import androidx.core.content.edit
import androidx.preference.PreferenceManager
import id.soulbabble.bangkit.data.UserProfile

object PreferenceManager {
    private const val KEY_FIRST_RUN = "first_run"
    private const val KEY_USER_UID = "user_uid"
    private const val KEY_USER_DISPLAY_NAME = "user_display_name"
    private const val KEY_USER_EMAIL = "user_email"
    private const val KEY_USER_PHOTO_URL = "user_photo_url"

    fun isFirstRun(context: Context): Boolean {
        val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
        return sharedPreferences.getBoolean(KEY_FIRST_RUN, true)
    }

    fun setFirstRun(context: Context, isFirstRun: Boolean) {
        val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
        sharedPreferences.edit {
            putBoolean(KEY_FIRST_RUN, isFirstRun)
        }
    }

    fun saveUserProfile(context: Context, uid: String, displayName: String?, email: String?, photoUrl: Uri?) {
        val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
        sharedPreferences.edit {
            putString(KEY_USER_UID, uid)
            putString(KEY_USER_DISPLAY_NAME, displayName)
            putString(KEY_USER_EMAIL, email)
            putString(KEY_USER_PHOTO_URL, photoUrl?.toString())
            apply()
        }
    }

    fun getUserProfile(context: Context): UserProfile {
        val sharedPreferences = PreferenceManager.getDefaultSharedPreferences(context)
        return UserProfile(
            uid = sharedPreferences.getString(KEY_USER_UID, "") ?: "",
            displayName = sharedPreferences.getString(KEY_USER_DISPLAY_NAME, ""),
            email = sharedPreferences.getString(KEY_USER_EMAIL, ""),
            photoUrl = sharedPreferences.getString(KEY_USER_PHOTO_URL, "")?.let { Uri.parse(it) }
        )
    }

}
