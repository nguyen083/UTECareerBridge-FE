import { Col, List, Row, Avatar, Typography, Tabs, Upload, Space, Flex, Dropdown, Button, Card, Modal, Form, Input, message, Select, Rate, Switch, Checkbox, Radio, Menu } from "antd";
import styles from "./PersonalLayout.module.scss";
import React, { useEffect, useState } from 'react';
import { BiSolidSchool } from "react-icons/bi";
import { MailOutlined, PhoneOutlined, HomeOutlined, UserOutlined, InboxOutlined, PaperClipOutlined, EllipsisOutlined, EditOutlined, DeleteOutlined, PlusOutlined, MinusCircleOutlined, LikeOutlined, ShareAltOutlined, MoreOutlined, DashboardOutlined, SettingOutlined } from '@ant-design/icons';
import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { getAllCV, getSimilarJob, getAllJobLevels, uploadCV, getSkillStudent, getAllSkills, addSkillStudent, deleteSkillStudent, deleteCV, updateFindjob, updateResumeActive } from "../../../services/apiService";
import UpdateProfile from "../Component/UpdateProfile";
import { Link } from "react-router-dom";

import { deleteImageFromCloudinaryByLink, uploadToCloudinary } from "../../../services/uploadCloudary";
import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { loading, stop } from "../../../redux/action/webSlice";
import { setFindJob } from "../../../redux/action/studentSlice";
// import { renameFile } from "../../../services/cloudinary";
const { Text } = Typography;
const { Dragger } = Upload;
const { Option } = Select;
const { Meta } = Card;

const PersonalLayout = () => {
    // state để quản lý các danh sách
    const [listResume, setListResume] = useState([]); // danh sách hồ sơ đã tải lên
    const [willLoveJob, setWillLoveJob] = useState([]);
    const [studentSkill, setStudentSkill] = useState([]);
    const [listSkill, setListSkill] = useState([]);
    const [levelOptions, setLevelOptions] = useState([]);
    // state để quản lý các modal
    const [visible, setVisible] = useState(false);
    const [openModalSkill, setOpenModalSkill] = useState(false);
    const [modalResume, setModalResume] = useState(false);
    // state để quản lý các thông tin cá nhân
    const infor = useSelector((state) => state.student);

    const dispatch = useDispatch();
    // state để quản lý các form
    const [form] = Form.useForm();
    const [formSkill] = Form.useForm();
    const [formResume] = Form.useForm();
    // state để quản lý các giá trị
    const [address, setAddress] = useState("");
    const [url, setUrl] = useState("");
    const [resumeIdActive, setResumeIdActive] = useState(0);
    const items = [
        {
            label: <Text type="danger"><DeleteOutlined /> &ensp;Xóa</Text>,
            key: '1',
            onClick: (e) => handleDelete(e), // Truyền item vào đây
        },
    ];
    const menuItems = [
        {
            key: "1",
            label: <div className="f-16">Tổng quan</div>,
            icon: <DashboardOutlined />,
        },
        {
            key: "2",
            label: <div className="f-16">Hồ sơ của tôi</div>,
            icon: <PaperClipOutlined />,
        },
        {
            key: "3",
            label: <div className="f-16">Công ty của tôi</div>,
            icon: <UserOutlined />,
        },
        {
            key: "4",
            label: <div className="f-16">Việc làm của tôi</div>,
            icon: <UserOutlined />,
        },
        {
            key: "5",
            label: <div className="f-16">Quản lý tài khoản</div>,
            icon: <SettingOutlined />,
        }
    ];
    // hàm lấy hồ sơ active
    const getResumeActive = () => {
        listResume.length !== 0 && listResume.forEach((item) => {
            if (item.acvite === true) {
                setResumeIdActive(item.id);
            }
        });
    };
    // hàm lấy danh sách hồ sơ đã tải lên
    const fetchCV = () => {
        getAllCV().then((res) => {
            console.log(res);
            setListResume(res?.data.map((item) => {
                return {
                    key: item.resumeId,
                    id: item.resumeId,
                    title: item.resumeTitle || "",
                    lastUpdated: item.updatedAt || 0,
                    link: item.resumeFile || "",
                    acvite: item.isActive
                }
            }));

        });
    }
    // hàm lấy danh sách kỹ năng của sinh viên
    const fetchStudentSkill = () => {
        const skillMap = listSkill.reduce((map, skill) => {
            map[skill.skillId] = skill.skillName;
            return map;
        }, {});
        getSkillStudent().then((res) => {
            setStudentSkill(res.data.map((item) => {
                return {
                    skillId: item.skillId,
                    skillName: skillMap[item.skillId],
                    level: item.level
                }
            }));
        });
    }
    // hàm lấy danh sách kỹ năng
    const fetchSkill = () => {
        getAllSkills().then((res) => {
            setListSkill(res.data.filter((item) => item.active === true).map((item) => { return { skillName: item.skillName, skillId: item.skillId } }));
        });
    }
    // lấy danh sách kỹ năng của sinh viên
    useEffect(() => {
        fetchStudentSkill();
    }, [listSkill]);
    // lấy hồ sơ active
    useEffect(() => {
        getResumeActive();
    }, [listResume]);
    // lấy địa chỉ của sinh viên
    useEffect(() => {
        apiService.getInforAddress(infor.address, infor.provinceId, infor.districtId, infor.wardId).then((res) => { console.log(res), setAddress(res) });

    }, [infor]);
    // hàm reset url khi modal đóng
    useEffect(() => {
        visible === false && setUrl("")
    }, [visible]);
    // lấy danh sách Resume đã tải lên
    useEffect(() => {
        fetchCV();
        fetchSkill();


        // lấy danh sách công việc sẽ thích dựa trên categoryId của user
        getSimilarJob(infor.categoryId).then((res) => {
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


    // lấy thông tin cá nhân trong redux
    const handleDelete = async (item) => {
        console.log(item);
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
    const handleChangeResume = (e) => {
        // setResumeIdActive(e.target.value);
        console.log(e.target.value);
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
    const handleSubmitSkill = (value) => {
        addSkillStudent(value).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                fetchStudentSkill();
                formSkill.resetFields();
            } else {
                message.error(res.message);
            }
        })
    }
    const handleDeleteSkill = (skillId) => {
        deleteSkillStudent(skillId).then((res) => {
            console.log(res);
            if (res.status === 'OK') {
                message.success(res.message);
                fetchStudentSkill();
            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error("Xóa kỹ năng thất bại, ", err);
        }).finally(() => {
            fetchStudentSkill();
        });
    }
    const handleFindJob = () => {
        //gọi API cập nhật hồ sơ active
        updateResumeActive(formResume.getFieldValue('resumeId')).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                fetchCV();
                switchFindjob(true);
                setModalResume(false);
                setResumeIdActive(formResume.getFieldValue('resumeId'));
            } else {
                message.error(res.message);
            }
        });
    }
    // hàm bật tìm kiếm hồ sơ
    const switchFindjob = (status = null) => {
        //gọi API bật tìm kiếm hồ sơ
        const check = status === null ? !infor.findingJob : status;
        updateFindjob(check).then((res) => {
            if (res.status === 'OK') {
                // message.success(res.message);
                dispatch(setFindJob(check));
            } else {
                message.error(res.message);
            }
        });
    }
    return (<>
        <Row gutter={[8, 8]} className={styles["row"]}>
            <Col span={6} className={styles["col_l"]}>
                <Row justify="center" >
                    <Col span={24}>
                        <Card
                            hoverable
                            className={styles.card}
                        >
                            <Meta
                                title={infor.lastName + " " + infor.firstName}
                                description={"Sinh viên năm thứ " + infor.year}
                            />
                            <div className={styles.div}>
                                <Flex gap={16} justify="space-between" align="center">
                                    <Text className="f-16" strong >Cho phép tìm kiếm hồ sơ</Text>
                                    <Switch checked={infor.findingJob} onChange={() => switchFindjob()} />
                                </Flex>
                                <Button onClick={() => setModalResume(true)} type="link">Thiết lập hồ sơ</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row >
                    <Col span={24}>
                        <BoxContainer className={styles.box_shadow} padding="1rem" width={"100%"}>
                            <Menu
                                className={styles.menu}
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                items={menuItems}
                            />
                        </BoxContainer>
                    </Col>
                </Row>
            </Col>

            <Col span={12} className={styles["col_c"]}>
                <Flex vertical gap={16}>
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
                                                    <Col span={22} className={styles["infor"]}>{address}</Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                            />
                        </List.Item>

                    </List>

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
                    <BoxContainer className={styles.box_shadow} padding="1rem" width={"100%"}>
                        <Card title={<Text className={styles.title}>Kĩ năng</Text>} extra={<EditOutlined className={styles.icon_edit} onClick={() => setOpenModalSkill(true)} />}>
                            <List size="small"
                                dataSource={studentSkill}
                                renderItem={(item, index) => (
                                    <List.Item>
                                        <div className="w-100">
                                            <Row>
                                                <Col span={8}>
                                                    <Text>{item.skillName}</Text>
                                                </Col>
                                                <Col span={12}>
                                                    <Rate disabled defaultValue={item.level} />
                                                </Col>
                                            </Row>
                                        </div>
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
        <Modal
            centered
            width={"40%"}
            title={<Text className={styles.title}>Thêm kỹ năng</Text>}
            open={openModalSkill}
            onCancel={() => setOpenModalSkill(false)}
            footer={null}>
            <Form
                form={formSkill}
                onFinish={handleSubmitSkill}
                name="skill_form"
                autoComplete="off"
                layout="inline"
            >
                <Flex className="w-100" gap={16}>
                    <Form.Item
                        name="skillId"
                        style={{ width: "45%" }}
                        rules={[
                            { required: true, message: "Hãy chọn kỹ năng!" },
                        ]}>
                        <Select placeholder="Chọn kỹ năng" >
                            {listSkill.map((item) => <Option key={item.skillId} value={item.skillId}>{item.skillName}</Option>)}
                        </Select>
                    </Form.Item>

                    {/* Rate: Đánh giá cấp độ */}
                    <Form.Item
                        name="level"
                        rules={[
                            { required: true, message: "Hãy đánh giá cấp độ!" },
                        ]}
                    >
                        <Rate />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" > Thêm</Button>
                    </Form.Item>
                </Flex>
            </Form>
            <Space direction="vertical" className={styles.space_list} size="large">
                <List size="small"
                    split={false}
                    dataSource={studentSkill}
                    renderItem={(item, index) => (
                        <List.Item className={styles.list_item}>
                            <div className="w-100">
                                <Row >
                                    <Col span={8} className="align-content-center">
                                        <Text>{item.skillName}</Text>
                                    </Col>
                                    <Col span={12} className="align-content-center">
                                        <Rate disabled defaultValue={item.level} />
                                    </Col>
                                    <Col span={4} className="align-content-center">
                                        <Button danger type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteSkill(item.skillId)} />
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />
            </Space>
        </Modal>
        <Modal
            title="Thiết lập hồ sơ"
            visible={modalResume}
            onCancel={() => { setModalResume(false); formResume.resetFields(); }}
            onOk={handleFindJob}
            cancelText="Hủy"
            okText="Hoàn tất"
        >
            <Form initialValues={{ resumeId: resumeIdActive }} form={formResume} >
                <Form.Item name="resumeId">
                    <Radio.Group className="w-100">
                        <List
                            size="small"
                            className={styles.ant_list}
                            itemLayout="horizontal"
                            split={false}
                            dataSource={listResume}
                            renderItem={item =>
                                <List.Item>
                                    <Card
                                        size='small'
                                        bordered
                                        style={{
                                            borderRadius: '10px',
                                            width: '100%',
                                        }}
                                    >
                                        <Flex justify='space-between'>
                                            <Radio value={item.id} />
                                            <div style={{ flexGrow: 1 }}>
                                                <Typography.Link href={item.link} target="_blank">
                                                    {item.title}
                                                </Typography.Link>
                                                <br />
                                                <Text type="secondary" italic className="f-12">
                                                    <PaperClipOutlined /> Tệp đính kèm • Cập nhật lúc: {item.lastUpdated.split(" ", 1)}
                                                </Text>
                                            </div>
                                        </Flex>
                                    </Card>
                                </List.Item>}
                        /></Radio.Group>
                </Form.Item>
            </Form>
        </Modal >

    </>
    );
}
export default PersonalLayout;