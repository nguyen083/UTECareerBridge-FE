
import axios from "../../utils/axiosCustomize.jsx";
const student = {
    getInformationByResumeId: async (id) => {
        return axios.get(`employers/student-application/detail/${id}`);
    }
}
export default student;