import { Flex, Form, Input, Button, message } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { changePassword } from "../../../../services/apiService";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AccountManagement = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    setLoading(true);
    changePassword(values)
      .then((res) => {
        if (res.status === "OK") {
          form.resetFields();
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
    <Flex vertical gap={8}>
      <BoxContainer className="shadow">
        <div className="title1">{t("student.accountManagement.title")}</div>
      </BoxContainer>
      <BoxContainer className="shadow">
        <Form
          form={form}
          onFinish={onFinish}
          layout="horizontal"
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
            label={t("student.accountManagement.currentPassword.label")}
            name="oldPassword"
            rules={[
              {
                required: true,
                message: t(
                  "student.accountManagement.currentPassword.required"
                ),
              },
            ]}
            validateTrigger={["onBlur"]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={t("student.accountManagement.newPassword.label")}
            name="newPassword"
            rules={[
              {
                required: true,
                message: t("student.accountManagement.newPassword.required"),
              },
              {
                min: 8,
                message: t("student.accountManagement.newPassword.minLength"),
              },
              {
                pattern: new RegExp(/^(?=.*[A-Z])/),
                message: t("student.accountManagement.newPassword.uppercase"),
              },
              {
                pattern: new RegExp(/^(?=.*[0-9])/),
                message: t("student.accountManagement.newPassword.number"),
              },
              {
                pattern: new RegExp(/^(?=.*[!@#$%^&*(),.?":{}|<>])/),
                message: t("student.accountManagement.newPassword.special"),
              },
            ]}
            validateFirst
            validateTrigger={["onBlur"]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label={t("student.accountManagement.confirmPassword.label")}
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: t(
                  "student.accountManagement.confirmPassword.required"
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      t("student.accountManagement.confirmPassword.mismatch")
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
          <Form.Item
            wrapperCol={{
              offset: 21,
            }}
          >
            <Button htmlType="submit" type="primary" loading={loading}>
              {t("student.accountManagement.save")}
            </Button>
          </Form.Item>
        </Form>
      </BoxContainer>
    </Flex>
  );
};

export default AccountManagement;
