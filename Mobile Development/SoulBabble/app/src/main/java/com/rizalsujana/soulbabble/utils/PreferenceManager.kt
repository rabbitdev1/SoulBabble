package com.rizalsujana.soulbabble.utils

import android.content.Context
import androidx.core.content.edit
import androidx.preference.PreferenceManager

object PreferenceManager {
    private const val KEY_FIRST_RUN = "first_run"

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
}
