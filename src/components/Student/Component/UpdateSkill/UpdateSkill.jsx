import { Card, Typography, List, Row, Col, Rate, Space, Select, Modal, Form, message, Flex, Button } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import styles from "./UpdateSkill.module.scss";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { addSkillStudent, deleteSkillStudent, getAllSkills, getSkillStudent } from "../../../../services/apiService";

const { Text } = Typography;
const { Option } = Select;

const UpdateSkill = () => {
    const [formSkill] = Form.useForm();
    const [openModalSkill, setOpenModalSkill] = useState(false);
    const [studentSkill, setStudentSkill] = useState([]);
    const [listSkill, setListSkill] = useState([]);

    useEffect(() => {
        fetchSkill();
    }, []);
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
            } else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error("Xóa kỹ năng thất bại, ", err);
        }).finally(() => {
            fetchStudentSkill();
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
    useEffect(() => {
        console.log(studentSkill);
    }, [studentSkill]);
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
    return <>
        <BoxContainer className={styles.box_shadow} padding="1rem" width={"100%"}>
            <Card title={<Text className={styles.title}>Kĩ năng</Text>} extra={<EditOutlined className={styles.icon_edit} onClick={() => setOpenModalSkill(true)} />}>
                <List size="small"
                    dataSource={studentSkill}
                    renderItem={(item, index) => (
                        <List.Item>
                            <div className="w-100">
                                <Row>
                                    <Col span={8}>
                                        <Text className="f-16">{item.skillName}</Text>
                                    </Col>
                                    <Col span={12}>
                                        <Rate disabled value={item.level} />
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />
            </Card>
        </BoxContainer>
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
                        <List.Item className={styles.list_item} key={index}>
                            <div className="w-100">
                                <Row >
                                    <Col span={8} className="align-content-center">
                                        <Text className="f-16">{item.skillName}</Text>
                                    </Col>
                                    <Col span={12} className="align-content-center">
                                        <Rate disabled value={item.level} />
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
    </>
}
export default UpdateSkill;