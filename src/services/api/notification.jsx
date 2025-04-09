import axios from "../../utils/axiosCustomize.jsx";

const notification = {
    getNotification: (id) => {
        return axios.get(`/notifications/${id}`);
    },
    getNotificationPersonal: (id, params) => {
        return axios.get(`/notifications/user/${id}`, { params });
    },
    getNotificationBroadcast: (params) => {
        return axios.get(`/notifications/user/general-notification`, { params });
    },
    createNotification: (data) => {
        console.log(data);
        return axios.post(`/notifications/broadcast`, data);
    }
}

export default notification;
