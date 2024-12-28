package com.example.easydine.network.service

import com.example.easydine.network.response.LoginResponse
import com.example.easydine.network.response.RefreshTokenResponse
import retrofit2.Response
import retrofit2.http.Field
import retrofit2.http.FormUrlEncoded
import retrofit2.http.Header
import retrofit2.http.POST

interface UserApiService {

    //    @FormUrlEncoded
//    @POST("api/auth/login")
//    suspend fun loginUser(
//        @Field("email") email: String,
//        @Field("password") password: String
//    ): LoginResponse
    @FormUrlEncoded
    @POST("/api/auth/login")
    suspend fun loginUser(
        @Field("email") email: String,
        @Field("password") password: String
    ): Response<LoginResponse>

    @POST("/api/auth/refresh-token")
    suspend fun refreshAccessToken(
        @Header("Authorization") authorization: String
    ): Response<RefreshTokenResponse>
}
