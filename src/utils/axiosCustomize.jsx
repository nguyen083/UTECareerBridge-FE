import axios from "axios";
import { store } from "../redux/store"; // Import the Redux store directly
import { setInitEmployer } from "../redux/action/employerSlice";
import { setInitStudent } from "../redux/action/studentSlice";
import { setInitUser } from "../redux/action/userSlice";
import { removeAllToken } from "../services/apiService";
import { setInitWeb } from "../redux/action/webSlice";

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
    console.log("Refreshing token...");
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
    console.log("Error refreshing token - redirecting to login");
    throw error;
  }
};

// Function to handle logout and reset state
const handleLogout = () => {
  // Use store.dispatch directly instead of the useDispatch hook
  store.dispatch(setInitEmployer());
  store.dispatch(setInitStudent());
  store.dispatch(setInitUser());
  removeAllToken();
  store.dispatch(setInitWeb());

  // Redirect to login page
  window.location = "/login";
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
      // Handle 500 error without redirecting
      return Promise.reject(error);
    }

    if (error.response?.status === 404) {
      window.location = "/user/404";
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Exclude interviews/schedule endpoint
      if (originalRequest.url.includes("interviews/schedule")) {
        return error?.response?.data
          ? error.response.data
          : Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, add request to queue
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

        // Process queued requests
        processQueue();
        isRefreshing = false;

        return instance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;

        // Handle failed refresh - logout user
        handleLogout();

        return Promise.reject(refreshError);
      }
    }

    return error?.response?.data ? error.response.data : Promise.reject(error);
  }
);

export default instance;
