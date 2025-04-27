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
  Divider,
  Space,
} from "antd";
import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import {
  getAllJobCategories,
  getAllJobLevels,
  getAllIndustry,
} from "../../../services/apiService";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdNotificationsActive, MdOutlineWorkOutline } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import { useJobAlertCreate } from "../../../composables/notification";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const CreateJobAlert = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [companyFields, setCompanyFields] = useState([]);
  const navigate = useNavigate();

  const { mutate: createJobAlert, isLoading: loading } = useJobAlertCreate();

  const frequencyOptions = [
    { value: "DAILY", label: "Hàng ngày" },
    { value: "WEEKLY", label: "Hàng tuần" },
  ];
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchData = () => {
      getAllJobCategories().then((res) => {
        setCategories(
          res.data
            .filter((item) => item.active === true)
            .map((item) => ({
              value: item.jobCategoryId,
              label: item.jobCategoryName,
            }))
        );
      });

      getAllJobLevels().then((res) => {
        setLevels(
          res.data
            .filter((item) => item.active === true)
            .map((item) => ({
              value: item.jobLevelId,
              label: item.nameLevel,
            }))
        );
      });

      getAllIndustry().then((res) => {
        setCompanyFields(
          res.data.map((item) => ({
            value: item.industryId,
            label: item.industryName,
          }))
        );
      });
    };
    fetchData();
    return () => {
      setCategories([]);
      setLevels([]);
      setCompanyFields([]);
    };
  }, []);

  const handleSubmit = (values) => {
    console.log(values);
    createJobAlert(values, {
      onSuccess: () => {
        message.success(t("student.jobAlerts.messages.createSuccess"));
        form.resetFields();
        navigate("/student/job-alerts");
      },
      onError: () => {
        message.error(t("student.jobAlerts.messages.createError"));
      },
    });
  };

  return (
    <Flex vertical gap={16}>
      <BoxContainer width="100%" className="shadow-md">
        <div className="flex items-center mb-12 title1">
          <MdNotificationsActive
            size={30}
            className="mr-3 text-text-color-hover"
          />
          <Title level={4} style={{ margin: 0 }}>
            {t("student.jobAlerts.create")}
          </Title>
        </div>
        <Row gutter={[32, 0]}>
          <Col xs={24} lg={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                jobTitle: null,
                location: "",
                jobCategoryId: null,
                minSalary: null,
                level: [],
                companyField: [],
                notifyByEmail: true,
                notifyByApp: true,
                frequency: "DAILY",
              }}
              size="large"
            >
              <Card
                title={
                  <Title level={5} className="flex items-center mb-0">
                    <FaFilter className="mr-3 text-xl text-text-color-hover" />{" "}
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
                    placeholder={t(
                      "student.jobAlerts.form.jobTitlePlaceholder"
                    )}
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
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
                        placeholder={t(
                          "student.jobAlerts.form.levelPlaceholder"
                        )}
                        size="large"
                        mode="multiple"
                        allowClear
                        options={levels}
                        filterOption={(input, option) =>
                          option.label
                            .toLowerCase()
                            .includes(input.toLowerCase())
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
                    placeholder={t(
                      "student.jobAlerts.form.frequencyPlaceholder"
                    )}
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
                  onClick={() => {
                    form.resetFields();
                    navigate("/student/job-alerts");
                  }}
                  size="large"
                  className="rounded-lg"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="rounded-lg"
                >
                  {t("student.jobAlerts.form.createJobAlert")}
                </Button>
              </Flex>
            </Form>
          </Col>

          <Col xs={24} lg={8}>
            <Card
              className="sticky transition-shadow duration-300 shadow-sm top-24 hover:shadow-md"
              bordered={false}
              style={{ borderRadius: "12px" }}
            >
              <Title
                level={5}
                className="flex items-center mb-4 !font-semibold"
              >
                <FaTags className="mr-2 text-2xl text-blue-500" />
                {t("student.jobAlerts.help.title")}
              </Title>
              <ul className="pl-0 space-y-4 list-none">
                <li className="flex items-start gap-3 p-3 rounded-lg bg-blue-50">
                  <FaTags className="flex-shrink-0 mt-1 text-base text-blue-500" />
                  <Text className="text-sm">
                    {t("student.jobAlerts.help.jobTitle")}
                  </Text>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                  <RiMoneyDollarCircleLine className="flex-shrink-0 mt-1 text-base text-green-500" />
                  <Text className="text-sm">
                    {t("student.jobAlerts.help.minSalary")}
                  </Text>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-orange-50">
                  <MdOutlineWorkOutline className="flex-shrink-0 mt-1 text-base text-orange-500" />
                  <Text className="text-sm">
                    {t("student.jobAlerts.help.level")}
                  </Text>
                </li>
                <li className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                  <IoMdMail className="flex-shrink-0 mt-1 text-base text-red-500" />
                  <Text className="text-sm">
                    {t("student.jobAlerts.help.notification")}
                  </Text>
                </li>
              </ul>

              <Divider />

              <Text type="secondary" className="text-base">
                {t("student.jobAlerts.help.description")}
              </Text>
            </Card>
          </Col>
        </Row>
      </BoxContainer>
    </Flex>
  );
};

export default CreateJobAlert;
