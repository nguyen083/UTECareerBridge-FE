import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals.jsx';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/Student/HomePage.jsx';
import HomePage from './components/Student/HomePage.jsx';
import JobPage from './components/Student/JobPage.jsx';
import EmployerPage from './components/Employer/EmployerPage.jsx';
import FavoritePage from './components/Student/FavoritePage.jsx';
import DashBoard from './components/Employer/DashBoard/DashBoard.jsx';
import RegisterPage from './components/Student/RegisterPage.jsx';
import LoginPage from './components/Employer/LoginPage.jsx';
import StudentLogin from './components/Student/LoginPage.jsx';
import EmployerRegister from './components/Employer/EmployerRegister.jsx';
import ForgotPassword from './components/Generate/ForgotPassword.jsx';
import ResetPassword from './components/Generate/ResetPassword.jsx';
import BackgroundAndForm from './components/Generate/BackgroundAndForm.jsx';
import EmployerLayout from './components/Employer/EmployerLayout.jsx';
import EmployerProfile from './components/Employer/Profile/EmployerProfile.jsx';
import EmployerCompany from './components/Employer/Company/EmployerCompany.jsx';
import EmployerChangePassword from './components/Employer/ChangePassword/EmployerChangePassword.jsx';
import BusinessCertificate from './components/Employer/Company/BusinessCertificate.jsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store.jsx';
import Page404 from './components/User/Page404.jsx';
import Page403 from './components/User/Page403.jsx';
import Page500 from './components/User/Page500.jsx';
import EmployerPostJob from './components/Employer/Post/EmployerPostJob.jsx';
import ManageListJobs from './components/Employer/ListJob/ManageListJobs.jsx';
import UpdateJob from './components/Employer/ListJob/UpdateJob.jsx';
import ViewJob from './components/User/ViewJob.jsx';
import InforCompany from './components/User/InforCompany.jsx';
import AdminLayout from './components/Admin/adminLayout.jsx';
import UserManagement from './components/Admin/ManageUser/ManageStudent.jsx';
import ManageListEmployer from './components/Admin/ManageUser/ManageEmployer.jsx';
import AdminDashboard from './components/Admin/Dashboard/dashboard.jsx';
import ServiceMarketplace from './components/Employer/Package/packageDashboard.jsx';
import ShoppingCart from './components/Employer/Package/orderPage.jsx';

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
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="company/:id" element={<InforCompany />} />
            <Route path="home" element={<HomePage />}>
            </Route>
            <Route path='job' element={<JobPage />} />

            <Route path='employer/register' element={<BackgroundAndForm />}>
              <Route index element={<EmployerRegister />} />
            </Route>

            <Route path='employer' element={<EmployerLayout />} >
              <Route path="" element={<Navigate to="dashboard" replace />} />
              {/* <Route element={<Navigate to="/employer/infor-company/11" replace />} /> */}
              <Route index path='dashboard' element={<DashBoard />} />
              <Route path='infor-company/:id' element={<InforCompany />} />
              <Route path='profile' element={<EmployerProfile />} />
              <Route path='change-password' element={<EmployerChangePassword />} />
              <Route path='company' element={<EmployerCompany />} />
              <Route path='business-certificate' element={<BusinessCertificate />} />
              <Route path='post-job' element={<EmployerPostJob />} />
              <Route path='buy-service' element={<ServiceMarketplace />} />
              <Route path='cart' element={<ShoppingCart />} />
              <Route path='manage-list-jobs' element={<ManageListJobs />} />
              <Route path='job/view/:id' element={<ViewJob />} />
              <Route path='job/edit/:id' element={<UpdateJob />} />
            </Route>

            <Route path='admin' element={<AdminLayout />} >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path='dashboard' element={<AdminDashboard />} />
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
            <Route path='login' element={<StudentLogin />} />
            <Route path='/employer/login' element={<LoginPage />} />
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
