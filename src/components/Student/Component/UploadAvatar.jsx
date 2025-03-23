import React, { useState, useRef, useEffect } from "react";
import './UploadAvatar.scss';
import { Avatar, Image, Progress, Upload, message, Typography } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { uploadToCloudinary } from "../../../services/uploadCloudary";
import ImgCrop from "antd-img-crop";

const { Text } = Typography;

const UploadAvatar = ({ src, setSrc }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [urlImage, setUrlImage] = useState(src);
    const uploadRef = useRef(null);

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
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };



    return (
        <div >
            <ImgCrop
                rotate
                quality={1}
                showReset
                modalTitle='Cắt ảnh'
                modalOk='Xác nhận'
                modalCancel='Hủy bỏ'
                resetText='Đặt lại'
                aspectSlider
                aspect={1 / 1}
                modalWidth={600}
            >
                <Upload
                    showUploadList={false}
                    beforeUpload={(file) => {
                        handleImageChange(file)
                        return false
                    }}>
                    <div className="container">
                        <div className={`div ${uploading ? 'uploading' : ''}`}  >

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
                                <Progress percent={uploadProgress} status="active" size="small" percentPosition={{ align: "center", type: "outer" }} />
                            </div>
                        )}
                    </div>
                </Upload>
            </ImgCrop>
        </div >
    );
}

const UploadImage = ({ value, onChange, link = "admin/event" }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [urlImage, setUrlImage] = useState(null);

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
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
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
                modalTitle='Cắt ảnh'
                modalOk='Xác nhận'
                modalCancel='Hủy bỏ'
                resetText='Đặt lại'
                aspectSlider
                minZoom={0.2}
                maxZoom={10}
                aspect={1636 / 400}
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
                        <div className={`div ${uploading ? 'uploading' : ''}`}>
                            {urlImage ? (
                                <Image
                                    preview={false}
                                    height={"200px"}
                                    src={urlImage}
                                    alt="Uploaded"
                                />
                            ) : (
                                !uploadProgress && <Text className="py-5">Kéo thả ảnh hoặc nhấn vào để tải ảnh lên</Text>
                            )}
                        </div>
                        {uploading && (
                            <div className="progress-container">
                                <Progress percent={uploadProgress} status="active" size="small" percentPosition={{ align: "center", type: "outer" }} />
                            </div>
                        )}
                    </div>
                </Upload.Dragger>
            </ImgCrop>
        </div>
    );
};



export { UploadAvatar, UploadImage };