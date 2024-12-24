import { Col, List, Row, Typography, Flex, Card, Modal, Form, message, Switch, Radio, Menu, Button } from "antd";
import styles from "./PersonalLayout.module.scss";
import React, { useEffect, useState } from 'react';
import { PaperClipOutlined, DashboardOutlined, SettingOutlined, SolutionOutlined } from '@ant-design/icons';
import { IoBriefcaseOutline } from "react-icons/io5";
import { IoIosBusiness } from "react-icons/io";

import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { getAllCV, getSimilarJob, updateFindjob, updateResumeActive } from "../../../services/apiService";


import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { setFindJob } from "../../../redux/action/studentSlice";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
// import { renameFile } from "../../../services/cloudinary";
const { Text, Link } = Typography;
const { Meta } = Card;

const PersonalLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // state để quản lý các danh sách
    const [listResume, setListResume] = useState([]); // danh sách hồ sơ đã tải lên
    const [willLoveJob, setWillLoveJob] = useState([]);

    // state để quản lý các modal
    const [modalResume, setModalResume] = useState(false);
    // state để quản lý các thông tin cá nhân
    const infor = useSelector((state) => state.student);

    const dispatch = useDispatch();
    // state để quản lý các form
    const [formResume] = Form.useForm();
    // state để quản lý các giá trị
    const [address, setAddress] = useState("");
    const [resumeIdActive, setResumeIdActive] = useState(0);

    const menuItems = [
        // {
        //     key: "/dashboard",
        //     label: <div className="f-16">Tổng quan</div>,
        //     icon: <DashboardOutlined />,
        // },
        {
            key: "/profile",
            label: <div className="f-16">Hồ sơ của tôi</div>,
            icon: <SolutionOutlined />,
        },
        {
            key: "/my-company",
            label: <div className="f-16">Công ty của tôi</div>,
            icon: <IoIosBusiness />,
        },
        {
            key: "/my-job",
            label: <div className="f-16">Việc làm của tôi</div>,
            icon: <IoBriefcaseOutline />
        },
        {
            key: "/account-management",
            label: <div className="f-16">Đổi mật khẩu</div>,
            icon: <SettingOutlined />,
        }
    ];
    const handleMenu = (key) => {
        navigate(key.key);
    }
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

    // lấy hồ sơ active
    useEffect(() => {
        getResumeActive();
    }, [listResume]);
    // lấy địa chỉ của sinh viên
    useEffect(() => {
        apiService.getInforAddress(infor.address, infor.provinceId, infor.districtId, infor.wardId).then((res) => { console.log(res), setAddress(res) });

    }, [infor]);
    // hàm reset url khi modal đóng

    // lấy danh sách Resume đã tải lên
    useEffect(() => {
        fetchCV();
        // lấy danh sách công việc sẽ thích dựa trên categoryId của user
        getSimilarJob(infor.categoryId).then((res) => {
            if (res.status === 'OK' && res.data !== null) {
                setWillLoveJob(res.data?.jobResponses);
            }
        });


    }, []); // lấy danh sách hồ sơ đã tải lên từ server



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
        <Row gutter={[16, 8]} className={styles["row"]}>
            <Col span={5} className={styles["col_l"]}>
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
                                onSelect={(key) => handleMenu(key)}
                                className={styles.menu}
                                selectedKeys={[location.pathname]}
                                mode="inline"
                                items={menuItems}
                            />
                        </BoxContainer>
                    </Col>
                </Row>
            </Col>

            <Col span={13} className={styles["col_c"]}>
                <Outlet context={{ infor, address, listResume, fetchCV }} />
            </Col>

            <Col span={6} className={`${styles.sol_r}`}>
                {willLoveJob?.length > 0 &&
                    <Card actions={[<Link onClick={() => { navigate('/search', { state: { filters: { categoryId: infor.categoryId } } }) }}>Xem thêm</Link>]} title={<div className='title2 p-3 text-start'>Việc làm bạn sẽ thích</div>}
                        style={{ width: "100%" }} size='small'>
                        <Flex gap={"0.5rem"} vertical>
                            {willLoveJob.map((job) => <JobCardSmall job={job} />)}
                        </Flex>
                    </Card>}
            </Col>
        </Row >


        <Modal
            title="Thiết lập hồ sơ"
            open={modalResume}
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