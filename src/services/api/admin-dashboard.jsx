import axios from "../../utils/axiosCustomize";

const adminDashboard = {
  getStatisticsByCategory: async (params) => {
    return axios.get("/admin/statistics/category-job", { params }); // thống kê số lượng job theo category
  },
  //   getRevenueByMonth: async (params) => {
  //     return axios.get("/admin/statistics/revenue-by-month", { params }); // thống kê doanh thu theo tháng
  //   },
  //   getStatistic: async () => {
  //     return axios.get("/admin/statistics-user"); // thống kê người dùng
  //   },
  getRecentOrders: async (params) => {
    return axios.get("/admin/recent-orders", { params }); // danh sách đơn hàng
  },
  getJobStatistics: async (params) => {
    return axios.get("/admin/jobs-statistics", { params }); //thống kê jobjob
  },
  getUserStats: async (params) => {
    return axios.get("/admin/users-statistics", { params }); //thống kê người dùng
  },
  getStatsTopSkills: async (params) => {
    return axios.get("/admin/top-requested-skills", { params }); //kỹ năng được yêu cầu nhiều nhất
  },
  getTopEmployer: async (params) => {
    return axios.get("/admin/top-employers", { params }); //danh sách nhà tuyển dụng hàng đầu
  },
  getApplicationStats: async (params) => {
    return axios.get("/admin/application-statistics", { params }); //thống kê đơn ứng tuyển
  },
  getForumStats: async (params) => {
    return axios.get("/admin/forum-statistics", { params }); //thống kê diễn đàn
  },
};
export default adminDashboard;
