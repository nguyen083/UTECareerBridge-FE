import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ModalFormLogin.scss';

const ModalFormLogin = (props) => {
    const { show, setShow } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleClose = () => {
        setEmail("");
        setPassword("");
        setShow(false);
        setIsShowPassword(false);
    }

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    }
    const onChangePassword = (event) => {
        setPassword(event.target.value);
    }

    const handleShowPassword = () => {
        if(isShowPassword === false){
            // hiện mật khẩu
            document.getElementById('eye-open').style.display = 'block';
            document.getElementById('eye-close').style.display = 'none';
            document.getElementById('inputPassword').type = 'text';
            console.log('ẩn mật khẩu' + isShowPassword);            
            setIsShowPassword(true);
        }
        else
        {
            // ẩn mật khẩu
            document.getElementById('eye-open').style.display = 'none';
            document.getElementById('eye-close').style.display = 'block';
            document.getElementById('inputPassword').type = 'password';
            console.log('hiện mật khẩu' + isShowPassword);
            setIsShowPassword(false);
        }
    }
    return (
        <>
            <Modal show={show} onHide={() => setShow(false)} size='lg'>
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
                            {/* <button type="button" className="sc-fUnMCh YeCEV btn-default btn-md  clickable">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_8755_164691)">
                                        <path d="M10.02 23.88C4.32 22.86 0 17.94 0 12C0 5.4 5.4 0 12 0C18.6 0 24 5.4 24 12C24 17.94 19.68 22.86 13.98 23.88L13.32 23.34H10.68L10.02 23.88Z" fill="url(#paint0_linear_8755_164691)">
                                        </path>
                                        <path d="M16.6801 15.3602L17.2201 12.0002H14.0401V9.66018C14.0401 8.70018 14.4001 7.98018 15.8401 7.98018H17.4001V4.92018C16.5601 4.80018 15.6001 4.68018 14.7601 4.68018C12.0001 4.68018 10.0801 6.36018 10.0801 9.36018V12.0002H7.08008V15.3602H10.0801V23.8202C10.7401 23.9402 11.4001 24.0002 12.0601 24.0002C12.7201 24.0002 13.3801 23.9402 14.0401 23.8202V15.3602H16.6801Z" fill="white">
                                        </path>
                                    </g>
                                    <defs>
                                        <linearGradient id="paint0_linear_8755_164691" x1="12.0006" y1="23.1654" x2="12.0006" y2="-0.00442066" gradientUnits="userSpaceOnUse">
                                            <stop stop-color="#0062E0">
                                            </stop>
                                            <stop offset="1" stop-color="#19AFFF">
                                            </stop>
                                        </linearGradient>
                                        <clipPath id="clip0_8755_164691">
                                            <rect width="24" height="24" fill="white">
                                            </rect>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>với tài khoản Facebook</span>
                            </button> */}
                        </div>
                        <p className="dBJbip">hoặc đăng nhập bằng email</p>
                        <div>
                            <label htmlFor="Email" className="col-form-label" value={email} onChange={(event) => onChangeEmail(event)}>Email/ Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                            <div>
                                <input type="text" className="form-control" id="Email" />
                            </div>
                        </div>
                        <div className='mb-3'>
                            <label htmlFor="inputPassword" className="col-form-label" value={password} onChange={(event) => onChangePassword(event)}>Mật khẩu <span style={{ color: 'red' }}>*</span></label>
                            <div className='position-relative'>
                                <input type="password" className="form-control" id="inputPassword" />
                                <div className="position-absolute top-50 end-0 translate-middle-y me-2">
                                    <svg id='eye-open' style={{display: 'none'}} width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" onClick={()=> handleShowPassword()}>
                                        <g id="icons/icon-forms/icon-eye-open" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="icons8-eye-(5)" transform="translate(2.000000, 5.000000)" fill="#666666" fillRule="nonzero">
                                                <path d="M10.5,0 C4.2571921,0 0.224691691,6.447826 0.151757816,6.5652342 C0.0535873741,6.68889382 0,6.8421104 0,7 C0,7.13544939 0.0395429981,7.26795363 0.113476566,7.3814454 C0.114383206,7.3828157 0.115294667,7.38418281 0.116210934,7.3855467 C0.128246496,7.4103827 3.51318191,14 10.5,14 C17.4571754,14 20.8371282,7.4751187 20.8783204,7.3951171 C20.8811066,7.39059116 20.8838413,7.38603363 20.8865237,7.3814454 C20.9604572,7.2679536 21,7.13544937 21,7 C21,6.84274207 20.9469987,6.69007331 20.8496092,6.5666013 C20.8491541,6.56614497 20.8486984,6.56568927 20.8482421,6.5652342 C20.7753084,6.447826 16.7428079,0 10.5,0 Z M10.5,2.1 C13.2062,2.1 15.4,4.2938 15.4,7 C15.4,9.7062 13.2062,11.9 10.5,11.9 C7.7938,11.9 5.6,9.7062 5.6,7 C5.6,4.2938 7.7938,2.1 10.5,2.1 Z M10.5,4.9 C9.34020203,4.9 8.4,5.84020203 8.4,7 C8.4,8.15979797 9.34020203,9.1 10.5,9.1 C11.659798,9.1 12.6,8.15979797 12.6,7 C12.6,5.84020203 11.659798,4.9 10.5,4.9 Z" id="Shape">
                                                </path>
                                            </g>
                                        </g>
                                    </svg>
                                    <svg id='eye-close' style={{display: 'block'}} width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" onClick={()=> handleShowPassword()}>
                                        <g id="icons/icon-forms/icon-eye-closed" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <g id="icons8-eyelashes-3d" transform="translate(2.000000, 5.000000)" fill="#666666" fillRule="nonzero">
                                                <path d="M0.700175,9.1 C0.879375,9.1 1.058575,9.0314 1.195075,8.8949 L2.595075,7.4949 C2.618875,7.4711 2.628675,7.441 2.648275,7.4151 C2.914975,7.6734 3.203375,7.9261 3.511375,8.1711 L2.217775,10.1115 C2.002875,10.4335 2.089675,10.8675 2.411675,11.0824 C2.531375,11.1615 2.665775,11.2 2.799475,11.2 C3.025575,11.2 3.248175,11.0908 3.382575,10.8885 L4.657275,8.9761 C5.162675,9.2869 5.705875,9.5634 6.279875,9.7951 L5.621175,12.4306 C5.526675,12.8051 5.754875,13.1852 6.130775,13.279 C6.187475,13.293 6.244875,13.3 6.300875,13.3 C6.614475,13.3 6.899375,13.0879 6.979175,12.7694 L7.614775,10.2284 C8.094275,10.3467 8.589175,10.4328 9.100875,10.4727 L9.100875,13.3 C9.100875,13.6871 9.413775,14 9.800875,14 C10.187975,14 10.500875,13.6871 10.500875,13.3 L10.500875,10.4727 C11.011875,10.4328 11.506775,10.3467 11.986975,10.2284 L12.622575,12.7694 C12.700275,13.0879 12.985875,13.3 13.299475,13.3 C13.355475,13.3 13.412875,13.293 13.469575,13.279 C13.844775,13.1852 14.072975,12.8051 13.979175,12.4306 L13.320475,9.7958 C13.894475,9.5641 14.437675,9.2876 14.943075,8.9768 L16.217775,10.8892 C16.352175,11.0908 16.574075,11.2 16.800875,11.2 C16.933875,11.2 17.068975,11.1615 17.188675,11.0824 C17.510675,10.8675 17.597475,10.4335 17.382575,10.1115 L16.088975,8.1711 C16.396975,7.9261 16.685375,7.6734 16.952075,7.4151 C16.971675,7.441 16.981475,7.4711 17.005275,7.4949 L18.405275,8.8949 C18.541775,9.0314 18.720975,9.1 18.900175,9.1 C19.079375,9.1 19.258575,9.0314 19.395075,8.8949 C19.668775,8.6212 19.668775,8.1788 19.395075,7.9051 L17.995075,6.5051 C17.957275,6.4673 17.911075,6.4477 17.867675,6.4204 C17.972675,6.2895 18.072075,6.16 18.165175,6.0312 C18.391275,5.7183 18.321275,5.2801 18.007675,5.054 C17.694075,4.8265 17.255875,4.8972 17.030475,5.2115 C15.733375,7.0049 13.062175,9.1 9.800175,9.1 C6.538175,9.1 3.866275,7.0049 2.569875,5.2108 C2.343075,4.8972 1.904875,4.8258 1.592675,5.0533 C1.279775,5.2794 1.209075,5.7176 1.435175,6.0305 C1.528275,6.1593 1.627675,6.2888 1.732675,6.4197 C1.689275,6.447 1.643075,6.4666 1.605275,6.5044 L0.205275,7.9044 C-0.068425,8.1781 -0.068425,8.6205 0.205275,8.8942 C0.341775,9.0314 0.520975,9.1 0.700175,9.1 Z M4.300975,3.6722 C4.436075,3.6722 4.573275,3.633 4.693675,3.5511 C4.823175,3.4629 4.968775,3.3579 5.129775,3.2417 C6.142675,2.5081 7.674975,1.4 9.800175,1.4 C12.031075,1.4 13.642475,2.5585 14.604975,3.2515 C14.763175,3.3642 14.904575,3.4664 15.028475,3.5497 C15.351875,3.7667 15.785175,3.6799 16.000075,3.3593 C16.215675,3.038 16.130275,2.6033 15.809675,2.3877 C15.695575,2.3114 15.566075,2.2183 15.422575,2.1147 C14.394275,1.3755 12.481875,0 9.800175,0 C7.220675,0 5.398575,1.3195 4.308675,2.1077 C4.160975,2.2148 4.027275,2.3121 3.907575,2.3933 C3.587675,2.6103 3.504375,3.0457 3.721375,3.3656 C3.857175,3.5651 4.076975,3.6722 4.300975,3.6722 Z" id="Shape">
                                                </path>
                                            </g>
                                        </g>
                                    </svg>
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
                    <Button variant="primary" >
                        Đăng nhập
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalFormLogin;