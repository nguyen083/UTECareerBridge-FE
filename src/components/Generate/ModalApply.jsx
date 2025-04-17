import BoxContainer from "./BoxContainer";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { FaMapLocationDot } from "react-icons/fa6";
import FileGroup from "./FileGroup";
import { useParams } from "react-router-dom";
import { Modal, Button, Row, Col, Typography, Flex, Divider, Image, Card, message } from "antd";
import { useState } from "react";
import LineEllipsis from "./LineEllipsis";
import { applyJob } from "../../services/apiService";
import { useTranslation } from "react-i18next";
// import styles from "./ModalApply.module.scss";
const { Title, Text } = Typography;
export const ModalApply = ({ show, setShow, company, job }) => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        resumeId: 0,
        jobId: id,
    });

    const handleApply = async () => {
        try {
            setLoading(true);
            const res = await applyJob(formData);
            if (res.status === 'OK') {
                message.success(t('job.apply.success'));
                setShow(false);
            }
            else
                message.error(res.message);
        } catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <Modal title={<><Title level={4}>{t('job.apply.title')}</Title> <Divider className="m-0" /></>}
            open={show}
            onCancel={() => setShow(false)} 
            width={1100}
            centered
            maskClosable={false}
            footer={[
                <Button key="apply" size="large" type="primary" onClick={handleApply} loading={loading}>{t('job.apply.submit')}</Button>
            ]}
        >
            <Row gutter={[8, 8]}>
                <Col span={9} color="#F8F9FA">
                    <BoxContainer className="shadow" background="#F8F9FA" borderRadius="0" padding="1rem">
                        <Flex vertical gap={8}>
                            <BoxContainer className="shadow" padding="0.5rem">
                                <Flex gap={3} align="center">
                                    <Image width={120}
                                        preview={false}
                                        src={company.companyLogo} />
                                    <Text className="text-base" type="secondary"><LineEllipsis line={2}>{company.companyName}</LineEllipsis></Text>
                                </Flex>
                            </BoxContainer>
                            <BoxContainer className="shadow" padding="0.5rem">
                                <Flex vertical>
                                    <Title level={5}>{job.jobTitle}</Title>
                                    <Flex align="center" gap={3}><FaRegMoneyBillAlt size={16} /> <div className='salary'>{job?.jobMinSalary?.toLocaleString('vi-VN')} - {job?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} /{t('common.month')}</div></Flex>
                                    <Flex align="center" gap={3}><FaMapLocationDot size={16} className="flex-shrink-0"/> <Text className="text-sm">{job?.jobLocation}</Text></Flex>
                                </Flex>
                            </BoxContainer>
                        </Flex>
                    </BoxContainer>
                </Col>
                <Col span={15}>
                    <Card className="shadow" size="default" title={t('job.apply.selectApplication')}>
                        <Flex vertical>
                            <FileGroup formData={formData} setFormData={setFormData} />
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </Modal>
    )
}