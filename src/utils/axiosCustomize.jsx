import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
    withCredentials: true, // Always send credentials
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
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

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            // Redirect to forbidden/unauthorized page
            window.location = '/forbidden'; // or '/unauthorized', depending on your route setup
            return Promise.reject(error);
        }
        // if (error.response?.status === 500) {
        //     // Redirect to not found page
        //     window.location = '/user/500';
        //     return Promise.reject(error);
        // }
        if (error.response?.status === 404) {
            window.location = '/user/404';
            return Promise.reject(error);
        }
        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newTokens = await refreshToken();
                localStorage.setItem('accessToken', newTokens.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${newTokens.accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                // Handle authentication failure
                console.error('Failed to refresh token. User may need to re-authenticate.');
                localStorage.removeItem('accessToken');
                window.location = '/login';
                return Promise.reject(refreshError);
            }
        }

        return error?.response?.data
            ? error.response.data
            : Promise.reject(error);
    }
);

export default instance;