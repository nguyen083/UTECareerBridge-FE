import axios from "../../utils/axiosCustomize.jsx";

const notification = {
    getNotification: (params) => {
        return axios.get(`/notifications`, { params });
    }
}

export default notification;
