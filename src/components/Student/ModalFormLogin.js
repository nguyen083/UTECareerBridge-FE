import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalFormLogin.scss';
import { postStudentLogin } from '../../services/apiService';
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
        let res = await postStudentLogin(email, password);
        console.log(res.data);
        // clear states
        handleClose();
    };
    return (
        <form>
            <Modal show={show} onHide={() => setShow(false)} size='lg' backdrop="static" centered>
                <Modal.Header >
                    <Modal.Title style={{ fontSize: "18px", fontWeight: "600", color: "rgb(51, 51, 51)", lineHeight: "22px" }}>Đăng nhập</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-login">
       
                        <p className="dBJbip">Đăng nhập bằng email</p>
                        <div>
                            <label htmlFor="Email" className="col-form-label" >Email/ Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                            <div>
                                <input type="text" className="form-control" id="Email" required value={email}  onChange={(event) => setEmail(event.target.value)}/>
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="inputPassword" className="col-form-label" >Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <div className='position-relative'>
                                <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(event) => setPassword(event.target.value)}/>
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