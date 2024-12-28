package com.example.easydine.data.repositories

import android.util.Log
import com.example.easydine.data.network.ApiClient
import com.example.easydine.data.network.response.LoginResponse
import com.example.easydine.data.network.response.RefreshTokenResponse
import com.example.easydine.data.network.response.SignUpResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserRepository {

    private val apiService = ApiClient.userApiService

    // Login user using coroutine
    suspend fun loginUser(email: String, password: String): LoginResponse? {
        // Thực hiện gọi API trên thread I/O
        return withContext(Dispatchers.IO) {
            try {
                // Gọi API để login
                val response = apiService.loginUser(email, password)

                if (response.isSuccessful) {
                    Log.d("UserRepository", "Login successful. Status: ${response.body()}")
                    return@withContext response.body()
                } else {
                    // Log khi API trả về lỗi (4xx hoặc 5xx)
                    Log.e(
                        "UserRepository",
                        "Login failed. Error code: ${response.code()} - ${response.message()}"
                    )
                    return@withContext null
                }
            } catch (e: Exception) {
                // Log lỗi nếu có (lỗi mạng hoặc các lỗi khác)
                Log.e("UserRepository", "Login error: ${e.message}", e)
                return@withContext null
            }
        }
    }

    // Refresh access token using coroutine
    suspend fun refreshAccessToken(refreshToken: String): RefreshTokenResponse? {
        return withContext(Dispatchers.IO) {
            try {
                // Tạo header Authorization với Bearer token
                val authorizationHeader = "$refreshToken"
                Log.d("UserRepostory", "vvt: $authorizationHeader")

                // Gọi API để refresh token với header Authorization
                val response = apiService.refreshAccessToken(authorizationHeader)

                // Kiểm tra nếu API trả về response thành công
                if (response.isSuccessful) {
                    // Log thành công và thông tin về accessToken
                    Log.d(
                        "UserRepository",
                        "Refresh token successful. AccessToken: ${response.body()?.accessToken}"
                    )

                    // Trả về LoginResponse nếu thành công
                    return@withContext response.body()
                } else {
                    // Log khi API trả về lỗi, thêm thông tin lỗi chi tiết
                    Log.e(
                        "UserRepository",
                        "Refresh token failed. Error code: ${response.code()} - ${response.message()}"
                    )
                    if (response.errorBody() != null) {
                        Log.e("UserRepository", "Error Body: ${response.errorBody()?.string()}")
                    }
                    return@withContext null
                }
            } catch (e: Exception) {
                // Log lỗi nếu có (lỗi mạng hoặc các lỗi khác)
                Log.e("UserRepository", "Refresh token error: ${e.message}", e)
                return@withContext null
            }
        }
    }

    suspend fun signUpUser(
        email: String,
        name: String,
        username: String,
        phone: String,
        password: String
    ): SignUpResponse? {
        return try {
            // Gọi API đăng ký với các tham số cần thiết
            val response = apiService.registerUser(email, name, username, phone, password)

            if (response.isSuccessful) {
                response.body()  // Trả về dữ liệu người dùng nếu đăng ký thành công
            } else {
                null  // Trả về null nếu đăng ký không thành công
            }
        } catch (e: Exception) {
            null  // Trả về null trong trường hợp có lỗi (ví dụ: lỗi kết nối)
        }
    }

}
