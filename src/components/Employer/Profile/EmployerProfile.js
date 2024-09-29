import { Button, Divider, Flex, Form, Input, Radio, Space, DatePicker } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './EmployerProfile.scss';
import { useState } from 'react';

const EmployerProfile = () => {
    const regChar = new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/);
    const [enableEdit, setEnableEdit] = useState(true);
    const [form] = Form.useForm();
    const [DoB, setDoB] = useState('');

    // Get data in redux
    const infor = {
        fist_name: "Nguyên",
        last_name: "Nguyễn Huỳnh",
        gender: 0,
        //dob: "01/01/2000",
    }

    const onChange = (date, dateString) => {
        setDoB(dateString);
    };

    const handleReset = () => {
        setEnableEdit(true);
        form.resetFields();
    }
    return (<>
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
            <Form form={form} size='large' layout='horizontal' requiredMark={false} autoComplete='false' disabled={enableEdit}
                initialValues={infor}>
                <div className="div-form-profile form-group row g-3">
                    <Form.Item name="fist_name" className="col-12 col-md-6 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
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

                    <Form.Item name="last_name" className="col-12 col-md-6 mt-0" label={<span>Họ <span style={{ color: "red" }}> *</span></span>}
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
                        <DatePicker onChange={onChange} className='form-control' format={"DD/MM/YYYY"} />
                    </Form.Item>
                    <Form.Item name="phone_number" className="col-12 mt-0" label={<span>Số điện thoại <span style={{ color: "red" }}> *</span></span>}
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