import React from 'react';
import { useState } from 'react';
import { Button, Form, Input, Space, DatePicker, Steps, Radio, Card, message, Col, Row, Flex, Image } from 'antd';
import './EmployerRegister.scss';
import SubmitButton from '../Generate/SubmitButton';
import COLOR from '../styles/_variables'
import { registerEmployer } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';
import path from '../../constant/path';


const steps = [
  {
    title: 'Liên lạc',
    content: '1',
  },
  {
    title: 'Công ty',
    content: '2',
  }
];
const EmployerRegister = () => {
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  const navigate = useNavigate();
  const gender = 0; // giới tính mặc định
  const [DoB, setDoB] = useState('');
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({});
  const regChar = new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/);

  const onChange = (date, dateString) => {
    setDoB(dateString);
  };
  const next = () => {
    setCurrent(current + 1);
    setForm({ ...form, ...form2.getFieldsValue(), dob: DoB });
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const onFinish = (values) => {
    registerEmployer({ ...form, ...values }).then(res => {
      if (res.status === 'CREATED') {
        message.success(res.message);
        form1.resetFields();
        form2.resetFields();
        navigate('/employer/login');
      } else {
        message.error(res.message);
      }
    }).catch(err => {
      message.error('Đăng ký thất bại');
    });
    // console.log({ ...form, ...values });
  };

  return (
    <>
      <Flex className='form-register' align='center' justify='start' vertical gap={20}>
        <Image
          className='logo'
          src={path.logo}
          alt=""
          preview={false}
          width={200}
          onClick={() => navigate('/home')}
        />
        <Card style={{ backgroundColor: COLOR.cardColor }} className='shadow-lg w-3/4 mx-auto'>
          <span className='title' style={{ color: COLOR.textColor }}>Đăng Ký</span>
          <Steps className='p-5 w-3/4 mx-auto' current={current} items={items} />
          <Form form={form1} onFinish={onFinish} name="validateOnlyform1" requiredMark={false} layout="vertical" autoComplete="off" size='large'>
            {steps[current].content === '1' && <div className='w-full mt-3'>

              <Form className='mb-0' size='large' form={form2} name="validateOnlyform2" requiredMark={false} layout="vertical" autoComplete="off"
                initialValues={{ gender: 0, dob: DoB }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="first_name" label={<span>Tên <span className='text-red-500'> *</span></span>}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tên của bạn',
                        },
                        {
                          pattern: regChar,
                          message: 'Tên không hợp lệ',
                        }
                      ]} validateTrigger={['onBlur']}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="last_name" label={<span>Họ <span className='text-red-500'> *</span></span>}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập họ của bạn',
                        },
                        {
                          pattern: regChar,
                          message: 'Họ không hợp lệ',
                        }
                      ]} validateTrigger={['onBlur']}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="gender" layout='horizontal' label="Giới tính" >
                      <Radio.Group value={gender} className='mb-0'>
                        <Space direction="vertical">
                          <Radio value={0}>Nam</Radio>
                          <Radio value={1}>Nữ</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="dob" label={<span>Ngày sinh <span className='text-red-500'> *</span></span>} rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập ngày sinh của bạn',
                      },
                    ]} validateTrigger={['onChange']}>
                      <DatePicker onChange={onChange} className='w-full' format={"DD/MM/YYYY"} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="phone_number" label={<span>Số điện thoại <span className='text-red-500'> *</span></span>}
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
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item name="email" label={<span>Email <span className='text-red-500'> *</span></span>}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập email của bạn',
                        },
                        {
                          type: 'email',
                          message: 'Email không hợp lệ',
                        }
                      ]}
                      validateTrigger={['onBlur']}>
                      <Input />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="password" label={<span>Mật khẩu <span className='text-red-500'> *</span></span>}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu của bạn',
                        },
                        {
                          min: 8,
                          message: 'Mật khẩu phải có ít nhất 8 ký tự'
                        },
                        {
                          pattern: new RegExp(/^(?=.*[A-Z])/),
                          message: 'Mật khẩu phải chứa ít nhất 1 chữ cái viết hoa'
                        },
                        {
                          pattern: new RegExp(/^(?=.*[0-9])/),
                          message: 'Mật khẩu phải chứa ít nhất 1 chữ số'
                        },
                        {
                          pattern: new RegExp(/^(?=.*[!@#$%^&*(),.?":{}|<>])/),
                          message: 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
                        }
                      ]} validateFirst
                      validateTrigger={['onBlur']}>
                      <Input.Password />
                    </Form.Item>
                  </Col>

                  <Col span={24}>
                    <Form.Item name="retype_password" label={<span>Xác nhận mật khẩu <span className='text-red-500'> *</span></span>}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng xác nhận lại mật khẩu của bạn',
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                          },
                        }),
                      ]} validateTrigger={['onBlur']}>
                      <Input.Password />
                    </Form.Item>
                  </Col>
                </Row>
                <Flex justify='end'>
                  {current < steps.length - 1 && (

                    <SubmitButton form={form2} onClick={next}>Tiếp tục</SubmitButton>

                  )}
                </Flex>
              </Form>

            </div>}
            {steps[current].content === '2' && <div className='w-full mt-3'>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="company_name" label={<span>Tên công ty <span className='text-red-500'> *</span></span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên công ty',
                      },
                    ]} validateTrigger={['onBlur']}>
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="company_email" label={<span>Email công ty <span className='text-red-500'> *</span></span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập email công ty',
                      },
                      {
                        type: 'email',
                        message: 'Email không hợp lệ',
                      }
                    ]} validateTrigger={['onBlur']}>
                    <Input />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="company_address" label={<span>Địa chỉ công ty <span className='text-red-500'> *</span></span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập địa chỉ công ty',
                      },
                    ]} validateTrigger={['onBlur']}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="company_website" label="Website công ty">
                    <Input />
                  </Form.Item>
                </Col>


              </Row>
            </div>}

            <div className='flex justify-end mt-4'>
              {current > 0 && (
                <Button className='mx-2' onClick={() => prev()}>
                  Quay lại
                </Button>
              )}

              {current === steps.length - 1 && (
                <SubmitButton type="primary" form={form1} onClick={() => { }} >Gửi</SubmitButton>
              )}
            </div>
          </Form>
        </Card>
      </Flex>
      {/* <div className='bottom-footer position-fixed bottom-0 p-2' >
        <span>Bạn đã có tài khoản? <a href='/login' className='text-decoration-none'>Đăng nhập</a></span>
      </div> */}
    </>

  );
};
export default EmployerRegister;