package com.example.easydine.data.repositories

import androidx.lifecycle.LiveData
import com.example.easydine.data.local.dao.ImageBannerDao
import com.example.easydine.data.model.ImageBanner
import com.example.easydine.data.network.service.ImageBannerService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class ImageBannerRepository(
    private val imageBannerDao: ImageBannerDao,
    private val imageBannerService: ImageBannerService
) {

    fun getAllBanners(): LiveData<List<ImageBanner>> {
        return imageBannerDao.getAllBanners()
    }

    suspend fun refreshBanners(authorization: String) {
        withContext(Dispatchers.IO) {
            try {
                val response = imageBannerService.getAllItemBanners(authorization)
                if (response.isSuccessful){
                    response.body()?.let {bannerResponseList ->
                        val banners = bannerResponseList.map { response ->
                            ImageBanner(
                                id = response.id,
                                image = response.image,
                                title = response.title
                            )
                        }
                        imageBannerDao.deleteAllBanners()
                        imageBannerDao.insertBanners(banners)
                    }
                }
                else {
                    throw Exception("Failed to fetch banners: ${response.code()}")
                }
            }
            catch (e: Exception){
                e.printStackTrace()
            }
        }
    }
}