package com.example.easydine.ui.signup

import android.content.Context
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.easydine.data.repositories.UserRepository
import kotlinx.coroutines.launch
import retrofit2.HttpException

class SignUpViewModel: ViewModel() {
    private val userRepository = UserRepository()

    private val _signupRes = MutableLiveData<SignUpResult>()
    val signUpResult: LiveData<SignUpResult> get() = _signupRes

    fun signUpUser(email: String, name: String, username: String, phone: String, password: String, context: Context){
        if(email.isNotEmpty() && name.isNotEmpty() && username.isNotEmpty() && phone.isNotEmpty() && password.isNotEmpty()) {
            viewModelScope.launch {
                try {
                    Log.d("RegisterViewModel", "Registering with email: $email")
                    val signUpResponse = userRepository.signUpUser(email, name, username, phone, password)
                    if (signUpResponse?.status == "SUCCESS") {
                        Log.d("RegisterViewModel", "Registration successful for username: ${signUpResponse.data}")
                        val sharedPreferences = context.getSharedPreferences("AppPrefs", Context.MODE_PRIVATE)
                        val editor = sharedPreferences.edit()

                        // Giả sử chỉ lưu username vào SharedPreferences sau khi đăng ký
                        editor.putString("username", signUpResponse.data)
                        editor.apply() // Lưu vào SharedPreferences

                        // Cập nhật kết quả thành công
                        _signupRes.postValue(SignUpResult.Success)
                    }
                }
                catch (e: HttpException) {
                    Log.e("RegisterViewModel", "HTTP error: ${e.message()}", e)
                    _signupRes.postValue(SignUpResult.Failure("Registration failed! Server error"))
                }
                catch (e: Exception) {
                    Log.e("SignUpViewModel", "Error: ${e.message}", e)
                    _signupRes.postValue(SignUpResult.Failure("Error: ${e.message}"))
                }
            }
        }
        else {
            // Nếu thông tin không đầy đủ
            _signupRes.postValue(SignUpResult.Failure("Please fill in all fields"))
            Log.w("RegisterViewModel", "One or more fields are empty")
        }
    }
}

sealed class SignUpResult {
    data object Success : SignUpResult()  // Đăng ký thành công
    data class Failure(val message: String) : SignUpResult()  // Đăng ký thất bại
}