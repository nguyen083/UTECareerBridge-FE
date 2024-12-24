import { HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Flex, List, Row, Typography, Avatar } from "antd";
import { BiSolidSchool } from "react-icons/bi";
import UpdateProfile from "../UpdateProfile";
import styles from "./ProfileCard.module.scss";

const { Text } = Typography;
const ProfileCard = ({ infor, address }) => {
    return (
        <>
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
        </>
    )
}

export default ProfileCard;