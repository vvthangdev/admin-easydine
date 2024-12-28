package com.example.easydine.ui.signup

import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.easydine.R
import com.example.easydine.databinding.ActivitySignUpBinding

class SignUpActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignUpBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignUpBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnSignUp.setOnClickListener{
            val email = binding.edtEmail.text.toString().trim()
            val username = binding.edtUserName.text.toString().trim()
            val name = binding.edtFullName.text.toString().trim()
            val phone = binding.edtPhone.text.toString().trim()
            val password = binding.edtPassword.text.toString().trim()

        }

    }
}