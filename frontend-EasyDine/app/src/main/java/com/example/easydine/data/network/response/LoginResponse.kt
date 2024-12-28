package com.example.easydine.data.network.response

import com.squareup.moshi.Json

data class LoginResponse(
    @Json(name = "id") val id: Int,
    @Json(name = "status") val status: String? = "Unknown Status", // Cung cấp giá trị mặc định
    @Json(name = "name") val name: String? = "Unknown User",     // Cung cấp giá trị mặc định
    @Json(name = "message") val message: String? = "No message",
    @Json(name = "role") val role: String? = "Guest",
    @Json(name = "address") val address: String? = "No address provided",
    @Json(name = "avatar") val avatar: String? = "default-avatar.png",
    @Json(name = "email") val email: String? = "noemail@example.com",
    @Json(name = "username") val username: String? = "Unknown Username",
    @Json(name = "phone") val phone: String? = "No phone",
    @Json(name = "accessToken") val accessToken: String? = "default-access-token",
    @Json(name = "refreshToken") val refreshToken: String? = "default-refresh-token"
)
