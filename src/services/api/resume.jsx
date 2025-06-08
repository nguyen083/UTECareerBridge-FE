import axios from "../../utils/axiosCustomize";

const resumeApi = {
  CVAnalyzeApplyJob: async (jobId, limit) => {
    return axios.get(`/cv/job/${jobId}/matching_resumes?limit=${limit}`);
  },
};

export default resumeApi;
