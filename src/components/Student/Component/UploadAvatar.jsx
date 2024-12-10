import React, { useState, useRef } from "react";
import styles from './UploadAvatar.module.scss';
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
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình   ----> Department này là tạo thư mục trên cloud để biết ảnh ở thư mục nào á
            const url = await uploadToCloudinary(file, "student", (progress) => {
                setUploadProgress(progress);
            });
            setSrc(url); // Lưu URL ảnh sau khi upload
            setUrlImage(url);
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
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
                    <div className={styles["container"]}>
                        <div className={`${styles.div} ${uploading ? 'uploading' : ''}`} >

                            <Avatar
                                className={styles["avatar-upload"]}
                                icon={<UserOutlined />}

                                src={urlImage}
                                alt="Uploaded"
                                size={200}
                            ></Avatar>
                            <UploadOutlined className={styles["upload-icon"]} />
                        </div>
                        {uploading && (
                            <div className={styles["progress-container"]}>
                                <Progress percent={uploadProgress} status="active" size="small" percentPosition={{ align: "center", type: "outer" }} />
                            </div>
                        )}
                    </div>
                </Upload>
            </ImgCrop>
        </div >
    );
}

const UploadImage = (props) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [urlImage, setUrlImage] = useState(null);

    const handleImageChange = async (file) => {
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình   ----> Department này là tạo thư mục trên cloud để biết ảnh ở thư mục nào á
            const url = await uploadToCloudinary(file, "admin", (progress) => {
                setUploadProgress(progress);
            });
            props.onChange(url); // Lưu URL ảnh sau khi upload
            setUrlImage(url);
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
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
                minZoom={0.2}
                maxZoom={10}
                aspect={16 / 9}
                modalWidth={600}
            >
                <Upload.Dragger
                    // className="py-5"
                    showUploadList={false}
                    beforeUpload={(file) => {
                        handleImageChange(file)
                        return false
                    }}>
                    <div className={styles["container"]}>
                        <div className={`${styles.div} ${uploading ? 'uploading' : ''}`} >

                            {urlImage ? <Image
                                preview={false}
                                width={"200px"}
                                src={urlImage}
                                alt="Uploaded"
                            /> : !uploadProgress && <Text className="py-5">Kéo thả ảnh hoặc nhấn vào để tải ảnh lên</Text>}

                        </div>
                        {uploading && (
                            <div className={styles["progress-container"]}>
                                <Progress percent={uploadProgress} status="active" size="small" percentPosition={{ align: "center", type: "outer" }} />
                            </div>
                        )}
                    </div>
                </Upload.Dragger>
            </ImgCrop>
        </div >
    );
}



export { UploadAvatar, UploadImage };