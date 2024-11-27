import { Col, List, Row, Avatar, Typography, Tabs, Upload, Space, Flex, Dropdown, Button, Card, Modal, Form, Input, message, Select } from "antd";
import styles from "./ProfilePage.module.scss";
import React, { useEffect, useState } from 'react';
import { BiSolidSchool } from "react-icons/bi";
import { MailOutlined, PhoneOutlined, HomeOutlined, UserOutlined, ReadOutlined, InboxOutlined, PaperClipOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { getAllCV, getSimilarJob, getAllJobLevels } from "../../../services/apiService";
import UpdateProfile from "../Component/UpdateProfile";
import { Link } from "react-router-dom";
import { Title } from "@mui/icons-material";
import { deleteImageFromCloudinaryByLink, uploadToCloudinary } from "../../../services/uploadCloudary";
import { useSelector } from "react-redux";
// import { renameFile } from "../../../services/cloudinary";
const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;


const ProfilePage = () => {
    const [listResume, setListResume] = useState([]); // danh sách hồ sơ đã tải lên
    const [willLoveJob, setWillLoveJob] = useState([]);
    const [visible, setVisible] = useState(false);
    const [listSkill, setListSkill] = useState(['Item 1',
        'Item 2',
        'Item 3',
        'Item 4',
        'Item 5']);
    const [url, setUrl] = useState("");
    const [form] = Form.useForm();
    const [levelOptions, setLevelOptions] = useState([]);
    const infor = useSelector((state) => state.student);
    const items = [
        {
            label: <Text type="danger"><DeleteOutlined /> &ensp;Xóa</Text>,
            key: '1',
            onClick: (e) => handleDelete(e), // Truyền item vào đây
        },
    ];
    const fetchCV = () => {
        getAllCV().then((res) => {
            setListResume(res?.data.map((item) => {
                return {
                    key: item.resumeId,
                    id: item.resumeId,
                    title: item.resumeTitle || "",
                    lastUpdated: item.updateAt || 0,
                    link: item.resumeFile || "",
                }
            }));

        });
    }
    const fetchSkill = () => {
        // getAllSkill().then((res) => {
        //     setListSkill(res.data);
        // });
    }
    useEffect(() => {

        // lấy danh sách Resume đã tải lên
        fetchCV();
        fetchSkill();

        // lấy danh sách công việc sẽ thích dựa trên categoryId của user
        getSimilarJob(5).then((res) => {
            if (res.status === 'OK' && res.data !== null) {
                setWillLoveJob(res.data?.jobResponses);
            }
        });
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

    }, []); // lấy danh sách hồ sơ đã tải lên từ server
    useEffect(() => {
        console.log("levelOptions", levelOptions);
    }, [levelOptions]);
    // lấy thông tin cá nhân trong redux
    const infor1 = {
        avatar: "data:image/jpeg;base64,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",
        name: "Nguyen Nguyen",
        email: "billbatri088@gmail.com",
        phone: "0945552109",
        address: "Huyện Ba Tri, Bến Tre, Việt Nam",
        level: "Cử nhân",
        career: "Thực tập sinh/Sinh viên",
        experience: "Tôi mới tốt nghiệp / chưa có kinh nghiệm làm việc",
    }

    const handleDelete = async (item) => {
        console.log(item);
        item.link && await deleteImageFromCloudinaryByLink(item.link).then((status) => {
            status === 200 ? message.success("Xoá CV thành công") : message.error("Xoá CV thất bại");
        }).catch((err) => {
            message.error("Xoá CV thất bại, ", err);
        });
    }
    const handleUpload = async (file) => {
        try {
            const url = await uploadToCloudinary(file, "student", (progress) => {
            });
            setUrl(url);
            message.success("Tải lên thành công!");
            setVisible(true);
            // cập nhật vào database sau đó lấy res set lại cho listResume


        } catch (error) {
            message.error("Tải lên thất bại. Vui lòng thử lại.");
            console.error(error);
        }

    }
    const handleSubmit = (values) => {
        console.log("submit: ", { ...values, resumeFile: url });
        // const res = await updateUser(1, values);
        // console.log(res);
    }
    const handleCancel = () => {
        deleteImageFromCloudinaryByLink(url).then((status) => {
            form.resetFields();
            setVisible(false);
        })
    }

    return (<>
        <Row gutter={8} className={styles["row"]}>
            <Col span={6} className={styles["col_l"]}>

            </Col>

            <Col span={12} className={styles["col_c"]}>
                <Flex vertical gap={16}>

                    <BoxContainer background="#F1F2F4" padding="1rem" width={"100%"}>
                        <List className={styles["list-infor"]}
                            itemLayout="horizontal"
                            size="small"
                        >
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={150} icon={<UserOutlined />} src={infor.profileImage} />}
                                    title={
                                        <Flex justify="space-between">
                                            <Text className={styles["title"]}>{infor.lastName} {infor.firstName}
                                            </Text>
                                            <UpdateProfile />
                                        </Flex>}
                                    description={
                                        <div className={styles["infor_card"]} >
                                            {/* <div className={styles["experience"]} >
                                                {infor1.experience}
                                            </div> */}
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <BiSolidSchool className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22} className={styles["infor"]}>{infor.universityEmail}</Col>
                                                    </Row>
                                                </Col>

                                            </Row>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <MailOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22} className={styles["infor"]}>{infor.email}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <PhoneOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22} className={styles["infor"]}>{infor.phoneNumber}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <HomeOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22} className={styles["infor"]}>{infor1.address}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                />
                            </List.Item>

                        </List>
                    </BoxContainer>
                    <div className={`${styles.div} ${styles.box_shadow}`}>
                        <Tabs defaultActiveKey="1" size="large" className={styles["tabs"]}>
                            <Tabs.TabPane tab="Hồ sơ Vietnamworks" key="1">
                                <div className={styles["tab_content"]}>Nội dung cho Hồ sơ Vietnamworks (tùy chỉnh thêm nếu cần).</div>
                            </Tabs.TabPane>
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
                                    <List size="small"
                                        itemLayout="horizontal"
                                        dataSource={listResume}
                                        renderItem={(item) => (<Card size="small">
                                            <List.Item

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
                                                            <Link to={item.link} className="text-decoration-none" target="_blank">Xem link như  nhà tuyển dụng</Link>
                                                        </>
                                                    }
                                                />
                                            </List.Item>
                                        </Card>
                                        )}
                                    />
                                </div>
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                    <BoxContainer className={styles.box_shadow} padding="1rem" width={"100%"}>
                        <Card title={<Text className={styles.title}>Kĩ năng</Text>} extra={<Button type="primary" >Thêm</Button>}>
                            <List
                                dataSource={listSkill}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <Flex justify="space-between">
                                            <Text>{item}</Text>
                                        </Flex>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </BoxContainer>
                </Flex>
            </Col>

            <Col span={6} className={`${styles.sol_r}`}>
                {willLoveJob?.length > 0 && <BoxContainer className={`${styles.box_shadow}`} padding='1rem'>
                    <Flex vertical gap={"0.5rem"}>
                        <div className='title2'>
                            Việc làm bạn sẽ thích
                        </div>
                        {willLoveJob.map((job) => <JobCardSmall job={job} />)}
                    </Flex>
                </BoxContainer>}
            </Col>
        </Row >
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
                    name="resume_title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
                >
                    <Input placeholder="Nhập tiêu đề" />
                </Form.Item>

                {/* Trường resume_description */}
                <Form.Item
                    name="resume_description"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập mô tả resume" />
                </Form.Item>

                {/* Trường level_id */}
                <Form.Item
                    name="level_id"
                    label="Cấp độ"
                    rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}>
                    <Select>
                        {levelOptions.map(level => (<Option key={level?.value} value={level?.value}>{level?.label}</Option>))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
    );
}
export default ProfilePage;