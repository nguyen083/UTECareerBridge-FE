import React, { useEffect, useState } from 'react';
import { Select, Flex, Form } from 'antd';
import styles from './FilterPanel.module.scss';
import { getAllIndustry, getAllJobCategories, getAllJobLevels, getAllSkills } from '../../../services/apiService';
const { Option } = Select;

const FilterPanel = ({ onValuesChange, filters = null }) => {
  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([]);
  const [listIndustry, setListIndustry] = useState([]);
  const [listJobLevel, setListJobLevel] = useState([]);
  const [listSkill, setListSkill] = useState([]);


  const fetchData = () => {
    // fetch data
    getAllJobCategories().then((res) => {
      setListCategory(res.data.filter((item) => item.active === true).map((item) => ({
        label: item.jobCategoryName,
        value: +item.jobCategoryId
      })));
    })
    getAllJobLevels().then((res) => {
      setListJobLevel(res.data.filter((item) => item.active === true).map((item) => ({
        label: item.nameLevel,
        value: +item.jobLevelId
      })));
    })
    getAllSkills().then((res) => {
      setListSkill(res.data.filter((item) => item.active === true).map((item) => ({
        label: item.skillName,
        value: +item.skillId
      })));
    })
    getAllIndustry().then((res) => {
      setListIndustry(res.data.map((item) => ({
        label: item.industryName,
        value: +item.industryId
      })));
    })
  }

  useEffect(() => {
    fetchData();
    if (filters) {
      console.log(filters);
      onValuesChange(filters)
    }
  }, []);
  return (

    <Form size='large' form={form}
      className='w-100'
      onValuesChange={(_, allValues) => {
        console.log(allValues);
        onValuesChange(allValues)
      }}
      initialValues={filters}
    >
      <Flex gap={16} className='w-100'>
        <Form.Item name='categoryId' className={styles.wSelect}>
          <Select placeholder='Ngành nghề'
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {listCategory.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='industryId' className={styles.wSelect}>
          <Select placeholder='Lĩnh vực'
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {listIndustry.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='jobLevelId' className={styles.wSelect}>
          <Select placeholder='Cấp bậc'
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {listJobLevel.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name='skillId' className={styles.wSelect}>
          <Select placeholder='Kỹ năng'
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {listSkill.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Form.Item>
      </Flex>
    </Form >
  );
};
export default FilterPanel;