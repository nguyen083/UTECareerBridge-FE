// import axios from "../utils/axiosCustomize.js";
import axios from 'axios';

const sendRequest = async (email, password) => {    

    return axios.post('http://localhost:8080/students/login', {email : email, password: password});
  };

  export { sendRequest}