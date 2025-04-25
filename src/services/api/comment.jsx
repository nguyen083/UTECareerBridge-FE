import axios from "../../utils/axiosCustomize.jsx";

const comment = {
  getCommentsRootByPostId: async (postId, params) => {
    return axios.get(`comments/post/${postId}/root`, { params });
  },
  getCommentChildrenByCommentId: async (commentId, params) => {
    return axios.get(`comments/${commentId}/children`, { params });
  },
  createComment: async (comment) => {
    return axios.post(`/comments`, comment);
  },
  updateComment: async (commentId, comment) => {
    return axios.put(`/comments/${commentId}`, comment);
  },
  deleteComment: async (commentId) => {
    return axios.delete(`/comments/${commentId}`);
  },
};

export default comment;
