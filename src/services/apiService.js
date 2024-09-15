import axios from "../utils/axiosCustomize.js";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
};

const studentLogin = async (email, password) => {
  return axios.post('users/login', { email, password });
};
const employerLogin = async (email, password) => {
  return axios.post('employers/login', { email, password });
};
const studentRegister = async (first_name, last_name, gender, dob, phone_number, email, password, retype_password) => {
  console.log(first_name, last_name, gender, dob, phone_number, email, password, retype_password);
  return axios.post('users/register', { first_name, last_name, gender: +gender, dob, phone_number, email, password, retype_password });
};
// const employerRegister = async (form) => {
//   return axios.post('employers/register', form);
// }
const getInfor = async () => {
  return axios.get('employers/company-general-info', config);
}
export { studentLogin, studentRegister, getInfor, employerLogin}