import { wait } from "@testing-library/user-event/dist/utils/index.js";
import axios from "../utils/axiosCustomize.js";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
};

const studentLogin = async (email, password) => {
  return axios.post('users/login', { email, password }, config);
};
const studentRegister = async (first_name, last_name, gender, dob, phone_number, email, password, retype_password) => {
  console.log(first_name, last_name, gender, dob, phone_number, email, password, retype_password);
  return axios.post('users/register', { first_name, last_name, gender: +gender, dob, phone_number, email, password, retype_password });
};
export { studentLogin, studentRegister }