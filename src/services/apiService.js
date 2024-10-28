import axios from "../utils/axiosCustomize.js";

let config = {};
const setToken = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  document.cookie = `refreshToken=${refreshToken}`;
}
const objectToFormData = (obj) => {
  const formData = new FormData();
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      formData.append(key, obj[key]);
    }
  }
  return formData;
};
const getToken = () => {
  config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  };
};

const removeToken = () => {
  localStorage.removeItem('accessToken');
  document.cookie = 'refreshToken=';
}


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
const userResetPassword = async (token, password) => {
  return axios.post('auth/reset-password', { token, password });
}
const userForgotPassword = async (values) => {
  const formData = new FormData();
  formData.append('email', values.email);
  return axios.post('auth/forgot-password', formData);
}
const getAllIndustry = async () => {
  return axios.get('industries/get-all-industries');
}
const getAllBenefit = async () => {
  return axios.get('benefits/get-all-benefits');
}
const logOut = async () => {
  return axios.post('auth/logout', {}, config);
}

const updateEmployerProfile = async (values) => {
  return axios.post('employers/update-profile', values, config);
}
const updateEmployerCompanyProfile = async (values) => {
  const formData = objectToFormData(values);
  return axios.post('employers/update-company-profile', formData, config);
}

const updateBusinessCertificate = async (values) => {
  const formData = objectToFormData(values);
  return axios.post('employers/legal-info', formData, config);
}
const getAllJobCategories = async () => {
  return axios.get('job-categories/get-all-job-categories');
};
const getAllJobLevels = async () => {
  return axios.get('job-levels/get-all-job-levels');
}
const getAllSkills = async () => {
  return axios.get('skills/get-all-skills');
};
const postJob = async (values) => {
  return axios.post('jobs/job-posting/new-job', values, config);
};
const getAllJobs = async (values) => {
  const formData = objectToFormData(values);
  return axios.get('jobs/employers/all-jobs', formData, config);
};
const getJobsByStatus = async (values) => {
  const params = new URLSearchParams(values).toString();
  return axios.get(`jobs/get-jobs-by-status?${params}`, config);
};
const putHideJob = async (id, status) => {
  const formData = objectToFormData({ jobStatus: status });
  return axios.put(`jobs/employer/job-posting/hide/${id}`, formData, config);
}
const deleteJob = async (id) => {
  return axios.delete(`jobs/employer/job-posting/delete/${id}`, config);
}
const putJob = async (id, values) => {
  return axios.put(`jobs/employer/job-posting/${id}`, values, config);
}
const getJobById = async (id) => {
  return axios.get(`jobs/${id}`);
}
const getSimilarJob = async (id) => {
  return axios.get(`jobs/similar-jobs/${id}`);
}

const getAllUsers = async (values) => {
  getToken();
  const params = new URLSearchParams(values).toString();
  return axios.get(`users/get-all-users?${params}`, config);
};
export {
  getToken,
  setToken,
  removeToken,
  studentLogin,
  studentRegister,
  getInfor,
  employerLogin,
  userForgotPassword,
  userResetPassword,
  logOut,
  getAllIndustry,
  getAllBenefit,
  updateEmployerProfile,
  updateBusinessCertificate,
  updateEmployerCompanyProfile,
  getAllJobCategories,
  getAllJobLevels,
  getAllSkills,
  postJob,
  getAllJobs,
  getJobsByStatus,
  putHideJob,
  deleteJob,
  putJob,
  getJobById,
  getSimilarJob,
  getAllUsers
}