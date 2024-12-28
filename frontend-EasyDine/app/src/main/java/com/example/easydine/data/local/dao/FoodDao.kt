package com.example.easydine.data.local.dao

import androidx.lifecycle.LiveData
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.example.easydine.data.model.Food

@Dao
interface FoodDao {
    @Query("SELECT * FROM Food")
    fun getAllFoods(): LiveData<List<Food>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertFoods(foods: List<Food>)
}
