package com.example.easydine.ui

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.example.easydine.data.models.LoginResponse
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
                if (response.isSuccessful && response.body()?.success == true) {
                    val loginResponse = response.body()

                    // Lưu token vào SharedPreferences
                    val sharedPreferences = getSharedPreferences("AppPrefs", MODE_PRIVATE)
                    val editor = sharedPreferences.edit()
                    editor.putString("accessToken", loginResponse?.accessToken)
                    editor.putString("refreshToken", loginResponse?.refreshToken)
                    editor.apply()

                    // Chuyển đến HomeActivity và truyền thông tin loginResponse
                    val intent = Intent(this@LoginActivity, HomeActivity::class.java).apply {
                        putExtra("username", loginResponse?.username)
                        putExtra("status", loginResponse?.status)
                        putExtra("message", loginResponse?.message)
                        putExtra("accessToken", loginResponse?.accessToken)
                        putExtra("refreshToken", loginResponse?.refreshToken)
                    }
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