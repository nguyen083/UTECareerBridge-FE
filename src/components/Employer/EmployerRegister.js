import React from 'react';
import { useState } from 'react';
import { Button, Form, Input, Space, DatePicker, Steps, Radio } from 'antd';
import './EmployerRegister.scss';
import SubmitButton from '../Generate/SubmitButton';


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
    console.log({ ...values, ...form });

  };
  return (
    <>
      <div className=' form-register'>
        <span className='title'>Đăng Ký</span>
        <Steps className='p-md-5' current={current} items={items} />
        <Form form={form1} onFinish={onFinish} name="validateOnlyform1" requiredMark={false} layout="vertical" autoComplete="off" initialValues={{ company_website: "" }}>
          {steps[current].content === '1' && <div className='col-12 mt-3'>

            <Form size='large' form={form2} name="validateOnlyform2" requiredMark={false} layout="vertical" autoComplete="off"
              initialValues={{ gender: 0, dob: DoB }}>
              <div className="form-group row g-3">
                <Form.Item name="fist_name" className=" col-12 col-md-6 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
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
                  <Input  />
                </Form.Item>


                <Form.Item name="last_name" className="col-12 col-md-6 mt-0" label={<span>Họ <span style={{ color: "red" }}> *</span></span>}
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
                  <Input  />
                </Form.Item>
                <Form.Item name="gender" layout='horizontal' className="col-12 col-md-6 mt-0 mb-0" label="Giới tính" >
                  <Radio.Group value={gender} className='mb-0'>
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
                  <Input  />
                </Form.Item>
                <Form.Item name="email" className="col-12 mt-0" label={<span>Email <span style={{ color: "red" }}> *</span></span>}
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
                  <Input  />
                </Form.Item>
                <Form.Item name="password" className="col-12 mt-0" label={<span>Mật khẩu <span style={{ color: "red" }}> *</span></span>}
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
                  <Input.Password className="form-control d-flex" />
                </Form.Item>
                <Form.Item name="retype_password" className="col-12 mt-0" label={<span>Xác nhận mật khẩu <span style={{ color: "red" }}> *</span></span>}
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
                  <Input.Password className="form-control d-flex" />
                </Form.Item>
              </div>
              <div className='d-flex justify-content-end mt-3'>
                {current < steps.length - 1 && (
                  <Form.Item>
                    <Space>
                      <SubmitButton form={form2} onClick={next}>Tiếp tục</SubmitButton>
                    </Space>
                  </Form.Item>
                )}
              </div>
            </Form>

          </div>}
          {steps[current].content === '2' && <div className='col-12 mt-3'>
            <div className="form-group row g-3">
              <Form.Item name="company_name" className="col-12 mt-0" label={<span>Tên công ty <span style={{ color: "red" }}> *</span></span>}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập tên công ty',
                  },
                ]} validateTrigger={['onBlur']}>
                <Input  />
              </Form.Item>
              <Form.Item name="company_email" className="col-12 mt-0" label={<span>Email công ty <span style={{ color: "red" }}> *</span></span>}
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
                <Input  />
              </Form.Item>
              <Form.Item name="company_address" className="col-12 mt-0" label={<span>Địa chỉ công ty <span style={{ color: "red" }}> *</span></span>}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập địa chỉ công ty',
                  },
                ]} validateTrigger={['onBlur']}>
                <Input  />
              </Form.Item>
              <Form.Item name="company_website" className="col-12 mt-0" label="Website công ty">
                <Input  />
              </Form.Item>
            </div>
          </div>}

          <div className='d-flex justify-content-end mt-4'>
            {current > 0 && (
              <Button className='mx-2' onClick={() => prev()}>
                Quay lại
              </Button>
            )}

            {current === steps.length - 1 && (
              <Form.Item>
                <Space>
                  <SubmitButton type="primary" form={form1} onClick={() => { }} >Gửi</SubmitButton>
                </Space>
              </Form.Item>
            )}
          </div>
        </Form>
      </div>
      <div className='bottom-footer position-fixed bottom-0 p-2' >
        <span>Bạn đã có tài khoản? <a href='/login' className='text-decoration-none'>Đăng nhập</a></span>
      </div>
    </>

  );
};
export default EmployerRegister;