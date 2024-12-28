package com.example.easydine.data.network.service

import com.example.easydine.data.model.Food
import retrofit2.http.GET
import com.example.easydine.data.network.response.FoodResponse
import retrofit2.Response
import retrofit2.http.*

interface FoodApiService {
    @GET("item")
    suspend fun getFoods(): Response<List<FoodResponse>>

    @GET("item/{id}")
    suspend fun getFoodById(@Path("id") id: Long): Response<FoodResponse>

    @POST("item")
    suspend fun createFood(@Body food: Food): Response<FoodResponse>

    @PUT("item/{id}")
    suspend fun updateFood(
        @Path("id") id: Long,
        @Body food: Food
    ): Response<FoodResponse>

    @DELETE("item/{id}")
    suspend fun deleteFood(@Path("id") id: Long): Response<Unit>
}


//interface FoodApiService {
//    @GET("item")
//    suspend fun getFoods(): Response<List<FoodResponse>>
//
//    @GET("item/{id}")
//    suspend fun getFoodById(@Path("id") id: Long): Response<FoodResponse>
//
//    @POST("item")
//    suspend fun createFood(@Body food: FoodResponse): Response<FoodResponse>
//
//    @PUT("item/{id}")
//    suspend fun updateFood(@Path("id") id: Long,
//                           @Body food: FoodResponse): Response<FoodResponse>
//
//    @DELETE("item/{id}")
//    suspend fun deleteFood(@Path("id") id: Long): Response<Unit>
//}