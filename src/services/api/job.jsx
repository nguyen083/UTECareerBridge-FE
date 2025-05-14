import axios from "../../utils/axiosCustomize.jsx";
const job = {
  getJobDetail: async (jobId) => {
    return axios.get(`/jobs/${jobId}?status=ACTIVE`);
  },

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
