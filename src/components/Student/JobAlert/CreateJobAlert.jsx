import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Flex, Card, Typography, Switch, InputNumber, Row, Col, message, Divider } from 'antd';
import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import { useSelector } from "react-redux";
import { getAllJobCategories, getAllJobLevels, getAllSkills, getAllIndustry } from '../../../services/apiService';
import notification from "../../../services/api/notification";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoMdMail } from "react-icons/io";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { MdNotificationsActive, MdOutlineWorkOutline } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { FaTags } from "react-icons/fa";

const { Option } = Select;
const { Title, Text } = Typography;

const frequencyOptions = [
  { value: 'DAILY', label: 'Mỗi ngày' },
  { value: 'WEEKLY', label: 'Mỗi tuần' },
  { value: 'MONTHLY', label: 'Mỗi tháng' }
];

const CreateJobAlert = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [companyFields, setCompanyFields] = useState([]);
  const userId = useSelector(state => state.user.userId);

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
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    fetchData();
  }, []);

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

      // Gọi API để tạo thông báo việc làm
      const response = await notification.createJobAlert(jobAlertData);
      
      if (response.status === 'OK') {
        message.success("Tạo thông báo việc làm thành công!");
        form.resetFields();
      } else {
        message.error("Không thể tạo thông báo việc làm. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error creating job alert:", error);
      message.error("Đã xảy ra lỗi khi tạo thông báo việc làm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BoxContainer width='100%' className="shadow-md">
        <div className='title1 flex items-center'>
          <MdNotificationsActive size={24} className="mr-2" />
          Tạo thông báo việc làm
        </div>
      </BoxContainer>
      
      <BoxContainer width='100%' className="shadow-md">
        <Row gutter={[24, 0]}>
          <Col span={16}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                notifyByEmail: true,
                notifyByApp: true,
                frequency: 'WEEKLY'
              }}
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
                  onClick={() => form.resetFields()}
                  className="mr-2"
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                  loading={loading}
                >
                  Tạo thông báo
                </Button>
              </Flex>
            </Form>
          </Col>
          
          <Col span={8}>
            <Card className="sticky top-24" bordered={false}>
              <Title level={5} className="mb-4">Hướng dẫn tạo thông báo việc làm</Title>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaTags className="mt-1 mr-2 text-blue-500" />
                  <Text>Điền chức danh công việc để nhận thông báo về các vị trí tương tự.</Text>
                </li>
                <li className="flex items-start">
                  <RiMoneyDollarCircleLine className="mt-1 mr-2 text-green-500" />
                  <Text>Nhập mức lương mong muốn để lọc các công việc phù hợp với yêu cầu của bạn.</Text>
                </li>
                <li className="flex items-start">
                  <MdOutlineWorkOutline className="mt-1 mr-2 text-orange-500" />
                  <Text>Chọn cấp bậc phù hợp với kinh nghiệm và kỹ năng của bạn.</Text>
                </li>
                <li className="flex items-start">
                  <IoMdMail className="mt-1 mr-2 text-red-500" />
                  <Text>Lựa chọn cách nhận thông báo phù hợp với bạn (email, ứng dụng hoặc cả hai).</Text>
                </li>
              </ul>

              <Divider />

              <Text type="secondary">
                Hệ thống sẽ gửi cho bạn thông báo về những cơ hội việc làm phù hợp với tiêu chí đã chọn 
                theo tần suất bạn đã thiết lập. Bạn có thể tạo nhiều thông báo việc làm khác nhau 
                với các tiêu chí khác nhau.
              </Text>
            </Card>
          </Col>
        </Row>
      </BoxContainer>
    </>
  );
};

export default CreateJobAlert;