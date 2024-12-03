import { Input } from "antd";

const JobSearchBar = ({ onSearch }) => {
  return (
    <div style={{ display: 'flex', marginBottom: 16 }}>
      <Input.Search
        placeholder="Tìm kiếm công việc, kỹ năng..."
        allowClear
        enterButton="Tìm kiếm"
        size="large"
        onSearch={onSearch}
      />
    </div>
  );
};
export default JobSearchBar;