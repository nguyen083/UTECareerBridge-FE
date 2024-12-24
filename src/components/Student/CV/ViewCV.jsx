import { List, Typography, Avatar, Flex, Row, Col, Divider, Descriptions } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import styles from './ViewCV.module.scss';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { BiSolidSchool } from 'react-icons/bi';
import { useLocation, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PDFViewer from '../../Generate/PDFViewer';
import { getCVByEmployer, getCVById } from '../../../services/apiService';
import { apiService } from '../../../services/getAddressId';
import { useSelector } from 'react-redux';
const { Text, Title } = Typography;
const ViewCV = ({ setStudentId = null }) => {
    const user = useSelector(state => state.user);
    const { id } = useParams();
    const location = useLocation();
    const [cv, setCv] = useState({});
    const [address, setAddress] = useState("");
    const items = [
        {
            key: 1,
            label: <Text className='f-16' strong>Họ và tên</Text>,
            children: <Text className='f-16'>{cv?.lastName} {cv?.firstName}</Text>
        },
        {
            key: 2,
            label: <Text className='f-16' strong>Giới tính</Text>,
            children: <Text className='f-16'>{cv?.gender ? 'Nữ' : "Nam"}</Text>
        },
        {
            key: 3,
            label: <Text className='f-16' strong>Ngày sinh</Text>,
            children: <Text className='f-16'>{cv?.dob}</Text>
        },
        {
            key: 3,
            label: <Text className='f-16' strong>Email</Text>,
            children: <Text className='f-16'>{cv?.email}</Text>
        },
        {
            key: 4,
            label: <Text className='f-16' strong>Email trường đại học</Text>,
            children: <Text className='f-16'>{cv?.universityEmail}</Text>
        },
        {
            key: 4,
            label: <Text className='f-16' strong>Số điện thoại</Text>,
            children: <Text className='f-16'>{cv?.phoneNumber}</Text>
        },
        address && {
            key: 5,
            label: <Text className='f-16' strong>Địa chỉ</Text>,
            children: <Text className='f-16'>{address}</Text>
        },
        {
            key: 6,
            label: <Text className='f-16' strong>Năm học</Text>,
            children: <Text className='f-16'>{cv?.year}</Text>
        },
        {
            key: 7,
            label: <Text className='f-16' strong>Chuyên nghành/ Lĩnh vực</Text>,
            children: <Text className='f-16'>{cv?.categoryName}</Text>
        },
        {
            key: 8,
            label: <Text className='f-16' strong>Cấp bậc</Text>,
            children: <Text className='f-16'>{cv?.levelName}</Text>
        },
        {
            key: 9,
            label: <Text className='f-16' strong>Kỹ năng</Text>,
            children: <Text className='f-16'>{Array.isArray(cv.studentSkills) ? cv.studentSkills.map((skill) => skill.skillName).join(', ') : ''}</Text>
        }
    ].filter(Boolean);
    const fetchData = async () => {
        if (user.role === 'student') {
            getCVById(id).then((res) => {
                if (res.status === 'OK') {
                    setCv(res.data);
                    apiService.getInforAddress(res.data.address, res.data.provinceId, res.data.districtId, res.data.wardId).then((res) => {
                        setAddress(res);
                    })
                }
            })
        } else {
            if (location.state?.datasource) {
                apiService.getInforAddress(location.state.datasource.address, location.state.datasource.provinceId, location.state.datasource.districtId, location.state.datasource.wardId).then((res) => {
                    setAddress(res);
                })
                setCv(location.state.datasource);
            } else {
                getCVByEmployer(id).then((res) => {
                    if (res.status === 'OK') {
                        setCv(res.data);
                        setStudentId(res.data.studentId);
                        apiService.getInforAddress(res.data.address, res.data.provinceId, res.data.districtId, res.data.wardId).then((res) => {
                            setAddress(res);
                        })
                    }
                })
            }
        }
    }
    useEffect(() => {
        fetchData();
    }, [id]);
    // useEffect(() => {
    //     const add = async () => {

    //     }
    //     add();
    // }, [cv]);

    return (
        <div className={styles.view_cv}>

            <List className={styles["list-infor"]}
                itemLayout="horizontal"
                size="small"
            >
                <List.Item>
                    <List.Item.Meta
                        className={`${styles.meta} d-flex align-items-stretch`}
                        avatar={<Avatar size={102} icon={<UserOutlined />} src={cv.profileImage} />}
                        title={
                            <Flex justify="space-between">
                                <Text className={styles["title"]}>
                                    {cv?.lastName} {cv?.firstName}
                                </Text>
                            </Flex>}
                        description={
                            <div className={styles["infor_card"]} >
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={1}>
                                                <BiSolidSchool className={styles["icon"]} />
                                            </Col>
                                            <Col span={23} className="f-16"> Sinh viên năm  thứ {cv?.year}</Col>
                                        </Row>
                                    </Col>

                                </Row>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={1}>
                                                <MailOutlined className={styles["icon"]} />
                                            </Col>
                                            <Col span={23} className="f-16">{cv?.email}</Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={1}>
                                                <PhoneOutlined className={styles["icon"]} />
                                            </Col>
                                            <Col span={23} className={styles["infor"]}>{cv?.phoneNumber}</Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </div>
                        }
                    />
                </List.Item>

            </List>
            <BoxContainer className={styles.box_shadow} width="100%" padding="1.25rem 1.875rem" background='white' borderRadius='8px'>
                <Title level={4}>
                    Thông tin chung
                </Title>
                <Divider className='my-0' />
                <div className='my-4 mx-3'>
                    <Descriptions layout='horizontal' column={2} items={items} />
                </div>
                <Title level={4}>
                    Hồ sơ đính kèm
                </Title>
                <Divider className='my-0' />
                <div className="my-4">
                    <PDFViewer fileUrl={cv.resumeFile} />
                </div>
            </BoxContainer>
        </div>
    )
}
export default ViewCV;
