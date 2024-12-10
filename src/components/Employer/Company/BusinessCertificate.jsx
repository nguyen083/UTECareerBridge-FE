import { Button, Flex, Form, Image, Modal, message } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { PicturesWall } from "../../Generate/Upload";
import React, { useState } from "react";
import IconLoading from "../../Generate/IconLoading";
import { useSelector, useDispatch } from "react-redux";
import { updateBusinessCertificate } from "../../../services/apiService";
import { setBusinessCertificate } from "../../../redux/action/employerSlice";
const BusinessCertificate = () => {
    const [loading, setLoading] = useState(false);
    const defaultImage = useSelector(state => state.employer.businessCertificate);
    const [change, setChange] = useState(false);
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const onFinish = (values) => {
        console.log(values);
        setLoading(true);

        updateBusinessCertificate(values).then((res) => {
            if (res.status === 'OK') {
                setLoading(false)
                setChange(false);
                message.success(res.message)
                dispatch(setBusinessCertificate(res));
                form.resetFields();
            }
            else {
                setLoading(false);
                setChange(false);
                message.error(res.message);
            }
        })
    }
    const onChange = () => {
        Modal.confirm({
            title: 'Xác nhận gửi thông tin',
            content: <span className="f-16">Bằng cách nhấp vào nút xác nhận, bạn đồng ý rằng việc không cung cấp hoặc cung cấp thông tin sai được coi là một vi phạm có thể dẫn tới tạm dừng dịch vụ và/hoặc hủy tài khoản mà không được hoàn tiền. Bạn có thể kiểm tra lại thông tin đã cung cấp</span>,
            onOk() {
                setChange(true);
            },
            onCancel() { form.resetFields() },
            footer: (_, { OkBtn, CancelBtn }) => (
                <>
                    <CancelBtn />
                    <OkBtn />
                </>
            )
        })
    }
    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Giấy chứng nhận kinh doanh
                </div>
            </BoxContainer>
            <BoxContainer>
                <Flex gap="1rem" align="center" >
                    < Form className=" col-12 col-md-7" onChange={onChange} form={form} onFinish={onFinish} layout="vertical" size="large">
                        <Form.Item name="businessCertificate" label="Ảnh giấy chứng nhận kinh doanh" tooltip="Kéo thả hoặc nhấp chọn để tải ảnh lên">
                            <PicturesWall defaultImage={defaultImage} listType={"text"} />
                        </Form.Item>

                        <Form.Item>
                            <Flex align='center' justify='end'>
                                <Button type='primary' htmlType='submit' disabled={loading || !change}><IconLoading loading={loading} setLoading={setLoading} /> Lưu</Button>
                            </Flex>
                        </Form.Item>
                    </Form>
                    <div className="d-none d-md-block col-5">
                        <Flex align="center" justify="center" vertical>
                            <div className="mb-1" style={{ fontSize: "1rem" }}>Ảnh minh họa</div>
                            <Image alt="Giấy phép minh họa" src="https://res.cloudinary.com/utejobhub/image/upload/v1727667740/company/tma_technology_group_business_certificate.jpg" width="60%" />
                        </Flex>
                    </div>
                </Flex>
            </BoxContainer>
        </>
    )
}
export default BusinessCertificate;