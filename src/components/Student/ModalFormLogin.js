import { Button, Checkbox, Form, Input } from 'antd';
import Modal from 'react-bootstrap/Modal';
import './ModalFormLogin.scss';
import { studentLogin } from '../../services/apiService';
import { toast } from 'react-toastify';

const ModalFormLogin = (props) => {
    const { show, setShow } = props;



    const handleLogin = async () => {
        //Validate dữ liệu

        //Call API
        // let res = await studentLogin(email, password);
        // if (res.status === 'OK') {
        //     toast.success(res.message);
        //     localStorage.setItem('accessToken', res.data.token);
        //     document.cookie = `refreshToken=${res.data.refresh_token}`;
        // } else {
        //     toast.error(res.message);
        // }

        // // clear states
        // handleClose();
    };
    return (
        <form>
            <Modal show={show} onHide={() => setShow(false)} size='lg' backdrop="static" centered>
                <Modal.Header >
                    <Modal.Title style={{ fontSize: "18px", fontWeight: "600", color: "rgb(51, 51, 51)", lineHeight: "22px" }}>Đăng nhập</Modal.Title>
                </Modal.Header>
                <Form
                    onFinish={handleLogin}
                    autoComplete="on">
                    {/* <Modal.Body className="modal-login">


                        <p className="title">Đăng nhập bằng email</p>
                        <Form.Item name="usename" className="col-6 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên của bạn',
                                },
                            ]} validateTrigger={['onBlur']}>
                            <Input className="form-control" />
                        </Form.Item>

                        <div className='mb-3'>
                            <label htmlFor="inputPassword" className="col-form-label" >Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <div className='position-relative'>
                                <input type="password" className="form-control" id="inputPassword" required value={password} onChange={(event) => setPassword(event.target.value)} />
                                <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                                    {isShowPassword ? <PiEye style={{ width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem" }} onClick={() => handleShowPassword()} /> : <PiEyeClosed style={{ width: "1.5rem", height: "1.5rem", viewBox: "0 0 1.5rem 1.5rem" }} onClick={() => handleShowPassword()} />}
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <a href="#">Quên mật khẩu?</a>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={() => handleLogin()}>
                            Đăng nhập
                        </Button>
                    </Modal.Footer> */}
                </Form>
            </Modal>
        </form>
    );
}

export default ModalFormLogin;