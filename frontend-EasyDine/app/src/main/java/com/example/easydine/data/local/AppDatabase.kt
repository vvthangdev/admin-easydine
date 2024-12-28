package com.example.easydine.data.local.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.easydine.data.local.dao.FoodDao
import com.example.easydine.data.model.Food

@Database(entities = [Food::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun foodDao(): FoodDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                // Xóa database cũ
                context.deleteDatabase("food_database")

                // Tạo database mới
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "food_database"
                )
                    .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
