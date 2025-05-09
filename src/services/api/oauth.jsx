import axios from "../../utils/axiosCustomize.jsx";

const oauth = {
    getGoogleCalendar: async ({ code, state }) => {
        return axios.get(`oauth/callback`, { params: { code, state } });
    }
}

export default oauth;
