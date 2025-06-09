import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../../services/api/auth";
import { message } from "antd";
import { setToken } from "../../services/apiService";
import { useRedux } from "../../utils/useRedux";
import { useTranslation } from "react-i18next";

const GoogleAuthCallback = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const code = queryParams.get("code");
  const state = queryParams.get("state");
  const navigate = useNavigate();
  const { login } = useRedux();
  const { t } = useTranslation();

  useEffect(() => {
    if (code) {
      const param = { code, login_type: "google", state };
      const role = atob(state);
      auth
        .sendCodeToBE(param)
        .then((res) => {
          console.log(res);
          if (res.status === "OK") {
            message.success(res.message);
            setToken(res.data.token, res.data.refreshToken);
            login(res);
            if (role === "student") {
              navigate("/home", { replace: true });
            } else if (role === "employer") {
              navigate("/employer", { replace: true });
            }
          } else {
            message.error(res.message);
            if (role === "student") {
              navigate("/login", { replace: true });
            } else if (role === "employer") {
              navigate("/employer/login", { replace: true });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          message.error(t("errors.loginFailedGoogle"));
          setTimeout(() => {
            window.close();
          }, 1500);
        });
    }
  }, []);
  return null;
};

export default GoogleAuthCallback;
