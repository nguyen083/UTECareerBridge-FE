import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    withCredentials: true, // Always send credentials
});

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//     failedQueue.forEach(prom => {
//         if (error) {
//             prom.reject(error);
//         } else {
//             prom.resolve(token);
//         }
//     });

//     failedQueue = [];
// };

instance.interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

const refreshToken = async () => {
    try {
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
        console.error('Error refreshing token:', error);
        throw error;
    }
};

instance.interceptors.response.use(
    (response) => response && response.data ? response.data : response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            // if (isRefreshing) {
            //     return new Promise((resolve, reject) => {
            //         failedQueue.push({ resolve, reject });
            //     }).then(token => {
            //         originalRequest.headers['Authorization'] = 'Bearer ' + token;
            //         return instance(originalRequest);
            //     }).catch(err => {
            //         return Promise.reject(err);
            //     });
            // }
            // isRefreshing = true;
            originalRequest._retry = true;


            // try {
            const newTokens = await refreshToken();
            localStorage.setItem('accessToken', newTokens.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
            //processQueue(null, newTokens.accessToken);
            return instance(originalRequest);
            // } catch (refreshError) {
            //     processQueue(refreshError, null);
            //     // Handle authentication failure (e.g., redirect to login)
            //     console.error('Failed to refresh token. User may need to re-authenticate.');
            //     // You might want to redirect to login page or clear tokens here
            //     localStorage.removeItem('accessToken');
            //     // window.location = '/login'; // Uncomment if you want to redirect to login page
            //     return Promise.reject(refreshError);
            // } finally {
            //     isRefreshing = false;
            // }
        }

        return error && error.response && error.response.data
            ? error.response.data : Promise.reject(error);
    }
);
export default instance;