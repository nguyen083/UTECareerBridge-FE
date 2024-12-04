import { DeleteOutlined, EllipsisOutlined, InboxOutlined, PaperClipOutlined } from '@ant-design/icons';
import { Tabs, List, Card, Typography, Button, Dropdown, Upload, message, Form, Modal, Input, Select } from 'antd';
import styles from './UploadCV.module.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loading, stop } from '../../../../redux/action/webSlice';
import { useEffect, useState } from 'react';
import { deleteCV, getAllJobLevels, uploadCV } from '../../../../services/apiService';
import { deleteImageFromCloudinaryByLink, uploadToCloudinary } from '../../../../services/uploadCloudary';
const { Dragger } = Upload;
const { Text } = Typography;
const { Option } = Select;
const UploadCV = ({ listResume, fetchCV }) => {
    const dispatch = useDispatch();
    const [url, setUrl] = useState("");
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [levelOptions, setLevelOptions] = useState([]);
    const items = [
        {
            label: <Text type="danger"><DeleteOutlined /> &ensp;Xóa</Text>,
            key: '1',
            onClick: (e) => handleDelete(e), // Truyền item vào đây
        },
    ];

    useEffect(() => {
        getAllJobLevels().then((res) => {
            setLevelOptions(res.data
                .filter((item) => item.active === true)  // Lọc những phần tử có active là true
                .map((item) => {
                    return {
                        value: item.jobLevelId,  // Chuyển jobLevelId thành kiểu số
                        label: item.nameLevel      // Gán label là nameLevel
                    }
                })
            );
        });
    }, []);
    useEffect(() => {
        visible === false && setUrl("")
    }, [visible]);
    const handleUpload = async (file) => {
        try {
            dispatch(loading());
            const url = await uploadToCloudinary(file, "student", (progress) => {
            });
            setUrl(url);
            message.success("Tải lên thành công!");
            setVisible(true);
            // cập nhật vào database sau đó lấy res set lại cho listResume
        } catch (error) {
            message.error("Tải lên thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            dispatch(stop());
        };

    }
    const handleDelete = async (item) => {
        deleteCV(item.id).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                deleteImageFromCloudinaryByLink(item.link).then((status) => {
                    status === 200 && message.success("Xóa hồ sơ thành công!");
                });
            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error("Xóa hồ sơ thất bại, ", err);
        }).finally(() => {
            fetchCV();
        });
    }
    const handleSubmit = (values) => {
        console.log({ ...values, resumeFile: url });
        uploadCV({ ...values, resumeFile: url }).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                fetchCV();
            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error("Cập nhật hồ sơ thất bại, ", err);
        }).finally(() => {
            setVisible(false);
            form.resetFields();
        });
    }
    const handleCancel = () => {
        deleteImageFromCloudinaryByLink(url).then((status) => {
            form.resetFields();
            setVisible(false);
        })
    }
    return (
        <>
            <div className={`${styles.div} ${styles.box_shadow}`}>
                <Tabs defaultActiveKey="2" size="large" className={styles["tabs"]}>

                    <Tabs.TabPane tab="Hồ sơ đính kèm" key="2">
                        <div className={styles["tab_content"]}>
                            <Text className={styles["text"]}>Hồ sơ đã tải lên</Text>
                            {(3 - listResume.length) !== 0 &&
                                <Dragger
                                    maxCount={1}
                                    showUploadList={false}
                                    customRequest={({ file, onSuccess, onError }) => {
                                        // Gọi API upload của bạn
                                        handleUpload(file)
                                    }}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <InboxOutlined />
                                    </p>
                                    <p>Chọn hoặc kéo thả hồ sơ từ máy của bạn</p>
                                    <p>Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5120KB</p>
                                </Dragger>}
                            {listResume.length !== 0 &&
                                <List
                                    split={false}
                                    size="small"
                                    itemLayout="horizontal"
                                    dataSource={listResume}
                                    renderItem={(item) => (
                                        <List.Item className={styles.list_CV}>
                                            <Card className="w-100" size="small">
                                                <List.Item
                                                    key={item.id}
                                                    actions={[<Dropdown
                                                        menu={{
                                                            items: items.map((i) => ({
                                                                ...i,
                                                                onClick: () => i.onClick(item), // Truyền item vào trong hành động
                                                            })),
                                                        }}
                                                        trigger={['click']}
                                                    >
                                                        <Button type="text" style={{ padding: "5 5 " }}>
                                                            <EllipsisOutlined style={{ fontSize: 20, padding: 0 }} /></Button>
                                                    </Dropdown>]}>
                                                    <List.Item.Meta

                                                        avatar={<PaperClipOutlined style={{ fontSize: '17px', marginTop: '5px' }} />}
                                                        title={<Typography.Link className="text-decoration-none" href={item.link} target="_blank" ><Text strong ellipsis={{ row: 1 }}>{item.title}</Text></Typography.Link>}
                                                        description={
                                                            <>
                                                                <Text type="secondary">Cập nhật lần cuối: {item.lastUpdated}</Text>
                                                                <br />
                                                                <Link to={`/resume/view/${item.id}`} className="text-decoration-none" target="_blank">Xem link như  nhà tuyển dụng</Link>
                                                            </>
                                                        }
                                                    />
                                                </List.Item>
                                            </Card>
                                        </List.Item>
                                    )}
                                />}
                        </div>
                    </Tabs.TabPane>
                </Tabs>
            </div>
            <Modal
                maskClosable={false}
                title="Thông tin CV"
                open={visible}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}

            >
                <Form
                    validateTrigger={['onSubmit']}
                    size="large"
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}

                    initialValues={{ level_id: levelOptions[0]?.value }} // Giá trị mặc định cho level_id
                >
                    {/* Trường resume_title */}
                    <Form.Item
                        name="resumeTitle"
                        label="Tiêu đề"
                        rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                    >
                        <Input placeholder="Nhập tiêu đề" />
                    </Form.Item>

                    {/* Trường resume_description */}
                    <Form.Item
                        name="resumeDescription"
                        label="Mô tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Nhập mô tả resume" />
                    </Form.Item>

                    {/* Trường level_id */}
                    <Form.Item
                        name="levelId"
                        label="Cấp độ"
                        rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}>
                        <Select>
                            {levelOptions.map(level => (<Option key={level?.value} value={level?.value}>{level?.label}</Option>))}
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default UploadCV;