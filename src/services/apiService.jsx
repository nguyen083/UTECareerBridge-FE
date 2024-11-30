import axios from "../utils/axiosCustomize.jsx";


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
  config = {};
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
const getInfor = async () => {
  getToken();
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
  getToken();
  return axios.post('auth/logout', {}, config);
}

const updateEmployerProfile = async (values) => {
  getToken();
  return axios.post('employers/update-profile', values, config);
}
const updateEmployerCompanyProfile = async (values) => {
  getToken();
  const formData = objectToFormData(values);
  return axios.post('employers/update-company-profile', formData, config);
}

const updateBusinessCertificate = async (values) => {
  getToken();
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
  getToken();
  return axios.post('jobs/job-posting/new-job', values, config);
};
const getAllJobs = async (values) => {
  getToken();
  const formData = objectToFormData(values);
  return axios.get('jobs/employers/all-jobs', formData, config);
};
const getJobsByStatus = async (values) => {
  getToken();
  const params = new URLSearchParams(values).toString();
  return axios.get(`jobs/get-jobs-by-status?${params}`, config);
};
const putHideJob = async (id, status) => {
  getToken();
  const formData = objectToFormData({ jobStatus: status });
  return axios.put(`jobs/employer/job-posting/hide/${id}`, formData, config);
}
const deleteJob = async (id) => {
  getToken();
  return axios.delete(`jobs/employer/job-posting/delete/${id}`, config);
}
const putJob = async (id, values) => {
  getToken();
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

const updateUser = async (id, values) => {
  getToken();
  return axios.put(`users/update-user/${id}`, values, config);
}

const getCompanyById = async (id) => {
  return axios.get(`employers/get-company?id=${id}`);
}
const getAllNotificationById = async (id) => {
  getToken();
  return axios.get(`notifications/user/${id}`, config);
}
const getUserByUserId = async (id) => {
  getToken();
  return axios.get(`users/get-user/${id}`, config);
}
const exportUserToPdf = async (queryParams) => {
  getToken();
  return axios.get('export/users/pdf', {
    params: queryParams,
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  }, config);
};
const getAllJobEmployer = (id, filter) => {
  const params = new URLSearchParams(filter).toString();
  return axios.get(`jobs/employers/${id}/all-jobs?${params}`);
}
const getAllCV = async () => {
  getToken();
  return axios.get(`students/resumes`, config);
}
const applyJob = async (values) => {
  getToken();
  const formData = objectToFormData(values);
  return axios.post('students/jobs/apply', formData, config);
}
const getStatisticsByJobCategory = async (values) => {
  getToken();
  const params = new URLSearchParams(values).toString();
  return axios.get(`admin/statistics/category-job?${params}`, config);
}
const getRevenueByMonth = async (values) => {
  getToken();
  const params = new URLSearchParams(values).toString();
  return axios.get(`admin/statistics/revenue-by-month?${params}`, config);
}
const getStatisticUser = async () => {
  getToken();
  return axios.get('admin/statistics-user', config);
}
const getStatisticPackage = async () => {
  getToken();
  return axios.get('admin/statistics-package', config);
}
const getAllPackages = async () => {
  return axios.get('packages/get-all', config);
}
const addPackageToCart = async (values) => {
  getToken();
  const { packageId, quantity } = values;
  return axios.post(`carts/add-to-cart?packageId=${packageId}&quantity=${quantity}`, {}, config);
};
const getCartByEmployer = async () => {
  getToken();
  return axios.get('carts/get-cart', config);
}
const removePackageFromCart = async (packageId) => {
  getToken();
  return axios.post(`carts/remove?packageId=${packageId}`, config);
}
const getAllCoupon = async (values) => {
  const queryString = new URLSearchParams(values).toString();
  return axios.get(`coupons/get-all?${queryString}`);
}
const updateInforStudent = async (values) => {
  getToken();
  return axios.put('students/update-infor', values, config);
}
const getInforStudent = async () => {
  getToken();
  return axios.get('students/infor', config);
}
const uploadCV = async (values) => {
  getToken();
  return axios.post('students/upload/resumes', values, config);
}
const getSkillStudent = async () => {
  getToken();
  return axios.get('students/skills', config);
}
const addSkillStudent = async (values) => {
  getToken();
  const formData = objectToFormData(values);
  return axios.post('students/skills/add', formData, config);
}
const deleteSkillStudent = async (id) => {
  getToken();
  return axios.delete(`students/skills/delete?skillId=${id}`, config);
}
const deleteCV = async (id) => {
  getToken();
  return axios.delete(`students/resume?resumeId=${id}`, config);
}
const getCVById = async (id) => {
  getToken();
  return axios.get(`${id}`, config);
}
export {
  uploadCV,
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
  getAllUsers,
  getCompanyById,
  getAllNotificationById,
  getUserByUserId,
  exportUserToPdf,
  updateUser,
  getAllJobEmployer,
  getAllCV,
  applyJob,
  getStatisticsByJobCategory,
  getRevenueByMonth,
  getStatisticUser,
  getStatisticPackage,
  getAllPackages,
  addPackageToCart,
  getCartByEmployer,
  removePackageFromCart,
  getAllCoupon,
  updateInforStudent,
  getInforStudent,
  getSkillStudent,
  addSkillStudent,
  deleteSkillStudent,
  deleteCV,
  getCVById
}