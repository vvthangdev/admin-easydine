package com.example.easydine.data.network.response

import com.squareup.moshi.Json

data class FoodResponse(
    @Json(name = "id") val id: Long = 0,
    @Json(name = "name") val name: String,
    @Json(name = "price") val price: Double? = 0.0,
    @Json(name = "image") val image: String
)
