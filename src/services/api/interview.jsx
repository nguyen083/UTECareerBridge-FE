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
  evaluateCandidate: async (interviewId, evaluationData) => {
    return axios.post(`/interviews/evaluation`, { ...evaluationData, interviewId });
  },
  getEvaluationsByJobId: async (jobId) => {
    const response = await axios.get(`/interviews/evaluation/job/${jobId}`);
    return response;
  },
  getJobsWithEvaluations: async () => {
    const response = await axios.get(`/jobs/interview-complete`);
    return response;
  },
};
export default interview;
