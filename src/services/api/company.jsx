import axios from "../../utils/axiosCustomize.jsx";

const company = {
  getCompanyById: (id) => {
    return axios.get(`employers/get-company?id=${id}`);
  },
  getAllCompanyforStudent: (params) => {
    return axios.get(`employers/get-all-company`, { params });
  },
};
export default company;
