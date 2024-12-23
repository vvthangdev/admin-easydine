package com.example.easydine.ui.activity

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.easydine.data.model.LoginResponse
import com.example.easydine.data.repositories.UserRepository
import com.example.easydine.databinding.ActivityLoginBinding
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private val userRepository = UserRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnLogin.setOnClickListener {
            val email = binding.etEmail.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                loginUser(email, password)
            } else {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(email: String, password: String) {
        userRepository.loginUser(email, password).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful && response.body()?.status == "SUCCESS") {
                    val loginResponse = response.body()

                    // Lưu token vào SharedPreferences
                    val sharedPreferences = getSharedPreferences("AppPrefs", MODE_PRIVATE)
                    val editor = sharedPreferences.edit()
                    editor.putString("status", loginResponse?.status)
                    editor.putString("message", loginResponse?.message)
                    editor.putString("role", loginResponse?.role)
                    editor.putString("address", loginResponse?.address)
                    editor.putString("avatar", loginResponse?.avatar)
                    editor.putString("email", loginResponse?.email)
                    editor.putString("phone", loginResponse?.phone)
                    editor.putString("username", loginResponse?.username)
                    editor.putString("accessToken", loginResponse?.accessToken)
                    editor.putString("refreshToken", loginResponse?.refreshToken)
                    editor.apply()

                    val intent = Intent(this@LoginActivity, HomeActivity::class.java)
                    startActivity(intent)
                    finish() // Đóng màn hình đăng nhập
                } else {
                    Toast.makeText(this@LoginActivity, "Login failed!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}