import axios from "../utils/axiosCustomize.jsx";



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
  return axios.post('users/register', values);
};
const getInfor = async () => {

  return axios.get('employers/company-general-info');
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

  return axios.post('auth/logout', {});
}

const updateEmployerProfile = async (values) => {

  return axios.post('employers/update-profile', values);
}
const updateEmployerCompanyProfile = async (values) => {

  const formData = objectToFormData(values);
  return axios.post('employers/update-company-profile', formData);
}

const updateBusinessCertificate = async (values) => {

  const formData = objectToFormData(values);
  return axios.post('employers/legal-info', formData);
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

  return axios.post('jobs/job-posting/new-job', values);
};
const getAllJobs = async (values) => {

  const formData = objectToFormData(values);
  return axios.get('jobs/employers/all-jobs', formData);
};
const getJobsByStatus = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`jobs/get-jobs-by-status?${params}`);
};
const putHideJob = async (id, status) => {

  const formData = objectToFormData({ jobStatus: status });
  return axios.put(`jobs/employer/job-posting/hide/${id}`, formData);
}
const deleteJob = async (id) => {

  return axios.delete(`jobs/employer/job-posting/delete/${id}`);
}
const putJob = async (id, values) => {

  return axios.put(`jobs/employer/job-posting/${id}`, values);
}
const getJobById = async (id, status = 'ACTIVE') => {
  status = status ?? 'ACTIVE';
  return axios.get(`jobs/${id}?status=${status}`);
}
const getSimilarJob = async (id) => {
  return axios.get(`jobs/similar-jobs/${id}`);
}

const getAllUsers = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`users/get-all-users?${params}`);
};

const updateUser = async (id, values) => {

  return axios.put(`users/update-user/${id}`, values);
}

const getCompanyById = async (id) => {
  return axios.get(`employers/get-company?id=${id}`);
}
const getAllNotificationById = async (id) => {

  return axios.get(`notifications/user/${id}`);
}
const getUserByUserId = async (id) => {

  return axios.get(`users/get-user/${id}`);
}
const exportUserToPdf = async (queryParams) => {

  return axios.get('export/users/pdf', {
    params: queryParams,
    responseType: 'blob',
    headers: {
      'Accept': 'application/pdf'
    }
  });
};
const getAllJobEmployer = (id, filter) => {
  const params = new URLSearchParams(filter).toString();
  return axios.get(`jobs/employers/${id}/all-jobs?${params}`);
}
const getAllCV = async () => {

  return axios.get(`students/resumes`);
}
const applyJob = async (values) => {

  const formData = objectToFormData(values);
  return axios.post('students/jobs/apply', formData);
}
const getStatisticsByJobCategory = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`admin/statistics/category-job?${params}`);
}
const getRevenueByMonth = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`admin/statistics/revenue-by-month?${params}`);
}
const getStatisticUser = async () => {

  return axios.get('admin/statistics-user');
}
const getStatisticPackage = async () => {

  return axios.get('admin/statistics-package');
}
const getAllPackages = async () => {
  return axios.get('packages/get-all');
}
const addPackageToCart = async (values) => {

  const { packageId, quantity } = values;
  return axios.post(`carts/add-to-cart?packageId=${packageId}&quantity=${quantity}`, {});
};
const getCartByEmployer = async () => {

  return axios.get('carts/get-cart');
}
const removePackageFromCart = async (packageId) => {

  return axios.post(`carts/remove?packageId=${packageId}`);
}
const getAllCoupon = async (values) => {
  const queryString = new URLSearchParams(values).toString();
  return axios.get(`coupons/get-all?${queryString}`);
}
const updateInforStudent = async (values) => {

  return axios.put('students/update-infor', values);
}
const getInforStudent = async () => {

  return axios.get('students/infor');
}
const uploadCV = async (values) => {

  return axios.post('students/upload/resumes', values);
}
const getSkillStudent = async () => {

  return axios.get('students/skills');
}
const addSkillStudent = async (values) => {

  const formData = objectToFormData(values);
  return axios.post('students/skills/add', formData);
}
const deleteSkillStudent = async (id) => {

  return axios.delete(`students/skills/delete?skillId=${id}`);
}
const deleteCV = async (id) => {

  return axios.delete(`students/resume?resumeId=${id}`);
}
const getCVById = async (id) => {

  return axios.get(`students/resumes/${id}`);
}
const updateFindjob = async (values) => {

  return axios.put(`students/is-finding-job?isFindingJob=${values}`, {});
}
const updateResumeActive = async (id) => {

  return axios.put(`students/resume/${id}`, {});
}
const getAllCompany = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`employers/get-all-employers?${params}`);
}
const approveCompany = async (id) => {

  return axios.put(`employers/admin/${id}/legal-info/approve`, {});
}
const rejectCompany = async (id, values) => {

  return axios.put(`employers/admin/${id}/legal-info/reject`, values);
}
const getAllPostByAdmin = async (values) => {

  const params = new URLSearchParams(values).toString();
  return axios.get(`jobs/admin/all-jobs?${params}`);
}
const approvePost = async (id) => {

  return axios.put(`jobs/admin/job-approval/approve/${id}`, {});
}
const rejectPost = async (id, values) => {

  return axios.put(`jobs/admin/job-approval/reject/${id}`, values);
}
const getApplyJobByJobId = async (id, status) => {

  const params = new URLSearchParams({ status }).toString();
  return axios.get(`employers/student-application/${id}?${params}`);
}
const getApplyJobByStudent = async () => {

  return axios.get(`students/jobs`);
}
const convertStatus = async (id, status) => {

  return axios.put(`employers/application/${id}`, { status });
}
const getCVByEmployer = async (id) => {

  return axios.get(`employers/student-application/detail/${id}`);
}
const searchJob = async (values) => {
  const params = new URLSearchParams(values).toString();
  console.log("params: ", params);
  return axios.get(`jobs/search?${params}`);
}
const followCompany = async (id) => {

  return axios.post(`students/follow/${id}`, {});
}
const unfollowCompany = async (id) => {
  return axios.delete(`students/unfollow/${id}`, {});
}
const getFollowCompany = async () => {
  return axios.get(`students/get-all-followed-employers`);
}
const checkSaveJob = async (id) => {
  return axios.get(`students/jobs/check?jobId=${id}`);
}
const saveJob = async (id) => {
  return axios.post(`students/jobs/saved/${id}`, {});
}
const unSaveJob = async (id) => {
  return axios.delete(`students/jobs/unsaved/${id}`, {});
}
const getJobSaved = async () => {
  return axios.get(`students/jobs/saved`);
}
const checkFollowCompany = async (id) => {
  return axios.get(`students/follow/company?companyId=${id}`);
}
const getAllApplicantByCategoryId = async (id) => {
  return axios.get(`students/students-finding-job/${id}`);
}
const getAds = async () => {
  return axios.get('employers/top-company');
}
const getJobUrgent = async () => {
  return axios.get('jobs/recruitment-urgent');
}
const changePassword = async (values) => {
  return axios.post('users/update-password', values);
}
const getJobsNewest = async () => {
  return axios.get(`jobs/search?keyword=&page=0&limit=30&sorting=newest`);
}
export {
  uploadCV,
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
  getCVById,
  updateFindjob,
  updateResumeActive,
  getAllCompany,
  approveCompany,
  rejectCompany,
  getAllPostByAdmin,
  approvePost,
  rejectPost,
  getApplyJobByJobId,
  getApplyJobByStudent,
  convertStatus,
  getCVByEmployer,
  searchJob,
  followCompany,
  unfollowCompany,
  getFollowCompany,
  checkSaveJob,
  saveJob,
  unSaveJob,
  getJobSaved,
  checkFollowCompany,
  getAllApplicantByCategoryId,
  getAds,
  getJobUrgent,
  changePassword,
  getJobsNewest
}