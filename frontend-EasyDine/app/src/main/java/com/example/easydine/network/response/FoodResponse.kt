package com.example.easydine.network.response

data class FoodResponse(
    val id: Long = 0,
    val name: String,
    val price: Double? = 0.0,
    val image: String
)
