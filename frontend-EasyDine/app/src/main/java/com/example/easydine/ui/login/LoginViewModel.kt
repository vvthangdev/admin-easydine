package com.example.easydine.ui.login

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.easydine.data.repositories.UserRepository
import kotlinx.coroutines.launch
import retrofit2.HttpException

class LoginViewModel : ViewModel() {

    // Dùng để giữ thông tin repository
    private val userRepository = UserRepository()

    // LiveData to observe login status and response
    private val _loginResult = MutableLiveData<LoginResult>()
    val loginResult: LiveData<LoginResult> get() = _loginResult

    // Function to handle login
    fun loginUser(email: String, password: String, context: Context) {
        // Validate email and password
        if (email.isNotEmpty() && password.isNotEmpty()) {
            // Start the login process in a coroutine
            viewModelScope.launch {
                try {
                    Log.d("LoginViewModel", "Logging in with email: $email")

                    // Call the login API
                    val loginResponse = userRepository.loginUser(email, password)

                    if (loginResponse?.status == "SUCCESS") {
                        Log.d("LoginViewModel", "Login successful for email: $email")

                        // Save user data to SharedPreferences
                        val sharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                        val editor = sharedPreferences.edit()

                        // Lưu các thông tin người dùng vào SharedPreferences
                        loginResponse.let {
                            editor.putInt("id", it.id) // Lưu id
                            editor.putString("name", it.name) // Lưu name
                            editor.putString("status", it.status)
                            editor.putString("message", it.message)
                            editor.putString("role", it.role)
                            editor.putString("address", it.address)
                            editor.putString("avatar", it.avatar)
                            editor.putString("email", it.email)
                            editor.putString("phone", it.phone)
                            editor.putString("username", it.username)
                            editor.putString("accessToken", it.accessToken)
                            editor.putString("refreshToken", it.refreshToken)
                        }

                        editor.apply()  // Lưu thay đổi vào SharedPreferences

                        // Update the result to indicate success
                        _loginResult.postValue(LoginResult.Success)
                    } else {
                        // If login failed
                        _loginResult.postValue(LoginResult.Failure(loginResponse?.message ?: "Login failed"))
                        Log.d("LoginViewModel", "Login failed with message: ${loginResponse?.message}")
                    }
                } catch (e: HttpException) {
                    Log.e("LoginViewModel", "HTTP error: ${e.message()}", e)
                    _loginResult.postValue(LoginResult.Failure("Login failed! Server error"))
                } catch (e: Exception) {
                    Log.e("LoginViewModel", "Error: ${e.message}", e)
                    _loginResult.postValue(LoginResult.Failure("Error: ${e.message}"))
                }
            }
        } else {
            // If email or password is empty
            _loginResult.postValue(LoginResult.Failure("Please fill in all fields"))
            Log.w("LoginViewModel", "Email or password is empty")
        }
    }
}

sealed class LoginResult {
    data object Success : LoginResult()
    data class Failure(val message: String) : LoginResult()
}
