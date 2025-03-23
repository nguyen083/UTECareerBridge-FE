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
        setDefaultImage(null);
        setFileList(fileList);
        props.onChange && props.onChange(file);
    };

    const onRemove = () => {
        setFileList([]);
        setDefaultImage(props.defaultImage || null);
    };

    const onDrop = (e) => {
        console.log('File dropped:', e.dataTransfer.files[0]);
    };

    return (
        <div className='items-center flex justify-center'>

            <Upload
                onChange={handleUpload}
                onDrop={onDrop}
                onRemove={onRemove}
                beforeUpload={() => false}
                maxCount={1}
                listType="picture"
                fileList={fileList}
                showUploadList={false}
                style={{ border: '1px dashed #d9d9d9', padding: 16 }}
                clssName="flex items-center justify-center"
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