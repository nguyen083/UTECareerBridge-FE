import { useEffect, useState } from "react";
import "./RegisterPage.scss";
import PhoneInputGfg from "../Generate/PhoneInputGfg";

const RegisterPage = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [check, setCheck] = useState(false);
    const [message, setMessage] = useState(
        {
            // firstName: "",
            // lastName: "",
            phoneNumber: true,
            email: true,
            password: true,
            retypePassword: true,
            messagePassword: "",
        }); // thông báo lỗi

    const validate = () => {


        validPhoneNumber();
        validEmail();
        validatePassword();
        validateRetypePassword();
    }

    const validPhoneNumber = async () => {
        let updatePhoneNumber = phoneNumber;
        updatePhoneNumber.startsWith('84') && (updatePhoneNumber = updatePhoneNumber.replace(/^84/, ''));
        !updatePhoneNumber.startsWith('0') && (updatePhoneNumber = '0' + updatePhoneNumber);
        if (updatePhoneNumber.length !== 10) 
            setMessage(message=>({ ...message, phoneNumber: false }));
        else 
            setMessage(message=>({ ...message, phoneNumber: true }));
           
        setPhoneNumber(updatePhoneNumber);

    }
    const validEmail = async () => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email))
            setMessage(message=>({ ...message, email: false }));
        else
            setMessage(message=>({ ...message, email: true }));

    }

    const validatePassword = () => {
        if (password.length < 8) {
            setMessage(message=> ({ ...message, messagePassword: "Mật khẩu phải chứa ít nhất 8 ký tự",password:false }));
            return;
        }

        if (!/[A-Z]/.test(password)) {
            setMessage(message=>({ ...message, messagePassword: "Mật khẩu phải chứa ít nhất 1 chữ in hoa." ,password:false }));
            return;
        }

        if (!/\d/.test(password)) {
            setMessage(message=>({ ...message, messagePassword: "Mật khẩu phải chứa ít nhất 1 chữ số.",password:false  }));
            return;
        }

        if (!/[!@#$%^&*()_+{}\[\]:;"'<>,.?/\\|`~]/.test(password)) {
            setMessage(message=> ({ ...message, messagePassword: "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt." ,password:false }));
            return;
        }
        setMessage(message=>({ ...message, messagePassword: "",password:true  }));
    }
    const validateRetypePassword = () => {
        if (password !== retypePassword&& message.password) {
            setMessage(message=>({ ...message, retypePassword: false }));
        }
        else {
            setMessage(message=>({...message, retypePassword: true }));
        }
    }

    return (
        <div className="d-flex ">
            <div className="col-md-4" style={{ height: "100vh" }}>
            </div>
            <div className="col-md-8 col-12 " style={{ padding: " 5rem 0 5rem 0" }}>
                <div className="d-block mx-auto p-5 shadow" style={{ width: "70%", backgroundColor: "white" }}>
                    <div className="title d-block">
                        <span className="d-block text-center mb-4" style={{ height: "auto", fontSize: "2rem", fontFamily: "Segoe UI", color: "#555555" }}>Đăng Ký Tài Khoản</span>
                    </div>
                    <div className="form-group row g-3">
                        <div className=" col-md-6">
                            <label htmlFor="firstName" className="form-label" >Tên</label>
                            <input type="text" className="form-control" id="firstName" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="lastName" className="form-label" >Họ</label>
                            <input className="form-control" id="lastName" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="phoneNumber" className="form-label" >Số điện thoại</label>
                            <input className={` ${!message.phoneNumber && 'is-invalid'}`} hidden aria-describedby="validationPhoneNumberFeedback" />
                            <PhoneInputGfg id="phoneNumber" phone={phoneNumber} setPhone={setPhoneNumber} />

                            <div id="validationPhoneNumberFeedback" className="invalid-feedback">
                                Số điện thoại không hợp lệ
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="email" className="form-label" >Email</label>
                            <input className={`form-control ${!message.email && 'is-invalid'}`} type="email" id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Nhập email để xác thực" aria-describedby="validationEmailFeedback" />
                            <div id="validationEmailFeedback" className="invalid-feedback">
                                Email không hợp lệ
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="password" className="form-label" >Mật khẩu</label>
                            <input className={`form-control ${!message.password && 'is-invalid'}`} type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" aria-describedby="validationPasswordFeedback" />
                            <div id="validationPasswordFeedback" className="invalid-feedback">
                                {message.messagePassword}
                            </div>
                        </div>
                        <div className="col-md-12">
                            <label htmlFor="retypePassword" className="form-label" >Xác nhận mật khẩu</label>
                            <input className={`form-control ${!message.retypePassword && 'is-invalid'}`} type="password" id="retypePassword" value={retypePassword} onChange={(event) => setRetypePassword(event.target.value)} placeholder="Nhập lại mật khẩu" aria-describedby="validationRetypePasswordFeedback" />
                            <div id="validationRetypePasswordFeedback" className="invalid-feedback">
                                Mật khẩu xác nhận không khớp
                            </div>
                        </div>
                        <div className="col-md-12 mb-5">
                            <div className="form-check">
                                <input className="form-check-input border-dark" type="checkbox" value={check}
                                    onChange={() => setCheck(!check)} id="Checkbox" />
                                <label className="form-check-label" htmlFor="invalidCheck3">
                                    Bạn đã đọc và đồng ý với các <a href="/#">điều khoản và điều kiện</a> của chúng tôi
                                </label>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <button className={`btn btn-primary col-12 ${!check && 'disabled'}`} onClick={() => validate()}>Đăng ký</button>
                        </div>
                    </div>
                    <div className="text-center mt-3 mb-3"><p className="fst-italic text-decoration-underline">or</p></div>
                    <div className="google-btn">
                        <a href="/#" className="sc-faUjhM vsUcT Header_LoginGG">
                            <svg fill="currentColor" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 33.652344 32.65625 29.222656 36 24 36 C 17.371094 36 12 30.628906 12 24 C 12 17.371094 17.371094 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 12.953125 4 4 12.953125 4 24 C 4 35.046875 12.953125 44 24 44 C 35.046875 44 44 35.046875 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(255, 193, 7)" }}></path>
                                <path d="M 6.304688 14.691406 L 12.878906 19.511719 C 14.65625 15.109375 18.960938 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 16.316406 4 9.65625 8.335938 6.304688 14.691406 Z " style={{ fill: "rgb(255, 61, 0)" }}></path>
                                <path d="M 24 44 C 29.164063 44 33.859375 42.023438 37.410156 38.808594 L 31.21875 33.570313 C 29.210938 35.089844 26.714844 36 24 36 C 18.796875 36 14.382813 32.683594 12.71875 28.054688 L 6.195313 33.078125 C 9.503906 39.554688 16.226563 44 24 44 Z " style={{ fill: "rgb(76, 175, 80)" }}></path>
                                <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 34.511719 30.238281 33.070313 32.164063 31.214844 33.570313 C 31.21875 33.570313 31.21875 33.570313 31.21875 33.570313 L 37.410156 38.808594 C 36.972656 39.203125 44 34 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(25, 118, 210)" }}></path>
                            </svg>
                            <span>Tiếp tục với Google</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default RegisterPage;