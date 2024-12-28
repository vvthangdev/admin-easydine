package com.example.easydine.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import com.example.easydine.data.model.Food
import com.example.easydine.databinding.ItemFoodBinding
import com.example.easydine.ui.viewholder.FoodViewHolder

class FoodAdapter : ListAdapter<Food, FoodViewHolder>(FoodDiffCallback()) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
        val binding = ItemFoodBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return FoodViewHolder(binding)
    }

    override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
        val food = getItem(position)
        holder.bind(food)
    }
}

class FoodDiffCallback : DiffUtil.ItemCallback<Food>() {
    override fun areItemsTheSame(oldItem: Food, newItem: Food): Boolean = oldItem.id == newItem.id
    override fun areContentsTheSame(oldItem: Food, newItem: Food): Boolean = oldItem == newItem
}
