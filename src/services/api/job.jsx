import axios from "../../utils/axiosCustomize.jsx";
const job = {
  getRecommendJob: async (userId) => {
    return axios.get(`/recommendations/jobs/${userId}`);
  },
  getJobSaved: async () => {
    return axios.get(`/students/jobs/saved`);
  },
  getRecruimentAverage: async () => {
    return axios.get(`/jobs/recruiment-average`);
  },
  getRecruimentPerformance: async () => {
    return axios.get(`jobs/recruitment-performance`);
  },
};
export default job;
