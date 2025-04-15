import  axiosInstance from "../../config/axios.config"

export const authAPI = {
    // Đăng ký
    register: (data) => {
        return axiosInstance.post('/users/signup', data);
    },

    // Đăng nhập
    login: (data) => {
        return axiosInstance.post('/users/login', data);
    },

    // Đăng xuất
    logout: () => {
        return axiosInstance.post('/users/logout');
    },

    // Refresh token
    refreshToken: () => {
        return axiosInstance.post('/users/refresh-token');
    }
};

export const userAPI = {
    // Cập nhật thông tin user
    updateProfile: (data) => {
        return axiosInstance.put('/users/update-user', data);
    },

    // Xóa tài khoản
    deleteAccount: (password) => {
        return axiosInstance.delete('/users/delete', { data: { password } });
    }
};