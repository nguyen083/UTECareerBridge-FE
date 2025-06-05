import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Badge,
  Divider,
  Alert,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import axios from "../../../utils/axiosCustomize";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// API để quản lý cấu hình lịch trình gửi thông báo việc làm
const jobAlertScheduleApi = {
  // Lấy danh sách cấu hình lịch trình
  getConfigs: async () => {
    try {
      const response = await axios.get("/admin/job-alert-schedule/configs");
      console.log("API Response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error fetching job alert configs:", error);
      throw error;
    }
  },

  // Cập nhật cấu hình lịch trình bằng query params
  updateConfig: async (frequency, cronExpression) => {
    try {
      const response = await axios.post(
        "/admin/job-alert-schedule/configs/update",
        null,
        {
          params: {
            frequency,
            cronExpression,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating job alert config:", error);
      throw error;
    }
  },

  // Vô hiệu hóa cấu hình lịch trình
  disableConfig: async (frequency) => {
    try {
      const response = await axios.post(
        "/admin/job-alert-schedule/configs/disable",
        null,
        {
          params: {
            frequency,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error disabling job alert config:", error);
      throw error;
    }
  },

  // Kích hoạt cấu hình lịch trình
  enableConfig: async (frequency) => {
    try {
      const response = await axios.post(
        "/job-alert-schedule/configs/enable",
        null,
        {
          params: {
            frequency,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error enabling job alert config:", error);
      throw error;
    }
  },
};

const JobAlertScheduleConfig = () => {
  const { t } = useTranslation();
  const [configList, setConfigList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);
  const [form] = Form.useForm();

  const frequencyDescriptions = [
    { label: t("jobAlertSchedule.frequency.daily"), value: "DAILY" },
    { label: t("jobAlertSchedule.frequency.weekly"), value: "WEEKLY" },
    { label: t("jobAlertSchedule.frequency.monthly"), value: "MONTHLY" },
    { label: t("jobAlertSchedule.frequency.hourly"), value: "HOURLY" },
  ];

  const cronExpressionSamples = [
    { label: t("jobAlertSchedule.cronSamples.daily8am"), value: "0 0 8 * * ?" },
    {
      label: t("jobAlertSchedule.cronSamples.daily6pm"),
      value: "0 0 18 * * ?",
    },
    {
      label: t("jobAlertSchedule.cronSamples.weeklyMonday"),
      value: "0 0 8 ? * MON",
    },
    {
      label: t("jobAlertSchedule.cronSamples.weeklyFriday"),
      value: "0 0 9 ? * FRI",
    },
    { label: t("jobAlertSchedule.cronSamples.monthly"), value: "0 0 8 1 * ?" },
    {
      label: t("jobAlertSchedule.cronSamples.every2hours"),
      value: "0 0 */2 * * ?",
    },
    {
      label: t("jobAlertSchedule.cronSamples.every30mins"),
      value: "0 */30 * * * ?",
    },
  ];

  // Fetch dữ liệu
  const fetchConfigs = async () => {
    try {
      setLoading(true);
      console.log("Fetching configs..."); // Debug log
      const data = await jobAlertScheduleApi.getConfigs();
      console.log("Received data:", data); // Debug log
      console.log("Data type:", typeof data, "Is array:", Array.isArray(data)); // Debug log

      // Đảm bảo data là array
      if (Array.isArray(data)) {
        setConfigList(data);
        console.log("Config list updated:", data); // Debug log
      } else {
        console.error("Data is not an array:", data);
        setConfigList([]);
      }
    } catch (error) {
      console.error("Error in fetchConfigs:", error); // Debug log
      message.error(t("jobAlertSchedule.messages.loadError"));
      setConfigList([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const showEditModal = (config) => {
    setEditingConfig(config);
    form.setFieldsValue({
      frequency: config.frequency,
      cronExpression: config.cronExpression,
    });
    setModalVisible(true);
  };

  const showAddModal = () => {
    setEditingConfig(null);
    form.resetFields();
    form.setFieldsValue({
      active: true,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      await jobAlertScheduleApi.updateConfig(
        values.frequency,
        values.cronExpression
      );
      message.success(t("jobAlertSchedule.messages.updateSuccess"));
      setModalVisible(false);
      fetchConfigs();
    } catch {
      message.error(t("jobAlertSchedule.messages.updateError"));
    }
  };
  const handleCronSelect = (value) => {
    form.setFieldsValue({ cronExpression: value });
  };

  const columns = [
    {
      title: t("jobAlertSchedule.table.frequency"),
      dataIndex: "frequency",
      key: "frequency",
      width: "20%",
      render: (frequency) => (
        <div className="frequency-cell">
          <Badge
            status={frequencyBadgeStatus(frequency)}
            text={
              frequencyDescriptions.find((opt) => opt.value === frequency).label
            }
            className="text-sm font-medium"
          />
        </div>
      ),
    },
    {
      title: t("jobAlertSchedule.table.cronExpression"),
      dataIndex: "cronExpression",
      key: "cronExpression",
      width: "25%",
      render: (cronExpression) => (
        <Text code className="px-2 py-1 font-mono">
          {cronExpression}
        </Text>
      ),
    },
    {
      title: t("jobAlertSchedule.table.timeDescription"),
      key: "description",
      width: "45%",
      render: (_, record) => (
        <Text className="text-gray-600">
          {getCronDescription(record.cronExpression)}
        </Text>
      ),
    },
    {
      title: t("common.actions"),
      key: "action",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => showEditModal(record)}
          className="px-3 transition-transform duration-200 rounded-md h-9 hover:scale-105"
        >
          {t("common.edit")}
        </Button>
      ),
    },
  ];

  // Hàm helper để hiển thị trạng thái phù hợp dựa trên tần suất
  const frequencyBadgeStatus = (frequency) => {
    const map = {
      DAILY: "success",
      WEEKLY: "processing",
      MONTHLY: "warning",
      HOURLY: "error",
    };
    return map[frequency] || "default";
  };

  // Hàm chuyển đổi biểu thức cron sang văn bản dễ đọc
  const getCronDescription = (cronExpression) => {
    // Tìm mô tả phù hợp từ danh sách mẫu
    const sample = cronExpressionSamples.find(
      (s) => s.value === cronExpression
    );
    if (sample) {
      return sample.label;
    }

    // Logic để phân tích biểu thức cron thành văn bản dễ đọc
    // Đây chỉ là phiên bản đơn giản, trong thực tế bạn có thể cần logic phức tạp hơn
    const parts = cronExpression.split(" ");
    if (parts.length !== 6)
      return t("jobAlertSchedule.messages.invalidCronExpression");

    const [second, minute, hour] = parts;

    if (second === "0" && minute === "0") {
      if (hour.includes("*/")) {
        const interval = hour.replace("*/", "");
        return t("jobAlertSchedule.messages.everyXHours", {
          interval,
        });
      } else if (hour !== "*") {
        return t("jobAlertSchedule.messages.dailyAtTime", {
          hour,
        });
      }
    }

    if (minute.includes("*/")) {
      const interval = minute.replace("*/", "");
      return t("jobAlertSchedule.messages.everyXMinutes", {
        interval,
      });
    }

    return t("jobAlertSchedule.messages.customSchedule");
  };
  return (
    <BoxContainer>
      <div className="px-6 font-bold title1">{t("jobAlertSchedule.title")}</div>
      <Divider />
      <div>
        <Alert
          message={
            <span className="font-bold">
              {t("jobAlertSchedule.info.title")}
            </span>
          }
          description={t("jobAlertSchedule.info.description")}
          type="info"
          showIcon
          className="mb-6 border border-blue-200 rounded-lg"
        />
        <Card size="default">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
            <div>
              <Title level={4} className="!text-text-color">
                {t("jobAlertSchedule.list.title")}
              </Title>
              <Text type="secondary" className="!text-text-color-hover">
                {t("jobAlertSchedule.list.description")}
              </Text>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              size="large"
              className="h-10 px-5 transition-all duration-300 border-none rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-blue-600 hover:shadow-lg"
            >
              {t("jobAlertSchedule.list.addNew")}
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={configList}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total, range) =>
                t("jobAlertSchedule.list.total", {
                  start: range[0],
                  end: range[1],
                  total,
                }),
            }}
            className="overflow-hidden rounded-lg shadow-sm"
            rowClassName={(record, index) =>
              index % 2 === 0
                ? "bg-gray-50 hover:bg-blue-50 transition-colors duration-200"
                : "bg-white hover:bg-blue-50 transition-colors duration-200"
            }
          />
        </Card>
      </div>

      <Modal
        title={
          <div className="py-2 text-lg font-semibold text-gray-800">
            {editingConfig
              ? t("jobAlertSchedule.modal.edit")
              : t("jobAlertSchedule.modal.create")}
          </div>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={750}
        className="top-5"
        bodyStyle={{
          padding: "24px",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        {" "}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                name="frequency"
                label={
                  <span className="font-semibold text-gray-800">
                    {t("jobAlertSchedule.modal.frequency.label")}
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: t("jobAlertSchedule.modal.frequency.required"),
                  },
                ]}
              >
                <Select
                  placeholder={t(
                    "jobAlertSchedule.modal.frequency.placeholder"
                  )}
                  size="large"
                  className="rounded-lg"
                  options={frequencyDescriptions}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label={
                  <span className="font-semibold text-gray-800">
                    {t("jobAlertSchedule.modal.sampleTime.label")}
                  </span>
                }
                tooltip={t("jobAlertSchedule.modal.sampleTime.tooltip")}
              >
                <Select
                  placeholder={t(
                    "jobAlertSchedule.modal.sampleTime.placeholder"
                  )}
                  onChange={handleCronSelect}
                  allowClear
                  size="large"
                  className="rounded-lg"
                >
                  {cronExpressionSamples.map((sample) => (
                    <Option key={sample.value} value={sample.value}>
                      {sample.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="cronExpression"
            label={
              <span className="font-semibold text-gray-800">
                {t("jobAlertSchedule.modal.cronExpression.label")}
              </span>
            }
            rules={[
              {
                required: true,
                message: t("jobAlertSchedule.modal.cronExpression.required"),
              },
            ]}
            tooltip={t("jobAlertSchedule.modal.cronExpression.tooltip")}
          >
            <Input
              placeholder="0 0 8 * * ?"
              size="large"
              className="font-mono text-sm rounded-lg"
            />
          </Form.Item>

          <Card size="small" className="mb-6 rounded-lg bg-gray-50">
            <Paragraph className="m-0">
              <Text strong className="text-blue-600">
                {t("jobAlertSchedule.modal.cronExpression.guide.title")}{" "}
              </Text>
              <Text code className="px-2 py-1 rounded bg-blue-50">
                {t("jobAlertSchedule.modal.cronExpression.guide.format")}
              </Text>
            </Paragraph>

            <div className="mt-3">
              <Text strong className="text-gray-600">
                {t(
                  "jobAlertSchedule.modal.cronExpression.guide.examples.title"
                )}
              </Text>
              <ul className="mt-2 mb-0 space-y-1">
                <li>
                  <Text code>0 0 8 * * ?</Text> -{" "}
                  {t(
                    "jobAlertSchedule.modal.cronExpression.guide.examples.daily8am"
                  )}
                </li>
                <li>
                  <Text code>0 0 18 * * ?</Text> -{" "}
                  {t(
                    "jobAlertSchedule.modal.cronExpression.guide.examples.daily6pm"
                  )}
                </li>
                <li>
                  <Text code>0 0 8 ? * MON</Text> -{" "}
                  {t(
                    "jobAlertSchedule.modal.cronExpression.guide.examples.weeklyMonday"
                  )}
                </li>
                <li>
                  <Text code>0 0 8 1 * ?</Text> -{" "}
                  {t(
                    "jobAlertSchedule.modal.cronExpression.guide.examples.monthly"
                  )}
                </li>
              </ul>
            </div>
          </Card>

          <Divider className="my-6" />

          <div className="text-right">
            <Button
              onClick={() => setModalVisible(false)}
              size="large"
              className="h-10 mr-3 rounded-lg"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="h-10 px-5 border-none rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
            >
              {editingConfig ? t("common.update") : t("common.save")}
            </Button>
          </div>
        </Form>
      </Modal>
    </BoxContainer>
  );
};

export default JobAlertScheduleConfig;
