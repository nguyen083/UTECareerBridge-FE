import axios from 'axios';
import { store } from '../redux/store';
import { setInitEmployer } from '../redux/action/employerSlice';
import { setInitStudent } from '../redux/action/studentSlice';
import { setInitUser } from '../redux/action/userSlice';
import {removeAllToken} from '../services/apiService';

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
        console.log('Refreshing token...');
        const response = await axios.post(
            'http://localhost:8080/api/v1/auth/refresh',
            {},
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return response.data;
    } catch (error) {
        console.log('Error refreshing token - redirecting to login');
        // Import store directly to ensure it's available
        const { store } = require('../redux/store');
        // Reset all user data
        store.dispatch(require('../redux/action/employerSlice').setInitEmployer());
        store.dispatch(require('../redux/action/studentSlice').setInitStudent());
        store.dispatch(require('../redux/action/userSlice').setInitUser());
        // Remove tokens
        require('../services/apiService').removeAllToken();
        // Redirect to login - using setTimeout to ensure this runs after the current execution context
        setTimeout(() => {
            window.location = '/login';
        }, 100);
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
    // if (error.response?.status === 500) {
    //   // Redirect to not found page
    //   window.location = "/user/500";
    //   return Promise.reject(error);
    // }
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

            try {
                const newTokens = await refreshToken();
                localStorage.setItem('accessToken', newTokens.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
                
                // Xử lý các request trong hàng đợi
                processQueue();
                isRefreshing = false;
                
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                isRefreshing = false;
                // Directly redirect to login without showing error message
                store.dispatch(setInitEmployer());
                store.dispatch(setInitStudent());
                store.dispatch(setInitUser());
                removeAllToken();
                window.location = '/login';
                return Promise.reject(refreshError);
            }
        }

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
