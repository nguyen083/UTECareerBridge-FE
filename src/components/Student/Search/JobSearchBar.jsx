import { Input } from "antd";
import './JobSearchBar.scss';
import { setKeyword } from "../../../redux/action/webSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

const JobSearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSearch = (value) => {
    dispatch(setKeyword(value));
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
    <div className="flex search-input">
      <Input.Search
        placeholder={t('job.search.placeholder')}
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={(value) => handleSearch(value)}
        style={{ width: '500px' }}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};
export default JobSearchBar;