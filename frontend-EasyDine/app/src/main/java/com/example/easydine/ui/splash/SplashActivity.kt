package com.example.easydine.ui.splash

import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import com.example.easydine.databinding.ActivitySplashBinding
import com.example.easydine.ui.home.HomeActivity

import com.example.easydine.ui.login.LoginActivity

class SplashActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySplashBinding
    private val splashViewModel: SplashViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val delay: Long = 100

        // Delay 2 seconds before checking user status
        Handler(Looper.getMainLooper()).postDelayed({
            val sharedPreferences = getSharedPreferences("AppPrefs", MODE_PRIVATE)

            splashViewModel.checkUserStatus(
                sharedPreferences,
                onNavigateToLogin = { navigateToLogin() },
                onNavigateToHome = { navigateToHome() }
            )
        }, delay)
    }

    private fun navigateToLogin() {
        val intent = Intent(this, LoginActivity::class.java)
        startActivity(intent)
        finish()
    }

    private fun navigateToHome() {
        val intent = Intent(this, HomeActivity::class.java)
        startActivity(intent)
        finish()
    }
}
