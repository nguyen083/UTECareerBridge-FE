import axios from "../utils/axiosCustomize.js";

const postStudentLogin = async(email, password) => {    

    return axios.post('students/login', {email : email, password: password});
  };
const postStudentRegister = async(first_name, last_name, phone_number, email, password, retype_password) => {
    return axios.post('students/register', {first_name, last_name, phone_number, email, password, retype_password});
};
  export { postStudentLogin, postStudentRegister}