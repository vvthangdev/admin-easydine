package com.example.easydine.network

import com.example.easydine.network.service.ApiService
import com.example.easydine.network.service.FoodApiService
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ApiClient {
    private const val BASE_URL = "https://00ca-113-185-51-228.ngrok-free.app/" // URL API gốc

    val retrofit: Retrofit = Retrofit.Builder()
        .baseUrl(BASE_URL)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    // ApiService cho UserRepository
    val apiService: ApiService by lazy {
        retrofit.create(ApiService::class.java)
    }

    // FoodApiService cho FoodRepository
    val foodApiService: FoodApiService by lazy {
        retrofit.create(FoodApiService::class.java)
    }
}
