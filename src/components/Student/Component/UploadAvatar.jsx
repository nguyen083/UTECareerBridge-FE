import { useState, useEffect } from "react";
import "./UploadAvatar.scss";
import { Avatar, Image, Progress, Upload, message, Typography } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadCloudary";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const UploadAvatar = ({ src, setSrc }) => {
  const { t } = useTranslation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  let [urlImage, setUrlImage] = useState(src);

  const handleImageChange = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinary(file, "student", (progress) => {
        setUploadProgress(progress);
      });
      setSrc(url);
      setUrlImage(url);
      message.success(t("uploadSuccess"));
    } catch (error) {
      message.error(t("uploadError"));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <ImgCrop
        rotate
        quality={1}
        showReset
        modalTitle={t("cutImage")}
        modalOk={t("common.confirm")}
        modalCancel={t("common.cancel")}
        resetText={t("common.reset")}
        aspectSlider
        aspect={1 / 1}
        modalWidth={600}
      >
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleImageChange(file);
            return false;
          }}
        >
          <div className="container">
            <div className={`div ${uploading ? "uploading" : ""}`}>
              <Avatar
                className="avatar-upload"
                icon={<UserOutlined />}
                src={urlImage}
                alt="Uploaded"
                size={200}
              ></Avatar>
              <UploadOutlined className="upload-icon" />
            </div>
            {uploading && (
              <div className="progress-container">
                <Progress
                  percent={uploadProgress}
                  status="active"
                  size="small"
                  percentPosition={{ align: "center", type: "outer" }}
                />
              </div>
            )}
          </div>
        </Upload>
      </ImgCrop>
    </div>
  );
};

const UploadImage = ({
  value,
  onChange,
  link = "admin/event",
  aspect = 1636 / 400,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  let [urlImage, setUrlImage] = useState(null);
  const { t } = useTranslation();
  useEffect(() => {
    setUrlImage(value);
  }, [value]);

  const handleImageChange = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const url = await uploadToCloudinary(file, link, (progress) => {
        setUploadProgress(progress);
      });
      onChange(url);
      setUrlImage(url);
      message.success(t("uploadSuccess"));
    } catch (error) {
      message.error(t("uploadError"));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <ImgCrop
        rotate
        quality={1}
        showReset
        modalTitle={t("cutImage")}
        modalOk={t("common.confirm")}
        modalCancel={t("common.cancel")}
        resetText={t("common.reset")}
        aspectSlider
        minZoom={0.2}
        maxZoom={10}
        aspect={aspect}
        modalWidth={1500}
      >
        <Upload.Dragger
          showUploadList={false}
          beforeUpload={(file) => {
            handleImageChange(file);
            return false;
          }}
        >
          <div className="container">
            <div className={`div ${uploading ? "uploading" : ""}`}>
              {urlImage ? (
                <Image
                  preview={false}
                  height={"200px"}
                  src={urlImage}
                  alt="Uploaded"
                />
              ) : (
                !uploadProgress && (
                  <Text className="py-5">{t("dragAndDrop")}</Text>
                )
              )}
            </div>
            {uploading && (
              <div className="progress-container">
                <Progress
                  percent={uploadProgress}
                  status="active"
                  size="small"
                  percentPosition={{ align: "center", type: "outer" }}
                />
              </div>
            )}
          </div>
        </Upload.Dragger>
      </ImgCrop>
    </div>
  );
};

export { UploadAvatar, UploadImage };
