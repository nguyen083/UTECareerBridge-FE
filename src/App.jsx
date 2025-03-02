import './App.scss';
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { ConfigProvider, Spin, App as AntApp } from 'antd';

import { useSelector } from 'react-redux';
import COLOR from './components/styles/_variables.jsx';
import viVN from 'antd/lib/locale/vi_VN'; // Locale của Ant Design
import './i18n.jsx';
// import HomePage from './components/Student/HomePage/HomePage.jsx';
// import Page404 from './components/User/Page404.jsx';
// import Page403 from './components/User/Page403.jsx';
// import Page500 from './components/User/Page500.jsx';
// import EmployerPostJob from './components/Employer/Post/EmployerPostJob.jsx';
// import ManageListJobs from './components/Employer/ListJob/ManageListJobs.jsx';
// import UpdateJob from './components/Employer/ListJob/UpdateJob.jsx';
// import ViewJob from './components/User/ViewJob.jsx';
// import InforCompany from './components/User/InforCompany.jsx';
// import AdminLayout from './components/Admin/adminLayout.jsx';
// import UserManagement from './components/Admin/ManageUser/ManageStudent.jsx';
// import ManageListEmployer from './components/Admin/ManageUser/ManageEmployer.jsx';
// import AdminDashboard from './components/Admin/Dashboard/dashboard.jsx';
// import ServiceMarketplace from './components/Employer/Package/packageDashboard.jsx';
// import ShoppingCart from './components/Employer/Package/orderPage.jsx';
// import ProfilePage from './components/Student/PersonalLayout/ProfilePage/ProfilePage.jsx';
// import StudentLayout from './components/Student/StudentLayout.jsx';
// import EmployerPage from './components/Employer/EmployerPage.jsx';
// import FavoritePage from './components/Student/FavoritePage.jsx';
// import DashBoard from './components/Employer/DashBoard/DashBoard.jsx';
// import RegisterPage from './components/Student/RegisterPage.jsx';
// import LoginPage from './components/Employer/LoginPage.jsx';
// import StudentLogin from './components/Student/LoginPage/LoginPage.jsx';
// import EmployerRegister from './components/Employer/EmployerRegister.jsx';
// import ForgotPassword from './components/Generate/ForgotPassword.jsx';
// import ResetPassword from './components/Generate/ResetPassword.jsx';
// import BackgroundAndForm from './components/Generate/BackgroundAndForm.jsx';
// import EmployerLayout from './components/Employer/EmployerLayout.jsx';
// import EmployerProfile from './components/Employer/Profile/EmployerProfile.jsx';
// import EmployerCompany from './components/Employer/Company/EmployerCompany.jsx';
// import EmployerChangePassword from './components/Employer/ChangePassword/EmployerChangePassword.jsx';
// import BusinessCertificate from './components/Employer/Company/BusinessCertificate.jsx';
// import BoxContainer from './components/Generate/BoxContainer.jsx';
// import ViewCV from './components/Student/CV/ViewCV.jsx';
// import PostApproval from './components/Admin/ManageCompany/Post/PostApproval.jsx';
// import CompanyApproval from './components/Admin/ManageCompany/Company/CompanyApproval.jsx';
// import ViewLayout from './components/Generate/ViewLayout.jsx';
// import Applicant from './components/Employer/Applicant/Applicant.jsx';
// import ListJob from './components/Employer/Applicant/ListJob.jsx';
// import ListApplicant from './components/Employer/Applicant/ListApplicant.jsx';
// import ViewDetailApplicant from './components/Employer/Applicant/ViewDetailApplicant.jsx';
// import MyCompanyPage from './components/Student/PersonalLayout/MyCompanyPage/MyCompanyPage.jsx';
// import PersonalLayout from './components/Student/PersonalLayout/PersonalLayout.jsx';
// import MyJobPage from './components/Student/PersonalLayout/MyJobPage/MyJobPage.jsx';
// import EventPage from './components/Student/Event/EventPage.jsx';
// import EventDetail from './components/Student/Event/EventPageDetail.jsx';
// import JobSearchPage from './components/Student/Search/JobSearchPage.jsx';
// import AccountManagement from './components/Student/PersonalLayout/AccountManagement/AccountManagement.jsx';
// import ListResumes from './components/Employer/ListResumes/ListResumes.jsx';
// import ListOrder from './components/Employer/Order/ListOrder.jsx';
// import ListEvent from './components/Admin/ManageEvent/ListEvent.jsx';
// import PaymentReturn from './components/Employer/Order/PaymentReturn.jsx';
// import ServicePackage from './components/Admin/ServicePackage/ServicePackage.jsx';
// import PaymentSuccess from './components/User/PaymentSuccess.jsx';
// import PaymentFail from './components/User/PaymentFail.jsx';
// import Coupon from './components/Admin/Coupon.jsx/Coupon.jsx';
// import DetailResume from './components/Employer/DetailResume/DetailResume.jsx';
// import Chat from './pages/Chat/Chat.jsx';
import { lazy, Suspense } from "react"
import GoogleAuthCallback from './components/Student/GoogleAuthCallback.jsx';

const HomePage = lazy(() => import("./components/Student/HomePage/HomePage.jsx"));
const Page404 = lazy(() => import("./components/User/Page404.jsx"));
const Page403 = lazy(() => import("./components/User/Page403.jsx"));
const Page500 = lazy(() => import("./components/User/Page500.jsx"));
const EmployerPostJob = lazy(() => import("./components/Employer/Post/EmployerPostJob.jsx"));
const ManageListJobs = lazy(() => import("./components/Employer/ListJob/ManageListJobs.jsx"));
const UpdateJob = lazy(() => import("./components/Employer/ListJob/UpdateJob.jsx"));
const ViewJob = lazy(() => import("./components/User/ViewJob.jsx"));
const InforCompany = lazy(() => import("./components/User/InforCompany.jsx"));
const AdminLayout = lazy(() => import("./components/Admin/adminLayout.jsx"));
const UserManagement = lazy(() => import("./components/Admin/ManageUser/ManageStudent.jsx"));
const ManageListEmployer = lazy(() => import("./components/Admin/ManageUser/ManageEmployer.jsx"));
const AdminDashboard = lazy(() => import("./components/Admin/Dashboard/dashboard.jsx"));
const ServiceMarketplace = lazy(() => import("./components/Employer/Package/packageDashboard.jsx"));
const ShoppingCart = lazy(() => import("./components/Employer/Package/orderPage.jsx"));
const ProfilePage = lazy(() => import("./components/Student/PersonalLayout/ProfilePage/ProfilePage.jsx"));
const StudentLayout = lazy(() => import("./components/Student/StudentLayout.jsx"));
const EmployerPage = lazy(() => import("./components/Employer/EmployerPage.jsx"));
const FavoritePage = lazy(() => import("./components/Student/FavoritePage.jsx"));
const DashBoard = lazy(() => import("./components/Employer/DashBoard/DashBoard.jsx"));
const RegisterPage = lazy(() => import("./components/Student/RegisterPage.jsx"));
const LoginPage = lazy(() => import("./components/Employer/LoginPage.jsx"));
const StudentLogin = lazy(() => import("./components/Student/LoginPage/LoginPage.jsx"));
const EmployerRegister = lazy(() => import("./components/Employer/EmployerRegister.jsx"));
const ForgotPassword = lazy(() => import("./components/Generate/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./components/Generate/ResetPassword.jsx"));
const BackgroundAndForm = lazy(() => import("./components/Generate/BackgroundAndForm.jsx"));
const EmployerLayout = lazy(() => import("./components/Employer/EmployerLayout.jsx"));
const EmployerProfile = lazy(() => import("./components/Employer/Profile/EmployerProfile.jsx"));
const EmployerCompany = lazy(() => import("./components/Employer/Company/EmployerCompany.jsx"));
const EmployerChangePassword = lazy(() => import("./components/Employer/ChangePassword/EmployerChangePassword.jsx"));
const BusinessCertificate = lazy(() => import("./components/Employer/Company/BusinessCertificate.jsx"));
const BoxContainer = lazy(() => import("./components/Generate/BoxContainer.jsx"));
const ViewCV = lazy(() => import("./components/Student/CV/ViewCV.jsx"));
const PostApproval = lazy(() => import("./components/Admin/ManageCompany/Post/PostApproval.jsx"));
const CompanyApproval = lazy(() => import("./components/Admin/ManageCompany/Company/CompanyApproval.jsx"));
const ViewLayout = lazy(() => import("./components/Generate/ViewLayout.jsx"));
const Applicant = lazy(() => import("./components/Employer/Applicant/Applicant.jsx"));
const ListJob = lazy(() => import("./components/Employer/Applicant/ListJob.jsx"));
const ListApplicant = lazy(() => import("./components/Employer/Applicant/ListApplicant.jsx"));
const ViewDetailApplicant = lazy(() => import("./components/Employer/Applicant/ViewDetailApplicant.jsx"));
const MyCompanyPage = lazy(() => import("./components/Student/PersonalLayout/MyCompanyPage/MyCompanyPage.jsx"));
const PersonalLayout = lazy(() => import("./components/Student/PersonalLayout/PersonalLayout.jsx"));
const MyJobPage = lazy(() => import("./components/Student/PersonalLayout/MyJobPage/MyJobPage.jsx"));
const EventPage = lazy(() => import("./components/Student/Event/EventPage.jsx"));
const EventDetail = lazy(() => import("./components/Student/Event/EventPageDetail.jsx"));
const JobSearchPage = lazy(() => import("./components/Student/Search/JobSearchPage.jsx"));
const AccountManagement = lazy(() => import("./components/Student/PersonalLayout/AccountManagement/AccountManagement.jsx"));
const ListResumes = lazy(() => import("./components/Employer/ListResumes/ListResumes.jsx"));
const ListOrder = lazy(() => import("./components/Employer/Order/ListOrder.jsx"));
const ListEvent = lazy(() => import("./components/Admin/ManageEvent/ListEvent.jsx"));
const PaymentReturn = lazy(() => import("./components/Employer/Order/PaymentReturn.jsx"));
const ServicePackage = lazy(() => import("./components/Admin/ServicePackage/ServicePackage.jsx"));
const PaymentSuccess = lazy(() => import("./components/User/PaymentSuccess.jsx"));
const PaymentFail = lazy(() => import("./components/User/PaymentFail.jsx"));
const Coupon = lazy(() => import("./components/Admin/Coupon.jsx/Coupon.jsx"));
const DetailResume = lazy(() => import("./components/Employer/DetailResume/DetailResume.jsx"));
const Chat = lazy(() => import('./pages/Chat/Chat.jsx'))

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
          Descriptions: {
            fontSize: '1rem',
          },
          Typography: {
            fontSize: '1rem',

          },
          Input: {
            colorBorder: "rgba(0,0,0,0.4)",
            activeShadow: "0 0 0 2px rgba(68, 120, 192, 0.2)",
            colorTextDisabled: "#AAA8A9",
            // colorText: COLOR.textColor,

          },
          Select: {
            colorBorder: "rgba(0,0,0,0.4)",
            // selectorBg: COLOR.backgroundColor,
            optionSelectedBg: COLOR.cardColor,
            optionSelectedColor: COLOR.textColor,
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
            colorLinkHover: "#4478c0",
            defaultActiveBorderColor: COLOR.textColorHover,
            defaultActiveColor: COLOR.textColorHover,
            defaultBorderColor: COLOR.textColor,
            defaultColor: COLOR.textColor,
            defaultHoverBg: COLOR.cardColor,
          },
          Menu: {
            fontSize: '1rem',
            iconMarginInlineEnd: '0.625rem',
            itemActiveBg: COLOR.backgroundColor,
            iconSize: '1.25rem',
            itemSelectedBg: COLOR.cardColor,
            itemSelectedColor: COLOR.textColor,
          },
          Alert: {
            colorText: COLOR.textColor,
            colorTextHeading: COLOR.textColor,
            fontSize: '1rem',
            fontSizeIcon: '1.25rem',
          },
          Table: {
            cellFontSize: "1rem",
          },
          Tag: {
            fontSizeSM: 14,
            fontSizeIcon: 14
            // fontSize: 12,
          },
          Divider: {
            colorSplit: COLOR.dividerColor,
          },
          Carousel: {
            dotWidth: 7,
            dotHeight: 7,
            dotActiveWidth: 7,
            arrowOffset: 16,
            arrowSize: 32,
          },
          Collapse: {
            headerBg: COLOR.cardColor,
            headerPadding: '0px 50px',
          },
          Modal: {
            titleFontSize: "1.125rem",
            fontSize: "1rem",
          },
          DatePicker: {
            colorBorder: "rgba(0,0,0,0.4)",
          },
          InputNumber: {
            colorBorder: "rgba(0,0,0,0.4)",
          }
        }
      }}>
      <AntApp>
        <BrowserRouter>
          <Suspense fallback={<div className='!h-screen w-full flex items-center justify-center'><Spin size='large' spinning={true}></Spin></div>
          }>
            <Spin style={{ maxHeight: "100vh", height: "100%" }} size='large' spinning={useSelector(state => state.web.loading)}>
              <Routes>
                <Route path='/chat' element={<Chat />} />
                <Route element={<StudentLayout />}>
                  <Route index element={<Navigate to={"/home"} replace />} />
                  <Route path='/home' element={<HomePage />} />
                  <Route path='/event' element={<EventPage />}>
                  </Route>
                  <Route path='/vnpay-payment-return' element={<PaymentReturn />} />

                  <Route element={<ViewLayout width='90%' />}>
                    <Route path='/event-detail/:id' element={<EventDetail />} />
                    <Route path='/search' element={<JobSearchPage />} />
                  </Route>

                  <Route element={<PersonalLayout />} >
                    <Route path='/profile' element={<ProfilePage />} />

                    <Route path='/my-company' element={<MyCompanyPage />} />
                    <Route path='/my-job' element={<MyJobPage />} />
                    <Route path='/account-management' element={<AccountManagement />} />
                  </Route>
                  <Route element={<ViewLayout width='90%' />}>
                    <Route path='/job/:id' element={<ViewJob />} />
                    <Route path="/company/:id" element={<InforCompany />} />
                    <Route path='/resume/view/:id' element={<ViewCV />} />
                  </Route>
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
                  <Route path='list-resumes' element={<ListResumes />} />
                  <Route path='list-order' element={<ListOrder />} />
                  <Route path='detail-resume' element={<DetailResume />} />
                  <Route path='applicant' element={<Applicant />} >
                    <Route index element={<Navigate to="list-job" replace />} />
                    <Route path='list-job' element={<ListJob />} />
                    <Route path='list-applicant-job/:id' element={<ListApplicant />} />
                  </Route>
                  <Route path='applicant-job/:id' element={<ViewDetailApplicant />} />
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
                  <Route path='service-packages' element={<ServicePackage />} />
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='manage-students' element={<UserManagement />} />
                  <Route path='manage-employers' element={<ManageListEmployer />} />
                  <Route path='company-approval' element={<CompanyApproval />} />
                  <Route path='post-approval' element={<PostApproval />} />
                  <Route path='news-events' element={<ListEvent />} />
                  <Route path='coupons' element={<Coupon />} />
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
                <Route path='payment-success' element={<PaymentSuccess />} />
                <Route path='payment-fail' element={<PaymentFail />} />
                <Route path='login' element={<StudentLogin />} />
                <Route path='/employer/login' element={<LoginPage />} />
                <Route path='favorite' element={<FavoritePage />} />
                <Route path='register' element={<RegisterPage />} />
                {/* <Route path="/auth/google/callback" element={<StudentLogin />} /> */}
                <Route path='*' element={<Page404 />} />
              </Routes>
            </Spin>
          </Suspense>
        </BrowserRouter>
      </AntApp>
      {/* <Navigation/> */}
    </ConfigProvider >
  );
}

export default App;
