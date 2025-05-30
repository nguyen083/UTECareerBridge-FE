import axios from "axios";
import { setInitEmployer } from "../redux/action/employerSlice";
import { setInitStudent } from "../redux/action/studentSlice";
import { setInitUser } from "../redux/action/userSlice";
import { removeAllToken } from "../services/apiService";
import { setInitWeb } from "../redux/action/webSlice";
import { store } from "../redux/store";

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

// API base URL từ biến môi trường hoặc mặc định
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
const REFRESH_ENDPOINT = "/v1/auth/refresh";

const instance = axios.create({
  baseURL: "/api",
  timeout: 60000,
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
    console.log("Refreshing token...");
    const response = await axios.post(
      `${API_BASE_URL}${REFRESH_ENDPOINT}`,
      {},
      {
        withCredentials: true,
        timeout: 5000,
      }
    );

    const { accessToken, expiresIn } = response.data;

    // Lưu thông tin token mới và thời gian hết hạn
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      // Lưu thời gian hết hạn của token (nếu có)
      if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        localStorage.setItem("tokenExpiryTime", expiryTime.toString());
      }
    }

    return response.data;
  } catch (error) {
    console.error("Error refreshing token:", error);
    throw error;
  }
};

const logout = () => {
  const dispatch = store.dispatch;

  // Xóa dữ liệu người dùng khỏi Redux store
  dispatch(setInitEmployer());
  dispatch(setInitStudent());
  dispatch(setInitUser());
  dispatch(setInitWeb());

  // Xóa token và dữ liệu xác thực khác
  removeAllToken();
  localStorage.removeItem("tokenExpiryTime");

  // Chuyển hướng người dùng đến trang đăng nhập
  setTimeout(() => {
    // window.location.href = "/login";
  }, 100);
};

instance.interceptors.response.use(
  (response) => (response && response.data ? response.data : response),
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Handle specific HTTP error codes
    if (error.response) {
      switch (error.response.status) {
        case 403:
          window.location.href = "/forbidden";
          return Promise.reject(error);

        case 404:
          if (originalRequest.url.includes("jobs")) {
            console.log(error?.response?.data);
            return error?.response?.data
              ? Promise.reject(error.response.data)
              : Promise.reject(error);
          }
          window.location.href = "/user/404";
          return Promise.reject(error);

        case 500:
          // Có thể ghi log lỗi ở đây nhưng không tự động chuyển hướng
          return Promise.reject(error);

        case 401:
          // Xử lý lỗi unauthorized và refresh token
          if (
            originalRequest._retry ||
            originalRequest.url.includes(REFRESH_ENDPOINT)
          ) {
            // Không thử refresh token nếu đã thử hoặc đang gọi API refresh token
            return logout();
          }

          // Loại trừ endpoint đặc biệt
          if (originalRequest.url.includes("interviews/schedule")) {
            return error?.response?.data
              ? error.response.data
              : Promise.reject(error);
          }

          originalRequest._retry = true;

          // Kiểm tra nếu đang refresh token
          if (isRefreshing) {
            // Thêm request vào hàng đợi để xử lý sau
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then(() => instance(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          // Đánh dấu đang trong quá trình refresh token
          isRefreshing = true;

          try {
            const newTokenData = await refreshToken();

            // Cập nhật header Authorization cho request ban đầu
            if (newTokenData.accessToken) {
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newTokenData.accessToken}`;
            }

            // Xử lý các request trong hàng đợi
            processQueue();

            // Gửi lại request ban đầu với token mới
            return instance(originalRequest);
          } catch (refreshError) {
            // Xử lý lỗi refresh token
            processQueue(refreshError);

            // Đăng xuất và chuyển hướng người dùng
            logout();

            return Promise.reject(refreshError);
          } finally {
            // Đánh dấu đã hoàn thành quá trình refresh token
            isRefreshing = false;
          }
      }
    }

    // Xử lý các lỗi khác
    return error?.response?.data ? error.response.data : Promise.reject(error);
  }
);

// Thêm hàm kiểm tra và tự động refresh token trước khi hết hạn
export const setupTokenRefresh = () => {
  const checkAndRefreshToken = async () => {
    const token = localStorage.getItem("accessToken");
    const expiryTime = localStorage.getItem("tokenExpiryTime");

    if (token && expiryTime) {
      // Nếu token sắp hết hạn trong vòng 5 phút, thực hiện refresh
      const timeToExpiry = parseInt(expiryTime) - Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (timeToExpiry > 0 && timeToExpiry < fiveMinutes && !isRefreshing) {
        try {
          await refreshToken();
          console.log("Token refreshed proactively");
        } catch (error) {
          console.error("Failed to refresh token proactively", error);
        }
      }
    }
  };

  // Kiểm tra token mỗi phút
  const intervalId = setInterval(checkAndRefreshToken, 60 * 1000);

  return () => clearInterval(intervalId);
};

export default instance;
