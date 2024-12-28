package com.example.easydine.data.repositories

import android.util.Log
import com.example.easydine.network.response.LoginResponse
import com.example.easydine.network.ApiClient
import com.example.easydine.network.response.RefreshTokenResponse
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

                // Log thông tin chi tiết về response
//                Log.d("UserRepository", "Login API response: ${response.body()}")
//                Log.d("UserRepository", "Response code: ${response.code()}")
//                Log.d("UserRepository", "Response message: ${response.message()}")

                // Kiểm tra response và trả về LoginResponse nếu thành công
                if (response.isSuccessful) {
                    Log.d("UserRepository", "Login successful. Status: ${response.body()}")
                    return@withContext response.body()
                } else {
                    // Log khi API trả về lỗi (4xx hoặc 5xx)
                    Log.e("UserRepository", "Login failed. Error code: ${response.code()} - ${response.message()}")
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

                // Log thông tin chi tiết về response
//                Log.d("UserRepository", "Refresh token API response: ${response.body()}")
//                Log.d("UserRepository", "Response code: ${response.code()}")
//                Log.d("UserRepository", "Response message: ${response.message()}")

                // Kiểm tra nếu API trả về response thành công
                if (response.isSuccessful) {
                    // Log thành công và thông tin về accessToken
                    Log.d("UserRepository", "Refresh token successful. AccessToken: ${response.body()?.accessToken}")

                    // Trả về LoginResponse nếu thành công
                    return@withContext response.body()
                } else {
                    // Log khi API trả về lỗi, thêm thông tin lỗi chi tiết
                    Log.e("UserRepository", "Refresh token failed. Error code: ${response.code()} - ${response.message()}")
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

//    suspend fun signUpUser()

}
