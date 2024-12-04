import { Input } from "antd";
import { setKeyword } from "../../../redux/action/webSlice";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const JobSearchBar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

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
    <div style={{ display: 'flex', }}>
      <Input.Search
        placeholder="Tìm kiếm công việc, kỹ năng..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={(value) => handleSearch(value)}
        style={{ width: '500px' }}
        onChange={(e) => handleChange(e)}
      />
    </div>
  );
};
export default JobSearchBar;