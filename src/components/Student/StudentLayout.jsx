import { useEffect, useState } from "react";
import "./StudentLayout.scss";
import "../Generate/CustomizePopover.scss";
import {
  Layout,
  Image,
  Button,
  Flex,
  Popover,
  Row,
  Col,
  Typography,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa6";
import FooterComponent from "../Generate/Footer.jsx";
import NotificationIcon from "../Generate/NotificationIcon.jsx";
import { useDispatch, useSelector } from "react-redux";
import PopoverAvatar from "./Header/PopoverAvatar.jsx";
import { setInforStudent } from "../../redux/action/studentSlice.jsx";
import { getInforStudent } from "../../services/apiService.jsx";
import JobSearchBar from "./Search/JobSearchBar.jsx";
import path from "../../constant/path.jsx";
import { useTranslation } from "react-i18next";
import ChangeLanguageBtn from "../Generate/ChangeLanguageBtn.jsx";
import { BsChatLeftText } from "react-icons/bs";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const PopoverCategory = ({ setOpen }) => {
  const navigate = useNavigate();
  const infor = useSelector((state) => state?.user);
  const { t } = useTranslation();

  return (
    <div className="dropdown-content">
      <Row gutter={[32, 16]}>
        <Col span={8}>
          <Title level={5}>{t("student.layout.jobs.title")}</Title>
          <Button
            size="large"
            type="text"
            onClick={() => {
              navigate("/search", {
                state: { filters: { jobStatus: "newest" } },
              });
              setOpen(false);
            }}
          >
            {t("student.layout.jobs.newest")}
          </Button>
          <Button
            size="large"
            type="text"
            onClick={() => {
              navigate("/search");
              setOpen(false);
            }}
          >
            {t("student.layout.jobs.search")}
          </Button>
        </Col>
        <Col span={8}>
          <Title level={5}>{t("student.layout.myJobs.title")}</Title>
          <Button
            size="large"
            type="text"
            onClick={() => {
              infor.role === "student"
                ? navigate("/my-job#job-saved")
                : navigate("login");
              setOpen(false);
            }}
          >
            {t("student.layout.myJobs.saved")}
          </Button>
          <Button
            size="large"
            type="text"
            onClick={() => {
              infor.role === "student"
                ? navigate("/my-job#job-applied")
                : navigate("login");
              setOpen(false);
            }}
          >
            {t("student.layout.myJobs.applied")}
          </Button>
          <Button
            size="large"
            type="text"
            onClick={() => {
              infor.role === "student"
                ? navigate("/recommend-job")
                : navigate("login");
              setOpen(false);
            }}
          >
            {t("student.layout.myJobs.recommend")}
          </Button>
        </Col>
        <Col span={8}>
          <Title level={5}>{t("student.layout.events.title")}</Title>
          <Button
            size="large"
            type="text"
            onClick={() => {
              navigate("/event");
              setOpen(false);
            }}
          >
            {t("student.layout.events.all")}
          </Button>
        </Col>
        <Col span={8}>
          <Title level={5}>{t("student.layout.company.title")}</Title>
          <Button
            size="large"
            type="text"
            onClick={() => {
              navigate("/company");
              setOpen(false);
            }}
          >
            {t("student.layout.company.all")}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

const StudentLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const infor = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (infor.role === "student") {
      getInforStudent()
        .then((res) => {
          if (res.status === "OK") {
            dispatch(setInforStudent(res.data));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const nagigateLogin = () => {
    infor.role === "employer"
      ? navigate("/employer")
      : navigate("/employer/login");
  };

  return (
    <Layout className="layout-student">
      <Header className="py-1 header-student">
        <Flex align="center" justify="space-between" className="w-full">
          <Image
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
            src={path.logo}
            alt="Website Logo"
            preview={false}
            width={150}
          />
          <JobSearchBar onSearch={() => {}} />
          <Flex gap={"1rem"} align="center">
            <Button className="rounded-full btn-header" size="large">
              <Flex gap={4}>
                <Link to="/forums">{t("student.layout.forum")}</Link>
              </Flex>
            </Button>
            <Popover
              open={open}
              onOpenChange={(e) => setOpen(e)}
              overlayClassName="customize-popover"
              placement="bottomRight"
              arrow={false}
              content={<PopoverCategory setOpen={setOpen} />}
              trigger={["click"]}
              destroyTooltipOnHide={true}
            >
              <Button className="rounded-full btn-header" size="large">
                <Flex gap={4}>
                  <MenuOutlined />
                  <div className="hidden md:block">
                    {t("all_categories.title")}
                  </div>
                </Flex>
              </Button>
            </Popover>
            <Button
              onClick={nagigateLogin}
              className="rounded-full btn-header"
              size="large"
            >
              {t("role.EMPLOYER")}
            </Button>
            <Flex
              gap={"0.5rem"}
              className="p-1 border rounded-full border-text-color"
            >
              <Button
                icon={<BsChatLeftText />}
                shape="circle"
                onClick={() => {
                  token ? navigate("/chat") : navigate("/login");
                }}
                className="ease-out transform rounded-full btn-header hover:scale-105"
                size="large"
              />
              <NotificationIcon
                userId={useSelector((state) => state.user.userId)}
              />
              <ChangeLanguageBtn />
              {infor.role !== "student" ? (
                <Button
                  onClick={() => navigate("/login")}
                  className="rounded-full btn-header btn-login hover:"
                  size="large"
                >
                  <Flex gap={4} align="center">
                    <FaUser />
                    <div className="hidden md:block">
                      {t("auth.login.title")}
                    </div>
                  </Flex>
                </Button>
              ) : (
                <PopoverAvatar />
              )}
            </Flex>
          </Flex>
        </Flex>
      </Header>
      <Content className="content-student">
        <Outlet />
      </Content>
      <Footer className="p-0">
        <FooterComponent />
      </Footer>
    </Layout>
  );
};

export default StudentLayout;
