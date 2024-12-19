import { Affix, Button, Col, DatePicker, Flex, Form, Input, message, Modal, Radio, Row, Select, Space, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import ViewCV from "../../Student/CV/ViewCV";
import styles from "./ViewDetailApplicant.module.scss";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import { convertStatus } from "../../../services/apiService";
import { useEffect, useState } from "react";
import './ModalInterview.scss';
import CustomizeQuill from './../../Generate/CustomizeQuill';
import dayjs from "dayjs";
import { useSelector } from "react-redux";

const { Text } = Typography;
const ViewDetailApplicant = () => {
    const { id } = useParams();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [studentId, setStudentId] = useState(null);


    useEffect(() => {
        if (location.state?.status === "PENDING") {
            convertStatus(id, "VIEWED");
        }
    }, []);

    const handleReject = () => {
        convertStatus(id, "REJECTED").then((res) => {
            if (res.status === "OK") {
                message.success(res.message);
            }
        });
    }


    return (
        <Flex vertical gap={20}>
            <Affix offsetTop={80}>
                <BoxContainer className={styles.box_container}>
                    <Flex justify='space-between' align='center'>
                        <Text className="mb-0 title1">Duyệt ứng viên</Text>
                        <Flex gap={10} align='center'>
                            <Button icon={<CheckOutlined />} size="large" type="primary" className={styles.btn_success} onClick={() => setOpen(true)}>Duyệt</Button>
                            <Button icon={<CloseOutlined />} size="large" type="primary" danger onClick={handleReject}>Từ chối</Button>
                        </Flex>
                    </Flex>
                </BoxContainer>
            </Affix>
            <ViewCV setStudentId={setStudentId} />
            <ModalInterview open={open} setOpen={setOpen} studentId={studentId} />
        </Flex>
    )
}
const ModalInterview = ({ open, setOpen, studentId }) => {

    const [form] = Form.useForm();
    const [type, setType] = useState("offline");
    const employerId = useSelector(state => state.employer.id);
    const handleOk = () => {
        form.submit();
    }
    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    }
    const handleSubmit = (values) => {
        values.studentId = studentId;
        values.employerId = employerId;
        values.dateTime = dayjs(values.dateTime).format('YYYY-MM-DD HH:mm:ss');

        // call api here
        console.log(values);

        // cập nhật trạng thái hồ sơ
        convertStatus(id, "APPROVED").then((res) => {
            if (res.status === "OK") {
                message.success(res.message);
                handleCancel();
            }
        });
    }

    const onlineForm = (
        <>
            <Form.Item name="link" layout="vertical" label="Link phỏng vấn">
                <Input placeholder="Nhập link phỏng vấn" />
            </Form.Item>
        </>
    )
    const offlineForm = (
        <>
            <Form.Item required label="Thời gian phỏng vấn" name='dateTime' rules={[{ required: true, message: 'Vui lòng chọn thời gian phỏng vấn!' }]} >
                <DatePicker placeholder="Chọn thời gian phỏng vấn" allowClear showTime className="w-100" format={'DD/MM/YYYY HH:mm:ss'} />
            </Form.Item>
            <Form.Item required label="Địa điểm phỏng vấn" name='location' rules={[{ required: true, message: 'Vui lòng nhập địa điểm phỏng vấn!' }]} >
                <Input allowClear placeholder="Nhập địa điểm phỏng vấn" />
            </Form.Item>
            <Form.Item label="Ngôn ngữ phỏng vấn" name='language' required rules={[{ required: true, message: 'Vui lòng nhập ngôn ngữ sẽ phỏng vấn!' }]} >
                <Input allowClear placeholder="Ngôn ngữ phỏng vấn" />
            </Form.Item>
            <Form.Item label="Thông tin bổ sung" name='description' >
                <CustomizeQuill />
            </Form.Item>
            <Form.Item required label="Thông tin liên hệ" tooltip="Thông tin liên hệ khi người nhận được thông báo này cần hỗ trợ" >
                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item name='phoneNumber' rules={[
                            { required: true, message: 'Vui lòng nhập số điện thoại!' },
                            {
                                pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                                message: 'Số điện thoại không hợp lệ'
                            }]} validateFirst validateTrigger={['onBlur']}>
                            <Input allowClear placeholder="Số điện thoại" />
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item allowClear name='name' rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ!' }]}>
                            <Space.Compact>
                                <Input className="f-16" value={'Gặp Anh/ Chị: '} disabled style={{ width: 'fit-content' }} />
                                <Input allowClear placeholder="Tên người liên hệ" />
                            </Space.Compact>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name='email'
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không hợp lệ!' },
                            ]} validateFirst validateTrigger={['onBlur']}>
                            <Input allowClear placeholder="Email" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form.Item>
        </>);



    return <Modal className="modal_interview" width={800} centered title="Thông báo phỏng vấn" open={open} onOk={handleOk} okText={"Gửi"} onCancel={handleCancel}>
        <Form autoComplete layout="vertical" required size="large" form={form} onFinish={handleSubmit}>
            <Form.Item label="Hình thức phỏng vấn">
                <Radio.Group value={type} onChange={(e) => { form.resetFields(); setType(e.target.value) }}>
                    <Radio className="f-16" value="offline">Trực tiếp</Radio>
                    <Radio className="f-16" value="online">Trực tuyến</Radio>
                </Radio.Group>
            </Form.Item>
            {type === "online" ?
                onlineForm
                : offlineForm}
        </Form>
    </Modal>
}
export default ViewDetailApplicant;