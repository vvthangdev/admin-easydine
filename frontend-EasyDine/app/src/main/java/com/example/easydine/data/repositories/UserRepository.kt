package com.example.easydine.data.repositories

import com.example.easydine.data.models.LoginResponse
import com.example.easydine.network.ApiClient
import com.example.easydine.network.ApiService
import retrofit2.Call

class UserRepository {
    private val apiService: ApiService = ApiClient.getClient().create(ApiService::class.java)

    fun loginUser(email: String, password: String): Call<LoginResponse> {
        return apiService.loginUser(email, password)
    }
}
