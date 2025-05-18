import "./App.scss";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import { ConfigProvider, Spin, App as AntApp } from "antd";
import { useSelector } from "react-redux";
import COLOR from "./components/styles/_variables.jsx";
import viVN from "antd/lib/locale/vi_VN";
import enUS from "antd/locale/en_US";
import I18nInitializer from "./i18n";
import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { connectStomp, disconnectStomp } from "./utils/stompConfig.js";
const StudentDashboard = lazy(() =>
  import("./components/Student/Dashboard/Dashboard.jsx")
);
const RecommendJob = lazy(() =>
  import("./components/Student/Recommend/RecommendJob.jsx")
);
const CVAnalysis = lazy(() =>
  import("./components/Student/CVAnalysis/CVAnalysis.jsx")
);
const InterviewList = lazy(() =>
  import("./components/Employer/Interview/InterviewPage.jsx")
);
const CandidateEvaluation = lazy(() =>
  import("./components/Employer/Interview/CandidateEvaluation.jsx")
);
const JobEvaluations = lazy(() =>
  import("./components/Employer/Interview/JobEvaluations.jsx")
);
const JobEvaluationList = lazy(() =>
  import("./components/Employer/Interview/JobEvaluationList.jsx")
);
const Notification = lazy(() =>
  import("./components/Generate/Notification/Notification.jsx")
);
const CreateNotification = lazy(() =>
  import("./components/Admin/Notification/CreateNotification.jsx")
);
const ForumPage = lazy(() => import("./pages/Forum/ForumPage.jsx"));
const AdminForum = lazy(() => import("./pages/Forum/Admin/ForumPage.jsx"));
const TopicListAdmin = lazy(() => import("./pages/Topic/Admin/TopicPage.jsx"));
const PostList = lazy(() => import("./pages/Post/User/PostList.jsx"));
const PostListAdmin = lazy(() => import("./pages/Post/Admin/PostList.jsx"));
const TopicList = lazy(() => import("./pages/Topic/User/TopicList.jsx"));
const PostDetail = lazy(() => import("./pages/Post/PostDetail.jsx"));
const AboutPage = lazy(() => import("./pages/About/AboutPage.jsx"));
const CreateJobAlert = lazy(() =>
  import("./components/Student/JobAlert/CreateJobAlert.jsx")
);
const ManageJobAlerts = lazy(() =>
  import("./components/Student/JobAlert/ManageJobAlerts.jsx")
);
const EditJobAlert = lazy(() =>
  import("./components/Student/JobAlert/EditJobAlert.jsx")
);
const TermsOfUse = lazy(() => import("./components/Generate/TermsOfUse.jsx"));
import Policy from "./components/Generate/Policy.jsx";
import { refreshToken, setupTokenRefresh } from "./utils/axiosCustomize.jsx";
// import CreatePostPage from './pages/Forum/create/CreatePostPage.jsx';

const GoogleAuthCallback = lazy(() =>
  import("./components/Student/GoogleAuthCallback.jsx")
);
const GoogleCalendarCallback = lazy(() =>
  import("./components/Employer/GoogleCalendarCallback.jsx")
);
const ChatEmployerLayout = lazy(() =>
  import("./components/Employer/Chat/ChatEmployerLayout.jsx")
);
const HomePage = lazy(() =>
  import("./components/Student/HomePage/HomePage.jsx")
);
const Page404 = lazy(() => import("./components/User/Page404.jsx"));
const Page403 = lazy(() => import("./components/User/Page403.jsx"));
const Page500 = lazy(() => import("./components/User/Page500.jsx"));
const EmployerPostJob = lazy(() =>
  import("./components/Employer/Post/EmployerPostJob.jsx")
);
const ManageListJobs = lazy(() =>
  import("./components/Employer/ListJob/ManageListJobs.jsx")
);
const UpdateJob = lazy(() =>
  import("./components/Employer/ListJob/UpdateJob.jsx")
);
const ViewJob = lazy(() => import("./components/User/ViewJob.jsx"));
const InforCompany = lazy(() => import("./components/User/InforCompany.jsx"));
const AdminLayout = lazy(() => import("./components/Admin/adminLayout.jsx"));
const UserManagement = lazy(() =>
  import("./components/Admin/ManageUser/ManageStudent.jsx")
);
const ManageListEmployer = lazy(() =>
  import("./components/Admin/ManageUser/ManageEmployer.jsx")
);
const AdminDashboard = lazy(() =>
  import("./components/Admin/Dashboard/dashboard.jsx")
);
const ServiceMarketplace = lazy(() =>
  import("./components/Employer/Package/packageDashboard.jsx")
);
const ShoppingCart = lazy(() =>
  import("./components/Employer/Package/orderPage.jsx")
);
const ProfilePage = lazy(() =>
  import("./components/Student/PersonalLayout/ProfilePage/ProfilePage.jsx")
);
const StudentLayout = lazy(() =>
  import("./components/Student/StudentLayout.jsx")
);
const EmployerPage = lazy(() =>
  import("./components/Employer/EmployerPage.jsx")
);
const FavoritePage = lazy(() =>
  import("./components/Student/FavoritePage.jsx")
);
const DashBoard = lazy(() =>
  import("./components/Employer/DashBoard/DashBoard.jsx")
);
const RegisterPage = lazy(() =>
  import("./components/Student/RegisterPage.jsx")
);
const LoginPage = lazy(() => import("./components/Employer/LoginPage.jsx"));
const StudentLogin = lazy(() =>
  import("./components/Student/LoginPage/LoginPage.jsx")
);
const EmployerRegister = lazy(() =>
  import("./components/Employer/EmployerRegister.jsx")
);
const ForgotPassword = lazy(() =>
  import("./components/Generate/ForgotPassword.jsx")
);
const ResetPassword = lazy(() =>
  import("./components/Generate/ResetPassword.jsx")
);
const BackgroundAndForm = lazy(() =>
  import("./components/Generate/BackgroundAndForm.jsx")
);
const EmployerLayout = lazy(() =>
  import("./components/Employer/EmployerLayout.jsx")
);
const EmployerProfile = lazy(() =>
  import("./components/Employer/Profile/EmployerProfile.jsx")
);
const EmployerCompany = lazy(() =>
  import("./components/Employer/Company/EmployerCompany.jsx")
);
const EmployerChangePassword = lazy(() =>
  import("./components/Employer/ChangePassword/EmployerChangePassword.jsx")
);
const BusinessCertificate = lazy(() =>
  import("./components/Employer/Company/BusinessCertificate.jsx")
);
const BoxContainer = lazy(() =>
  import("./components/Generate/BoxContainer.jsx")
);
const ViewCV = lazy(() => import("./components/Student/CV/ViewCV.jsx"));
const PostApproval = lazy(() =>
  import("./components/Admin/ManageCompany/Post/PostApproval.jsx")
);
const CompanyApproval = lazy(() =>
  import("./components/Admin/ManageCompany/Company/CompanyApproval.jsx")
);
const ViewLayout = lazy(() => import("./components/Generate/ViewLayout.jsx"));
const Applicant = lazy(() =>
  import("./components/Employer/Applicant/Applicant.jsx")
);
const ListJob = lazy(() =>
  import("./components/Employer/Applicant/ListJob.jsx")
);
const ListApplicant = lazy(() =>
  import("./components/Employer/Applicant/ListApplicant.jsx")
);
const ViewDetailApplicant = lazy(() =>
  import("./components/Employer/Applicant/ViewDetailApplicant.jsx")
);
const MyCompanyPage = lazy(() =>
  import("./components/Student/PersonalLayout/MyCompanyPage/MyCompanyPage.jsx")
);
const PersonalLayout = lazy(() =>
  import("./components/Student/PersonalLayout/PersonalLayout.jsx")
);
const MyJobPage = lazy(() =>
  import("./components/Student/PersonalLayout/MyJobPage/MyJobPage.jsx")
);
const EventPage = lazy(() =>
  import("./components/Student/Event/EventPage.jsx")
);
const EventDetail = lazy(() =>
  import("./components/Student/Event/EventPageDetail.jsx")
);
const JobSearchPage = lazy(() =>
  import("./components/Student/Search/JobSearchPage.jsx")
);
const AccountManagement = lazy(() =>
  import(
    "./components/Student/PersonalLayout/AccountManagement/AccountManagement.jsx"
  )
);
const ListResumes = lazy(() =>
  import("./components/Employer/ListResumes/ListResumes.jsx")
);
const ListOrder = lazy(() =>
  import("./components/Employer/Order/ListOrder.jsx")
);
const ListEvent = lazy(() =>
  import("./components/Admin/ManageEvent/ListEvent.jsx")
);
const PaymentReturn = lazy(() =>
  import("./components/Employer/Order/PaymentReturn.jsx")
);
const ServicePackage = lazy(() =>
  import("./components/Admin/ServicePackage/ServicePackage.jsx")
);
const PaymentSuccess = lazy(() =>
  import("./components/User/PaymentSuccess.jsx")
);
const PaymentFail = lazy(() => import("./components/User/PaymentFail.jsx"));
const Coupon = lazy(() => import("./components/Admin/Coupon/Coupon.jsx"));
const DetailResume = lazy(() =>
  import("./components/Employer/DetailResume/DetailResume.jsx")
);
const ChatLayout = lazy(() => import("./pages/Chat/ChatLayout.jsx"));
const Meeting = lazy(() => import("./components/Generate/Meeting/Meeting.jsx"));
const DetailNotification = lazy(() =>
  import("./components/Generate/Notification/DetailNotification.jsx")
);
const CVBuilderPage = lazy(() =>
  import("./components/Student/CV/CVBuilderPage.jsx")
);
const InterviewEvaluation = lazy(() =>
  import("./components/Employer/Interview/InterviewEvaluation.jsx")
);

const App = () => {
  const lang = useSelector((state) => state.web.lang || "en");
  const queryClient = new QueryClient();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    connectStomp(() => {});
    if (token) {
      // Kiểm tra token hiện tại và refresh nếu cần
      const isExpired = isTokenExpired(token);

      if (isExpired) {
        refreshToken()
          .then(() => {
            console.log("Token refreshed successfully");
            // Kết nối WebSocket sau khi refresh token thành công
            connectStomp(() => {
              console.log("WebSocket connected after token refresh");
            });
          })
          .catch((error) => {
            console.error("Failed to refresh token:", error);
            // Không kết nối WebSocket với token không hợp lệ
          });
      } else {
        // Token hợp lệ, kết nối WebSocket
        connectStomp(() => {
          console.log("WebSocket connected with valid token");
        });
      }

      // Thiết lập cơ chế tự động refresh token trước khi hết hạn
      const cleanupTokenRefresh = setupTokenRefresh();

      return () => {
        // Dọn dẹp khi component unmount
        disconnectStomp();
        cleanupTokenRefresh();
      };
    }
  }, []);

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch (e) {
      console.error("Error parsing token:", e);
      return true;
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={lang === "vi" ? viVN : enUS}
        theme={{
          token: {
            colorPrimary: COLOR.textColor,
            colorPrimaryHover: COLOR.textColorHover,
            fontFamily: "Be Vietnam Pro",
            inputFontSize: "1rem",
          },
          components: {
            Descriptions: {
              fontSize: "1rem",
            },
            Typography: {
              fontSize: "1rem",
            },
            Input: {
              colorBorder: "rgba(0,0,0,0.4)",
              activeShadow: "0 0 0 2px rgba(68, 120, 192, 0.2)",
              colorTextDisabled: "#AAA8A9",
            },
            Select: {
              colorBorder: "rgba(0,0,0,0.4)",
              optionSelectedBg: COLOR.cardColor,
              optionSelectedColor: COLOR.textColor,
            },
            Form: {
              labelFontSize: "1rem",
              itemMarginBottom: "1.5rem",
              labelColonMarginInlineEnd: "0.5rem",
              labelHeight: "0.5rem",
              labelColonMarginInlineStart: "0.125rem",
              verticalLabelPadding: "0 0 0rem",
              labelColor: COLOR.textColor,
            },
            Button: {
              colorLink: "#1E4F94",
              colorLinkHover: "#4478c0",
              defaultActiveBorderColor: COLOR.textColorHover,
              defaultActiveColor: COLOR.textColorHover,
              defaultBorderColor: COLOR.textColor,
              // defaultColor: COLOR.textColor,
              defaultHoverBg: COLOR.cardColor,
              colorPrimaryBg:
                "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)",
            },
            Card: {
              colorBorderSecondary: "rgba(0,0,0,0.1)",
              borderRadiusLG: 8,
              boxShadowTertiary: "0 4px 15px rgba(0,0,0,0.1)",
              colorFillAlter: "#f8f9fa",
              headerFontSize: "1.1rem",
              headerFontSizeSM: "1rem",
              headerHeight: 60,
              headerPadding: "16px 24px",
            },
            Statistic: {
              titleFontSize: "1.1rem",
              contentFontSize: "2rem",
              fontFamily: "Be Vietnam Pro",
            },
            Table: {
              cellFontSize: "1rem",
              headerBg: "#f5f7fa",
              headerColor: COLOR.textColor,
              headerFilterHoverBg: "#e8edf5",
              headerSortActiveBg: "#e8edf5",
              rowHoverBg: "rgba(68, 120, 192, 0.05)",
              borderColor: "rgba(0,0,0,0.1)",
            },
            Menu: {
              fontSize: "1rem",
              iconMarginInlineEnd: "0.625rem",
              itemActiveBg: COLOR.backgroundColor,
              iconSize: "1.25rem",
              itemSelectedBg: COLOR.cardColor,
              itemSelectedColor: COLOR.textColor,
            },
            Alert: {
              colorText: COLOR.textColor,
              colorTextHeading: COLOR.textColor,
              fontSize: "1rem",
              fontSizeIcon: "1.25rem",
            },
            Tag: {
              fontSizeSM: 14,
              fontSizeIcon: 14,
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
              headerPadding: "0px 50px",
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
            },
          },
        }}
      >
        <AntApp>
          <I18nInitializer />
          <BrowserRouter>
            <Suspense
              fallback={
                <div className="!h-screen w-full flex items-center justify-center">
                  <Spin size="large" spinning={true}></Spin>
                </div>
              }
            >
              <Spin
                style={{ maxHeight: "100vh", height: "100%" }}
                size="large"
                spinning={useSelector((state) => state.web.loading)}
              >
                <Routes>
                  <Route path="/meeting/:roomID" element={<Meeting />} />
                  <Route path="/chat" element={<ChatLayout />} />
                  <Route path="/chat/:recipientId" element={<ChatLayout />} />
                  <Route element={<StudentLayout />}>
                    <Route index element={<Navigate to={"/home"} replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/event" element={<EventPage />}></Route>
                    <Route
                      path="/vnpay-payment-return"
                      element={<PaymentReturn />}
                    />
                    <Route element={<ViewLayout width="90%" />}>
                      <Route
                        path="/event-detail/:id"
                        element={<EventDetail />}
                      />
                      <Route path="/search" element={<JobSearchPage />} />
                      <Route path="/recommend-job" element={<RecommendJob />} />
                    </Route>
                    <Route element={<PersonalLayout />}>
                      <Route path="/dashboard" element={<StudentDashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/my-company" element={<MyCompanyPage />} />
                      <Route path="/notification" element={<Notification />} />
                      <Route
                        path="/notification/:id"
                        element={<DetailNotification />}
                      />
                      <Route path="/my-job" element={<MyJobPage />} />
                      <Route path="/cv-builder" element={<CVBuilderPage />} />
                      <Route
                        path="/account-management"
                        element={<AccountManagement />}
                      />
                      <Route
                        path="/student/job-alerts"
                        element={<ManageJobAlerts />}
                      />
                      <Route
                        path="/student/job-alerts/create"
                        element={<CreateJobAlert />}
                      />
                      <Route
                        path="/student/job-alerts/edit/:id"
                        element={<EditJobAlert />}
                      />
                      <Route path="/cv-analysis" element={<CVAnalysis />} />
                    </Route>
                    <Route element={<ViewLayout width="90%" />}>
                      <Route path="/job/:id" element={<ViewJob />} />
                      <Route path="/company/:id" element={<InforCompany />} />
                      <Route path="/resume/view/:id" element={<ViewCV />} />
                      <Route path="/forums" element={<ForumPage />} />
                      <Route
                        path="/forums/:forumId/topics"
                        element={<TopicList />}
                      />
                      <Route
                        path="/admin/forums/:forumId/topics"
                        element={<TopicListAdmin />}
                      />
                      <Route
                        path="admin/forums/:forumId/topics/:topicId/posts"
                        element={<PostListAdmin />}
                      />
                      {/* <Route path='/forum/create' element={<CreatePostPage />} /> */}
                      <Route
                        path="/forums/:forumId/topics/:topicId/posts/:postId"
                        element={<PostDetail />}
                      />
                      <Route
                        path="/forums/:forumId/topics/:topicId/posts"
                        element={<PostList />}
                      />
                    </Route>
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy-policy" element={<Policy />} />
                    <Route path="/terms-of-use" element={<TermsOfUse />} />
                  </Route>
                  <Route element={<ViewLayout />}>
                    <Route path="view/company/:id" element={<InforCompany />} />
                    <Route path="view/job/:id" element={<ViewJob />} />
                  </Route>

                  <Route
                    path="employer/register"
                    element={<BackgroundAndForm />}
                  >
                    <Route index element={<EmployerRegister />} />
                  </Route>

                  <Route path="employer" element={<EmployerLayout />}>
                    <Route
                      path=""
                      element={<Navigate to="dashboard" replace />}
                    />
                    <Route index path="dashboard" element={<DashBoard />} />
                    <Route path="notification" element={<Notification />} />
                    <Route
                      path="notification/:id"
                      element={<DetailNotification />}
                    />
                    <Route
                      path="infor-company/:id"
                      element={<InforCompany />}
                    />
                    <Route path="profile" element={<EmployerProfile />} />
                    <Route
                      path="change-password"
                      element={<EmployerChangePassword />}
                    />
                    <Route path="company" element={<EmployerCompany />} />
                    <Route path="list-resumes" element={<ListResumes />} />
                    <Route path="interview" element={<InterviewList />} />
                    <Route
                      path="interview/evaluation/:interviewId"
                      element={<CandidateEvaluation />}
                    />
                    <Route
                      path="interview/evaluations"
                      element={<JobEvaluationList />}
                    />
                    <Route
                      path="interview/evaluations/job/:jobId"
                      element={<JobEvaluations />}
                    />
                    <Route path="list-order" element={<ListOrder />} />
                    <Route path="detail-resume" element={<DetailResume />} />
                    <Route path="applicant" element={<Applicant />}>
                      <Route
                        index
                        element={<Navigate to="list-job" replace />}
                      />
                      <Route path="list-job" element={<ListJob />} />
                      <Route
                        path="list-applicant-job/:id"
                        element={<ListApplicant />}
                      />
                    </Route>
                    <Route
                      path="applicant-job/:id"
                      element={<ViewDetailApplicant />}
                    />
                    <Route
                      path="business-certificate"
                      element={<BusinessCertificate />}
                    />
                    <Route path="post-job" element={<EmployerPostJob />} />
                    <Route path="chat" element={<ChatEmployerLayout />} />
                    <Route
                      path="chat/:recipientId"
                      element={<ChatEmployerLayout />}
                    />
                    <Route
                      path="buy-service"
                      element={<ServiceMarketplace />}
                    />
                    <Route path="cart" element={<ShoppingCart />} />
                    <Route
                      path="manage-list-jobs"
                      element={<ManageListJobs />}
                    />
                    <Route path="job/view/:id" element={<ViewJob />} />
                    <Route path="job/edit/:id" element={<UpdateJob />} />
                  </Route>
                  <Route
                    element={
                      <BoxContainer width={"100%"} background="#F5F5F5" />
                    }
                  ></Route>
                  <Route path="admin" element={<AdminLayout />}>
                    <Route
                      index
                      element={<Navigate to="/admin/dashboard" replace />}
                    />
                    <Route
                      path="service-packages"
                      element={<ServicePackage />}
                    />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route
                      path="manage-students"
                      element={<UserManagement />}
                    />
                    <Route
                      path="manage-employers"
                      element={<ManageListEmployer />}
                    />
                    <Route
                      path="company-approval"
                      element={<CompanyApproval />}
                    />
                    <Route path="post-approval" element={<PostApproval />} />
                    <Route path="news-events" element={<ListEvent />} />
                    <Route path="coupons" element={<Coupon />} />
                    <Route
                      path="create-notification"
                      element={<CreateNotification />}
                    />
                    <Route path="notification" element={<Notification />} />
                    <Route
                      path="notification/:id"
                      element={<DetailNotification />}
                    />
                    <Route path="forums" element={<AdminForum />} />
                  </Route>

                  <Route path="forgot-password" element={<BackgroundAndForm />}>
                    <Route index element={<ForgotPassword />} />
                  </Route>
                  <Route path="reset-password" element={<BackgroundAndForm />}>
                    <Route index element={<ResetPassword />} />
                  </Route>
                  <Route path="user" element={<EmployerPage />}>
                    <Route path="403" element={<Page403 />} />
                    <Route path="500" element={<Page500 />} />
                  </Route>
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="payment-fail" element={<PaymentFail />} />
                  <Route path="login" element={<StudentLogin />} />
                  <Route path="/employer/login" element={<LoginPage />} />
                  <Route path="favorite" element={<FavoritePage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route
                    path="/auth/google/callback"
                    element={<GoogleAuthCallback />}
                  />
                  <Route
                    path="/auth/google-calendar/callback"
                    element={<GoogleCalendarCallback />}
                  />
                  <Route path="*" element={<Page404 />} />
                </Routes>
              </Spin>
            </Suspense>
          </BrowserRouter>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default App;
