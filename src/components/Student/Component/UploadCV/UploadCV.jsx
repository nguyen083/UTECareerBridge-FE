import {
  DeleteOutlined,
  MoreOutlined,
  InboxOutlined,
  PaperClipOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Tabs,
  List,
  Card,
  Typography,
  Button,
  Dropdown,
  Upload,
  message,
  Form,
  Modal,
  Input,
  Select,
  Progress,
  Tooltip,
} from "antd";
import styles from "./UploadCV.module.scss";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteCV, getAllJobLevels } from "../../../../services/apiService";
import {
  deleteImageFromCloudinaryByLink,
  uploadToCloudinary,
} from "../../../../services/uploadCloudary";
import { useTranslation } from "react-i18next";
import { useUploadResume } from "../../../../composables/resume";
const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;
const UploadCV = ({ listResume, fetchCV }) => {
  const resumeMutate = useUploadResume();
  const [url, setUrl] = useState("");
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [levelOptions, setLevelOptions] = useState([]);
  const { t } = useTranslation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const items = [
    {
      label: (
        <Text type="danger">
          <DeleteOutlined /> &ensp;{t("cv.uploadCV.delete")}
        </Text>
      ),
      key: "1",
      onClick: (e) => {
        Modal.confirm({
          centered: true,
          title: <span className="text-lg">{t("cv.confirmModal.title")}</span>,
          icon: <ExclamationCircleOutlined />,
          content: (
            <span className="text-base">{t("cv.confirmModal.content")}</span>
          ),
          okText: (
            <span className="text-base">{t("cv.confirmModal.okText")}</span>
          ),
          onOk: () => handleDelete(e),
          cancelText: (
            <span className="text-base">{t("cv.confirmModal.cancelText")}</span>
          ),
        });
      },
    },
  ];

  useEffect(() => {
    getAllJobLevels().then((res) => {
      setLevelOptions(
        res.data
          .filter((item) => item.active === true)
          .map((item) => {
            return {
              value: item.jobLevelId,
              label: item.nameLevel,
            };
          })
      );
    });
  }, []);
  useEffect(() => {
    visible === false && setUrl("");
  }, [visible]);

  const handleUpload = async (file) => {
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, "student", (progress) => {
        setUploadProgress(progress);
      });
      setUrl(url);
      message.success(t("cv.upload.success"));
      setVisible(true);
    } catch (error) {
      message.error(t("cv.upload.error"));
      console.error(error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  const handleDelete = async (item) => {
    deleteCV(item.id)
      .then((res) => {
        if (res.status === "OK") {
          message.success(res.message);
          deleteImageFromCloudinaryByLink(item.link).then((status) => {
            status === 200 && message.success(t("cv.upload.deleteSuccess"));
          });
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        message.error(t("cv.upload.deleteError"), err);
      })
      .finally(() => {
        fetchCV();
      });
  };
  const handleSubmit = (values) => {
    resumeMutate.mutate(
      { ...values, resumeFile: url },
      {
        onSuccess: (res) => {
          if (res.status === "OK") {
            message.success(res.message);
            fetchCV();
          } else {
            message.error(res.message);
          }
        },
        onError: (err) => {
          message.error(t("cv.upload.updateError"), err);
        },
      }
    );
    setVisible(false);
    form.resetFields();
  };
  const handleCancel = () => {
    deleteImageFromCloudinaryByLink(url).then(() => {
      form.resetFields();
      setVisible(false);
    });
  };
  return (
    <>
      <div className={`${styles.div} ${styles.box_shadow}`}>
        <Tabs defaultActiveKey="2" size="large" className={styles["tabs"]}>
          <Tabs.TabPane tab={t("cv.uploadCV.attachedResume")} key="2">
            <div className={styles["tab_content"]}>
              <Text className={styles["text"]}>
                {t("cv.uploadCV.uploadedResume")}
              </Text>
              {3 - listResume.length !== 0 && (
                <Dragger
                  maxCount={1}
                  showUploadList={false}
                  accept=".doc,.docx,.pdf"
                  disabled={uploading}
                  customRequest={({ file, onError }) => {
                    const isDocOrPdf =
                      file.type === "application/pdf" ||
                      file.type === "application/msword" ||
                      file.type ===
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    const isSizeValid = file.size / 1024 / 1024 < 5;

                    if (!isDocOrPdf) {
                      message.error(t("cv.upload.fileType"));
                      onError("Invalid file type");
                      return;
                    }

                    if (!isSizeValid) {
                      message.error(t("cv.upload.fileMax"));
                      onError("File size exceeds limit");
                      return;
                    }

                    handleUpload(file);
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p>{t("cv.upload.fileChoose")}</p>
                  <p>{t("cv.upload.fileSupport")}</p>
                  {uploading && <Progress percent={uploadProgress} />}
                </Dragger>
              )}
              {listResume.length !== 0 && (
                <List
                  split={false}
                  size="small"
                  itemLayout="horizontal"
                  dataSource={listResume}
                  renderItem={(item) => (
                    <List.Item className="!px-0">
                      <Tooltip
                        destroyTooltipOnHide={true}
                        title={item.description}
                      >
                        <Card className="w-full" size="small">
                          <List.Item
                            key={item.id}
                            actions={[
                              <Dropdown
                                key={item.id}
                                menu={{
                                  items: items.map((i) => ({
                                    ...i,
                                    onClick: () => i.onClick(item),
                                  })),
                                }}
                                trigger={["click"]}
                              >
                                <Button className="p-0" type="text">
                                  <MoreOutlined
                                    style={{ fontSize: 20, padding: 0 }}
                                  />
                                </Button>
                              </Dropdown>,
                            ]}
                          >
                            <List.Item.Meta
                              avatar={
                                <PaperClipOutlined
                                  style={{ fontSize: "17px", marginTop: "5px" }}
                                />
                              }
                              title={
                                <Typography.Link
                                  className="text-decoration-none"
                                  href={item.link}
                                  target="_blank"
                                >
                                  <Text strong ellipsis={{ row: 1 }}>
                                    {item.title}
                                  </Text>
                                </Typography.Link>
                              }
                              description={
                                <>
                                  <Text type="secondary">
                                    {t("cv.uploadCV.lastUpdated")}{" "}
                                    {item.lastUpdated}
                                  </Text>
                                  <br />
                                  <Link
                                    to={`/resume/view/${item.id}`}
                                    className="text-decoration-none"
                                    target="_blank"
                                  >
                                    {t("cv.uploadCV.viewAsEmployer")}
                                  </Link>
                                </>
                              }
                            />
                          </List.Item>
                        </Card>
                      </Tooltip>
                    </List.Item>
                  )}
                />
              )}
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
      <Modal
        maskClosable={false}
        title={t("cv.uploadCV.title")}
        open={visible}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okText={t("cv.uploadCV.save")}
        cancelText={t("cv.uploadCV.cancel")}
        width={600}
      >
        <Form
          validateTrigger={["onSubmit"]}
          size="large"
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ level_id: levelOptions[0]?.value }}
        >
          {/* Trường resume_title */}
          <Form.Item
            name="resumeTitle"
            label={t("cv.form.title")}
            rules={[{ required: true, message: t("cv.form.titleRequired") }]}
          >
            <Input placeholder={t("cv.form.title")} />
          </Form.Item>

          {/* Trường resume_description */}
          <Form.Item
            name="resumeDescription"
            label={t("cv.form.description")}
            rules={[
              { required: true, message: t("cv.form.descriptionRequired") },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t("cv.form.descriptionPlaceholder")}
            />
          </Form.Item>

          {/* Trường level_id */}
          <Form.Item
            name="levelId"
            label={t("cv.form.level")}
            rules={[{ required: true, message: t("cv.form.levelRequired") }]}
          >
            <Select>
              {levelOptions.map((level) => (
                <Option key={level?.value} value={level?.value}>
                  {level?.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UploadCV;
