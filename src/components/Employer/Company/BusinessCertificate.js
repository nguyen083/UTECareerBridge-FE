import { Button, Flex, Form } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import PicturesWall from "../../Generate/Upload";
import React, { useState } from "react";
import { toast } from "react-toastify";
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
                toast.success(res.message)
                dispatch(setBusinessCertificate(res));
                form.resetFields();
            }
            else {
                setLoading(false);
                setChange(false);
                toast.error(res.message);
            }
        })
    }
    const onChange = () => {
        setChange(true);
    }
    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Giấy chứng nhận kinh doanh
                </div>
            </BoxContainer>
            <BoxContainer>
                <Form onChange={onChange} form={form} onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="businessCertificate" label="Ảnh giấy chứng nhận kinh doanh">
                        <PicturesWall defaultImage={defaultImage} listType={"text"} />
                    </Form.Item>

                    <Form.Item>
                        <Flex align='center' justify='end'>
                            <Button type='primary' htmlType='submit' disabled={loading || !change}><IconLoading loading={loading} setLoading={setLoading} /> Lưu</Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </BoxContainer>
        </>
    )
}
export default BusinessCertificate;