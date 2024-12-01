import './App.scss';
import { Route, Routes, Navigate } from "react-router-dom";
import { ConfigProvider, Spin } from 'antd';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from 'react-redux';
import HomePage from './components/Student/HomePage/HomePage.jsx';
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
import ProfilePage from './components/Student/PersonalLayout.jsx/PersonalLayout.jsx';
import StudentLayout from './components/Student/StudentLayout.jsx';
import EmployerPage from './components/Employer/EmployerPage.jsx';
import FavoritePage from './components/Student/FavoritePage.jsx';
import DashBoard from './components/Employer/DashBoard/DashBoard.jsx';
import RegisterPage from './components/Student/RegisterPage.jsx';
import LoginPage from './components/Employer/LoginPage.jsx';
import StudentLogin from './components/Student/LoginPage/LoginPage.jsx';
import EmployerRegister from './components/Employer/EmployerRegister.jsx';
import ForgotPassword from './components/Generate/ForgotPassword.jsx';
import ResetPassword from './components/Generate/ResetPassword.jsx';
import BackgroundAndForm from './components/Generate/BackgroundAndForm.jsx';
import EmployerLayout from './components/Employer/EmployerLayout.jsx';
import EmployerProfile from './components/Employer/Profile/EmployerProfile.jsx';
import EmployerCompany from './components/Employer/Company/EmployerCompany.jsx';
import EmployerChangePassword from './components/Employer/ChangePassword/EmployerChangePassword.jsx';
import BusinessCertificate from './components/Employer/Company/BusinessCertificate.jsx';
import BoxContainer from './components/Generate/BoxContainer.jsx';
import COLOR from './components/styles/_variables.jsx';
import viVN from 'antd/lib/locale/vi_VN'; // Locale của Ant Design
import ViewCV from './components/Student/CV/ViewCV.jsx';
import PostApproval from './components/Admin/ManageCompany/Post/PostApproval.jsx';
import CompanyApproval from './components/Admin/ManageCompany/Company/CompanyApproval.jsx';
import ViewLayout from './components/Generate/ViewLayout.jsx';
import EventPage from './components/Student/Event/EventPage.jsx';
import EventDetail from './components/Student/Event/EventPageDetail.jsx';
import JobSearchPage from './components/Student/Search/JobSearchPage.jsx';
const App = () => {
  return (
    <ConfigProvider locale={viVN}
      theme={{
        token: {
          colorPrimary: COLOR.textColor,
          colorPrimaryHover: COLOR.textColorHover,
          fontFamily: "'Inter', sans-serif",
          inputFontSize: '1rem',
          //inputFontSizeLG: '1rem',
        },
        components: {

          Input: {
            activeShadow: "0 0 0 2px rgba(68, 120, 192, 0.2)",
            colorTextDisabled: "#AAA8A9",
            colorText: COLOR.textColor,

          },
          Select: {
          },
          Form: {
            labelFontSize: '1rem',
            itemMarginBottom: '1.5rem',
            labelColonMarginInlineEnd: '0.5rem',
            labelHeight: '0.5rem',
            labelColonMarginInlineStart: '0.125rem',
            verticalLabelPadding: '0 0 0rem',
            labelColor: COLOR.textColor,

          },
          Button: {
            // contentFontSize: '1rem',
            // contentFontSizeLG: '1rem',
            // paddingBlock: '0.25rem',
            // paddingBlockLG: '0.5rem',
            colorLink: "#1E4F94",
            colorLinkHover: "#4478c0"
          },
          Menu: {
            iconMarginInlineEnd: '0.625rem',
            itemActiveBg: COLOR.backgroundColor,
            iconSize: '1.25rem',
            itemSelectedBg: COLOR.cardColor,
            itemSelectedColor: COLOR.textColor,

          }
        }
      }}>
      <Spin style={{ maxHeight: "100vh", height: "100%" }} size='large' spinning={useSelector(state => state.web.loading)}>
        <Routes>
          <Route element={<StudentLayout />}>
            <Route index element={<Navigate to={"/home"} replace />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/job/:id' element={<ViewJob />} />
            <Route path='/resume/view/:id' element={<ViewCV />} />
            <Route path='/event' element={<EventPage />}>
            </Route>
            <Route path='/event-detail' element={<EventDetail />} />
            <Route path='/search' element={<JobSearchPage />} />

          </Route>
          <Route element={<ViewLayout />} >
            <Route path="view/company/:id" element={<InforCompany />} />
            <Route path='view/job/:id' element={<ViewJob />} />
          </Route>


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
          <Route element={<BoxContainer width={"100%"} background='#F5F5F5' />} >
          </Route>
          <Route path='admin' element={<AdminLayout />} >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='manage-students' element={<UserManagement />} />
            <Route path='manage-employers' element={<ManageListEmployer />} />
            <Route path='company-approval' element={<CompanyApproval />} />
            <Route path='post-approval' element={<PostApproval />} />
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

        </Routes>
      </Spin>
      {/* <Navigation/> */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ConfigProvider >
  );
}

export default App;
