package com.example.easydine

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.example.easydine.data.model.Food
import com.example.easydine.data.network.ApiClient
import com.example.easydine.data.network.service.FoodApiService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity() {

//    private val foodApiService: FoodApiService by lazy {
//        ApiClient.retrofit.create(FoodApiService::class.java)
//    }
//
//    override fun onCreate(savedInstanceState: Bundle?) {
//        super.onCreate(savedInstanceState)
//        setContentView(R.layout.activity_main)
//
//        // Kiểm tra API
//        testApi()
//    }
//
//    private fun testApi() {
//        CoroutineScope(Dispatchers.IO).launch {
//            try {
//                // Gọi API và nhận phản hồi
//                val response = foodApiService.getFoods()
//
//                if (response.isSuccessful) {
//                    // Lấy danh sách FoodResponse từ response body
//                    val foodResponses = response.body()
//
//                    // Ánh xạ từ FoodResponse sang Food
//                    val foodList = foodResponses?.map { foodResponse ->
//                        Food(
//                            id = foodResponse.id,
//                            name = foodResponse.name,
//                            price = foodResponse.price ?: 0.0, // Giá mặc định là 0.0 nếu null
//                            image = foodResponse.image
//                        )
//                    } ?: emptyList()
//
//                    // Log kết quả trên luồng chính
//                    withContext(Dispatchers.Main) {
//                        Log.d("API_TEST", "Received data: $foodList")
//                    }
//                } else {
//                    // Xử lý lỗi từ phản hồi API
//                    withContext(Dispatchers.Main) {
//                        Log.e("API_TEST", "API Error: ${response.code()} - ${response.message()}")
//                    }
//                }
//            } catch (e: Exception) {
//                // Xử lý lỗi ngoại lệ (Exception)
//                withContext(Dispatchers.Main) {
//                    Log.e("API_TEST", "Exception: ${e.message}")
//                }
//            }
//        }
//    }

}
