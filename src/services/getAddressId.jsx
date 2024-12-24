import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://api.nosomovo.xyz/',
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
            const resProvince = await this.getNameAddress(wardId);
            if (address && resProvince.data.data.name)
                return `${address}, ${resProvince.data.data.name}`;
            else if (address && !resProvince.data.data.name) {
                return `${address}`;
            } else if (!address && resProvince.data.data.name) {
                return `${resProvince.data.data.name}`;
            }
            else
                return null;
        } catch (error) {
            console.error("Error fetching address information:", error);
            throw error;
        }
    },

    // getAllProvince() {
    //     return axiosInstance.get(`/province/getalllist/193`)
    // },
    // getDistrictByProvinceId(id) {
    //     return axiosInstance.get(`/district/getalllist/${id}`)
    // },
    // getWardByDistrictId(id) {
    //     return axiosInstance.get(`/commune/getalllist/${id}`)
    // },
    getNameAddress(id) {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/5/${id}.htm`)
    },
    getAllProvince() {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/1/0.htm`)
    },
    getDistrictByProvinceId(id) {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`)
    },
    getWardByDistrictId(id) {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/3/${id}.htm`)
    },
}
