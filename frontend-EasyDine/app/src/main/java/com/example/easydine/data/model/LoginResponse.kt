package com.example.easydine.data.model

data class LoginResponse(
    var status: String? = null,
    var message: String? = null,
    var role: String? = null,
    var address: String? = null,
    var avatar: String? = null,
    var email: String? = null,
    var phone: String? = null,
    var username: String? = null,
    var accessToken: String? = null,
    var refreshToken: String? = null,
)