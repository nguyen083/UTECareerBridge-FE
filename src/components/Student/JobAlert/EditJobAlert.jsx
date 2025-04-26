import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Flex, Card, Typography, Switch, InputNumber, Row, Col, message, Divider } from 'antd';
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import BoxContainer from "../../Generate/BoxContainer";
import { useSelector } from "react-redux";
import { getAllJobCategories, getAllJobLevels, getAllSkills, getAllIndustry } from '../../../services/apiService';
import notification from "../../../services/api/notification";
import { IoNotificationsOutline } from "react-icons/io5";
import { BsArrowLeftShort } from "react-icons/bs";
import { FaFilter } from "react-icons/fa";

const { Option } = Select;
const { Title, Text } = Typography;

const frequencyOptions = [
  { value: 'DAILY', label: 'Mỗi ngày' },
  { value: 'WEEKLY', label: 'Mỗi tuần' },
  { value: 'MONTHLY', label: 'Mỗi tháng' }
];

const EditJobAlert = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [companyFields, setCompanyFields] = useState([]);
  const userId = useSelector(state => state.user.userId);

  // Lấy thông tin job alert hiện tại
  const fetchJobAlert = async () => {
    try {
      const response = await notification.getJobAlertById(id);
      
      if (response.status === 'OK') {
        const alertData = response.data;
        form.setFieldsValue({
          jobTitle: alertData.jobTitle,
          minSalary: alertData.minSalary,
          level: alertData.level,
          location: alertData.location,
          jobCategoryId: alertData.jobCategoryId,
          companyField: alertData.companyField,
          frequency: alertData.frequency,
          notifyByEmail: alertData.notifyByEmail,
          notifyByApp: alertData.notifyByApp
        });
      } else {
        message.error("Không thể tải thông tin thông báo việc làm");
        navigate('/student/job-alerts');
      }
    } catch (error) {
      console.error("Error fetching job alert:", error);
      message.error("Đã xảy ra lỗi khi tải thông tin thông báo việc làm");
      navigate('/student/job-alerts');
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách các danh mục công việc
        const categoriesRes = await getAllJobCategories();
        const filteredCategories = categoriesRes.data
          .filter(item => item.active === true)
          .map(item => ({
            value: item.jobCategoryId,
            label: item.jobCategoryName
          }));
        setCategories(filteredCategories);

        // Lấy danh sách các cấp độ công việc
        const levelsRes = await getAllJobLevels();
        const filteredLevels = levelsRes.data
          .filter(item => item.active === true)
          .map(item => ({
            value: item.jobLevelId,
            label: item.nameLevel
          }));
        setLevels(filteredLevels);

        // Lấy danh sách lĩnh vực công ty
        const industryRes = await getAllIndustry();
        const filteredIndustries = industryRes.data.map(item => ({
          value: item.industryId,
          label: item.industryName
        }));
        setCompanyFields(filteredIndustries);

        // Lấy thông báo việc làm hiện tại
        await fetchJobAlert();
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Xây dựng đối tượng JobAlert từ form values
      const jobAlertData = {
        jobTitle: values.jobTitle,
        minSalary: values.minSalary,
        level: values.level,
        location: values.location,
        jobCategoryId: values.jobCategoryId,
        companyField: values.companyField,
        frequency: values.frequency,
        notifyByEmail: values.notifyByEmail,
        notifyByApp: values.notifyByApp
      };

      // Gọi API để cập nhật thông báo việc làm
      const response = await notification.updateJobAlert(id, jobAlertData);
      
      if (response.status === 'OK') {
        message.success("Cập nhật thông báo việc làm thành công!");
        navigate('/student/job-alerts');
      } else {
        message.error("Không thể cập nhật thông báo việc làm. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error updating job alert:", error);
      message.error("Đã xảy ra lỗi khi cập nhật thông báo việc làm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    navigate('/student/job-alerts');
  };

  return (
    <>
      <BoxContainer width='100%' className="shadow-md">
        <div className='title1 flex items-center'>
          <Button
            icon={<BsArrowLeftShort size={24} />}
            type="link"
            onClick={goBack}
            style={{ marginLeft: -16 }}
          />
          Chỉnh sửa thông báo việc làm
        </div>
      </BoxContainer>
      
      <BoxContainer width='100%' className="shadow-md">
        {initialLoading ? (
          <div className="text-center py-8">Đang tải...</div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Card 
              title={<Title level={5} className="flex items-center"><FaFilter className="mr-2" /> Tiêu chí tìm kiếm việc làm</Title>}
              className="mb-4"
              bordered={false}
            >
              <Form.Item
                name="jobTitle"
                label="Chức danh công việc"
                rules={[{ required: false }]}
              >
                <Input 
                  placeholder="Nhập chức danh công việc bạn muốn tìm, ví dụ: Developer, Marketing" 
                  size="large"
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="Địa điểm"
                    rules={[{ required: false }]}
                  >
                    <Input 
                      placeholder="Nhập địa điểm làm việc"
                      size="large" 
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="jobCategoryId"
                    label="Ngành nghề"
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một ngành nghề" }]}
                  >
                    <Select
                      placeholder="Chọn ngành nghề"
                      size="large"
                    >
                      {categories.map(category => (
                        <Option key={category.value} value={category.value}>
                          {category.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="minSalary"
                    label="Mức lương tối thiểu"
                    rules={[{ required: false }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      size="large"
                      placeholder="Nhập mức lương tối thiểu"
                      formatter={value => value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
                      parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
                      addonAfter="VND"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="level"
                    label="Cấp bậc"
                    rules={[{ required: false }]}
                  >
                    <Select
                      placeholder="Chọn cấp bậc"
                      size="large"
                      mode="multiple"
                    >
                      {levels.map(level => (
                        <Option key={level.value} value={level.value}>
                          {level.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="companyField"
                label="Lĩnh vực công ty"
                rules={[{ required: false }]}
              >
                <Select
                  placeholder="Chọn lĩnh vực công ty"
                  size="large"
                  mode="multiple"
                >
                  {companyFields.map(field => (
                    <Option key={field.value} value={field.value}>
                      {field.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>

            <Card 
              title={<Title level={5} className="flex items-center"><IoNotificationsOutline className="mr-2" /> Tùy chọn thông báo</Title>}
              className="mb-4"
              bordered={false}
            >
              <Form.Item
                name="frequency"
                label="Tần suất nhận thông báo"
                rules={[{ required: true, message: "Vui lòng chọn tần suất nhận thông báo" }]}
              >
                <Select 
                  placeholder="Chọn tần suất nhận thông báo"
                  size="large"
                  options={frequencyOptions}
                />
              </Form.Item>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="notifyByEmail"
                    label="Nhận thông báo qua email"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Có" 
                      unCheckedChildren="Không"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="notifyByApp"
                    label="Nhận thông báo qua ứng dụng"
                    valuePropName="checked"
                  >
                    <Switch 
                      checkedChildren="Có" 
                      unCheckedChildren="Không"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Flex justify="end">
              <Button 
                type="default" 
                onClick={goBack}
                className="mr-2"
              >
                Hủy
              </Button>
              <Button 
                type="primary" 
                htmlType="submit"
                loading={loading}
              >
                Lưu thay đổi
              </Button>
            </Flex>
          </Form>
        )}
      </BoxContainer>
    </>
  );
};

export default EditJobAlert;