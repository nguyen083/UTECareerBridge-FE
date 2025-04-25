import axios from "../../utils/axiosCustomize";

const tag = {
  getTags: async () => {
    const params = { page: 0, size: 1000 };
    return axios.get("tags", { params });
  },
  createTag: async (data) => {
    return axios.post("tags", data);
  },
};

export default tag;
