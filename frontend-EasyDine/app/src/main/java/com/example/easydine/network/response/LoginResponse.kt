package com.example.easydine.network.response

import com.squareup.moshi.Json

data class LoginResponse(
    @Json(name = "id") val id: Int,
    @Json(name = "status") val status: String,
    @Json(name = "name") val name: String,
    @Json(name = "message") val message: String,
    @Json(name = "role") val role: String,
    @Json(name = "address") val address: String,
    @Json(name = "avatar") val avatar: String,
    @Json(name = "email") val email: String,
    @Json(name = "username") val username: String,
    @Json(name = "phone") val phone: String,
    @Json(name = "accessToken") val accessToken: String,
    @Json(name = "refreshToken") val refreshToken: String
)
