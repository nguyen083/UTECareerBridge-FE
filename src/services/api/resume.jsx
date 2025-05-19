import axios from "../../utils/axiosCustomize";

const resumeApi = {
  CVAnalyzeApplyJob: async (jobId) => {
    return axios.get(`/cv/job/${jobId}/matching_resumes`);
  },
};

export default resumeApi;
