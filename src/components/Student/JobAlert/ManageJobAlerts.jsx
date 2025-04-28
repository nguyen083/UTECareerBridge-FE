import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Modal,
  message,
  Flex,
  Row,
  Col,
  Pagination,
  Spin,
  Empty,
  Tooltip,
  Badge,
  Divider,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  DollarOutlined,
  BankOutlined,
  TagsOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import { getAllJobLevels, getAllIndustry } from "../../../services/apiService";
import { MdNotificationsActive } from "react-icons/md";
import {
  useJobAlertById,
  useJobAlertByUserId,
  useJobAlertDelete,
} from "../../../composables/notification";

const { Text } = Typography;
const { confirm } = Modal;

const ManageJobAlerts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [levels, setLevels] = useState({});
  const [industries, setIndustries] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const size = searchParams.get("size") || 10;
  const {
    data: jobAlerts,
    isLoading: isLoadingJobAlerts,
    refetch: refetchJobAlerts,
  } = useJobAlertByUserId({ page: page - 1, size: size });
  const [jobAlertId, setJobAlertId] = useState(null);
  const { data: jobAlert, refetch: refetchJobAlert } =
    useJobAlertById(jobAlertId);
  const { mutate: deleteJobAlert } = useJobAlertDelete();

  const fetchReferenceData = () => {
    getAllJobLevels().then((levelsRes) => {
      const levelsMap = {};
      levelsRes.data.forEach((level) => {
        levelsMap[level.jobLevelId] = level.nameLevel;
      });
      setLevels(levelsMap);
    });

    getAllIndustry().then((industriesRes) => {
      const industriesMap = {};
      industriesRes.data.forEach((industry) => {
        industriesMap[industry.industryId] = industry.industryName;
      });
      setIndustries(industriesMap);
    });
  };

  const handleDelete = (alertId) => {
    confirm({
      centered: true,
      title: t("student.jobAlerts.messages.delete"),
      icon: <ExclamationCircleOutlined />,
      content: t("student.jobAlerts.messages.deleteConfirm"),
      okText: t("student.jobAlerts.messages.delete"),
      okType: "danger",
      cancelText: t("common.cancel"),
      onOk: async () => {
        deleteJobAlert(alertId, {
          onSuccess: () => {
            message.success(t("student.jobAlerts.messages.deleteSuccess"));
          },
          onError: () => {
            message.error(t("student.jobAlerts.messages.deleteError"));
          },
        });
      },
    });
  };

  const handleEdit = (alertId) => {
    navigate(`/student/job-alerts/edit/${alertId}`);
  };

  const handleAdd = () => {
    navigate("/student/job-alerts/create");
  };

  const formatFrequency = (frequency) => {
    const frequencyMap = {
      DAILY: "Hàng ngày",
      WEEKLY: "Hàng tuần",
    };
    return frequencyMap[frequency] || frequency;
  };

  const getFrequencyColor = (frequency) => {
    const colorMap = {
      DAILY: "volcano",
      WEEKLY: "purple",
    };
    return colorMap[frequency] || "blue";
  };

  const getNotificationMethods = (alert) => {
    const methods = [];
    if (alert.notifyByEmail) methods.push("Email");
    if (alert.notifyByApp) methods.push("Ứng dụng");
    return methods.join(", ");
  };

  const getLevelNames = (levelIds) => {
    if (!levelIds || levelIds.length === 0) return "Tất cả cấp bậc";
    if (!Array.isArray(levelIds)) return "Cấp bậc không hợp lệ";
    return levelIds.map((id) => levels[id] || `Cấp bậc ${id}`).join(", ");
  };

  const getIndustryNames = (industryIds) => {
    if (!industryIds || industryIds.length === 0) return "Tất cả lĩnh vực";
    if (!Array.isArray(industryIds)) return "Lĩnh vực không hợp lệ";
    return industryIds
      .map((id) => industries[id] || `Lĩnh vực ${id}`)
      .join(", ");
  };

  const handlePageChange = (page, pageSize) => {
    searchParams.set("page", page);
    searchParams.set("size", pageSize);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (jobAlert) {
      const matchedJobs = jobAlert.data.matchedJobs;
      // navigate(`/search/${jobAlertId}`);
    }
  }, [jobAlert]);

  useEffect(() => {
    if (jobAlertId) {
      refetchJobAlert();
    }
  }, [jobAlertId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchReferenceData();
  }, []);

  useEffect(() => {
    refetchJobAlerts();
  }, [searchParams]);

  return (
    <Flex vertical gap={16}>
      <BoxContainer width="100%" className="shadow-md">
        <div className="flex items-center justify-between mb-12 title1">
          <div className="flex items-center text-text-color">
            <MdNotificationsActive size={24} className="mr-2 text-text-color" />
            {t("student.jobAlerts.manage")}
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t("student.jobAlerts.create")}
          </Button>
        </div>
        {isLoadingJobAlerts ? (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        ) : !jobAlerts?.data?.content || jobAlerts.data.content.length === 0 ? (
          <Empty
            description={t("student.jobAlerts.messages.emptyText")}
            className="py-8"
          />
        ) : (
          <>
            <Row gutter={[16, 16]} className="pb-6">
              {jobAlerts.data.content.map((alert) => (
                <Col xs={24} key={alert.id}>
                  <Badge.Ribbon
                    text={formatFrequency(alert.frequency)}
                    color={getFrequencyColor(alert.frequency)}
                  >
                    <Card className="relative overflow-hidden transition-all duration-300 border-l-4 group border-l-text-color-hover">
                      <div className="absolute flex gap-2 space-x-1 transition-opacity duration-200 bottom-4 right-2">
                        {/* Xem công việc phù hợp */}
                        <Button
                          className="mr-4"
                          type="primary"
                          size="small"
                          onClick={() => {
                            setJobAlertId(alert.id);
                          }}
                        >
                          {t("student.jobAlerts.viewMatchedJobs")}
                        </Button>

                        {/* Chỉnh sửa */}
                        <Tooltip title={t("common.edit")}>
                          <Button
                            className="opacity-70"
                            type="text"
                            size="small"
                            icon={<EditOutlined className="text-blue-500" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(alert.id);
                            }}
                          />
                        </Tooltip>
                        {/* Xóa */}
                        <Tooltip title={t("common.delete")}>
                          <Button
                            className="opacity-70"
                            type="text"
                            size="small"
                            icon={<DeleteOutlined className="text-red-500" />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(alert.id);
                            }}
                          />
                        </Tooltip>
                      </div>
                      <Flex align="center" gap={20}>
                        <div className="flex-1 min-w-0">
                          {/* Tên công việc */}
                          <Text
                            strong
                            className="block mb-2 text-base font-semibold"
                          >
                            {alert.jobTitle ||
                              t("student.jobAlerts.form.allJobs")}
                          </Text>

                          <Divider type="horizontal" className="my-3" />
                          <Flex wrap="wrap" gap={16} className="!text-sm">
                            {/* Cấp bậc */}
                            <Row gutter={[16, 16]}>
                              <Col>
                                <Flex align="center" gap={2}>
                                  <TagsOutlined className="text-green-600 !text-lg" />
                                  <Text type="secondary" className="!text-sm">
                                    {t("student.jobAlerts.form.level")}:
                                  </Text>
                                  <Text
                                    className="!text-sm"
                                    ellipsis={{
                                      tooltip: getLevelNames(alert.level),
                                    }}
                                  >
                                    {getLevelNames(alert.level)}
                                  </Text>
                                </Flex>

                                {/* Lương tối thiểu */}
                                <Flex align="center" gap={2} className="mt-2">
                                  <DollarOutlined className="text-[goldenrod] !text-lg" />
                                  <Text type="secondary" className="!text-sm">
                                    {t("student.jobAlerts.form.minSalary")}:
                                  </Text>
                                  <Text className="!text-sm">
                                    {alert.minSalary
                                      ? `${alert.minSalary.toLocaleString(
                                          "vi-VN"
                                        )} VND`
                                      : "Không giới hạn"}
                                  </Text>
                                </Flex>
                              </Col>
                              <Col>
                                {/* Lĩnh vực */}
                                <Flex align="center" gap={2}>
                                  <BankOutlined className="text-purple-600 !text-lg" />
                                  <Text type="secondary" className="!text-sm">
                                    {t("student.jobAlerts.form.companyField")}:
                                  </Text>
                                  <Text
                                    className="!text-sm"
                                    ellipsis={{
                                      tooltip: getIndustryNames(
                                        alert.companyField
                                      ),
                                    }}
                                  >
                                    {getIndustryNames(alert.companyField)}
                                  </Text>
                                </Flex>

                                {/* Nhận qua */}
                                <Flex align="center" gap={2} className="mt-2">
                                  <BellOutlined className="text-blue-500 !text-lg" />
                                  <Text type="secondary" className="!text-sm">
                                    {t("student.jobAlerts.form.notifyByApp")}:
                                  </Text>
                                  <Text className="!text-sm">
                                    {getNotificationMethods(alert)}
                                  </Text>
                                </Flex>
                              </Col>
                            </Row>
                          </Flex>
                        </div>
                      </Flex>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>

            <Flex justify="end">
              <Pagination
                current={parseInt(page)}
                pageSize={parseInt(size)}
                total={jobAlerts?.data?.totalElements || 0}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
              />
            </Flex>
          </>
        )}
      </BoxContainer>
    </Flex>
  );
};

export default ManageJobAlerts;
