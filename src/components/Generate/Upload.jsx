import React, { useState, useEffect } from 'react';
import { Upload, Avatar } from 'antd';
import { InboxOutlined, UserOutlined } from '@ant-design/icons';
const { Dragger } = Upload;


const PicturesWall = (props) => {
    const [defaultImage, setDefaultImage] = useState(props.defaultImage);
    const [fileList, setFileList] = useState([]);
    const handleUpload = (({ file, fileList }) => {
        setDefaultImage(null);
        console.log('file', file);
        setFileList(fileList);
        props.onChange(file);
    });

    const onRemove = (file) => {
        console.log('onRemove', file);
        setFileList([]);
    }
    const onDrop = (e) => {
        console.log('onDrop', e.dataTransfer.files[0]);
    }
    return (
        <Dragger
            onChange={handleUpload} onDrop={onDrop} onRemove={onRemove}
            beforeUpload={() => false} maxCount={1}
            showUploadList={false}
            listType={props.listType} fileList={fileList}>
            {(fileList.length === 0 && defaultImage === null) ? (
                <>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-hint">
                        Kéo thả hoặc nhấn vào đây để tải ảnh lên
                    </p>
                </>
            ) : (

                <img
                    alt='' src={defaultImage !== null ? defaultImage : URL.createObjectURL(fileList[0].originFileObj)}
                    style={{ maxHeight: '138px', maxWidth: '138px' }}
                />
            )}
        </Dragger>
    );
};

const AvatarUploader = (props) => {
    const [defaultImage, setDefaultImage] = useState(props.defaultImage || null);
    const [fileList, setFileList] = useState([]);

    const handleUpload = ({ file, fileList }) => {
        setDefaultImage(null); // Xóa ảnh mặc định khi chọn ảnh mới
        setFileList(fileList); // Cập nhật danh sách file
        props.onChange && props.onChange(file); // Truyền file đã chọn ra ngoài qua props (nếu cần)
    };

    const onRemove = () => {
        setFileList([]); // Xóa danh sách file
        setDefaultImage(props.defaultImage || null); // Đặt lại ảnh mặc định
    };

    const onDrop = (e) => {
        console.log('File dropped:', e.dataTransfer.files[0]);
    };

    return (
        <div style={{ textAlign: 'center' }}>

            <Upload
                onChange={handleUpload}
                onDrop={onDrop}
                onRemove={onRemove}
                beforeUpload={() => false} // Ngăn không cho upload tự động
                maxCount={1} // Giới hạn chỉ upload 1 file
                listType="picture" // Định dạng danh sách file là ảnh
                fileList={fileList}
                showUploadList={false} // Không hiển thị danh sách file tải lên
                style={{ border: '1px dashed #d9d9d9', padding: 16 }}
            >
                <Avatar
                    size={128}
                    src={
                        defaultImage
                            ? defaultImage
                            : fileList.length > 0 && URL.createObjectURL(fileList[0].originFileObj)
                    }
                    icon={!defaultImage && fileList.length === 0 ? <UserOutlined /> : null}
                    style={{ marginBottom: 16 }}
                />
            </Upload>
        </div>
    );
};


export { PicturesWall, AvatarUploader };