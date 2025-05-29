import axiosInstance from "../../config/axios.config";
import {handleApiResponse} from "./handleApiResponse";

export const itemAPI = {
  getAllItem: () =>
    axiosInstance.get("/item").then(handleApiResponse),

  addItem: (data) =>
    axiosInstance.post("/item/create-item", data).then(handleApiResponse),

  updateItem: (data) =>
    axiosInstance.patch("/item/update-item", data).then(handleApiResponse),

  deleteItem: (data) =>
    axiosInstance
      .delete("/item/delete-item", { data })
      .then(handleApiResponse),

  searchItem: (data) =>
    axiosInstance
      .get("/item/search-item", { params: data })
      .then(handleApiResponse),

  filterItemsByCategory: (categoryId) =>
    axiosInstance
      .get("/item/filter-by-category", { params: { categoryId } })
      .then(handleApiResponse),

  getAllCategories: () =>
    axiosInstance.get("/item/categories").then(handleApiResponse),

  createCategory: (data) =>
    axiosInstance.post("/item/create-category", data).then(handleApiResponse),

  deleteCategory: (categoryId) =>
    axiosInstance
      .delete("/item/delete-category", { data: { categoryId } })
      .then(handleApiResponse),
};