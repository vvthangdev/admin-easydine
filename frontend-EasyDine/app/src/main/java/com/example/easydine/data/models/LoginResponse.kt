package com.example.easydine.data.models

data class LoginResponse(
//    val success: Boolean,
//    val message: String,
//    val token: String? = null

    var success: Boolean = false,
    var status: String? = null,
    var message: String? = null,
    var username: String? = null,
    var accessToken: String? = null,
    var refreshToken: String? = null,
)
