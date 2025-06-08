import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Space,
  DatePicker,
  Steps,
  Radio,
  Card,
  message,
  Col,
  Row,
  Flex,
  Image,
} from "antd";
import "./EmployerRegister.scss";
import SubmitButton from "../Generate/SubmitButton";
import COLOR from "../styles/_variables";
import { registerEmployer } from "../../services/apiService";
import { Link, useNavigate } from "react-router-dom";
import path from "../../constant/path";
import { useTranslation } from "react-i18next";

const EmployerRegister = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t("admin.employer.register.contact"),
      content: "1",
    },
    {
      title: t("admin.employer.register.company"),
      content: "2",
    },
  ];

  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const gender = 0;
  const [DoB, setDoB] = useState("");
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({});
  const regChar = new RegExp(
    /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/
  );

  const onChange = (date, dateString) => {
    setDoB(dateString);
  };
  const next = () => {
    setCurrent(current + 1);
    setForm({ ...form, ...form2.getFieldsValue(), dob: DoB });
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const onFinish = (values) => {
    registerEmployer({ ...form, ...values })
      .then((res) => {
        if (res.status === "CREATED") {
          message.success(t("common.success"));
          form1.resetFields();
          form2.resetFields();
          navigate("/employer/login");
        }
      })
      .catch(() => {
        message.error(t("common.error"));
      });
  };

  return (
    <>
      <Flex
        className="form-register"
        align="center"
        justify="start"
        vertical
        gap={20}
      >
        <Image
          className="logo"
          src={path.logo}
          preview={false}
          width={200}
          onClick={() => navigate("/home")}
        />
        <Card
          style={{ backgroundColor: COLOR.cardColor }}
          className="w-3/4 mx-auto shadow-lg"
        >
          <span
            className="flex justify-center title"
            style={{ color: COLOR.textColor }}
          >
            {t("auth.register.title")}
          </span>
          <Steps
            className="w-3/4 p-5 mx-auto"
            current={current}
            items={items}
          />
          <Form
            form={form1}
            onFinish={onFinish}
            name="validateOnlyform1"
            requiredMark={false}
            layout="vertical"
            autoComplete="off"
            size="large"
          >
            {steps[current].content === "1" && (
              <div className="w-full mt-3">
                <Form
                  className="mb-0"
                  size="large"
                  form={form2}
                  name="validateOnlyform2"
                  requiredMark={false}
                  layout="vertical"
                  autoComplete="off"
                  initialValues={{ gender: 0, dob: DoB }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="first_name"
                        label={
                          <span>
                            {t("auth.register.firstName")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("auth.register.firstNameRequired"),
                          },
                          {
                            pattern: regChar,
                            message: t(
                              "admin.employer.register.invalidFirstName"
                            ),
                          },
                        ]}
                        validateTrigger={["onBlur"]}
                      >
                        <Input placeholder={t("auth.register.firstName")} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="last_name"
                        label={
                          <span>
                            {t("auth.register.lastName")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("auth.register.lastNameRequired"),
                          },
                          {
                            pattern: regChar,
                            message: t(
                              "admin.employer.register.invalidLastName"
                            ),
                          },
                        ]}
                        validateTrigger={["onBlur"]}
                      >
                        <Input placeholder={t("auth.register.lastName")} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="gender"
                        layout="horizontal"
                        label={t("auth.register.gender")}
                      >
                        <Radio.Group value={gender} className="mb-0">
                          <Space direction="vertical">
                            <Radio value={0}>{t("auth.register.male")}</Radio>
                            <Radio value={1}>{t("auth.register.female")}</Radio>
                          </Space>
                        </Radio.Group>
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="dob"
                        label={
                          <span>
                            {t("auth.register.birthday")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("auth.register.birthday"),
                          },
                        ]}
                        validateTrigger={["onChange"]}
                      >
                        <DatePicker
                          onChange={onChange}
                          className="w-full"
                          format={"DD/MM/YYYY"}
                          placeholder={t("auth.register.birthdayPlaceholder")}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="phone_number"
                        label={
                          <span>
                            {t("auth.register.phone")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("admin.employer.register.invalidPhone"),
                          },
                          {
                            pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                            message: t("admin.employer.register.invalidPhone"),
                          },
                        ]}
                        validateTrigger={["onBlur"]}
                      >
                        <Input placeholder={t("auth.register.phone")} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label={
                          <span>
                            {t("auth.register.email")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t("admin.employer.register.invalidEmail"),
                          },
                          {
                            type: "email",
                            message: t("admin.employer.register.invalidEmail"),
                          },
                        ]}
                        validateTrigger={["onBlur"]}
                      >
                        <Input placeholder={t("auth.register.email")} />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="password"
                        label={
                          <span>
                            {t("auth.register.password")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t(
                              "admin.employer.register.passwordMinLength"
                            ),
                          },
                          {
                            min: 8,
                            message: t(
                              "admin.employer.register.passwordMinLength"
                            ),
                          },
                          {
                            pattern: new RegExp(/^(?=.*[A-Z])/),
                            message: t(
                              "admin.employer.register.passwordUppercase"
                            ),
                          },
                          {
                            pattern: new RegExp(/^(?=.*[0-9])/),
                            message: t(
                              "admin.employer.register.passwordNumber"
                            ),
                          },
                          {
                            pattern: new RegExp(
                              /^(?=.*[!@#$%^&*(),.?":{}|<>])/
                            ),
                            message: t(
                              "admin.employer.register.passwordSpecial"
                            ),
                          },
                        ]}
                        validateFirst
                        validateTrigger={["onBlur"]}
                      >
                        <Input.Password
                          placeholder={t("auth.register.password")}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="retype_password"
                        label={
                          <span>
                            {t("auth.register.confirmPassword")}{" "}
                            <span className="text-red-500"> *</span>
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: t(
                              "admin.employer.register.passwordMismatch"
                            ),
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  t("admin.employer.register.passwordMismatch")
                                )
                              );
                            },
                          }),
                        ]}
                        validateTrigger={["onBlur"]}
                      >
                        <Input.Password
                          placeholder={t("auth.register.confirmPassword")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Flex justify="space-between" align="center">
                    <Link to="/employer/login" className="text-blue-500">
                      {t("auth.register.haveAccount")}
                    </Link>
                    {current < steps.length - 1 && (
                      <SubmitButton form={form2} onClick={next}>
                        {t("common.continue")}
                      </SubmitButton>
                    )}
                  </Flex>
                </Form>
              </div>
            )}
            {steps[current].content === "2" && (
              <div className="w-full mt-3">
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="company_name"
                      label={
                        <span>
                          {t("admin.employer.register.companyName")}{" "}
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
                      validateTrigger={["onBlur"]}
                    >
                      <Input
                        placeholder={t("admin.employer.register.companyName")}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="company_email"
                      label={
                        <span>
                          {t("admin.employer.register.companyEmail")}{" "}
                          <span className="text-red-500"> *</span>
                        </span>
                      }
                      rules={[
                        {
                          required: true,
                          message: t(
                            "admin.employer.register.companyEmailRequired"
                          ),
                        },
                        {
                          type: "email",
                          message: t(
                            "admin.admin.employer.register.invalidEmail"
                          ),
                        },
                      ]}
                      validateTrigger={["onBlur"]}
                    >
                      <Input
                        placeholder={t("admin.employer.register.companyEmail")}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item
                      name="company_address"
                      label={
                        <span>
                          {t("admin.employer.register.companyAddress")}{" "}
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
                      validateTrigger={["onBlur"]}
                    >
                      <Input
                        placeholder={t(
                          "admin.employer.register.companyAddress"
                        )}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="company_website"
                      label={t("admin.employer.register.companyWebsite")}
                    >
                      <Input
                        placeholder={t(
                          "admin.employer.register.companyWebsite"
                        )}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            )}
            <Flex justify="space-between" align="center">
              {current > 0 && (
                <Link to="/employer/login" className="text-blue-500">
                  {t("auth.register.haveAccount")}
                </Link>
              )}
              <div className="flex justify-between mt-4">
                {current > 0 && (
                  <Button className="mx-2" onClick={() => prev()}>
                    {t("common.cancel")}
                  </Button>
                )}

                {current === steps.length - 1 && (
                  <SubmitButton type="primary" form={form1} onClick={() => {}}>
                    {t("common.save")}
                  </SubmitButton>
                )}
              </div>
            </Flex>
          </Form>
        </Card>
      </Flex>
    </>
  );
};

export default EmployerRegister;
