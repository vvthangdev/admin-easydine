package com.example.easydine.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "Food")
data class Food(
    @PrimaryKey val id: Long,
    val name: String,
    val image: String,
    val price: Double
)
