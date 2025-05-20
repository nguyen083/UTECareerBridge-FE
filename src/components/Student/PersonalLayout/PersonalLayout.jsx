import {
  Col,
  List,
  Row,
  Typography,
  Flex,
  Card,
  Modal,
  Form,
  message,
  Switch,
  Radio,
  Menu,
  Button,
} from "antd";
import styles from "./PersonalLayout.module.scss";
import { useEffect, useState } from "react";
import {
  NotificationOutlined,
  PaperClipOutlined,
  SettingOutlined,
  SolutionOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { IoBriefcaseOutline } from "react-icons/io5";
import { HiLightBulb } from "react-icons/hi";
import { IoIosBusiness } from "react-icons/io";
import BoxContainer from "../../Generate/BoxContainer";
import {
  updateFindjob,
  updateResumeActive,
} from "../../../services/apiService";

import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { setFindJob } from "../../../redux/action/studentSlice";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useResume } from "../../../composables/resume";
const { Text } = Typography;
const { Meta } = Card;

const PersonalLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: resume, refetch: refetchResume } = useResume();
  const [listResume, setListResume] = useState([]);
  const [modalResume, setModalResume] = useState(false);
  const infor = useSelector((state) => state.student);
  const dispatch = useDispatch();
  const [formResume] = Form.useForm();
  const [address, setAddress] = useState("");
  const [resumeIdActive, setResumeIdActive] = useState(0);

  const menuItems = [
    {
      key: "/dashboard",
      label: <div className="text-base">{t("student.menu.dashboard")}</div>,
      icon: <SolutionOutlined />,
    },
    {
      key: "/profile",
      label: <div className="text-base">{t("student.menu.myResume")}</div>,
      icon: <SolutionOutlined />,
    },
    {
      key: "/cv-builder",
      label: (
        <div className="text-base">
          {t("student.menu.cvBuilder") || "CV Builder"}
        </div>
      ),
      icon: <PaperClipOutlined />,
    },
    {
      key: "/cv-analysis",
      label: (
        <div className="text-base">
          {t("student.menu.cvAnalysis") || "CV Analysis"}
        </div>
      ),
      icon: <RobotOutlined />,
    },
    {
      key: "/notification",
      label: <div className="text-base">{t("student.menu.notification")}</div>,
      icon: <NotificationOutlined />,
    },
    {
      key: "/my-company",
      label: <div className="text-base">{t("student.menu.myCompany")}</div>,
      icon: <IoIosBusiness />,
    },
    {
      key: "/my-job",
      label: <div className="text-base">{t("student.menu.myJob")}</div>,
      icon: <IoBriefcaseOutline />,
    },
    {
      key: "/student/job-alerts",
      label: <div className="text-base">{t("student.menu.jobAlerts")}</div>,
      icon: <NotificationOutlined />,
    },
    {
      key: "/recommend-job",
      label: <div className="text-base">{t("student.menu.recommend")}</div>,
      icon: <HiLightBulb />,
    },
    {
      key: "/account-management",
      label: (
        <div className="text-base">{t("student.menu.changePassword")}</div>
      ),
      icon: <SettingOutlined />,
    },
  ];
  const handleMenu = (menuItem) => {
    navigate(menuItem.key);
  };

  const getResumeActive = () => {
    listResume.length !== 0 &&
      listResume.forEach((item) => {
        if (item.acvite === true) {
          setResumeIdActive(item.id);
        }
      });
  };

  const fetchCV = () => {
    refetchResume();
  };

  useEffect(() => {
    getResumeActive();
  }, [listResume]);

  useEffect(() => {
    apiService
      .getInforAddress(
        infor.address,
        infor.provinceId,
        infor.districtId,
        infor.wardId
      )
      .then((res) => {
        console.log(res), setAddress(res);
      });
  }, [infor]);

  useEffect(() => {
    if (resume) {
      setListResume(
        resume.data.map((item) => {
          return {
            key: item.resumeId,
            id: item.resumeId,
            title: item.resumeTitle || "",
            description: item.resumeDescription || "",
            lastUpdated: item.updatedAt || 0,
            link: item.resumeFile || "",
            acvite: item.isActive,
          };
        })
      );
    }
  }, [resume]);

  const handleFindJob = () => {
    updateResumeActive(formResume.getFieldValue("resumeId")).then((res) => {
      if (res.status === "OK") {
        message.success(res.message);
        fetchCV();
        switchFindjob(true);
        setModalResume(false);
        setResumeIdActive(formResume.getFieldValue("resumeId"));
      } else {
        message.error(res.message);
      }
    });
  };

  const switchFindjob = (status = null) => {
    const check = status === null ? !infor.findingJob : status;
    updateFindjob(check).then((res) => {
      if (res.status === "OK") {
        dispatch(setFindJob(check));
      } else {
        message.error(t("cv.chooseResume"));
        setModalResume(true);
      }
    });
  };
  return (
    <>
      <Row gutter={[16, 8]} className="px-12 py-4">
        <Col span={5} className={styles["col_l"]}>
          <Row justify="center">
            <Col span={24}>
              <Card hoverable className={styles.card}>
                <Meta
                  title={
                    <div className="text-text-color">
                      {infor.lastName + " " + infor.firstName}
                    </div>
                  }
                  description={t("student.year", { year: infor?.year || 1 })}
                />
                <div className={styles.div}>
                  <Flex gap={16} justify="space-between" align="center">
                    <Text className="text-base text-text-color" strong>
                      {t("student.allowSearch")}
                    </Text>
                    <Switch
                      checked={infor.findingJob}
                      onChange={() => switchFindjob()}
                    />
                  </Flex>
                  <Button onClick={() => setModalResume(true)} type="link">
                    {t("student.setupResume")}
                  </Button>
                </div>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <BoxContainer
                className={styles.box_shadow}
                padding="1rem"
                width={"100%"}
              >
                <Menu
                  onSelect={(key) => handleMenu(key)}
                  className={styles.menu}
                  selectedKeys={[location.pathname]}
                  mode="inline"
                  items={menuItems}
                />
              </BoxContainer>
            </Col>
          </Row>
        </Col>

        <Col span={19} className={styles["col_c"]}>
          <Outlet context={{ infor, address, listResume, fetchCV }} />
        </Col>
      </Row>

      <Modal
        title={t("student.setupResume")}
        open={modalResume}
        onCancel={() => {
          setModalResume(false);
          formResume.resetFields();
        }}
        onOk={handleFindJob}
        cancelText={t("common.cancel")}
        okText={t("common.complete")}
      >
        <Form initialValues={{ resumeId: resumeIdActive }} form={formResume}>
          <Form.Item name="resumeId">
            <Radio.Group className="w-full">
              <List
                size="small"
                className={styles.ant_list}
                itemLayout="horizontal"
                split={false}
                dataSource={listResume}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      size="small"
                      bordered
                      style={{
                        borderRadius: "10px",
                        width: "100%",
                      }}
                    >
                      <Flex justify="space-between">
                        <Radio value={item.id} />
                        <div style={{ flexGrow: 1 }}>
                          <Typography.Link href={item.link} target="_blank">
                            {item.title}
                          </Typography.Link>
                          <br />
                          <Text type="secondary" italic className="text-xs">
                            <PaperClipOutlined /> {t("student.attachmentFile")}{" "}
                            • {t("student.updatedAt")}:{" "}
                            {item.lastUpdated.split(" ", 1)}
                          </Text>
                        </div>
                      </Flex>
                    </Card>
                  </List.Item>
                )}
              />
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default PersonalLayout;
