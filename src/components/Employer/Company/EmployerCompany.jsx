import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Row,
  Select,
  message,
  Card,
  Tooltip,
  Tabs,
  Divider,
} from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import "./EmployerCompany.scss";
import { useEffect, useState } from "react";
import { IoMdTrash } from "react-icons/io";
import {
  getAllBenefit,
  getAllIndustry,
  updateEmployerCompanyProfile,
} from "../../../services/apiService";
import { PlusCircleFilled } from "@ant-design/icons";
import CustomizeQuill from "../../Generate/CustomizeQuill";
import { useSelector, useDispatch } from "react-redux";
import { setInfor } from "../../../redux/action/employerSlice";
import { UploadImage } from "../../Student/Component/UploadAvatar";
import { useTranslation } from "react-i18next";
import { SaveOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const EmployerCompany = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [industries, setIndustries] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const dispatch = useDispatch();
  const { TextArea } = Input;
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basicInfo");

  const defaultLogo = useSelector((state) => state.employer.companyLogo);
  const defaultBackground = useSelector(
    (state) => state.employer.backgroundImage
  );

  const infor = {
    ...useSelector((state) => state.employer),
    companyLogo: defaultLogo,
    backgroundImage: defaultBackground,
  };

  const handleReset = () => {
    form.resetFields();
    message.info(t("employer.company.resetForm"));
  };

  const handleSubmit = (values) => {
    const keyValueObject = {};
    values.benefitArray.forEach((item, index) => {
      keyValueObject[`benefitDetails[${index}].benefitId`] = item.benefitId;
      keyValueObject[`benefitDetails[${index}].description`] = item.description;
    });

    // eslint-disable-next-line
    const { benefitArray, ...rest } = values;
    values = { ...rest, ...keyValueObject };

    setLoading(true);
    updateEmployerCompanyProfile(values)
      .then((res) => {
        if (res.status === "OK") {
          message.success(res.message);
          dispatch(setInfor(res.data));
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        message.error(t("common.error"));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllIndustry()
      .then((res) => {
        setIndustries(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
    getAllBenefit()
      .then((res) => {
        setBenefits(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <BoxContainer className="shadow-md company-content">
        <div className=" title1">{t("employer.company.info")}</div>
        <Divider />
        <Card className="company-card" bordered={false}>
          <Form
            onFinish={handleSubmit}
            form={form}
            size="large"
            layout="vertical"
            requiredMark={false}
            autoComplete="false"
            initialValues={infor}
            className="company-form"
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              type="card"
              className="company-tabs"
            >
              <TabPane
                tab={
                  <span className="tab-label">
                    {t("employer.company.basicInfo")}
                  </span>
                }
                key="basicInfo"
              >
                <Row gutter={[24, 16]}>
                  <Col xs={24}>
                    <Form.Item
                      name="companyName"
                      label={
                        <span>
                          {t("admin.employer.register.companyName")}
                          <span className="text-red-500"> *</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t(
                            "admin.employer.register.companyNameRequired"
                          ),
                        },
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={14}>
                    <Form.Item
                      name="companyAddress"
                      label={
                        <span>
                          {t("admin.employer.register.companyAddress")}
                          <span className="text-red-500"> *</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t(
                            "admin.employer.register.companyAddressRequired"
                          ),
                        },
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                    >
                      <Input
                        allowClear
                        placeholder={t("employer.company.addressPlaceholder")}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={10}>
                    <Form.Item
                      name="companySize"
                      label={t("employer.company.size")}
                    >
                      <Select className="size-select">
                        <Select.Option value="">
                          {t("employer.company.sizePlaceholder")}
                        </Select.Option>
                        <Select.Option value="Ít hơn 10">
                          {t("employer.company.sizeLessThan10")}
                        </Select.Option>
                        <Select.Option value="10-24">10&#8722;24</Select.Option>
                        <Select.Option value="25-99">25&#8722;99</Select.Option>
                        <Select.Option value="100-499">
                          100&#8722;499
                        </Select.Option>
                        <Select.Option value="500-999">
                          500&#8722;999
                        </Select.Option>
                        <Select.Option value="1.000-4.999">
                          1.000&#8722;4.999
                        </Select.Option>
                        <Select.Option value="5.000-9.999">
                          5.000&#8722;9.999
                        </Select.Option>
                        <Select.Option value="10.000-19.999">
                          10.000&#8722;19.999
                        </Select.Option>
                        <Select.Option value="20.000+">20.000+</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={14}>
                    <Form.Item
                      name="companyEmail"
                      label={t("employer.company.email")}
                    >
                      <Input allowClear />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={10}>
                    <Form.Item
                      name="industryId"
                      label={
                        <span>
                          {t("employer.company.industry")}
                          <span className="text-red-500"> *</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t("employer.company.industryRequired"),
                        },
                        () => ({
                          validator(_, value) {
                            if (value === 0) {
                              return Promise.reject(
                                new Error(
                                  t("employer.company.industryRequired")
                                )
                              );
                            }
                            return Promise.resolve();
                          },
                        }),
                      ]}
                      validateTrigger={["onChange", "onBlur"]}
                    >
                      <Select className="industry-select">
                        <Select.Option value={0}>
                          {t("employer.company.industryPlaceholder")}
                        </Select.Option>
                        {industries.map((industry) => (
                          <Select.Option
                            key={industry.industryId}
                            value={industry.industryId}
                          >
                            {industry.industryName}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24}>
                    <Form.Item
                      label={
                        <span>
                          {t("employer.company.benefits")}
                          <span className="text-red-500"> *</span>
                        </span>
                      }
                      className="benefits-container"
                    >
                      <Form.List name="benefitArray">
                        {(fields, { add, remove }) => (
                          <div className="benefits-list">
                            {fields.map((field) => (
                              <Flex
                                key={field.name}
                                gap="middle"
                                className="benefit-item"
                              >
                                <Form.Item
                                  name={[field.name, "benefitId"]}
                                  className="benefit-type"
                                >
                                  <Select
                                    placeholder={t(
                                      "employer.company.benefitType"
                                    )}
                                  >
                                    {benefits.map((benefit) => (
                                      <Select.Option
                                        key={benefit.benefitId}
                                        value={benefit.benefitId}
                                      >
                                        {benefit.benefitName}
                                      </Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  name={[field.name, "description"]}
                                  className="benefit-description"
                                >
                                  <TextArea
                                    rows={3}
                                    allowClear
                                    placeholder={t(
                                      "employer.company.benefitDescriptionPlaceholder"
                                    )}
                                  />
                                </Form.Item>

                                <Tooltip title={t("common.remove")}>
                                  <Button
                                    size="middle"
                                    danger
                                    disabled={fields.length === 1}
                                    onClick={() => {
                                      remove(field.name);
                                    }}
                                    className="remove-benefit-btn"
                                    icon={<IoMdTrash />}
                                  />
                                </Tooltip>
                              </Flex>
                            ))}

                            {fields.length < 3 && (
                              <Button
                                className="add-benefit-btn"
                                onClick={() => add()}
                                icon={
                                  <PlusCircleFilled
                                    style={{ color: "#4096FF" }}
                                  />
                                }
                                type="text"
                              >
                                {t("employer.company.addBenefit")}
                              </Button>
                            )}
                          </div>
                        )}
                      </Form.List>
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>

              <TabPane
                tab={
                  <span className="tab-label">
                    {t("employer.company.mediaAndDescription")}
                  </span>
                }
                key="mediaDescription"
              >
                <Row gutter={[24, 24]}>
                  <Col xs={24}>
                    <Form.Item
                      name="companyDescription"
                      label={t("employer.company.description")}
                    >
                      <CustomizeQuill key="description" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="companyLogo"
                      label={t("employer.company.logo")}
                      tooltip={t("employer.company.logoTooltip")}
                      className="upload-field"
                    >
                      <UploadImage />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="backgroundImage"
                      label={t("employer.company.backgroundImage")}
                      tooltip={t("employer.company.imageTooltip")}
                      className="upload-field"
                    >
                      <UploadImage />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="companyWebsite"
                      label={t("admin.employer.register.companyWebsite")}
                    >
                      <Input
                        allowClear
                        placeholder={t("employer.company.websitePlaceholder")}
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      name="videoIntroduction"
                      label={t("employer.company.video")}
                    >
                      <Input
                        allowClear
                        placeholder={t("employer.company.videoPlaceholder")}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>

            <Flex
              gap="1rem"
              align="center"
              justify="end"
              className="form-actions"
            >
              <Button type="default" onClick={handleReset}>
                {t("common.reset")}
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                {t("common.save")}
              </Button>
            </Flex>
          </Form>
        </Card>
      </BoxContainer>
    </>
  );
};

export default EmployerCompany;
