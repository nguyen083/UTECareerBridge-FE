import { Input } from "antd";
import "./JobSearchBar.scss";
import { setKeyword } from "../../../redux/action/webSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";

const JobSearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (e) => {
    dispatch(setKeyword(e.target.value));
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleChange = (e) => {
    if (e.target.value === "") {
      dispatch(setKeyword(""));
    }
  };

  return (
    <div
      className={clsx(
        "search-input",
        location.pathname === "/home"
          ? "hidden"
          : "!flex items-center justify-center"
      )}
    >
      <Input
        placeholder={t("job.search.placeholder")}
        allowClear
        prefix={<SearchOutlined />}
        size="large"
        onPressEnter={(value) => handleSearch(value)}
        style={{ width: "500px" }}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};
export default JobSearchBar;
