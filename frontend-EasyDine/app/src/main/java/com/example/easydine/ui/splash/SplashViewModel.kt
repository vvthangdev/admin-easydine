package com.example.easydine.ui.splash

import android.content.SharedPreferences
import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.easydine.data.repositories.UserRepository
import com.example.easydine.utils.UserManager
import kotlinx.coroutines.launch

class SplashViewModel : ViewModel() {
    private val userRepository = UserRepository()

    // Function to check user status and refresh token if necessary
    fun checkUserStatus(sharedPreferences: SharedPreferences, onNavigateToLogin: () -> Unit, onNavigateToHome: () -> Unit) {
        val refreshToken = sharedPreferences.getString("refreshToken", null)
        Log.d("SplashViewModel", "Refresh Token: $refreshToken")  // Log refreshToken

        // Initialize UserManager
        UserManager.initializeUser(sharedPreferences)
        val user = UserManager.currentUser

        // Log user info
        if (user != null) {
            Log.d("UserInfo", "ID: ${user.id}, Name: ${user.name}, Email: ${user.email}")
        } else {
            Log.d("UserInfo", "User is null")
        }

        // If there's no refreshToken, navigate to login
        if (refreshToken.isNullOrEmpty()) {
            Log.d("SplashViewModel", "No refresh token, navigating to login.")
            onNavigateToLogin()
        } else {
            // If there's a refresh token, refresh the token and navigate to Home
            Log.d("SplashViewModel", "Refresh token found, attempting to refresh access token.")
            refreshAccessToken(refreshToken, onNavigateToHome, onNavigateToLogin)
        }
    }

    private fun refreshAccessToken(refreshToken: String, onNavigateToHome: () -> Unit, onNavigateToLogin: () -> Unit) {
        viewModelScope.launch {
            try {
                Log.d("SplashViewModel", "Refreshing access token with refreshToken: $refreshToken")
                val response = userRepository.refreshAccessToken(refreshToken)

                if (response?.accessToken != null) {
                    Log.d("SplashViewModel", "Access token refreshed successfully, navigating to home.")
                    Log.d("SplashViewModel", "Access token: ${response.accessToken}")
                    // Save the new accessToken into SharedPreferences
                    onNavigateToHome()
                } else {
                    Log.d("SplashViewModel", "Failed to refresh access token, navigating to login.")
                    onNavigateToLogin()
                }
            } catch (e: Exception) {
                // Handle any errors (e.g., network issues)
                Log.e("SplashViewModel", "Error refreshing access token: ${e.message}", e)
                onNavigateToLogin()
            }
        }
    }
}
