import axios from "../utils/axiosCustomize.js";

const sendRequest = async (email, password) => {    

    return axios.post('students/login', {email : email, password: password});
  };

  export { sendRequest}