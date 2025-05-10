import axios from "../../utils/axiosCustomize.jsx";

const about = {
  getAbout: async () => {
    return axios.get("/statistical/about");
  },
};

export default about;
