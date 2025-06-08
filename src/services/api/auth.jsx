import axios from "../../utils/axiosCustomize.jsx";


const auth = {
    loginGoogle: async (role) => {
        return axios.get(`users/auth/social-login?login_type=google&role=${role}`);
    },
    sendCodeToBE: async (data) => {
        const urlParam = new URLSearchParams(data);
        return axios.get(`users/auth/social/callback?${urlParam}`);
    }
}
export default auth;