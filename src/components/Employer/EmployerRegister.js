import React, { useState } from 'react';
import { Button, Steps, theme } from 'antd';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import './EmployerRegister.scss';
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { DatePicker } from 'antd';


const steps = [
  {
    title: 'Liên lạc',
    content: '1',
  },
  {
    title: 'Công ty',
    content: '2',
  },
  {
    title: 'Tuyển dụng',
    content: '3',
  },
];
const EmployerRegister = () => {

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowRetypePassword, setIsShowRetypePassword] = useState(false);

  const handleShowPassword = () => {
    document.getElementById('password').type = isShowPassword ? 'password' : 'text';
    setIsShowPassword(!isShowPassword);
}
const handleShowRetypePassword = () => {
  document.getElementById('retypePassword').type = isShowRetypePassword ? 'password' : 'text';
  setIsShowRetypePassword(!isShowRetypePassword);
}

  const onChange = (date, dateString) => {
    console.log(date, dateString);
  };
  // const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };
  const prev = () => {
    setCurrent(current - 1);
  };
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  return (
    <div className='d-flex'>
      <div className='col-lg-4 sticky-top' style={{ height: "100vh", backgroundColor: "#ADADAD" }}>

      </div>
      <div className='col-lg-8 form-register'>
        <span className='title'>Đăng ký</span>
        <Steps className='p-4' current={current} items={items} />

        {steps[current].content === '1' && <div className='col-12 mt-3'>
          <div className="form-group row g-3">

            <div className="col-6 ">
              <label htmlFor="fistName" className="form-label">
                Tên <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="fistName" />
            </div>

            <div className="col-6 ">
              <label htmlFor="lastName" className="form-label">
                Họ <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="lastName" />
            </div>

            <div className="col-6 d-flex">
              <label htmlFor="gender" className="form-label">
                Giới tính <span style={{ color: "red" }}>*</span>
              </label>
              <div className='row ps-3'>
                <Form.Check defaultChecked label="Nam" name="group1" type="radio" id="male" />
                <Form.Check label="Nữ" name="group1" type="radio" id="female" />
              </div>
            </div>

            <div className="col-6 ">
              <label htmlFor="dob" className="form-label">
                Ngày sinh <span style={{ color: "red" }}>*</span>
              </label>
              <DatePicker className='form-control' onChange={onChange} format={"DD/MM/YYYY"} />
            </div>

            <div className="col-12 ">
              <label htmlFor="phoneNumber" className="form-label">
                Điện thoại <span style={{ color: "red" }}>*</span>
              </label>
              <input type="tel" className="form-control" id="phoneNumber" />
            </div>

            <div className="col-12 ">
              <label htmlFor="email" className="form-label">
                Địa chỉ email <span style={{ color: "red" }}>*</span>
              </label>
              <input type="email" className="form-control" id="email" />
            </div>

            <div className="col-12 ">
              <label htmlFor="password" className="form-label">
                Mật khẩu <span style={{ color: "red" }}>*</span>
              </label>
              <InputGroup >
                <Form.Control type='password' id='password' />
                <InputGroup.Text onClick={()=> handleShowPassword()}>{isShowPassword?<PiEye />:<PiEyeClosed/>}</InputGroup.Text>
              </InputGroup>
            </div>

            <div className="col-12 ">
              <label htmlFor="retypePassword" className="form-label">
                Nhập lại mật khẩu <span style={{ color: "red" }}>*</span>
              </label>
              <InputGroup >
                <Form.Control type='password' id='retypePassword' />
                <InputGroup.Text onClick={()=> handleShowRetypePassword()}>{isShowRetypePassword?<PiEye />:<PiEyeClosed/>}</InputGroup.Text>
              </InputGroup>
            </div>
          </div>
        </div>}
        {steps[current].content === '2' && <div className='col-12 mt-3'>
          <div className="form-group row g-3">

            <div className="col-12 ">
              <label htmlFor="companyName" className="form-label">
                Tên công ty <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="companyName" />
            </div>

            <div className="col-12 ">
              <label htmlFor="companyAddress" className="form-label">
                Địa chỉ công ty <span style={{ color: "red" }}>*</span>
              </label>
              <input type="text" className="form-control" id="companyAddress" />
            </div>

            <div className="col-12 ">
              <label htmlFor="companyPhone" className="form-label">
                Điện thoại công ty <span style={{ color: "red" }}>*</span>
              </label>
              <input type="tel" className="form-control" id="companyPhone" />
            </div>

            <div className="col-12 ">
              <label htmlFor="companyEmail" className="form-label">
                Email công ty <span style={{ color: "red" }}>*</span>
              </label>
              <input type="email" className="form-control" id="companyEmail" />
            </div>

            <div className="col-12 ">
              <label htmlFor="companyWebsite" className="form-label">
                Website công ty
              </label>
              <input type="text" className="form-control" id="companyWebsite" />
            </div>
          </div>
        </div>}

        <div className='d-flex justify-content-end'
          style={{
            marginTop: 24,
          }}
        >
          {current > 0 && (
            <Button
              style={{
                margin: '0 8px',
              }}
              onClick={() => prev()}
            >
              Quay lại
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Tiếp tục
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={() => { }}>
              Gửi
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};
export default EmployerRegister;