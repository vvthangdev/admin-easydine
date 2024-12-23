package com.example.easydine.data.repositories

import com.example.easydine.data.model.LoginResponse
import com.example.easydine.network.ApiClient
import com.example.easydine.network.service.ApiService
import retrofit2.Call

class UserRepository {
//    private val apiService: ApiService = ApiClient.getClient().create(ApiService::class.java)
private val apiService: ApiService = ApiClient.apiService

    fun loginUser(email: String, password: String): Call<LoginResponse> {
        return apiService.loginUser(email, password)
    }

    fun refreshAccessToken(refreshToken: String): Call<LoginResponse> {
        return apiService.refreshAccessToken(refreshToken)
    }
}
