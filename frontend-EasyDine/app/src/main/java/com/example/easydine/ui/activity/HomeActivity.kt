package com.example.easydine.ui.activity

import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.easydine.data.local.database.AppDatabase
import com.example.easydine.data.repositories.FoodRepository
import com.example.easydine.databinding.ActivityHomeBinding
import com.example.easydine.network.ApiClient
import com.example.easydine.ui.adapter.FoodAdapter
import com.example.easydine.viewmodel.FoodViewModel
import com.example.easydine.viewmodel.FoodViewModelFactory
import kotlinx.coroutines.launch

class HomeActivity : AppCompatActivity() {

    private lateinit var binding: ActivityHomeBinding
    private val foodViewModel: FoodViewModel by viewModels {
        FoodViewModelFactory(
            FoodRepository(
                AppDatabase.getDatabase(this).foodDao(),
                ApiClient.foodApiService
            )
        )
    }
    private val foodAdapter = FoodAdapter()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupRecyclerView()

        foodViewModel.foods.observe(this) { foods ->
            foodAdapter.submitList(foods)
        }

        lifecycleScope.launch {
            foodViewModel.refreshFoods()
        }
    }

    private fun setupRecyclerView() {
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@HomeActivity)
            adapter = foodAdapter
        }
    }
}
