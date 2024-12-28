package com.example.easydine.data.network.response

import com.squareup.moshi.Json

data class ImageBannerResponse(
    @Json(name = "id") val id: Int,
    @Json(name = "image") val image: String,
    @Json(name = "title") val title: String
)
