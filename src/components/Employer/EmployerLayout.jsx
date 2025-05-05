import { useEffect, useState } from "react";
import "./EmployerLayout.scss";
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { FaRegNewspaper } from "react-icons/fa";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts, MdOutlineMessage } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setInfor } from "../../redux/action/employerSlice.jsx";
import { useRedux } from "../../utils/useRedux.jsx";
import { AiOutlinePayCircle } from "react-icons/ai";
import { IoMdChatboxes } from "react-icons/io";
import { useTranslation } from "react-i18next";

import {
  BarChartOutlined,
  LogoutOutlined,
  SolutionOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  MenuOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Layout,
  Menu,
  Avatar,
  Flex,
  Badge,
  Button,
  Tooltip,
  message,
  Input,
  Dropdown,
  Space,
  Typography,
} from "antd";
import {
  getInfor,
  logOut,
  removeAllToken,
} from "../../services/apiService.jsx";
import { loading, stop } from "../../redux/action/webSlice.jsx";
import ChangeLanguageBtn from "./../Generate/ChangeLanguageBtn";
import NotificationIcon from "../Generate/NotificationIcon.jsx";

const { Header, Content, Sider } = Layout;
const { Text } = Typography;

const siderStyle = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
  scrollbarWidth: "thin",
  scrollbarColor: "unset",
};

const EmployerLayout = () => {
  const { t } = useTranslation();
  const { clearRedux } = useRedux();
  const dispatch = useDispatch();
  const location = useLocation();
  const [defaultImage, setDefaultImage] = useState(null);

  const avatar = useSelector((state) => state.employer.companyLogo);
  const employerInfo = useSelector((state) => state.employer);
  const companyName = useSelector((state) => state.employer.companyName);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const itemSider = [
    {
      key: "/employer/dashboard",
      icon: <BarChartOutlined />,
      label: t("admin.employer.sidebar.dashboard"),
      className: "sidebar-item",
    },
    {
      key: "/employer/notification",
      icon: <BellOutlined />,
      label: t("admin.employer.sidebar.notification"),
      className: "sidebar-item",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: t("admin.employer.sidebar.account.title"),
      className: "sidebar-group",
      children: [
        {
          key: "/employer/profile",
          label: t("admin.employer.sidebar.account.profile"),
          icon: <MdManageAccounts />,
          className: "sidebar-subitem",
        },
        {
          key: "/employer/change-password",
          label: t("admin.employer.sidebar.account.changePassword"),
          icon: <RiLockPasswordLine />,
          className: "sidebar-subitem",
        },
      ],
    },
    {
      key: "3",
      icon: <IoBusinessOutline />,
      label: t("admin.employer.sidebar.company.title"),
      className: "sidebar-group",
      children: [
        {
          key: "/employer/company",
          label: t("admin.employer.sidebar.company.info"),
          icon: <TiBusinessCard />,
          className: "sidebar-subitem",
        },
        {
          key: "/employer/business-certificate",
          label: t("admin.employer.sidebar.company.certificate"),
          icon: <FaRegNewspaper />,
          className: "sidebar-subitem",
        },
      ],
    },
    {
      key: "/employer/post-job",
      icon: <UploadOutlined />,
      label: t("admin.employer.sidebar.postJob"),
      className: "sidebar-item",
    },
    {
      key: "/employer/manage-list-jobs",
      icon: <LiaBriefcaseSolid />,
      label: t("admin.employer.sidebar.manageJobs"),
      className: "sidebar-item",
    },
    {
      key: "/employer/applicant/list-job",
      icon: <TeamOutlined />,
      label: t("admin.employer.sidebar.applicant"),
      className: "sidebar-item",
    },
    {
      key: "/employer/list-resumes",
      icon: <SolutionOutlined />,
      label: t("admin.employer.sidebar.resumes"),
      className: "sidebar-item",
    },
    {
      key: "/employer/interview",
      icon: <IoMdChatboxes />,
      label: t("admin.employer.sidebar.interview"),
      className: "sidebar-item",
    },
    {
      key: "/employer/list-order",
      icon: <AiOutlinePayCircle />,
      label: t("admin.employer.sidebar.orders"),
      className: "sidebar-item",
    },
    {
      key: "/employer/chat",
      icon: <MdOutlineMessage />,
      label: t("admin.employer.sidebar.messages"),
      className: "sidebar-item",
    },
    {
      key: "/employer/buy-service",
      icon: <BsTicketPerforated />,
      label: t("admin.employer.sidebar.services"),
      className: "sidebar-item",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("admin.employer.sidebar.logout"),
      className: "sidebar-item logout",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      let res = await getInfor();
      dispatch(setInfor(res.data));
      if (res.status !== "OK") {
        message.error(t("admin.messages.error"));
      }
    };

    if (localStorage.getItem("accessToken") === null) {
      window.location.href = "/employer/login";
    } else {
      if (user.role === "employer") {
        fetchData();
      } else window.location.href = "/employer/login";
    }
  }, []);

  const logout = async () => {
    dispatch(loading());
    try {
      const res = await logOut();
      if (res.status === "OK") {
        removeAllToken();
        message.success(res.message);
        navigate("login");
        clearRedux();
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(stop());
    }
  };

  useEffect(() => {
    setDefaultImage(
      "https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png"
    );
  }, []);

  if (localStorage.getItem("accessToken") === null) {
    return null;
  }

  const handleMenu = (key) => {
    if (key.key === "logout") {
      logout();
    } else {
      navigate(key.key);
    }
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate("/employer/profile")}>
        <UserOutlined /> {t("admin.employer.sidebar.account.profile")}
      </Menu.Item>
      <Menu.Item key="company" onClick={() => navigate("/employer/company")}>
        <IoBusinessOutline /> {t("admin.employer.sidebar.company.info")}
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" onClick={logout} danger>
        <LogoutOutlined /> {t("admin.employer.sidebar.logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="employer-layout">
      <Sider
        className="employer-sider"
        onBreakpoint={(broken) => {
          setCollapsed(broken);
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        width={250}
        style={siderStyle}
        theme="light"
      >
        <div className="logo-container">
          {collapsed ? (
            <img src={defaultImage} alt="logo" className="logo-small" />
          ) : (
            <img src={defaultImage} alt="logo" className="logo-large" />
          )}
        </div>
        <Menu
          onSelect={(key) => handleMenu(key)}
          selectedKeys={[location.pathname]}
          theme="light"
          className="sidebar-menu"
          mode="inline"
          items={itemSider}
        />
      </Sider>
      <Layout className="site-layout">
        <Header className="header-employer">
          <Flex
            align="center"
            justify="space-between"
            className="header-content"
          >
            <div className="header-left">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="menu-trigger"
              />
              <div className="company-info">
                {!collapsed && companyName && (
                  <Text strong className="company-name">
                    {companyName}
                  </Text>
                )}
              </div>
            </div>

            <div className="header-right">
              {searchVisible ? (
                <Input
                  className="search-input"
                  placeholder={t("common.search")}
                  prefix={<SearchOutlined />}
                  onBlur={() => setSearchVisible(false)}
                  autoFocus
                />
              ) : (
                <Button
                  onClick={() => setSearchVisible(true)}
                  className="search-button"
                  type="text"
                  icon={<SearchOutlined />}
                />
              )}

              <Tooltip title={t("employer.header.cart")}>
                <Badge count={0} size="small">
                  <Button
                    onClick={() => navigate("/employer/cart")}
                    className="header-icon-button"
                    type="text"
                    icon={<ShoppingCartOutlined />}
                  />
                </Badge>
              </Tooltip>

              <NotificationIcon userId={user.userId} />

              <ChangeLanguageBtn className="language-button" />

              <Dropdown
                overlay={userMenu}
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="user-profile">
                  <Avatar
                    size={40}
                    className="avatar"
                    icon={<UserOutlined />}
                    src={avatar}
                  />
                  {!collapsed && (
                    <Space direction="vertical" size={0} className="user-info">
                      <Text strong className="username">{`${
                        employerInfo?.firstName || ""
                      } ${employerInfo?.lastName || ""}`}</Text>
                      <Text type="secondary" className="user-role">
                        {t("role.EMPLOYER")}
                      </Text>
                    </Space>
                  )}
                </div>
              </Dropdown>
            </div>
          </Flex>
        </Header>
        <Content className="content-employer">
          <div className="page-content">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmployerLayout;
