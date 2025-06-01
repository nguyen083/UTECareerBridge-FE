import { useEffect, useState } from "react";
import "./adminLayout.scss";
import { useTranslation } from "react-i18next";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  FileTextOutlined,
  DollarOutlined,
  GlobalOutlined,
  MenuOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Flex,
  Space,
  message,
  Dropdown,
  Tooltip,
} from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut, removeAllToken } from "../../services/apiService";
import { loading, stop } from "../../redux/action/webSlice";
import { useRedux } from "../../utils/useRedux.jsx";
import ChangeLanguageBtn from "../Generate/ChangeLanguageBtn";
import NotificationIcon from "../Generate/NotificationIcon.jsx";

const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "#f0f2f5",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
};

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { clearRedux } = useRedux();
  const dispatch = useDispatch();
  const [defaultImage, setDefaultImage] = useState(null);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const adminInfo = useSelector((state) => state.admin);
  const name = `${adminInfo?.firstName || ""} ${adminInfo?.lastName || ""}`;
  const avatar = adminInfo?.avatar;

  const user = useSelector((state) => state.user);

  const itemSider = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: t("admin.sidebar.overview"),
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: t("admin.sidebar.userManagement"),
      children: [
        { key: "/admin/manage-students", label: t("admin.sidebar.candidates") },
        { key: "/admin/manage-employers", label: t("admin.sidebar.employers") },
      ],
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: t("admin.sidebar.companyManagement"),
      children: [
        {
          key: "/admin/company-approval",
          label: t("admin.sidebar.companyApproval"),
        },
        {
          key: "/admin/post-approval",
          label: t("admin.sidebar.postApproval"),
        },
      ],
    },
    {
      key: "4",
      icon: <DollarOutlined />,
      label: t("admin.sidebar.transactionManagement"),
      children: [
        {
          key: "/admin/service-packages",
          label: t("admin.sidebar.servicePackages"),
        },
        { key: "/admin/coupons", label: t("admin.sidebar.coupons") },
      ],
    },
    {
      key: "6",
      icon: <GlobalOutlined />,
      label: t("admin.sidebar.contentManagement"),
      children: [
        {
          key: "/admin/news-events",
          label: t("admin.sidebar.newsAndEvents"),
        },
        {
          key: "/admin/forums",
          label: t("admin.sidebar.forums"),
        },
      ],
    },    {
      key: "7",
      icon: <NotificationOutlined />,
      label: t("admin.sidebar.notification"),
      children: [
        {
          key: "/admin/create-notification",
          label: t("admin.sidebar.createNotification"),
        },
        {
          key: "/admin/notification",
          label: t("admin.sidebar.notificationList"),
        },
        {
          key: "/admin/job-alert-config",
          label: "Cấu hình thông báo việc làm",
        },
      ],
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("admin.sidebar.logout"),
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      label: t("admin.sidebar.logout"),
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const handleNavigation = async (key) => {
    if (key.key === "logout") {
      try {
        dispatch(loading());
        const res = await logOut();
        if (res.status === "OK") {
          clearRedux();
          removeAllToken();
          navigate("/");
          message.success(res.message);
        } else {
          message.error(t("admin.messages.error"));
        }
      } catch {
        message.error(t("admin.messages.error"));
      } finally {
        dispatch(stop());
      }
    } else {
      navigate(key.key);
    }
  };

  const handleUserMenuClick = ({ key }) => {
    if (key === "logout") {
      handleNavigation({ key: "logout" });
    } else if (key === "profile") {
      // Navigate to profile page
      navigate("/admin/profile");
    } else if (key === "settings") {
      // Navigate to settings page
      navigate("/admin/settings");
    }
  };

  useEffect(() => {
    setDefaultImage(
      "https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png"
    );
  }, []);

  if (!localStorage.getItem("accessToken")) {
    return null;
  }

  return (
    <Layout hasSider>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={260}
        style={siderStyle}
        theme="light"
        className="admin-sider"
      >
        <div className="admin-logo">
          <img src={defaultImage} alt="Admin Logo" className="admin-logo-img" />
        </div>
        <Menu
          onSelect={handleNavigation}
          selectedKeys={[location.pathname]}
          theme="light"
          mode="inline"
          items={itemSider}
          className="admin-menu"
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="admin-header !bg-card-color">
          <Flex align="center">
            <Tooltip
              destroyTooltipOnHide={true}
              title={collapsed ? "Expand menu" : "Collapse menu"}
            >
              <MenuOutlined
                className="text-base transition-all cursor-pointer hover:text-blue-500"
                onClick={() => setCollapsed(!collapsed)}
              />
            </Tooltip>
          </Flex>

          <div className="flex !items-center gap-6">
            <ChangeLanguageBtn />

            <NotificationIcon userId={user.userId} />

            <Dropdown
              menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              trigger={["click"]}
              overlayClassName="admin-user-dropdown"
            >
              <Space className="cursor-pointer">
                <Avatar
                  size="large"
                  icon={<UserOutlined />}
                  src={avatar}
                  className="admin-avatar"
                />
                <span className="admin-name">{name}</span>
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content className="admin-content">
          <Flex gap="1rem" vertical>
            <Outlet />
          </Flex>
        </Content>
        <Footer className="admin-footer">
          © {new Date().getFullYear()} UTECareerBridge - All Rights Reserved
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
