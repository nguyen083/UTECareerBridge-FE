import { Button, Divider, Flex, Form, Input, Radio, Space, DatePicker } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './EmployerProfile.scss';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { updateEmployerProfile } from '../../../services/apiService';
import { toast } from 'react-toastify';
import { setInfor } from '../../../redux/action/employerSlice';

const EmployerProfile = () => {
    const regChar = new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/);
    const [enableEdit, setEnableEdit] = useState(true);
    const [form] = Form.useForm();
    dayjs.extend(customParseFormat);
    const dispatch = useDispatch();
    let infor = { ...useSelector(state => state.employer), dob: dayjs(useSelector(state => state.employer.dob), "DD/MM/YYYY") };

    const handleReset = () => {
        setEnableEdit(true);
        form.resetFields();
    }
    const handleSubmit = (values) => {
        values.dob = values.dob.format("DD/MM/YYYY");
        console.log(values);
        updateEmployerProfile(values).then(res => {
            if (res.status === 'OK') {
                toast.success(res.message);
                dispatch(setInfor(res.data));
            }
            else {
                toast.error(res.message);
            }
        });
    };



    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Thông tin cá nhân
                </div>
            </BoxContainer>
            <BoxContainer>
                <Flex align='center' justify='space-between'>
                    <span className='title2'>Thông tin chung</span>
                    <Button disabled={!enableEdit} onClick={() => { setEnableEdit(false) }}>Chỉnh sửa</Button>
                </Flex>
                <Divider />
                <Form onFinish={handleSubmit} form={form} size='large' layout='horizontal' requiredMark={false} autoComplete='false' disabled={enableEdit}
                    initialValues={infor}>
                    <div className="div-form-profile form-group row g-3">
                        <Form.Item name="firstName" className="col-12 col-md-6 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên',
                                },
                                {
                                    pattern: regChar,
                                    message: 'Tên không hợp lệ',
                                }
                            ]} validateTrigger={['onChange']}>
                            <Input allowClear />
                        </Form.Item>

                        <Form.Item name="lastName" className="col-12 col-md-6 mt-0" label={<span>Họ <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ',
                                },
                                {
                                    pattern: regChar,
                                    message: 'Họ không hợp lệ',
                                }
                            ]} validateTrigger={['onChange']}>
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item name="gender" layout='horizontal' className="col-12 col-md-6 mt-0 mb-0" label="Giới tính" >
                            <Radio.Group className='mb-0'>
                                <Space direction="vertical">
                                    <Radio value={0}>Nam</Radio>
                                    <Radio value={1}>Nữ</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item name="dob" className="col-12 col-md-6 mt-0" label={<span>Ngày sinh <span style={{ color: "red" }}> *</span></span>} rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập ngày sinh của bạn',
                            },
                        ]} validateTrigger={['onChange']}>
                            <DatePicker className='form-control' format={"DD/MM/YYYY"} />
                        </Form.Item>
                        <Form.Item name="phoneNumber" className="col-12 mt-0" label={<span>Số điện thoại <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số điện thoại của bạn',
                                },
                                {
                                    pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                                    message: 'Số điện thoại không hợp lệ'
                                }
                            ]}
                            validateTrigger={['onBlur']}>
                            <Input allowClear />
                        </Form.Item>
                    </div>
                    <Flex gap={"1rem"} align='center' justify='end' hidden={enableEdit}>
                        <Button type='default' onClick={handleReset}>Hủy</Button>
                        <Button type='primary' htmlType='submit'>Lưu</Button>
                    </Flex>
                </Form>
            </BoxContainer>
        </>
    );
}

export default EmployerProfile;