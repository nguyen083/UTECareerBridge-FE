import React, { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
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
            listType={props.listType} fileList={fileList}>
            {(fileList.length === 0 && defaultImage === null) ? (
                <>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-hint">
                        Kéo thả hoặc click vào đây để tải ảnh lên
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

export default PicturesWall;