import axios from "../../utils/axiosCustomize.jsx";

const forum = {
  getAllForumActive: async (params) => {
    return axios.get("forums/active", { params });
  },
  getAllForum: async (params) => {
    return axios.get("forums", { params });
  },
  searchForum: async (params) => {
    return axios.get("forums/search", { params });
  },
  getDetailById: async (id) => {
    return axios.get(`forums/${id}`);
  },
  createForum: async (params) => {
    return axios.post("forums", params);
  },
  updateForum: async (id, params) => {
    return axios.put(`forums/${id}`, params);
  },
  deleteForum: async (id) => {
    return axios.delete(`forums/${id}`);
  },
};
export default forum;
