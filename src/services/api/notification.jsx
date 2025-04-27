import axios from "../../utils/axiosCustomize.jsx";

const notification = {
  getAllNotification: (id) => {
    return axios.get(`/notifications/user/${id}`);
  },
  getNotificationById: (id) => {
    return axios.get(`/notifications/${id}`);
  },
  getNotificationPersonal: (id, params) => {
    return axios.get(`/notifications/personal/user/${id}`, { params });
  },
  getNotificationBroadcast: (params) => {
    return axios.get(`/notifications/user/general-notification`, { params });
  },
  createNotification: (data) => {
    console.log(data);
    return axios.post(`/notifications/broadcast`, data);
  },
  readNotification: (id) => {
    return axios.put(`/notifications/${id}/read`);
  },
  readAllNotification: (id) => {
    return axios.put(`/notifications/user/${id}/read`);
  },
  countNotification: (id) => {
    return axios.get(`/notifications/user/${id}/count`);
  },
  createJobAlert: (data) => {
    return axios.post(`/job-alerts`, data);
  },
  getJobAlerts: (params) => {
    return axios.get(`/job-alerts/user`, { params });
  },
  getJobAlertById: (alertId) => {
    return axios.get(`/job-alerts/${alertId}`);
  },
  updateJobAlert: (alertId, data) => {
    return axios.put(`/job-alerts/${alertId}`, data);
  },
  deleteJobAlert: (alertId) => {
    return axios.delete(`/job-alerts/${alertId}`);
  },
};

export default notification;
