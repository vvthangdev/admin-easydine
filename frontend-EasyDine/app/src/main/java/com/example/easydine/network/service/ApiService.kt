package com.example.easydine.network.service

import com.example.easydine.data.model.LoginResponse
import retrofit2.Call
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.POST

interface ApiService {
    @FormUrlEncoded
    @POST("api/auth/login")
    fun loginUser(
        @Field("email") email: String,
        @Field("password") password: String
    ): Call<LoginResponse>

    @FormUrlEncoded
    @POST("api/auth/refresh-token/")
    fun refreshAccessToken(
        @Field("refreshToken") refreshToken: String,
    ): Call <LoginResponse>
}
