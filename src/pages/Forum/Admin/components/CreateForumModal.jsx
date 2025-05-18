import { Modal, Form, Input, Button } from "antd";
import { useCreateForumMutation } from "../../../../composables/forum";
import { UploadImage } from "../../../../components/Student/Component/UploadAvatar";
const { TextArea } = Input;

const CreateForumModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const createMutation = useCreateForumMutation();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <Modal
      title="Thêm diễn đàn mới"
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
            loading={createMutation.isPending}
          >
            Tạo mới
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForumModal;
