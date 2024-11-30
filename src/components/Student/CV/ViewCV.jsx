import { List, Typography, Avatar, Flex, Row, Col, Divider } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import styles from './ViewCV.module.scss';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { BiSolidSchool } from 'react-icons/bi';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PDFViewer from '../../Generate/PDFViewer';
const { Text, Title } = Typography;
const ViewCV = () => {
    const { id } = useParams();
    const [cv, setCv] = useState({});
    useEffect(() => {
        // getCVById(id).then((res) => {
        //     if (res.status === 'OK') {
        //         setCv(res.data);
        //     }
        // })
    }, [id]);
    return (
        <div className={styles.view_cv}>

            <List className={styles["list-infor"]}
                itemLayout="horizontal"
                size="small"
            >
                <List.Item>
                    <List.Item.Meta
                        className={`${styles.meta} d-flex align-items-stretch`}
                        avatar={<Avatar size={102} icon={<UserOutlined />} />}
                        title={
                            <Flex justify="space-between">
                                <Text className={styles["title"]}>
                                    Nguyên Nguyên
                                </Text>
                            </Flex>}
                        description={
                            <div className={styles["infor_card"]} >
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={2}>
                                                <BiSolidSchool className={styles["icon"]} />
                                            </Col>
                                            <Col span={22} className={styles["infor"]}></Col>
                                        </Row>
                                    </Col>

                                </Row>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={2}>
                                                <MailOutlined className={styles["icon"]} />
                                            </Col>
                                            <Col span={22} className={styles["infor"]}></Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row gutter={[16, 16]} align="middle">
                                    <Col span={24}>
                                        <Row align="middle">
                                            <Col span={2}>
                                                <PhoneOutlined className={styles["icon"]} />
                                            </Col>
                                            <Col span={22} className={styles["infor"]}></Col>
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
                <div className='my-4'>

                </div>
                <Title level={4}>
                    Hồ sơ đính kèm
                </Title>
                <Divider className='my-0' />
                <div className="my-4">
                    <PDFViewer fileUrl='https://res.cloudinary.com/utejobhub/image/upload/v1732801532/student/TUONGVI_CV_n4hsw2.pdf' />
                </div>
            </BoxContainer>
        </div>
    )
}
export default ViewCV;
