import axios from "../../utils/axiosCustomize.jsx";
const interview = {
  createInterview: async (data) => {
    const response = await axios.post(`/interviews/schedule`, data);
    return response;
  },
  getListInterviewEmployer: async () => {
    const response = await axios.get(`/interviews/employers/calendar`);
    return response;
  },
  updateStatus: async (interviewId, status) => {
    return axios.put(`/interviews/${interviewId}/status?status=${status}`);
  },
  getInterviewById: async (id) => {
    const response = await axios.get(`/interviews/${id}`);
    return response;
  },
  submitEvaluation: async (data) => {
    const response = await axios.post(
      `/interviews/${data.interviewId}/evaluation`,
      data
    );
    return response;
  },
};
export default interview;
