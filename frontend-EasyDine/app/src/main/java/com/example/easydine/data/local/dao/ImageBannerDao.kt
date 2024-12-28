package com.example.easydine.data.local.dao

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.easydine.data.model.ImageBanner

@Dao
interface ImageBannerDao {
    @Query("SELECT * FROM image_banners")
    fun getAllBanners(): LiveData<List<ImageBanner>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBanners(banners: List<ImageBanner>)

    @Query("DELETE FROM image_banners")
    suspend fun deleteAllBanners()
}
