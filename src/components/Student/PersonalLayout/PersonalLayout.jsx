import { Col, List, Row, Typography, Flex, Card, Modal, Form, message, Switch, Radio, Menu, Button } from "antd";
import styles from "./PersonalLayout.module.scss";
import { useEffect, useState } from 'react';
import { PaperClipOutlined, SettingOutlined, SolutionOutlined } from '@ant-design/icons';
import { IoBriefcaseOutline } from "react-icons/io5";
import { HiLightBulb } from "react-icons/hi";
import { IoIosBusiness } from "react-icons/io";
import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { getAllCV, getSimilarJob, updateFindjob, updateResumeActive } from "../../../services/apiService";


import { useDispatch, useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { setFindJob } from "../../../redux/action/studentSlice";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
const { Text, Link } = Typography;
const { Meta } = Card;

const PersonalLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [listResume, setListResume] = useState([]);
    const [willLoveJob, setWillLoveJob] = useState([]);
    const [modalResume, setModalResume] = useState(false);
    const infor = useSelector((state) => state.student);
    const dispatch = useDispatch();
    const [formResume] = Form.useForm();
    const [address, setAddress] = useState("");
    const [resumeIdActive, setResumeIdActive] = useState(0);

    const menuItems = [
        {
            key: "/profile",
            label: <div className="text-base">Hồ sơ của tôi</div>,
            icon: <SolutionOutlined />,
        },
        {
            key: "/my-company",
            label: <div className="text-base">Công ty của tôi</div>,
            icon: <IoIosBusiness />,
        },
        {
            key: "/my-job",
            label: <div className="text-base">Việc làm của tôi</div>,
            icon: <IoBriefcaseOutline />
        },
        {
            key: "/recommend-job",
            label: <div className="text-base">Đề xuất việc làm</div>,
            icon: <HiLightBulb />
        },
        {
            key: "/account-management",
            label: <div className="text-base">Đổi mật khẩu</div>,
            icon: <SettingOutlined />,
        }
    ];
    const handleMenu = (key) => {
        navigate(key.key);
    }
   
    const getResumeActive = () => {
        listResume.length !== 0 && listResume.forEach((item) => {
            if (item.acvite === true) {
                setResumeIdActive(item.id);
            }
        });
    };
   
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

   
    useEffect(() => {
        getResumeActive();
    }, [listResume]);
   
    useEffect(() => {
        apiService.getInforAddress(infor.address, infor.provinceId, infor.districtId, infor.wardId).then((res) => { console.log(res), setAddress(res) });

    }, [infor]);
   

   
    useEffect(() => {
        fetchCV();
       
        getSimilarJob(infor.categoryId).then((res) => {
            if (res.status === 'OK' && res.data !== null) {
                setWillLoveJob(res.data?.jobResponses);
            }
        });


    }, []);



    const handleFindJob = () => {
       
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
   
    const switchFindjob = (status = null) => {
       
        const check = status === null ? !infor.findingJob : status;
        updateFindjob(check).then((res) => {
            if (res.status === 'OK') {
               
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
                                    <Text className="text-base" strong >Cho phép tìm kiếm hồ sơ</Text>
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
                    <Card actions={[<Link key={willLoveJob.jobId} onClick={() => { navigate('/search', { state: { filters: { categoryId: infor.categoryId } } }) }}>Xem thêm</Link>]} title={<div className='p-3 title2 text-start'>Việc làm bạn sẽ thích</div>}
                        style={{ width: "100%" }} size='small'>
                        <Flex gap={"0.5rem"} vertical>
                            {willLoveJob.map((job) => <JobCardSmall key={job.jobId} job={job} />)}
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
                    <Radio.Group className="w-full">
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
                                                <Text type="secondary" italic className="text-xs">
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