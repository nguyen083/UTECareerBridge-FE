import axios from "../../utils/axiosCustomize";

const reaction = {
  getReactionByPostId: async (postId) => {
    return axios.get(`/posts/${postId}/reactions`, {
      params: { page: 0, size: 10000 },
    });
  },
  getCountReactionByPostId: async (postId) => {
    return axios.get(`/posts/${postId}/reactions/count`);
  },
  getReactionByUserId: async (postId) => {
    return axios.get(`/posts/${postId}/reactions/me`);
  },
  createReaction: async (postId, reaction) => {
    return axios.post(`/posts/${postId}/reactions`, reaction);
  },
  deleteReaction: async (postId) => {
    return axios.delete(`/posts/${postId}/reactions`);
  },
};

export default reaction;
