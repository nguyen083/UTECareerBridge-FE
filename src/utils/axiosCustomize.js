import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080/api/v1/',
});


//instance.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
const refreshToken = async () => {
    return await axios.post('http://localhost:8080/api/v1/auth/refresh');
}
instance.setToken = (token) => {

    console.log("token: ", token)
    // localStorage.setItem('accessToken', token.accessToken);
    // document.cookie = `refreshToken=${token.refreshToken}`;
}
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
        const rs = await refreshToken();
        instance.setToken(rs.data);
        // console.log(rs.data)
        // originalRequest.headers['Authorization'] = `Bearer ${rs.data.accessToken}`;
        // return instance(originalRequest);
    }
    // Do something with response error
    return error && error.response && error.response.data
        ? error.response.data : Promise.reject(error);
});
export default instance;