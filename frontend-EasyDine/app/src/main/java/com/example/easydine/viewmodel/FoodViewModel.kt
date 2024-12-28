package com.example.easydine.viewmodel

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.easydine.data.model.Food
import com.example.easydine.data.repositories.FoodRepository
import kotlinx.coroutines.launch

class FoodViewModel(private val repository: FoodRepository) : ViewModel() {
    val foods: LiveData<List<Food>> = repository.allFoods

    fun refreshFoods() {
        viewModelScope.launch {
            repository.refreshFoods()
        }
    }
}

class FoodViewModelFactory(private val repository: FoodRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(FoodViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return FoodViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
