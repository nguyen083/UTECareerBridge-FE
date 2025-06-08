import { Modal, Form, Input, Button } from "antd";
import { useUpdateForumMutation } from "../../../../composables/forum";
import { UploadImage } from "../../../../components/Student/Component/UploadAvatar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

const EditForumModal = ({ open, onCancel, onSuccess, forumData }) => {
  const [form] = Form.useForm();
  const updateMutation = useUpdateForumMutation();
  const { t } = useTranslation();

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
      title={t("forum.editModal.title")}
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
          label={t("forum.editModal.name.label")}
          rules={[
            { required: true, message: t("forum.editModal.name.required") },
          ]}
        >
          <Input placeholder={t("forum.editModal.name.placeholder")} />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("forum.editModal.description.label")}
          rules={[
            {
              required: true,
              message: t("forum.editModal.description.required"),
            },
          ]}
        >
          <TextArea
            placeholder={t("forum.editModal.description.placeholder")}
            rows={4}
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label={t("forum.editModal.image.label")}
          name="image"
          tooltip={t("forum.editModal.image.tooltip")}
          rules={[
            {
              required: true,
              message: t("forum.editModal.image.required"),
            },
          ]}
        >
          <UploadImage link="admin/forums" aspect={1 / 1} />
        </Form.Item>

        <Form.Item className="flex justify-end mb-0">
          <Button className="mr-2" onClick={handleCancel}>
            {t("forum.editModal.cancel")}
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateMutation.isPending}
          >
            {t("forum.editModal.update")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForumModal;
