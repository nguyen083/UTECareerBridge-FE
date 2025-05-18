import { Modal, Form, Input, Button } from "antd";
import { useUpdateForumMutation } from "../../../../composables/forum";
import { UploadImage } from "../../../../components/Student/Component/UploadAvatar";
import { useEffect } from "react";

const { TextArea } = Input;

const EditForumModal = ({ open, onCancel, onSuccess, forumData }) => {
  const [form] = Form.useForm();
  const updateMutation = useUpdateForumMutation();

  // Cập nhật form khi dữ liệu forum thay đổi
  useEffect(() => {
    if (open && forumData) {
      form.setFieldsValue({
        name: forumData.name,
        description: forumData.description,
        image: forumData.image,
      });
    }
  }, [open, forumData, form]);

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    updateMutation.mutate(
      {
        id: forumData.forumId,
        ...values,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <Modal
      title="Chỉnh sửa diễn đàn"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Tên diễn đàn"
          rules={[{ required: true, message: "Vui lòng nhập tên diễn đàn!" }]}
        >
          <Input placeholder="Nhập tên diễn đàn" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ required: true, message: "Vui lòng nhập mô tả diễn đàn!" }]}
        >
          <TextArea
            placeholder="Nhập mô tả chi tiết về diễn đàn"
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh"
          name="image"
          tooltip="Hình ảnh diễn đàn"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn hình ảnh diễn đàn!",
            },
          ]}
        >
          <UploadImage link="admin/forums" aspect={1 / 1} />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Button className="mr-2" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isPending}
          >
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForumModal;
