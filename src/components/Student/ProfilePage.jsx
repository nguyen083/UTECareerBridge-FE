import { Col, List, Row, Avatar, Typography, Tabs, Upload, Space, Flex, Dropdown, Button } from "antd";
import styles from "./ProfilePage.module.scss";
import React, { useEffect, useState } from 'react';

import { MailOutlined, PhoneOutlined, HomeOutlined, DownOutlined, UserOutlined, ReadOutlined, InboxOutlined, PaperClipOutlined, EllipsisOutlined } from '@ant-design/icons';
import BoxContainer from "../Generate/BoxContainer";
const { Text } = Typography;
const { Dragger } = Upload;

const items = [
    {
        label: <a href="https://www.antgroup.com">1st menu item</a>,
        key: '0',
    },
    {
        label: <a href="https://www.aliyun.com">2nd menu item</a>,
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: '3rd menu item',
        key: '3',
    },
];
const ProfilePage = () => {
    const [listResume, setListResume] = useState([]); // danh sách hồ sơ đã tải lên



    useEffect(() => {
        //callAPI
        // setListResume(response.data);
        setListResume(
            [
                {
                    title: 'Huynh Nguyen.pdf',
                    lastUpdated: '10/11/2024',
                    link: 'Xem như nhà tuyển dụng',
                },
            ]
        );
    }, []); // lấy danh sách hồ sơ đã tải lên từ server

    // lấy thông tin cá nhân trong redux
    const infor = {
        avatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGiLScCSGgL3_J0OYeY1zudERlRvTGEyaaCw&s",
        name: "Nguyen Nguyen",
        email: "billbatri088@gmail.com",
        phone: "0945552109",
        address: "Huyện Ba Tri, Bến Tre, Việt Nam",
        level: "Cử nhân",
        career: "Thực tập sinh/Sinh viên",
        experience: "Tôi mới tốt nghiệp / chưa có kinh nghiệm làm việc",
    }

    const uploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: '/upload.do', // URL giả định
    };




    return (<>
        <Row gutter={8} className={styles["row"]}>
            <Col span={6} className={styles["col-l"]}>

            </Col>

            <Col span={12} className={styles["col-c"]}>
                <Flex vertical gap={8}>

                    <BoxContainer background="#F1F2F4" padding="1rem" width={"100%"}>
                        <List className={styles["list-infor"]}
                            itemLayout="horizontal"
                            size="small"
                        >
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar size={150} icon={<UserOutlined />} src={infor.avatar} />}
                                    title={<Text className={styles["title"]}>{infor.name}</Text>}
                                    description={
                                        <div className={styles["infor-card"]} >
                                            <div className={styles["experience"]} >
                                                {infor.experience}
                                            </div>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={12}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <ReadOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22}>{infor.career}</Col>
                                                    </Row>
                                                </Col>
                                                <Col span={12}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <UserOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22}>{infor.level}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={12}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <MailOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22}>{infor.email}</Col>
                                                    </Row>
                                                </Col>
                                                <Col span={12}>
                                                    <Row align="middle">
                                                        <Col span={2}>
                                                            <PhoneOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22}>{infor.phone}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Row align="middle">
                                                        <Col span={1}>
                                                            <HomeOutlined className={styles["icon"]} />
                                                        </Col>
                                                        <Col span={22}>{infor.address}</Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    }
                                />
                            </List.Item>

                        </List>
                    </BoxContainer>
                    <BoxContainer background="#F1F2F4" padding="1rem" width={"100%"}>
                        <div className={styles["div"]}>
                            <Tabs defaultActiveKey="1" className={styles["tabs"]}>
                                <Tabs.TabPane tab="Hồ sơ Vietnamworks" key="1">
                                    <div style={{ padding: '20px' }}>Nội dung cho Hồ sơ Vietnamworks (tùy chỉnh thêm nếu cần).</div>
                                </Tabs.TabPane>
                                <Tabs.TabPane tab="Hồ sơ đính kèm" key="2">
                                    <div style={{ padding: '20px' }}>
                                        <Text>Hồ sơ đã tải lên</Text>
                                        <Dragger {...uploadProps} style={{ padding: '20px', border: '1px dashed #d9d9d9', marginBottom: '20px' }}>
                                            <p className="ant-upload-drag-icon">
                                                <InboxOutlined />
                                            </p>
                                            <p>Chọn hoặc kéo thả hồ sơ từ máy của bạn</p>
                                            <p style={{ color: '#8c8c8c' }}>Hỗ trợ định dạng .doc, .docx, .pdf có kích thước dưới 5120KB</p>
                                        </Dragger>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={listResume}
                                            renderItem={(item) => (
                                                <List.Item actions={[<Dropdown
                                                    menu={{
                                                        items,
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <Button type="text" style={{ padding: "5 5 " }}>
                                                        <EllipsisOutlined style={{ fontSize: 20, height: 'fit-content' }} /></Button>
                                                </Dropdown>]}>
                                                    <List.Item.Meta
                                                        avatar={<PaperClipOutlined style={{ fontSize: '17px', marginTop: '5px' }} />}
                                                        title={<strong>{item.title}</strong>}
                                                        description={
                                                            <>
                                                                <p>Cập nhật lần cuối: {item.lastUpdated}</p>
                                                                <a href="#">{item.link}</a>
                                                            </>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                </Tabs.TabPane>
                            </Tabs>
                        </div>
                    </BoxContainer>
                </Flex>
            </Col>

            <Col span={6} className={styles["sol-r"]}>
            </Col>
        </Row>
    </>
    );
}
export default ProfilePage;