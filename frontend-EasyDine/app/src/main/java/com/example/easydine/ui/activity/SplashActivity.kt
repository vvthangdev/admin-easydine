package com.example.easydine.ui.activity

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import com.example.easydine.data.model.LoginResponse
import com.example.easydine.data.repositories.UserRepository
import com.example.easydine.databinding.ActivitySplashBinding
import com.example.easydine.utils.UserManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class SplashActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySplashBinding
    private val userRepository = UserRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val delay: Long = 2000
        Handler(Looper.getMainLooper()).postDelayed({
            val sharedPreferences = getSharedPreferences("AppPrefs", MODE_PRIVATE)
            val refreshToken = sharedPreferences.getString("refreshToken", null)

            UserManager.initializeUser(sharedPreferences)
            val user = UserManager.currentUser

            // In giá trị của User vào logcat
            if (user != null) {
                Log.d("UserInfo", "ID: ${user.id}, Name: ${user.name}, Email: ${user.email}")
            } else {
                Log.d("UserInfo", "User is null")
            }
//            val user = UserManager.currentUser

            if (refreshToken.isNullOrEmpty()) {
                navigateToLogin()
            } else {
                refreshAccessToken(refreshToken)
                navigateToHome()
            }
        }, delay)
    }

    private fun refreshAccessToken(refreshToken: String) {
        userRepository.refreshAccessToken(refreshToken).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(p0: Call<LoginResponse>, p1: Response<LoginResponse>) {
                if (p1.isSuccessful) {
                    val loginResponse = p1.body()
                    val sharedPreferences = getSharedPreferences("AppPrefs", MODE_PRIVATE)
                    val editor = sharedPreferences.edit()
                    editor.putString("accessToken", loginResponse?.accessToken)
                    editor.apply()

                    navigateToHome()
                }
            }

            override fun onFailure(p0: Call<LoginResponse>, p1: Throwable) {
                Toast.makeText(this@SplashActivity, "Error: ${p1.message}", Toast.LENGTH_SHORT)
                    .show()
                navigateToLogin()
            }
        })
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
//        overridePendingTransition(0, 0)
        finish()
    }
}