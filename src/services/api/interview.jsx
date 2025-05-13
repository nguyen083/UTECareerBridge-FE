import axios from "../../utils/axiosCustomize.jsx";
const interview = {
  createInterview: async (data) => {
    return axios.post(`/interviews/schedule`, data);
  },
  getListInterviewEmployer: async (params) => {
    return axios.get(`/interviews/employers/calendar`, { params });
  },
  updateStatus: async (interviewId, status) => {
    return axios.put(`/interviews/${interviewId}/status?status=${status}`);
  },
  getInterviewById: async (id) => {
    return axios.get(`/interviews/${id}`);
  },
  submitEvaluation: async (data) => {
    return axios.post(`/interviews/${data.interviewId}/evaluation`, data);
  },
  countInterview: async () => {
    return axios.get(`employers/count-interview`);
  },
  evaluateCandidate: async (interviewId, evaluationData) => {
    return axios.post(`/interviews/evaluation`, {
      ...evaluationData,
      interviewId,
    });
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
