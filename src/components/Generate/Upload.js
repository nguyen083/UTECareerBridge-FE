import React, { useState, useCallback } from 'react';
import { Upload, Modal } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
// import ImgCrop from 'antd-img-crop';
const { Dragger } = Upload;


const PicturesWall = (props) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [fileList, setFileList] = useState([]);

    const handleCancel = useCallback(() => setPreviewVisible(false), []);

    const handlePreview = useCallback(async file => {
        let src = file.url;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        // const image = new Image();
        // image.src = src;
        // const imgWindow = window.open(src);
        // imgWindow?.document.write(image.outerHTML);
        setPreviewImage(src);
        console.log('file', file);
        setPreviewVisible(true);
    }, []);

    const handleUpload = useCallback(({ file, fileList }) => {
        console.log('file', file);
        setFileList(fileList);
        props.onChange(file);
    }, []);



    // const uploadButton = (
    //     <div>
    //         <PlusOutlined />
    //         <div className="ant-upload-text">Upload</div>
    //     </div>
    // );
    const onRemove = (file) => {
        console.log('onRemove', file);
        setFileList([]);
    }
    const onDrop = (e) => {
        console.log('onDrop', e.dataTransfer.files[0]);
        // setFileList(e.dataTransfer.files);
        // props.onChange(e.dataTransfer.files[0]);
    }
    return (
        // <div>
        //     {/* <ImgCrop> */}
        //     <Upload
        //         listType={props.listType}
        //         fileList={fileList}
        //         onPreview={handlePreview}
        //         onChange={handleUpload}
        //         beforeUpload={() => false}
        //         maxCount={1}
        //     >
        //         {fileList.length >= 1 ? null : uploadButton}
        //     </Upload>
        //     {/* </ImgCrop> */}

        //     <Modal className='p-3'
        //         visible={previewVisible}
        //         title="Ảnh xem trước"
        //         footer={null}
        //         onCancel={handleCancel}>
        //         <img alt="example" style={{ width: "100%" }} src={previewImage} />
        //     </Modal>
        // </div>
        <Dragger
            onChange={handleUpload} onDrop={onDrop} onRemove={onRemove}
            beforeUpload={() => false} maxCount={1}
            listType={props.listType} fileList={fileList}>
            {fileList.length === 0 ? (
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
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    style={{ maxHeight: '138px', maxWidth: '138px' }}
                />
            )}
        </Dragger>
    );
};

export default PicturesWall;