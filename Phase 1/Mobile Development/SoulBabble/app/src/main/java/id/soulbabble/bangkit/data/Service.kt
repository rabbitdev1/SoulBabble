package id.soulbabble.bangkit.data

import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface ApiService {
    @POST("auth/login")
    fun loginUser(@Body request: LoginRequest): Call<LoginResponse>

    @POST("auth/register")
    fun registerUser(@Body request: RegisterRequest): Call<RegisterResponse>

    @POST("auth/logout")
    fun logoutUser(
        @Header("Authorization") authorization: String
    ): Call<LogOutResponse>

    @GET("journal/get-journal")
    fun getJournal(@Query("fullname") fullname: String): Call<List<JournalEntry>>

    @POST("journal/post-journal")
    fun postJournal(@Body request: PostJournalRequest): Call<JournalResponse>

    @POST("predict/{id}")
    fun predict(@Body request: PredictionRequest,
                @Path("id") number: Int
    ): Call<PredictionResponse>

    @POST("predict")
    fun predictMSG(@Body request: PredictionwithKataRequest, @Query("st") katakata: String): Call<PredictionResponse>
}