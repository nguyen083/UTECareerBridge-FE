import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalFormLogin.scss';
import { sendRequest } from '../../services/apiService';
import { PiEye, PiEyeClosed  } from "react-icons/pi";

const ModalFormLogin = (props) => {
    const { show, setShow } = props;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setShow(false);
        setIsShowPassword(false);
    }

    const handleShowPassword = () => {
        if(isShowPassword === false){
            // hiện mật khẩu
            document.getElementById('inputPassword').type = 'text';
            console.log('ẩn mật khẩu' + isShowPassword);            
            setIsShowPassword(true);
        }
        else
        {
            // ẩn mật khẩu
            document.getElementById('inputPassword').type = 'password';
            console.log('hiện mật khẩu' + isShowPassword);
            setIsShowPassword(false);
        }
    }
    const handleLogin = async() => {
        //Validate dữ liệu
        //Call API
        let res = await sendRequest(email, password);
        console.log(res.data);
        // clear states
        handleClose();
    };
    return (
        <form>
            <Modal show={show} onHide={() => setShow(false)} size='lg' backdrop="static" centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: "18px", fontWeight: "600", color: "rgb(51, 51, 51)", lineHeight: "22px" }}>Đăng nhập để tiếp tục</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-login">
                        <div className="login-google">
                            <button type="button" className="sc-fUnMCh YeCEV btn-default btn-md  clickable">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.1713 8.36775H17.5001V8.33317H10.0001V11.6665H14.7097C14.0226 13.6069 12.1763 14.9998 10.0001 14.9998C7.23883 14.9998 5.00008 12.7611 5.00008 9.99984C5.00008 7.23859 7.23883 4.99984 10.0001 4.99984C11.2747 4.99984 12.4342 5.48067 13.3172 6.26609L15.6742 3.909C14.1859 2.52192 12.1951 1.6665 10.0001 1.6665C5.398 1.6665 1.66675 5.39775 1.66675 9.99984C1.66675 14.6019 5.398 18.3332 10.0001 18.3332C14.6022 18.3332 18.3334 14.6019 18.3334 9.99984C18.3334 9.44109 18.2759 8.89567 18.1713 8.36775Z" fill="#FFC107">
                                    </path>
                                    <path d="M2.62732 6.12109L5.36524 8.129C6.10607 6.29484 7.90024 4.99984 9.99982 4.99984C11.2744 4.99984 12.434 5.48067 13.3169 6.26609L15.674 3.909C14.1857 2.52192 12.1948 1.6665 9.99982 1.6665C6.79899 1.6665 4.02315 3.47359 2.62732 6.12109Z" fill="#FF3D00">
                                    </path>
                                    <path d="M10 18.3331C12.1525 18.3331 14.1084 17.5094 15.5871 16.1698L13.008 13.9873C12.1713 14.621 11.1313 14.9998 10 14.9998C7.83255 14.9998 5.99213 13.6177 5.2988 11.689L2.5813 13.7827C3.96047 16.4815 6.7613 18.3331 10 18.3331Z" fill="#4CAF50">
                                    </path>
                                    <path d="M18.1712 8.36808H17.5V8.3335H10V11.6668H14.7096C14.3796 12.5989 13.78 13.4027 13.0067 13.9881L13.0079 13.9872L15.5871 16.1697C15.4046 16.3356 18.3333 14.1668 18.3333 10.0002C18.3333 9.44141 18.2758 8.896 18.1712 8.36808Z" fill="#1976D2">
                                    </path>
                                </svg>
                                <span style={{ marginLeft: '8px' }}>với tài khoản Google</span>
                            </button>                           
                        </div>
                        <p className="dBJbip">hoặc đăng nhập bằng email</p>
                        <div>
                            <label htmlFor="Email" className="col-form-label" >Email/ Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                            <div>
                                <input type="text" className="form-control" id="Email" value={email} required onChange={(event) => setEmail(event.target.value)}/>
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="inputPassword" className="col-form-label" >Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <div className='position-relative'>
                                <input type="password" className="form-control" id="inputPassword" value={password} onChange={(event) => setPassword(event.target.value)}/>
                                <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                                     {isShowPassword?<PiEye style={{width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem"}}  onClick={()=> handleShowPassword()}/>:<PiEyeClosed style={{width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem"}}  onClick={()=> handleShowPassword()}/>}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <a href="#">Quên mật khẩu?</a>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={()=> handleLogin()}>
                        Đăng nhập
                    </Button>
                </Modal.Footer>
            </Modal>
        </form>
    );
}

export default ModalFormLogin;