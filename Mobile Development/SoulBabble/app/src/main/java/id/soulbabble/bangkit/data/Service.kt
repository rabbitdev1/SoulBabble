package id.soulbabble.bangkit.data

import retrofit2.Call
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
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


//    @GET("stories")
//    suspend fun allStories(
//        @Query("page") page: Int?,
//        @Query("size") size: Int?,
//        @Header("Authorization") authorization: String?
//    ): Response<StoryResponse>
//
//    @GET("stories")
//    fun allStoriesLocation(
//        @Query("page") page: Int?,
//        @Query("size") size: Int?,
//        @Query("location") location: Int?,
//        @Header("Authorization") authorization: String?
//    ): Call<StoryResponse>
//
//
//    @GET("stories/{id}")
//    fun detailStories(
//        @Path("id") id: String,
//        @Header("Authorization") authorization: String?
//    ): Call<StoryDetailResponse>
//
//    @Multipart
//    @POST("stories")
//    fun uploadStories(
//        @Header("Authorization") token: String?,
//        @Part("description") description: RequestBody,
//        @Part photo: MultipartBody.Part?,
//        @Part("lat") lat: RequestBody,
//        @Part("lon") lon: RequestBody
//    ): Call<UploadStoriesResult>
//
//
//    @Multipart
//    @POST("stories/guest")
//    fun uploadStoriesGuest(
//        @Part("description") description: RequestBody,
//        @Part photo: MultipartBody.Part?,
//        @Part("lat") lat: RequestBody,
//        @Part("lon") lon: RequestBody
//    ): Call<UploadStoriesResult>

}
