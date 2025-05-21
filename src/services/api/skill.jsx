import axios from "../../utils/axiosCustomize.jsx";

const skill = {
  getTopStudentSkill: async () => {
    return axios.get("/jobs/top-student-skills");
  },
  getTopSkill: async (params) => {
    return axios.get("/jobs/top-skills", { params });
  },
};

export default skill;
