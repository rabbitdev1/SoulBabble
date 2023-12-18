package id.soulbabble.bangkit.data

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    val token: String,
)
data class ErrorResponse(
    val error: String
)
data class RegisterResponse(
    val message: String
)
data class LogOutResponse(
    val message: String
)

data class JournalResponse(
    val message: String
)


data class JournalEntry(
    @SerializedName("post_id") val postId: Int,
    @SerializedName("sbuser_id") val sbuserId: Int,
    @SerializedName("fullname") val fullname: String,
    @SerializedName("message") val message: String,
    @SerializedName("timestamp") val timestamp: String
)
