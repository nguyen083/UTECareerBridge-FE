import React, { useState } from 'react';
import { Layout, Row, Col, Card, Tag, Button, Input, Select, Checkbox } from 'antd';
import './FilterPanel.scss';
const { Content } = Layout;
const { Option } = Select;

const FilterPanel = ({ onFilter }) => {
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [skills, setSkills] = useState([]);

  const handleApplyFilters = () => {
    const filters = {
      location,
      salary,
      skills,
    };
    onFilter(filters);
  };

  return (
    <div className='filter-item'>
      <div className='select-job-category'>
       <div style={{ marginRight: 16 }}>
        <Select
          placeholder="Chọn ngành nghề"
          style={{ width: '100%' }}
          value={salary}
          onChange={(value) => setSalary(value)}
        >
          <Option value="">Ngành nghề</Option>
          <Option value="1000-2000">1000-2000 USD</Option>
          <Option value="2000-3000">2000-3000 USD</Option>
          <Option value="3000-4000">3000-4000 USD</Option>
        </Select>
      </div>
      <div className='select-salary'>
        <Select
          placeholder="Chọn mức lương"
          style={{ width: '100%' }}
          value={salary}
          onChange={(value) => setSalary(value)}
        >
          <Option value="">Mức lương</Option>
          <Option value="1000-2000">1000-2000 USD</Option>
          <Option value="2000-3000">2000-3000 USD</Option>
          <Option value="3000-4000">3000-4000 USD</Option>
        </Select>
      </div>
      <div className='select-level'>
        <Select
          placeholder="Chọn mức lương"
          style={{ width: '100%' }}
          value={salary}
          onChange={(value) => setSalary(value)}
        >
          <Option value="">Tất cả cấp bậc</Option>
          <Option value="1000-2000">Thực tập sinh</Option>
          <Option value="2000-3000">Mới tốt nghiệp</Option>
          <Option value="3000-4000">Kinh nghiệm 1 năm</Option>
        </Select>
      </div>
    </div>
    </div>
  );
};
export default FilterPanel;