package id.soulbabble.bangkit.data

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

data class EmotionUserTrackData(
    val type: String,
    val positive: List<String>,
    val negative: List<String>,
    val sourceEmotion: List<String>

)

