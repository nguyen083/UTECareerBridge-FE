import axios from "../../utils/axiosCustomize.jsx";

const studentDashboard = {
  getJobStatistics: async () => {
    return axios.get("/students/job-statistics");
  },
  getEventStatistics: async () => {
    return axios.get("/admin/events/upcoming");
  },
  getActivityStatistics: async () => {
    return axios.get("/students/activity");
  },
};
export default studentDashboard;
