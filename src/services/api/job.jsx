import axios from "../../utils/axiosCustomize.jsx";
const job = {
  getRecommendJob: async (userId) => {
    return axios.get(`/recommendations/jobs/${userId}`);
  },
  getJobSaved: async () => {
    return axios.get(`/students/jobs/saved`);
  },
};
export default job;
