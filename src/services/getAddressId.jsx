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
    async getInforAddress(address, provinceId, districtId, wardId) {
        try {
            const resProvince = await axiosInstance.get(`/province/getdetail/${provinceId}`);
            const provinceName = resProvince.data.name;

            const resDistrict = await axiosInstance.get(`/district/getdetail/${districtId}`);
            const districtName = resDistrict.data.name;

            const resWard = await axiosInstance.get(`/commune/getdetail/${wardId}`);
            const wardName = resWard.data.name;

            return `${address}, ${wardName}, ${districtName}, ${provinceName}`;
        } catch (error) {
            console.error("Error fetching address information:", error);
            throw error;
        }
    },
    // getAllFolk() {
    //     return axiosInstance.get(`/ethnic/getalllist/`)
    // },
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
