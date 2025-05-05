import { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button, message } from "antd";
import TableListUser from "./TableListUser";
import BoxContainer from "../../Generate/BoxContainer";
import { getUserByUserId, updateUser } from "../../../services/apiService";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTranslation } from "react-i18next";

const { Option } = Select;

const ManageStudent = () => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [res, setRes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const handleEdit = async (record) => {
    try {
      setLoading(true);
      const response = await getUserByUserId(record.key);
      if (response && response.data) {
        setSelectedUser(response.data);
        form.setFieldsValue({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          dob: response.data.dob ? dayjs(response.data.dob, "DD/MM/YYYY") : null,
          active: response.data.active,
        });
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error loading user:", error);
      message.error(t("admin.student.messages.loadError", "Không thể tải thông tin người dùng"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Modal.confirm({
      title: t("admin.student.modal.deleteConfirm.title", "Xác nhận xóa"),
      content: t("admin.student.modal.deleteConfirm.content", "Bạn có chắc chắn muốn xóa người dùng này không?"),
      okText: t("admin.student.modal.deleteConfirm.okText", "Xóa"),
      okType: "danger",
      centered: true,
      cancelText: t("admin.student.modal.deleteConfirm.cancelText", "Hủy"),
      onOk: async () => {
        try {
          setLoading(true);
          //   await deleteUserById(userId);
          message.success(t("admin.student.messages.deleteSuccess", "Xóa người dùng thành công"));
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error(t("admin.student.messages.deleteError", "Không thể xóa người dùng"));
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
      
      // Only format dob if it exists
      if (values.dob) {
        values.dob = dayjs(values.dob).format("DD/MM/YYYY");
      }
      
      const response = await updateUser(selectedUser.userId, values);
      if (response && response.status === "OK") {
        setRes(response.data);
        message.success(t("admin.student.messages.updateSuccess", "Cập nhật thông tin người dùng thành công"));
        handleModalCancel();
      } else {
        message.error(t("admin.student.messages.updateError", "Cập nhật thông tin người dùng thất bại"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error(t("admin.student.messages.validateError", "Vui lòng kiểm tra lại thông tin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="title1">{t("admin.student.title", "Quản lý người tìm việc")}</div>
      </BoxContainer>
      <BoxContainer className="shadow-md">
        <TableListUser
          fetch={res}
          userType="student"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </BoxContainer>
      <Modal
        title={t("admin.student.modal.title", "Chỉnh sửa thông tin người dùng")}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="back" onClick={handleModalCancel}>
            {t("admin.student.modal.buttons.cancel", "Hủy")}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={form.submit}
          >
            {t("admin.student.modal.buttons.save", "Lưu thay đổi")}
          </Button>,
        ]}
        width={720}
      >
        <Form form={form} onFinish={handleModalOk} layout="vertical">
          <div style={{ display: "flex", gap: "20px" }}>
            <Form.Item
              name="lastName"
              label={t("admin.student.modal.form.lastName.label", "Họ")}
              style={{ flex: 1 }}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="firstName"
              label={t("admin.student.modal.form.firstName.label", "Tên")}
              style={{ flex: 1 }}
            >
              <Input disabled />
            </Form.Item>
          </div>

          <Form.Item
            name="email"
            label={t("admin.student.modal.form.email.label", "Email")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="phone"
            label={t("admin.student.modal.form.phone.label", "Số điện thoại")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="address"
            label={t("admin.student.modal.form.address.label", "Địa chỉ")}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item name="dob" label={t("admin.student.modal.form.dob.label", "Ngày sinh")}>
            <DatePicker
              format={"DD/MM/YYYY"}
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>

          <Form.Item
            name="active"
            label={t("admin.student.modal.form.status.label", "Trạng thái")}
          >
            <Select>
              <Option value={true}>
                {t("admin.student.modal.form.status.options.active", "Hoạt động")}
              </Option>
              <Option value={false}>
                {t("admin.student.modal.form.status.options.blocked", "Khóa")}
              </Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ManageStudent;
