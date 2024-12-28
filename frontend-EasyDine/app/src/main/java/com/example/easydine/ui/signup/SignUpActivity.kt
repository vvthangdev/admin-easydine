package com.example.easydine.ui.signup

import android.os.Bundle
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import com.example.easydine.databinding.ActivitySignUpBinding

class SignUpActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignUpBinding
    private val signUpViewModel: SignUpViewModel by viewModels()

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
            signUpViewModel.signUpUser(email, username, name, phone, password, this)
        }

        signUpViewModel.signUpResult.observe(this, Observer { result ->
            when(result){
                is SignUpResult.Success -> {
                    finish()
                }
                is SignUpResult.Failure -> {
                    Toast.makeText(this, result.message, Toast.LENGTH_SHORT).show()
                }
            }
        })
    }
}