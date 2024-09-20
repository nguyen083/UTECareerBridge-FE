import axios from "../utils/axiosCustomize.js";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
};

const studentLogin = async (values) => {
  return axios.post('users/login', values);
};
const employerLogin = async (values) => {
  return axios.post('employers/login', values);
};
const studentRegister = async (values) => {
  console.log(values);
  return axios.post('users/register', values);
};
// const employerRegister = async (form) => {
//   return axios.post('employers/register', form);
// }
const getInfor = async () => {
  return axios.get('employers/company-general-info', config);
}
const userChangePassword = async (token, password) => {
  return axios.post('auth/reset-password', {token, password});
}
const userForgotPassword = async (values) => {
  const formData = new FormData();
  formData.append('email', values.email);
  return axios.post('auth/forgot-password', formData);
}
const logOut = async () => {
  return axios.post('auth/logout', {},config);
}

export { studentLogin, studentRegister, getInfor, employerLogin, userForgotPassword, userChangePassword, logOut }