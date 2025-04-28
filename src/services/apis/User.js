import axiosInstance from "../../config/axios.config";

export const userAPI = {
  // getAllUser: () =>
  //   axiosInstance.get("/users/all").then((res) => res),

  getUserById: (id) => axiosInstance.get(`/users/${id}`).then((res) => res),

  searchUsers: (query) =>
    axiosInstance
      .get("/users/search", { params: { query } })
      .then((res) => res),

  getAllUser: () => {
    return axiosInstance.get("/users/all-users");
  },

  updateUser: (user) => {
    return axiosInstance.patch("/users/update-user", user);
  },

  deleteUser: (data) => {
    return axiosInstance.delete("/users/delete", { data });
  },
  getUserInfo: (data) => {
    return axiosInstance.get("/users/user-info", data);
  },
  // Thêm phương thức mới cho admin update user
  adminUpdateUser: (id, data) => {
    return axiosInstance.patch(`/users/admin/update/${id}`, data);
  },
};
