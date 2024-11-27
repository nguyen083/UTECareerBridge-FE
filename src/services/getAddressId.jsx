import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.nosomovo.xyz/',
    withCredentials: false,
});
export const apiService = {
    getProvinceNameById(id) {
        return axiosInstance.get(`/province/getdetail/${id}`)
    },
    getDistrictNameById(id) {
        return axiosInstance.get(`/district/getdetail/${id}`)
    },
    getWardNameById(id) {
        return axiosInstance.get(`/commune/getdetail/${id}`)
    },
    getAllFolk() {
        return axiosInstance.get(`/ethnic/getalllist/`)
    },
    getAllProvince() {
        return axiosInstance.get(`/province/getalllist/193`)
    },
    getDistrictByProvinceId(id) {
        return axiosInstance.get(`/district/getalllist/${id}`)
    },
    getWardByDistrictId(id) {
        return axiosInstance.get(`/commune/getalllist/${id}`)
    },
}
