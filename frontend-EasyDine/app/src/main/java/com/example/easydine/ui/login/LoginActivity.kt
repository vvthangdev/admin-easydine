package com.example.easydine.ui.login

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.example.easydine.databinding.ActivityLoginBinding
import com.example.easydine.ui.home.HomeActivity
import com.example.easydine.ui.signup.SignUpActivity

class LoginActivity : AppCompatActivity() {

    private lateinit var binding: ActivityLoginBinding

    // Lấy đối tượng ViewModel, không dùng ViewModelFactory
    private val loginViewModel: LoginViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Quan sát kết quả đăng nhập
        loginViewModel.loginResult.observe(this, Observer { result ->
            when (result) {
                is LoginResult.Success -> {
                    // Chuyển sang HomeActivity khi đăng nhập thành công
                    val intent = Intent(this@LoginActivity, HomeActivity::class.java)
                    startActivity(intent)
                    finish()  // Đóng màn hình đăng nhập
                }
                is LoginResult.Failure -> {
                    // Hiển thị thông báo lỗi
                    Toast.makeText(this@LoginActivity, result.message, Toast.LENGTH_SHORT).show()
                }
            }
        })

        binding.btnLogin.setOnClickListener {
            val email = binding.edtEmail.text.toString().trim()
            val password = binding.edtPassword.text.toString().trim()

            Log.d("LoginActivity", "Attempting to login with email: $email")

            // Gọi phương thức loginUser trong ViewModel
            loginViewModel.loginUser(email, password, this)
        }

        binding.tvSignUpLink.setOnClickListener{
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        }
    }
}
