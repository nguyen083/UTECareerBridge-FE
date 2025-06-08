import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Flex,
  Card,
  Typography,
  Switch,
  InputNumber,
  Row,
  Col,
  message,
  Space,
  Spin,
} from "antd";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import BoxContainer from "../../Generate/BoxContainer";
import {
  getAllJobCategories,
  getAllJobLevels,
  getAllIndustry,
} from "../../../services/apiService";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdEdit, MdNotificationsActive } from "react-icons/md";
import {
  useJobAlertById,
  useJobAlertUpdate,
} from "../../../composables/notification";

const { Title } = Typography;

const EditJobAlert = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [companyFields, setCompanyFields] = useState([]);
  const {
    data: jobAlert,
    isLoading: initialLoading,
    refetch: refetchJobAlert,
  } = useJobAlertById(id);
  const { mutate: updateJobAlert, isLoading: isUpdatingJobAlert } =
    useJobAlertUpdate();

  const frequencyOptions = [
    { value: "DAILY", label: "Hàng ngày" },
    { value: "WEEKLY", label: "Hàng tuần" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      getAllJobCategories().then((categoriesRes) => {
        setCategories(
          categoriesRes.data
            .filter((item) => item.active === true)
            .map((item) => ({
              value: item.jobCategoryId,
              label: item.jobCategoryName,
            }))
        );
      });

      getAllJobLevels().then((levelsRes) => {
        setLevels(
          levelsRes.data
            .filter((item) => item.active === true)
            .map((item) => ({
              value: item.jobLevelId,
              label: item.nameLevel,
            }))
        );
      });

      getAllIndustry().then((industryRes) => {
        setCompanyFields(
          industryRes.data.map((item) => ({
            value: item.industryId,
            label: item.industryName,
          }))
        );
      });
    };
    window.scrollTo({ top: 0, behavior: "smooth" });
    refetchJobAlert();
    fetchData();
  }, [id]);

  useEffect(() => {
    if (jobAlert?.data) {
      form.setFieldsValue(jobAlert?.data);
    }
  }, [jobAlert]);

  const handleSubmit = async (values) => {
    updateJobAlert(
      { id, values },
      {
        onSuccess: () => {
          message.success(t("student.jobAlerts.messages.updateSuccess"));
          navigate("/student/job-alerts");
        },
        onError: () => {
          message.error(t("student.jobAlerts.messages.updateError"));
        },
      }
    );
  };

  const goBack = () => {
    navigate("/student/job-alerts");
  };

  return (
    <Flex vertical gap={16}>
      <BoxContainer width="100%" className="shadow-md">
        <div className="flex items-center mb-12 title1">
          <MdEdit size={30} className="mr-3 text-text-color-hover" />
          <Title level={4} style={{ margin: 0 }}>
            {t("student.jobAlerts.form.updateJobAlert")}
          </Title>
        </div>

        {initialLoading ? (
          <div className="flex items-center justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={jobAlert?.data}
            size="large"
          >
            <Card
              title={
                <Title level={5} className="flex items-center mb-0">
                  <FaFilter className="mr-3 text-xl text-blue-600" />{" "}
                  {t("student.jobAlerts.form.title")}
                </Title>
              }
              className="mb-5 transition-shadow duration-300 shadow-sm hover:shadow-md"
              bordered={false}
            >
              <Form.Item
                name="jobTitle"
                label={t("student.jobAlerts.form.jobTitle")}
                rules={[
                  {
                    required: true,
                    message: t("student.jobAlerts.form.jobTitleRequired"),
                  },
                ]}
              >
                <Input
                  placeholder={t("student.jobAlerts.form.jobTitlePlaceholder")}
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label={t("student.jobAlerts.form.location")}
                    rules={[{ required: false }]}
                  >
                    <Input
                      placeholder={t(
                        "student.jobAlerts.form.locationPlaceholder"
                      )}
                      size="large"
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="jobCategoryId"
                    label={t("student.jobAlerts.form.jobCategory")}
                  >
                    <Select
                      placeholder={t(
                        "student.jobAlerts.form.jobCategoryPlaceholder"
                      )}
                      size="large"
                      allowClear
                      showSearch
                      options={categories}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="minSalary"
                    label={t("student.jobAlerts.form.minSalary")}
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      style={{ width: "100%" }}
                      size="large"
                      placeholder={t(
                        "student.jobAlerts.form.minSalaryPlaceholder"
                      )}
                      formatter={(value) =>
                        value
                          ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          : ""
                      }
                      parser={(value) =>
                        value ? value.replace(/\$\s?|(,*)/g, "") : ""
                      }
                      addonAfter="VND"
                      min={0}
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="level"
                    label={t("student.jobAlerts.form.level")}
                    rules={[{ required: false }]}
                  >
                    <Select
                      placeholder={t("student.jobAlerts.form.levelPlaceholder")}
                      size="large"
                      mode="multiple"
                      allowClear
                      options={levels}
                      filterOption={(input, option) =>
                        option.label.toLowerCase().includes(input.toLowerCase())
                      }
                      className="rounded-lg"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="companyField"
                label={t("student.jobAlerts.form.companyField")}
                rules={[{ required: false }]}
              >
                <Select
                  placeholder={t(
                    "student.jobAlerts.form.companyFieldPlaceholder"
                  )}
                  size="large"
                  mode="multiple"
                  allowClear
                  options={companyFields}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().includes(input.toLowerCase())
                  }
                  className="rounded-lg"
                />
              </Form.Item>
            </Card>

            <Card
              title={
                <Title level={5} className="flex items-center mb-0">
                  <IoNotificationsOutline className="mr-3 text-xl text-orange-500" />{" "}
                  {t("student.jobAlerts.form.notificationOptions")}
                </Title>
              }
              className="mb-5 transition-shadow duration-300 shadow-sm hover:shadow-md"
              bordered={false}
            >
              <Form.Item
                name="frequency"
                label={t("student.jobAlerts.form.frequency")}
              >
                <Select
                  placeholder={t("student.jobAlerts.form.frequencyPlaceholder")}
                  size="large"
                  options={frequencyOptions}
                  className="rounded-lg"
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="notifyByEmail"
                    label={
                      <Space>
                        <IoMdMail className="text-xl text-red-500" />
                        {t("student.jobAlerts.form.notifyByEmailLabel")}
                      </Space>
                    }
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={t("student.jobAlerts.form.yes")}
                      unCheckedChildren={t("student.jobAlerts.form.no")}
                      size="default"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notifyByApp"
                    label={
                      <Space>
                        <MdNotificationsActive className="text-xl text-blue-500" />
                        {t("student.jobAlerts.form.notifyByAppLabel")}
                      </Space>
                    }
                    valuePropName="checked"
                  >
                    <Switch
                      checkedChildren={t("student.jobAlerts.form.yes")}
                      unCheckedChildren={t("student.jobAlerts.form.no")}
                      size="default"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Flex justify="end" gap={12}>
              <Button
                type="default"
                onClick={goBack}
                size="large"
                className="rounded-lg"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdatingJobAlert}
                size="large"
                className="rounded-lg"
              >
                {t("common.save")}
              </Button>
            </Flex>
          </Form>
        )}
      </BoxContainer>
    </Flex>
  );
};

export default EditJobAlert;
