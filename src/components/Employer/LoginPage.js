import './LoginPage.scss';
import { useState } from 'react';
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { toast } from 'react-toastify';
import { employerLogin } from '../../services/apiService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

    // document.title = "Đăng nhập";
    const onChangePassword = (event) => {
        setPassword(event.target.value)
    }
    const handleShowPassword = () => {
        if (isShowPassword === false) {
            // hiện mật khẩu
            document.getElementById('inputPassword').type = 'text';
            console.log('ẩn mật khẩu' + isShowPassword);
            setIsShowPassword(true);
        }
        else {
            // ẩn mật khẩu
            document.getElementById('inputPassword').type = 'password';
            console.log('hiện mật khẩu' + isShowPassword);
            setIsShowPassword(false);
        }
    }
    const handleSubmit = async() => {
        //Validate email
        if (email === '') {
            toast.error('Vui lòng nhập email');
            return;
        } else {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(email)) {
                toast.error('Email không hợp lệ');
                return;
            }
        }
        //Validate password
        if (password === '') {
            toast.error('Vui lòng nhập mật khẩu');
            return;
        }
        //Call API
        const data = await employerLogin(email, password);        
        if (data.status === 'OK') {
            toast.success(data.data.message);
            localStorage.setItem('accessToken', data.data.token);
            window.location.href = '/get-infor';
            document.cookie = `refreshToken=${data.data.refreshToken}`;
        } else {
            toast.error(data.data.message);
        }
    }
    return (
        <div className="login-page d-flex">
            <div className="image col-lg-5 d-none d-lg-block"></div>
            <div className="col-12 p-5 col-lg-7">
                <div className="login-form mt-4 p-5 shadow">
                    <span className="fw-bold title">Đăng nhập</span>
                    <div className="col-md-12 form-group mt-5 mb-4">
                        <label htmlFor="email" className="form-label" >Email/ Số điện thoại <span style={{ color: "red" }}>*</span></label>
                        <input className="form-control" type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Nhập email" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Mật khẩu <span style={{ color: "red" }}>*</span></label>
                        <div className='position-relative'>
                            <input className="form-control" type="password" id="inputPassword" value={password} onChange={(event) => onChangePassword(event)} placeholder='Nhập mật khẩu' />
                            <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                                {isShowPassword ? <PiEye style={{ width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem" }} onClick={() => handleShowPassword()} /> : <PiEyeClosed style={{ width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem" }} onClick={() => handleShowPassword()} />}
                            </div>
                        </div>

                    </div>
                    <div className='d-flex justify-content-between mb-4'>
                        <span>Bạn chưa đăng ký? <a href='/employer/register'>Đăng ký ngay</a></span>
                        <a href='/user/forgot-password' target='_blank'>Quên mật khẩu?</a>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <button className="btn btn-primary text-end px-3" onClick={() => handleSubmit()}>Đăng nhập</button>
                    </div>

                </div>
            </div>
        </div>

    );
}
export default LoginPage;