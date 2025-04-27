import { useState, useEffect } from "react";
import { 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  Button, 
  message, 
  Flex,
  Typography,
  Card,
  Statistic,
  Row,
  Col,
  Badge,
  Avatar
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PlusOutlined
} from "@ant-design/icons";
import TableListUser from "./TableListUser";
import BoxContainer from "../../Generate/BoxContainer";
import { getUserByUserId, updateUser, getAllUsers } from "../../../services/apiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTranslation } from "react-i18next";
import "./ManageStudent.scss";

const { Option } = Select;
const { Title, Text } = Typography;

const ManageListUser = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUserStats();
  }, [res]);

  const fetchUserStats = async () => {
    try {
      const response = await getAllUsers({ role: "student", page: 0, size: 1000 });
      if (response.status === "OK") {
        const users = response.data.userResponses;
        setStats({
          total: users.length,
          active: users.filter(user => user.active).length,
          blocked: users.filter(user => !user.active).length,
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleEdit = async (record) => {
    try {
      setLoading(true);
      const response = await getUserByUserId(record.key);
      if (response.data) {
        setSelectedUser(response.data);
        form.setFieldsValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          dob: dayjs(response.data.dob, "DD/MM/YYYY"),
          active: response.data.active,
        });
        setIsModalVisible(true);
      }
    } catch {
      message.error(t("admin.student.messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: t("admin.student.modal.deleteConfirm.title"),
      content: t("admin.student.modal.deleteConfirm.content"),
      okText: t("admin.student.modal.deleteConfirm.okText"),
      okType: "danger",
      centered: true,
      cancelText: t("admin.student.modal.deleteConfirm.cancelText"),
      onOk: async () => {
        try {
          setLoading(true);
          //   await deleteUserById(userId);
          message.success(t("admin.student.messages.deleteSuccess"));
        } catch {
          message.error(t("admin.student.messages.deleteError"));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleModalCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleModalOk = async (values) => {
    try {
      setLoading(true);
      dayjs.extend(customParseFormat);
      values.dob = dayjs(values.dob, "YYYY-MM-DD").format("DD/MM/YYYY");
      updateUser(selectedUser.userId, values).then((res) => {
        if (res.status === "OK") {
          setRes(res.data);
          message.success(t("admin.student.messages.updateSuccess"));
        } else {
          message.error(t("admin.student.messages.updateError"));
        }
      });
      handleModalCancel();
    } catch {
      message.error(t("admin.student.messages.validateError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BoxContainer className="shadow-md admin-header">
        <Flex align="center" justify="space-between">
          <Title level={3} className="m-0">{t("admin.student.title")}</Title>
          
        </Flex>
      </BoxContainer>

      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title={t("admin.student.stats.total")}
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title={t("admin.student.stats.active")}
              value={stats.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title={t("admin.student.stats.blocked")}
              value={stats.blocked}
              prefix={<StopOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <BoxContainer className="shadow-md student-table-container">
        <TableListUser
          fetch={res}
          userType="student"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </BoxContainer>
      
      <Modal
        title={
          <div className="modal-header">
            <UserOutlined className="modal-icon" />
            <span>{t("admin.student.modal.title")}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            {t("admin.student.modal.buttons.cancel")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={form.submit}
          >
            {t("admin.student.modal.buttons.save")}
          </Button>,
        ]}
        width={720}
        centered
      >
        {selectedUser && (
          <div className="user-profile-header">
            <Avatar 
              size={80} 
              icon={<UserOutlined />} 
              src={selectedUser.avatar}
              className="user-avatar"
            />
            <div className="user-info">
              <Title level={4}>{`${selectedUser.lastName} ${selectedUser.firstName}`}</Title>
              <Badge 
                status={selectedUser.active ? "success" : "error"} 
                text={selectedUser.active ? 
                  t("admin.student.modal.form.status.options.active") : 
                  t("admin.student.modal.form.status.options.blocked")
                } 
              />
            </div>
          </div>
        )}
        
        <Form form={form} onFinish={handleModalOk} layout="vertical" className="edit-student-form">
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              name="lastName"
              label={t("admin.student.modal.form.lastName.label")}
              style={{ flex: 1 }}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="firstName"
              label={t("admin.student.modal.form.firstName.label")}
              style={{ flex: 1 }}
            >
              <Input disabled />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label={t("admin.student.modal.form.email.label")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("admin.student.modal.form.phone.label")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label={t("admin.student.modal.form.address.label")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="dob" label={t("admin.student.modal.form.dob.label")}>
            <DatePicker
              format={"DD/MM/YYYY"}
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="active"
            label={t("admin.student.modal.form.status.label")}
          >
            <Select>
              <Option value={true}>
                {t("admin.student.modal.form.status.options.active")}
              </Option>
              <Option value={false}>
                {t("admin.student.modal.form.status.options.blocked")}
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageListUser;
