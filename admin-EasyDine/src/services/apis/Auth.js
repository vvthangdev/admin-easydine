import  axiosInstance from "../../config/axios.config"

export const authAPI = {
    // Đăng ký
    register: (data) => {
        return axiosInstance.post('/api/auth/signup', data);
    },

    // Đăng nhập
    login: (data) => {
        return axiosInstance.post('/api/auth/login', data);
    },

    // Đăng xuất
    logout: () => {
        return axiosInstance.post('/api/auth/logout');
    },

    // Refresh token
    refreshToken: () => {
        return axiosInstance.post('/api/auth/refresh-token');
    }
};

export const userAPI = {
    // Cập nhật thông tin user
    updateProfile: (data) => {
        return axiosInstance.put('/api/auth/update-user', data);
    },

    // Xóa tài khoản
    deleteAccount: (password) => {
        return axiosInstance.delete('/api/auth/delete', { data: { password } });
    }
};