import axios from "../../utils/axiosCustomize.jsx";
const interview = {
    createInterview: async (data) => {
        const response = await axios.post(`/interviews/schedule`, data);
        return response;
    },
    getListInterviewEmployer: async () => {
        const response = await axios.get(`/interviews/employers/calendar`);
        return response;
    }
}
export default interview;
