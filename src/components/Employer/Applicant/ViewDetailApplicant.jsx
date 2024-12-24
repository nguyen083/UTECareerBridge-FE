import { Affix, Button, Col, DatePicker, Flex, Form, Input, message, Modal, Radio, Row, Select, Space, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import ViewCV from "../../Student/CV/ViewCV";
import styles from "./ViewDetailApplicant.module.scss";
import { CheckOutlined, CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams, useLocation, useSearchParams } from "react-router-dom";
import { convertStatus, sendMailApprove } from "../../../services/apiService";
import { useEffect, useState } from "react";
import './ModalInterview.scss';
import CustomizeQuill from './../../Generate/CustomizeQuill';
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { loading, stop } from "../../../redux/action/webSlice";

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
            {location.state?.status !== 'APPROVED' && <Affix Affix offsetTop={80}>
                <BoxContainer className={styles.box_container}>
                    <Flex justify='space-between' align='center'>
                        <Text className="mb-0 title1">Duyệt ứng viên</Text>
                        <Flex gap={10} align='center'>
                            <Button icon={<CheckOutlined />} size="large" type="primary" className={styles.btn_success} onClick={() => setOpen(true)}>Duyệt</Button>
                            {location.state?.status !== 'REJECTED' && <Button icon={<CloseOutlined />} size="large" type="primary" danger onClick={handleReject}>Từ chối</Button>}
                        </Flex>
                    </Flex>
                </BoxContainer>
            </Affix>}
            <ViewCV setStudentId={setStudentId} />
            <ModalInterview open={open} setOpen={setOpen} studentId={studentId} />
        </Flex >
    )
}
export const ModalInterview = ({ open, setOpen, studentId }) => {

    const { id } = useParams();
    const [form] = Form.useForm();
    const [type, setType] = useState("ONLINE");
    const employerId = useSelector(state => state.employer.id);
    const location = useLocation();
    const dispatch = useDispatch();
    const load = useSelector(state => state.web.loading);
    const handleOk = () => {
        form.submit();
    }
    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    }
    const handleSubmit = (values) => {
        values.studentId = studentId;
        if (type === "ONLINE") {
            values.jobId = location.state?.jobId;
            values.interviewDate = dayjs(values.interviewDate).format('YYYY-MM-DD HH:mm:ss');
            values.interviewMethod = type;
            dispatch(loading());
            sendMailApprove(values).then((res) => {
                if (res.status === "OK") {
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            }).catch((err) => {
                message.error(err.message);
            }
            ).finally(() => {
                convertStatus(id, "APPROVED").then((response) => {
                    console.log(response);
                    if (response.status === "OK") {
                        message.success(response.message);
                        handleCancel();
                    }
                }).catch((err) => {
                    message.error(err.message);
                }).finally(() => {
                    dispatch(stop());
                    form.resetFields();
                });

            });
        } else {
            values.employerId = employerId;
            values.dateTime = dayjs(values.dateTime).format('YYYY-MM-DD HH:mm:ss');
        }


    }
    const disablePastDates = (current) => {
        // Chỉ cho phép chọn các ngày từ hôm nay trở đi
        return current && current < new Date().setHours(0, 0, 0, 0);
    };
    const onlineForm = (
        <>
            <Form.Item required label="Vị trí phỏng vấn" name='jobPosition' rules={[{ required: true, message: 'Vui vị trí phỏng vấn!' }]} >
                <Input allowClear placeholder="Nhập vị trí phỏng vấn" />
            </Form.Item>
            <Form.Item required label="Thời gian phỏng vấn" name='interviewDate' rules={[{ required: true, message: 'Vui lòng chọn thời gian phỏng vấn!' }]} >
                <DatePicker placeholder="Chọn thời gian phỏng vấn" allowClear showTime className="w-100" format={'DD/MM/YYYY HH:mm:ss'} disabledDate={disablePastDates} />
            </Form.Item>
            <Form.Item required name="interviewLocation" layout="vertical" label="Link phỏng vấn" rules={[{ required: true, message: 'Vui lòng nhập link Google Meet!' }]} >
                <Input.TextArea allowClear rows={4} placeholder="Nhập link Google Meet" />
            </Form.Item>
            <Form.Item label="Thông tin bổ sung" name='description' >
                <CustomizeQuill />
            </Form.Item>
            <Form.Item required label="Người phỏng vấn" name='interviewer' rules={[{ required: true, message: 'Vui lòng nhập tên người phỏng vấn!' }]} >
                <Input allowClear placeholder="Người phỏng vấn" />
            </Form.Item>
            <Form.Item name='contactEmail'
                label="Email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]} validateFirst validateTrigger={['onBlur']}>
                <Input allowClear placeholder="Email" />
            </Form.Item>
            <Form.Item name='contactPhone'
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    {
                        pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                        message: 'Số điện thoại không hợp lệ'
                    }]} validateFirst >
                <Input allowClear placeholder="Số điện thoại" />
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
                            }]} validateFirst >
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
    return <Modal closable={false} className="modal_interview" width={800} centered title="Thông báo phỏng vấn" open={open}

        footer={[
            <Button size="large" key="back" onClick={handleCancel} >Hủy</Button>,
            <Button loading={load} size="large" key="submit" type="primary" onClick={handleOk}>Gửi</Button>,
        ]}
    >
        <Form autoComplete="on" layout="vertical" required size="large" form={form} onFinish={handleSubmit}>
            {/* <Form.Item label="Hình thức phỏng vấn">
                <Radio.Group value={type} onChange={(e) => { form.resetFields(); setType(e.target.value) }}>
                    <Radio className="f-16" value="OFFLINE">Trực tiếp</Radio>
                    <Radio className="f-16" value="ONLINE">Trực tuyến</Radio>
                </Radio.Group>
            </Form.Item> */}
            {type === "ONLINE" ?
                onlineForm
                : offlineForm}
        </Form>
    </Modal>
}
export default ViewDetailApplicant;