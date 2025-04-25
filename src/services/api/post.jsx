import axios from "../../utils/axiosCustomize";

const post = {
  getAllPosts: async (params) => {
    return axios.get(`/posts`, { params });
  },
  getById: async (id) => {
    return axios.get(`/posts/${id}`);
  },
  getByTopicId: async (topicId, params) => {
    return axios.get(`/posts/topic/${topicId}`, { params });
  },
  getByUserId: async (userId, params) => {
    return axios.get(`/posts/user/${userId}`, { params });
  },
  getSearch: async (params) => {
    return axios.get(`/posts/search`, { params });
  },
  createPost: async (post) => {
    return axios.post(`/posts`, post);
  },
  updatePost: async (id, post) => {
    return axios.put(`/posts/${id}`, post);
  },
  deletePost: async (id) => {
    return axios.delete(`/posts/${id}`);
  },
};

export default post;
