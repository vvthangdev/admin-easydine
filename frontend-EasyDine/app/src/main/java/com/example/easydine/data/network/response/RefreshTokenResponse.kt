package com.example.easydine.data.network.response

import com.squareup.moshi.Json

data class RefreshTokenResponse(
    @Json(name = "status") val status: String,
    @Json(name = "accessToken") val accessToken: String
)