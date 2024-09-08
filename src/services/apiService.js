import axios from "../utils/axiosCustomize.js";

const studentLogin = async(email, password) => {    
    return axios.post('users/login', {email : email, password: password});
  };
const studentRegister = async(first_name, last_name,gender, dob, phone_number, email, password, retype_password) => {
    console.log(first_name, last_name, gender, dob, phone_number, email, password, retype_password);
    return axios.post('users/register', {first_name, last_name,gender, dob, phone_number, email, password, retype_password});
};
  export { studentLogin, studentRegister}