package com.rizalsujana.soulbabble.data

import android.net.Uri


data class OnBoardingItems(
    val image: Int,
    val title: String,
    val desc: String
)
data class UserProfile(
    val uid: String,
    val displayName: String?,
    val email: String?,
    val photoUrl: Uri?
)