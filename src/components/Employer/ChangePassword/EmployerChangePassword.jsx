import { Button, Divider, Form, Input, message } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useSelector } from "react-redux";
import { changePassword } from "../../../services/apiService";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const EmployerChangePassword = () => {
  const { t } = useTranslation();
  const email = useSelector((state) => state.user.email);
  const [loading, setLoading] = useState(false);
  const infor = {
    email: email,
  };
  const onFinish = (values) => {
    setLoading(true);
    changePassword(values)
      .then((res) => {
        if (res.status === "OK") {
          message.success(res.message);
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="title1">{t("employer.changePassword.title")}</div>
        <Divider />
        <Form
          onFinish={onFinish}
          layout="horizontal"
          initialValues={infor}
          size="large"
          requiredMark={false}
          autoComplete="false"
          labelCol={{
            md: { span: 4 },
            span: 24,
          }}
          wrapperCol={{
            md: { span: 10 },
            span: 24,
          }}
        >
          <Form.Item
            label={t("employer.changePassword.loginEmail")}
            name="email"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label={t("employer.changePassword.currentPassword.label")}
            name="oldPassword"
            rules={[
              {
                required: true,
                message: t("employer.changePassword.currentPassword.required"),
              },
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={t("employer.changePassword.newPassword.label")}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t("employer.changePassword.newPassword.required"),
              },
              {
                min: 8,
                message: t("employer.changePassword.newPassword.minLength"),
              },
              {
                pattern: new RegExp(/^(?=.*[A-Z])/),
                message: t("employer.changePassword.newPassword.uppercase"),
              },
              {
                pattern: new RegExp(/^(?=.*[0-9])/),
                message: t("employer.changePassword.newPassword.number"),
              },
              {
                pattern: new RegExp(/^(?=.*[!@#$%^&*(),.?":{}|<>])/),
                message: t("employer.changePassword.newPassword.special"),
              },
            ]}
            validateFirst
            validateTrigger={["onBlur"]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={t("employer.changePassword.confirmPassword.label")}
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: t("employer.changePassword.confirmPassword.required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      t("employer.changePassword.confirmPassword.mismatch")
                    )
                  );
                },
              }),
            ]}
            validateFirst
            validateTrigger={["onBlur"]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24, offset: 13 }}>
            <Button loading={loading} htmlType="submit" type="primary">
              {t("employer.changePassword.save")}
            </Button>
          </Form.Item>
        </Form>
      </BoxContainer>
    </>
  );
};

export default EmployerChangePassword;
