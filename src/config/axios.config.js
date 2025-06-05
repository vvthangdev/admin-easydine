import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    token ? resolve(token) : reject(error);
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.replace(/^Bearer\s+/, "")}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { config, response } = error;
    if (
      (response?.status === 401 || response?.status === 403) &&
      !config._retry &&
      !config.url.includes("/users/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            config.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(config);
          })
          .catch((err) => Promise.reject(err));
      }

      config._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(`${API_URL}/users/refresh-token`, { refreshToken });
        const accessToken = data.data.accessToken?.replace(/^Bearer\s+/, "");
        if (!accessToken) throw new Error("No access token");

        localStorage.setItem("accessToken", accessToken);
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return axiosInstance(config);
      } catch (err) {
        processQueue(err);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;