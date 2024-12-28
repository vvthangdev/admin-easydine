package com.example.easydine.data.network.service

import com.example.easydine.data.network.response.ImageBannerResponse

import retrofit2.Response

import retrofit2.http.GET
import retrofit2.http.Header

interface ImageBannerService {

        @GET("item/item-banner")
        suspend fun getAllItemBanners(
            @Header("Authorization") authorization: String
        ): Response<List<ImageBannerResponse>>

//    @GET("item/item-banner")
//    suspend fun getAllItemBanners(
//        @Header("Authorization") authorization: String
//    ): Response<List<ImageBannerResponse>>
//    @POST("/api/auth/refresh-token")
//    suspend fun refreshAccessToken(
//        @Header("Authorization") authorization: String
//    ): Response<RefreshTokenResponse>
}