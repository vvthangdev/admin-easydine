import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const itemCategoryAPI = {
  getAllItemCategory: () =>
    axiosInstance.get("/item-category").then(handleApiResponse),

  createItemCategory: (data) =>
    axiosInstance
      .post("/item-category/create-item-category", data)
      .then(handleApiResponse),

  updateItemCategory: (data) =>
    axiosInstance
      .patch("/item-category/update-item-category", data)
      .then(handleApiResponse),

  deleteItemCategory: (data) =>
    axiosInstance
      .delete("/item-category/delete-item-category", { data })
      .then(handleApiResponse),

  searchItemCategory: (data) =>
    axiosInstance
      .get("/item-category/search-item-category", { params: data })
      .then(handleApiResponse),
};