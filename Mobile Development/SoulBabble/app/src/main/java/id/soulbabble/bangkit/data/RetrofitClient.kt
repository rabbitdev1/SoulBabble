package id.soulbabble.bangkit.data

import id.soulbabble.bangkit.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = BuildConfig.BASE_URL
    private const val BASE_URL1 = "https://soulbabble-js-api-v6deafcxhq-et.a.run.app/"

     private val loggingInterceptor = HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY)
     private val client = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()
    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .client(client)
        .build()
    val retrofit1: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL1)
        .addConverterFactory(GsonConverterFactory.create())
        .client(client)
        .build()

    fun <T> createService(serviceClass: Class<T>): T {
        return retrofit.create(serviceClass)
    }
    fun <T> createService1(serviceClass: Class<T>): T {
        return retrofit1.create(serviceClass)
    }
}
