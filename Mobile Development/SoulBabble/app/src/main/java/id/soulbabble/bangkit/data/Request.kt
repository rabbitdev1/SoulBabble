package id.soulbabble.bangkit.data

data class LoginRequest(
    val id_google: String,
)

data class RegisterRequest(
    val id_google: String,
    val fullname: String,
    val email: String,
    val photoUrl: String
)

data class PostJournalRequest(
    val fullname: String,
    val message: String
)