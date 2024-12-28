package com.example.easydine.ui.viewholder

import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.easydine.data.model.Food
import com.example.easydine.databinding.ItemFoodBinding

class FoodViewHolder(private val binding: ItemFoodBinding) : RecyclerView.ViewHolder(binding.root) {
    fun bind(food: Food) {
        binding.foodName.text = food.name
        binding.foodPrice.text = "${food.price} VND"
        Glide.with(binding.root.context)
            .load(food.image)
            .into(binding.foodImage)
    }
}
