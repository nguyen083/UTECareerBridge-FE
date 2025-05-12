import axios from "../../utils/axiosCustomize.jsx";

const employerDashboard = {
  getActivityStats: async () => {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    return axios.get(`/jobs/activity-stats?month=${month}&year=${year}`);
  },
};

export default employerDashboard;
