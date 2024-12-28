package com.example.easydine.data.network.service

import com.example.easydine.data.network.response.LoginResponse
import com.example.easydine.data.network.response.RefreshTokenResponse
import com.example.easydine.data.network.response.SignUpResponse
import retrofit2.Response
import retrofit2.http.Body
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

    @FormUrlEncoded
    @POST("/api/auth/signup")
    suspend fun registerUser(
        @Field("email") email: String,
        @Field("name") name: String,
        @Field("username") username: String,
        @Field("phone") phone: String,
        @Field("password") password: String,
    ): Response<SignUpResponse>
}
