package com.example.easydine.data.network.response

data class SignUpResponse(
    val status: String,  // "SUCCESS" hoặc các giá trị khác
    val message: String, // Thông báo chi tiết
    val data: String     // Tên người dùng (hoặc có thể là các dữ liệu khác nếu cần)
)
