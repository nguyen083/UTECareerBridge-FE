import axios from "axios";
import { useDispatch } from "react-redux";
import { setInitEmployer } from "../redux/action/employerSlice";
import { setInitStudent } from "../redux/action/studentSlice";
import { setInitUser } from "../redux/action/userSlice";
import { removeAllToken } from "../services/apiService";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const instance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": localStorage.getItem("lang") || "en",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export const refreshToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/auth/refresh",
      {},
      {
        withCredentials: true,
        timeout: 5000,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

instance.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      // Redirect to forbidden/unauthorized page
      window.location = "/forbidden"; // or '/unauthorized', depending on your route setup
      return Promise.reject(error);
    }
    if (error.response?.status === 500) {
      // Redirect to not found page
      // window.location = "/user/500";
      return Promise.reject(error);
    }
    if (error.response?.status === 404) {
      window.location = "/user/404";
      return Promise.reject(error);
    }
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Loại trừ trường hợp từ endpoint interviews/schedule
      if (originalRequest.url.includes("interviews/schedule")) {
        return error?.response?.data
          ? error.response.data
          : Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh token, thêm request vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newTokens = await refreshToken();
        localStorage.setItem("accessToken", newTokens.accessToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newTokens.accessToken}`;

        // Xử lý các request trong hàng đợi
        processQueue();
        isRefreshing = false;

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        console.error(
          "Failed to refresh token. User may need to re-authenticate."
        );
        const dispatch = useDispatch();
        dispatch(setInitEmployer());
        dispatch(setInitStudent());
        dispatch(setInitUser());
        removeAllToken();
        window.location = "/login";
        return Promise.reject(refreshError);
      }
    }

    return error?.response?.data ? error.response.data : Promise.reject(error);
  }
);

export default instance;
