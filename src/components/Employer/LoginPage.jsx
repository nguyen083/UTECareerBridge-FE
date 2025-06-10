import "./LoginPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { employerLogin, setToken } from "../../services/apiService";
import { UserOutlined, UnlockOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  Typography,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { loading, stop } from "../../redux/action/webSlice";
import { setInfor } from "../../redux/action/userSlice";
import { FcGoogle } from "react-icons/fc";
import path from "../../constant/path";
import auth from "../../services/api/auth";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^[0-9]{10,11}$/;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const checkUserName = (value) => {
    if (emailRegex.test(value)) {
      return { email: value };
    } else if (phoneRegex.test(value)) {
      return { phone_number: value };
    } else {
      return { "": value };
    }
  };

  const handleLogin = async (values) => {
    console.log(values);
    const { username, ...rest } = values;
    const updatedValues = {
      ...rest,
      ...checkUserName(username),
    };
    console.log(updatedValues);
    dispatch(loading());
    try {
      const res = await employerLogin(updatedValues);
      if (res.status === "OK") {
        message.success(t("auth.login.loginSuccess"));
        setToken(res.data.token, res.data.refreshToken);
        dispatch(
          setInfor({
            userId: res.data.id,
            role: res.data.roles.roleName,
            email: res.data.username,
          })
        );
        navigate("/employer");
      } else {
        message.error(t("auth.login.loginError"));
      }
    } catch {
      message.error(t("auth.login.loginError"));
    } finally {
      dispatch(stop());
    }
  };
  const handleLoginWithGoogle = () => {
    auth
      .loginGoogle("employer")
      .then((res) => {
        window.open(res);
      })
      .catch(() => {
        message.error(t("common.error"));
      });
  };
  return (
    <div className="flex login-page">
      <div className="hidden image lg:w-5/12 lg:block"></div>
      <div className="flex flex-col items-center justify-center w-full h-screen p-0 sm:p-5 lg:w-7/12">
        <Link to="/home" className="flex items-center">
          <Image
            className="logo"
            src={path.logo}
            alt=""
            preview={false}
            width={200}
            onClick={() => navigate("/home")}
          />
        </Link>
        <div className="p-5 mt-10 shadow-2xl login-form h-fit lg:w-7/12 ">
          <span className="flex justify-center title">
            {t("auth.login.title")}
          </span>
          <div className="mt-5 mb-4 md:w-full form-group">
            <Form
              size="large"
              requiredMark={false}
              form={form}
              onFinish={handleLogin}
              autoComplete="on"
              layout="vertical"
              validateTrigger={["onBlur"]}
            >
              <Form.Item
                name="username"
                label={t("auth.login.email/phone")}
                rules={[
                  {
                    required: true,
                    message: t("auth.register.emailRequired"),
                  },
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject(t("auth.register.emailRequired"));
                      }
                      if (emailRegex.test(value)) {
                        return Promise.resolve();
                      }
                      if (phoneRegex.test(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        t("admin.employer.register.invalidEmail")
                      );
                    },
                  }),
                ]}
                validateFirst
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder={t("auth.login.emailPlaceholder")}
                />
              </Form.Item>
              <Form.Item
                label={t("auth.register.password")}
                required
                name="password"
                rules={[
                  {
                    required: true,
                    message: t("auth.register.passwordRequired"),
                  },
                ]}
              >
                <Input.Password
                  prefix={<UnlockOutlined />}
                  placeholder={t("auth.login.passwordPlaceholder")}
                />
              </Form.Item>

              <Form.Item>
                <Flex justify="space-between">
                  <Flex gap={7} align="center" justify="center">
                    <Text>{t("auth.login.dont_have_an_account")}</Text>
                    <Link to="/employer/register">
                      {t("auth.register.title")}
                    </Link>
                  </Flex>
                  <Link to="/forgot-password" target="_blank">
                    {t("auth.login.forgotPassword")}
                  </Link>
                </Flex>
              </Form.Item>
              <Flex align="center" justify="space-between">
                <Button
                  size="large"
                  className="w-full"
                  type="primary"
                  htmlType="submit"
                >
                  {t("auth.login.title")}
                </Button>
              </Flex>
              <Divider className="mb-3">
                <div className="text-gray-500">{t("common.or")}</div>
              </Divider>

              <Form.Item className="mb-1">
                <Button
                  className="w-full"
                  type="default"
                  onClick={handleLoginWithGoogle}
                >
                  <FcGoogle size={24} className="mr-1" />
                  {t("auth.login.googleLogin")}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
