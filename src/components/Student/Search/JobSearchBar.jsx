import { Input } from "antd";
import "./JobSearchBar.scss";
import { setKeyword } from "../../../redux/action/webSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { clsx } from "clsx";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const JobSearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const keyWord = useSelector((state) => state.web.keyword);
  const [key, setKey] = useState(keyWord);

  const handleSearch = () => {
    dispatch(setKeyword(key));
    if (location.pathname !== "/search") {
      navigate("/search");
    }
  };

  const handleChange = (e) => {
    setKey(e.target.value);
  };

  useEffect(() => {
    if (key === "") {
      dispatch(setKeyword(""));
    }
  }, [key]);

  useEffect(() => {
    setKey(keyWord);
  }, [keyWord]);

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
        onPressEnter={() => handleSearch()}
        style={{ width: "500px" }}
        value={key}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};
export default JobSearchBar;
