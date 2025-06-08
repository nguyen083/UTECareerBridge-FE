import { Modal, Form, Input, Button } from "antd";
import { useCreateForumMutation } from "../../../../composables/forum";
import { UploadImage } from "../../../../components/Student/Component/UploadAvatar";
import { useTranslation } from "react-i18next";
const { TextArea } = Input;

const CreateForumModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const createMutation = useCreateForumMutation();
  const { t } = useTranslation();

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
      title={t("forum.createModal.title")}
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
          label={t("forum.createModal.name.label")}
          rules={[
            { required: true, message: t("forum.createModal.name.required") },
          ]}
        >
          <Input placeholder={t("forum.createModal.name.placeholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("forum.createModal.description.label")}
          rules={[
            {
              required: true,
              message: t("forum.createModal.description.required"),
            },
          ]}
        >
          <TextArea
            placeholder={t("forum.createModal.description.placeholder")}
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>
        <Form.Item
          label={t("forum.createModal.image.label")}
          name="image"
          tooltip={t("forum.createModal.image.tooltip")}
          rules={[
            {
              required: true,
              message: t("forum.createModal.image.required"),
            },
          ]}
        >
          <UploadImage link="admin/forums" aspect={1 / 1} />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Button className="mr-2" onClick={handleCancel}>
            {t("forum.createModal.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={createMutation.isPending}
          >
            {t("forum.createModal.create")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateForumModal;
