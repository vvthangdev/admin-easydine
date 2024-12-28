package com.example.easydine.data.repositories

import androidx.lifecycle.LiveData
import com.example.easydine.data.local.dao.FoodDao
import com.example.easydine.data.model.Food
import com.example.easydine.data.network.service.FoodApiService

class FoodRepository(
    private val foodDao: FoodDao,
    private val foodApiService: FoodApiService
) {

    val allFoods: LiveData<List<Food>> = foodDao.getAllFoods()

    suspend fun refreshFoods() {
        val response = foodApiService.getFoods()

        if (response.isSuccessful) {
            val foodResponses = response.body() ?: emptyList()

            // Ánh xạ từ FoodResponse sang Food
            val foodsToInsert = foodResponses.map { foodResponse ->
                Food(
                    id = foodResponse.id,
                    name = foodResponse.name,
                    image = foodResponse.image,
                    price = foodResponse.price ?: 0.0 // Giá trị mặc định nếu null
                )
            }

            // Chèn danh sách Food vào Room Database
            foodDao.insertFoods(foodsToInsert)
        } else {
            throw Exception("Failed to refresh foods: ${response.message()}")
        }
    }
}
