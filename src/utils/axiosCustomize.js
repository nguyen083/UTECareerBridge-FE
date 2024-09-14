import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/'
});


//instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
const refreshToken = async () => {
    console.log("refreshToken")
    try {
        const response = await instance.post(
            'auth/refresh', 
            {}, // Nếu API không yêu cầu body, có thể để object rỗng
            {
                withCredentials: true, // Cho phép gửi cookie cùng với request
                headers: {
                    'Content-Type': 'application/json', // Định dạng yêu cầu là JSON
                    // Các headers khác nếu có yêu cầu
                }
            }
        );
        
        console.log('Response:', response);
    } catch (error) {
        console.error('Error refreshing token:', error);
    }
};
// instance.setToken = (token) => {

//     console.log("token: ", token)
//     // localStorage.setItem('accessToken', token.accessToken);
//     // document.cookie = `refreshToken=${token.refreshToken}`;
// }
// Add a response interceptor
instance.interceptors.response.use(function (response) {
    
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response && response.data ? response.data : response;
}, async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("error: ", error)
        await refreshToken();
    //     //instance.setToken(rs.data);
        //console.log("token: ", rs)
        // originalRequest.headers['Authorization'] = `Bearer ${rs.data.accessToken}`;
        // return instance(originalRequest);
    }
    // Do something with response error
    return error && error.response && error.response.data
        ? error.response.data : Promise.reject(error);
});
export default instance;