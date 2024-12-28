package com.example.easydine.utils

import android.content.SharedPreferences
import com.example.easydine.data.model.User

object UserManager {
    var currentUser: User? = null

    fun initializeUser(sharedPreferences: SharedPreferences) {
        val id = sharedPreferences.getInt("id", -1)
        val role = sharedPreferences.getString("role", null)
        val name = sharedPreferences.getString("name", null)
        val status = sharedPreferences.getString("status", null)
        val message = sharedPreferences.getString("message", null)
        val address = sharedPreferences.getString("address", null)
        val avatar = sharedPreferences.getString("avatar", null)
        val email = sharedPreferences.getString("email", null)
        val phone = sharedPreferences.getString("phone", null)
        val username = sharedPreferences.getString("username", null)
        val accessToken = sharedPreferences.getString("accessToken", null)
        val refreshToken = sharedPreferences.getString("refreshToken", null)

        currentUser = if (email != null) {
            User(
                id = id,
                role = role,
                name = name,
                status = status,
                message = message,
                address = address,
                avatar = avatar,
                email = email,
                phone = phone,
                username = username,
                accessToken = accessToken,
                refreshToken = refreshToken
            )
        } else {
            null
        }
    }

    fun saveUser(sharedPreferences: SharedPreferences, user: User) {
        val editor = sharedPreferences.edit()
        editor.putInt("id", user.id ?: -1)
        editor.putString("role", user.role ?: null)
        editor.putString("status", user.status)
        editor.putString("message", user.message)
        editor.putString("address", user.address)
        editor.putString("avatar", user.avatar)
        editor.putString("email", user.email)
        editor.putString("phone", user.phone)
        editor.putString("username", user.username)
        editor.putString("accessToken", user.accessToken)
        editor.putString("refreshToken", user.refreshToken)
        editor.apply()
        currentUser = user
    }

    fun clearUser(sharedPreferences: SharedPreferences) {
        val editor = sharedPreferences.edit()
        editor.remove("id")
        editor.remove("role")
        editor.remove("status")
        editor.remove("message")
        editor.remove("address")
        editor.remove("avatar")
        editor.remove("email")
        editor.remove("phone")
        editor.remove("username")
        editor.remove("accessToken")
        editor.remove("refreshToken")
        editor.apply()

        currentUser = null
    }
}