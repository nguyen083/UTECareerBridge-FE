import BoxContainer from "./BoxContainer";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import FileGroup from "./FileGroup";
import { useParams } from "react-router-dom";
import { Modal, Button, Row, Col, Typography, Flex, Divider, Image, Card, message } from "antd";
import { useState } from "react";
import LineEllipsis from "./LineEllipsis";
import { applyJob } from "../../services/apiService";
import styles from "./ModalApply.module.scss";
const { Title, Text } = Typography;
export const ModalApply = ({ show, setShow, company, job }) => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        resumeId: 0,
        jobId: id,
    });

    const handleApply = () => {
        try {
            setLoading(true);
            applyJob(formData).then((res) => {
                if (res.status === 'OK') {
                    message.success(res.message);
                    setShow(false);
                }
                else
                    message.error(res.message);
            });
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false);
        }

    }
    return (
        <Modal title={<><Title level={4}>Ứng tuyển công việc</Title> <Divider className="m-0" /></>}
            open={show}
            onCancel={() => setShow(false)} width={900}
            centered
            maskClosable={false}
            footer={[
                <Button size="large" type="primary" onClick={handleApply}> Ứng tuyển</Button>
            ]}
        >

            <Row gutter={[8, 8]}>
                <Col span={9} color="#F8F9FA">
                    <BoxContainer className={styles.box_shadow} background="#F8F9FA" borderRadius="0" padding="1rem">
                        <Flex vertical gap={8}>
                            <BoxContainer className={styles.box_shadow} padding="0.5rem">
                                <Flex gap={3} align="center">
                                    <Image width={120}
                                        preview={false}
                                        src={company.companyLogo} />
                                    <Text className="font-size" type="secondary"><LineEllipsis line={2}>{company.companyName}</LineEllipsis></Text>
                                </Flex>
                            </BoxContainer>
                            <BoxContainer className={styles.box_shadow} padding="0.5rem">
                                <Flex vertical>
                                    <Title level={5}>{job.jobTitle}</Title>
                                    <Flex align="center" gap={3}><FaRegMoneyBillAlt size={16} /> <div className='salary'>{job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} /tháng</div></Flex>
                                    <Flex align="center" gap={3}><FaMapLocationDot size={16} /> <Text>{job?.jobLocation}</Text></Flex>
                                </Flex>
                            </BoxContainer>
                        </Flex>
                    </BoxContainer>
                </Col>
                <Col span={15}>
                    <Card className={styles.box_shadow} size="default" title={"Chọn đơn ứng tuyển"}>
                        <Flex vertical>
                            <FileGroup formData={formData} setFormData={setFormData} />
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </Modal>
    );
}