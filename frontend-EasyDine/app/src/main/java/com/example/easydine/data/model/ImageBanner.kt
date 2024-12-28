package com.example.easydine.data.model
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "image_banners")
data class ImageBanner(
    @PrimaryKey val id: Int,
    val image: String,
    val title: String?
)
