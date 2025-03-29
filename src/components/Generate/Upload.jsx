import { useState } from 'react';
import { Upload, Avatar } from 'antd';
import { InboxOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
const { Dragger } = Upload;


const PicturesWall = (props) => {
    const { t } = useTranslation();
    const [defaultImage, setDefaultImage] = useState(props.defaultImage);
    const [fileList, setFileList] = useState([]);
    const handleUpload = (({ file, fileList }) => {
        setDefaultImage(null);
        setFileList(fileList);
        props.onChange(file);
    });

    const onRemove = () => {
        setFileList([]);
    }

    return (
        <Dragger
            onChange={handleUpload} 
            // onDrop={onDrop} 
            onRemove={onRemove}
            beforeUpload={() => false} maxCount={1}
            showUploadList={false}
            listType={props.listType} fileList={fileList}>
            {(fileList.length === 0 && defaultImage === null) ? (
                <>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-hint">
                        {t('common.dragAndDrop')}
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

    return (
        <div className='flex items-center justify-center'>

            <Upload
                onChange={handleUpload}
                // onDrop={onDrop}
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