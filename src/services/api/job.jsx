import axios from "../../utils/axiosCustomize.jsx";
const job = {
  getRecommendJob: async (userId) => {
    const response = await axios.get(`/recommendations/jobs/${userId}`);
    return response.data;
  },
};
export default job;
