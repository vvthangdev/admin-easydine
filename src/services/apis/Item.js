import axiosInstance from "../../config/axios.config";

export const itemAPI = {
  getAllItem: (data) => {
    return axiosInstance.get("/item");
  },

  addItem: (data) => {
    return axiosInstance.post("/item/create-item", data);
  },

  updateItem: (data) => {
    return axiosInstance.patch("/item/update-item", data);
  },

  deleteItem: (data) => {
    return axiosInstance.delete("/item/delete-item", { data });
  },

  searchItem: (data) => {
    return axiosInstance.get("/item/search-item", { params: data }); // Sửa endpoint
  },

  // API mới: Lọc món ăn theo danh mục
  filterItemsByCategory: (categoryId) => {
    return axiosInstance.get("/item/filter-by-category", {
      params: { categoryId },
    });
  },

  // API mới: Lấy danh sách danh mục
  getAllCategories: () => {
    return axiosInstance.get("/item/categories");
  },

  // API mới: Tạo danh mục
  createCategory: (data) => {
    return axiosInstance.post("/item/create-category", data);
  },

  // API mới: Xóa danh mục
  deleteCategory: (categoryId) => {
    return axiosInstance.delete("/item/delete-category", {
      data: { categoryId },
    });
  },
};