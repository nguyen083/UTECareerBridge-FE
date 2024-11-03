import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Student/HomePage.js';
import HomePage from './components/Student/HomePage.js';
import JobPage from './components/Student/JobPage.js';
import EmployerPage from './components/Employer/EmployerPage.js';
import FavoritePage from './components/Student/FavoritePage.js';
import DashBoard from './components/Employer/DashBoard/DashBoard.js';
import RegisterPage from './components/Student/RegisterPage.js';
import LoginPage from './components/Employer/LoginPage.js';
import EmployerRegister from './components/Employer/EmployerRegister.js';
import ForgotPassword from './components/Generate/ForgotPassword.js';
import ResetPassword from './components/Generate/ResetPassword.js';
import BackgroundAndForm from './components/Generate/BackgroundAndForm.js';
import EmployerLayout from './components/Employer/EmployerLayout.js';
import EmployerProfile from './components/Employer/Profile/EmployerProfile.js';
import EmployerCompany from './components/Employer/Company/EmployerCompany.js';
import EmployerChangePassword from './components/Employer/ChangePassword/EmployerChangePassword.js';
import BusinessCertificate from './components/Employer/Company/BusinessCertificate.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import Page404 from './components/User/Page404';
import Page403 from './components/User/Page403';
import Page500 from './components/User/Page500';
import EmployerPostJob from './components/Employer/Post/EmployerPostJob.js';
import ManageListJobs from './components/Employer/ListJob/ManageListJobs.js';
import UpdateJob from './components/Employer/ListJob/UpdateJob.js';
import ViewJob from './components/User/ViewJob.js';
import InforCompany from './components/User/InforCompany.js';
import AdminLayout from './components/Admin/adminLayout.jsx';
import UserManagement from './components/Admin/ManageUser/ManageStudent.jsx';
import ManageListEmployer from './components/Admin/ManageUser/ManageEmployer.jsx';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>

            {/* <Route path="test" element={<Test />}>
          <Route index element={<EmployerCompany />} />
        </Route> */}
            <Route index element={<Navigate to="/company/11" replace />} />
            <Route path="/company/:id" element={<InforCompany />} />s
            <Route path="/home" element={<HomePage />}>
            </Route>
            <Route path='job' element={<JobPage />} />

            <Route path='employer' element={<EmployerPage />}>
              <Route path='register' element={<BackgroundAndForm />}>
                <Route index element={<EmployerRegister />} />
              </Route>
              <Route element={<EmployerLayout />} >
                <Route index element={<Navigate to="/employer/infor-company/11" replace />} />
                <Route path='dashboard' element={<DashBoard />} />
                <Route path='infor-company/:id' element={<InforCompany />} />
                <Route path='profile' element={<EmployerProfile />} />
                <Route path='change-password' element={<EmployerChangePassword />} />
                <Route path='company' element={<EmployerCompany />} />
                <Route path='business-certificate' element={<BusinessCertificate />} />
                <Route path='post-job' element={<EmployerPostJob />} />
                <Route path='manage-list-jobs' element={<ManageListJobs />} />
                <Route path='job/view/:id' element={<ViewJob />} />
                <Route path='job/edit/:id' element={<UpdateJob />} />
              </Route>
            </Route>

            <Route path='admin' element={<AdminLayout />} >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path='dashboard' element={<DashBoard />} />
              <Route path='manage-students' element={<UserManagement />} />
              <Route path='manage-employers' element={<ManageListEmployer />} />
              </Route>

            <Route path='forgot-password' element={<BackgroundAndForm />}>
              <Route index element={<ForgotPassword />} />
            </Route>
            <Route path='reset-password' element={<BackgroundAndForm />} >
              <Route index element={<ResetPassword />} />
            </Route>
            <Route path='user' element={<EmployerPage />}>
              <Route path='403' element={<Page403 />} />
              <Route path='500' element={<Page500 />} />
            </Route>

            <Route path='login' element={<LoginPage />} />
            <Route path='favorite' element={<FavoritePage />} />
            <Route path='register' element={<RegisterPage />} />
            <Route path='*' element={<Page404 />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

reportWebVitals();
