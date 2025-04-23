import axios from "../../utils/axiosCustomize.jsx";

const topic = {
  getAllTopic: async (params) => {
    return axios.get("topics", { params });
  },
  getByForumId: async (id, params) => {
    return axios.get(`topics/forum/${id}`, { params });
  },
  searchTopic: async (params) => {
    return axios.get("topics/search", { params });
  },
  getDetailById: async (id) => {
    return axios.get(`topics/${id}`);
  },
  getByUserId: async (id) => {
    return axios.get(`topics/user/${id}`);
  },
  createTopic: async (params) => {
    return axios.post("topics", params);
  },
  updateTopic: async (id, params) => {
    return axios.put(`topics/${id}`, params);
  },
  deleteTopic: async (id) => {
    return axios.delete(`topics/${id}`);
  },
};
export default topic;
