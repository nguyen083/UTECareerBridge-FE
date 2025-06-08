import axios from "../../utils/axiosCustomize.jsx";

const meeting = {
  getToken: async (params) => {
    return axios.get(`/zegocloud/token`, { params });
  },
};
export default meeting;
