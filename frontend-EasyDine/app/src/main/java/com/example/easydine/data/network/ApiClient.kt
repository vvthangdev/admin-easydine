package com.example.easydine.data.network

import com.example.easydine.data.network.service.UserApiService
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

object ApiClient {
    private const val BASE_URL = "https://3cec-104-28-222-75.ngrok-free.app/"

    // Moshi instance
    private val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()

    // HttpLoggingInterceptor for logging requests and responses
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    // OkHttpClient with interceptor
    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(loggingInterceptor)
        .build()

    // Retrofit instance
    private val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .client(httpClient) // Add OkHttpClient with interceptor
        .addConverterFactory(MoshiConverterFactory.create(moshi))
        .build()

    // UserApiService instance
    val userApiService: UserApiService by lazy {
        retrofit.create(UserApiService::class.java)
    }
}
