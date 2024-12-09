import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://be-test01.onrender.com', // Thay đổi baseURL theo API của bạn
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu token hết hạn (status 403) và chưa thử refresh
        if (error.response?.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axiosInstance.post('/auth/refresh-token', {}, {
                    headers: {
                        'Authorization': refreshToken
                    }
                });

                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);

                originalRequest.headers['Authorization'] = accessToken;
                return axiosInstance(originalRequest);
            } catch (error) {
                // localStorage.clear();
                // window.location.href = '/login';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;