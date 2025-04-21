import axios from "../../utils/axiosCustomize.jsx";

const forum = {
  getAllForumActive: async (params) => {
    const response = await axios.get("forums/active", { params });
    return response;
  },
  getAllForum: async (params) => {
    const response = await axios.get("forums", { params });
    return response;
  },
  searchForum: async (params) => {
    const response = await axios.get("forums/search", { params });
    return response;
  },
};
export default forum;
