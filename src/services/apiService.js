import axios from "../utils/axiosCustomize.js";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
};

const studentLogin = async (values) => {
  return axios.post('users/login', values);
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
const userChangePassword = async (token, password) => {
  return axios.post(`auth/reset-password?token=${token}&password=${password}`);
}
const userForgotPassword = async (values) => {
  const formData = new FormData();
  formData.append('email', values.email);
  return axios.post('auth/forgot-password', formData);
}


export { studentLogin, studentRegister, getInfor, employerLogin, userForgotPassword, userChangePassword }