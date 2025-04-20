import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
const Page403 = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Result
      status="403"
      title="403"
      subTitle={t("errors.403")}
      extra={
        <Button onClick={() => navigate("/home")} size="large" type="primary">
          {t("errors.backToHome")}
        </Button>
      }
    />
  );
};
export default Page403;
