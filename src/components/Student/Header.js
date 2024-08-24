import { BsList } from "react-icons/bs";
import { FaUser } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import './Header.scss';
import React, { useState, useEffect, useRef } from 'react';
import ModalFormLogin from "./ModalFormLogin";


const Header = () => {

    const [isShowFormLogin, setShowFormLogin] = useState(false);
    const [isShowModal, setShowModal] = useState(false);
    const formRef = useRef(null);

    const handleClickOutside = (event) => {
        if (formRef.current && !formRef.current.contains(event.target)) {
            //console.log('Bạn đã nhấp bên ngoài form-login');
            // Thực hiện đóng form khi nhấp bên ngoài
            formRef.current.style.display = 'none';
            setShowFormLogin(false);
        }
        // else {
        //   console.log('Bạn đã nhấp bên trong form-login');
        // }
    };

    const handleShowForm = () => {
        handleClickBtnLogin();
        setShowModal(true);
    }
    useEffect(() => {

        // Gắn sự kiện khi component được mount
        document.addEventListener('mousedown', handleClickOutside);

    }, []);

    const handleClickBtnLogin = () => {
        let div = document.getElementById('form-login');
        if (isShowFormLogin === false) {
            div.style.display = 'block';
            setShowFormLogin(true);
        } else {
            div.style.display = 'none';
            setShowFormLogin(false);
        }

    }
    return (
        <>
            <div data-cname="Header" className="sc-fxfXEX kJYTOq appHeader">
                <div className="sc-bgzxJp bYMQiI">
                    <div className="sc-cfKVUY hfEnWi">
                        <h1 title="VietnamWorks - Nền tảng tuyển dụng, việc làm, tra cứu lương &amp; tư vấn nghề nghiệp hàng đầu Việt Nam">
                            <a href="http://localhost:3000/home" title="VietnamWorks - Nền tảng tuyển dụng, việc làm, tra cứu lương &amp; tư vấn nghề nghiệp hàng đầu Việt Nam" className="sc-ggKVCX hTBdHF">
                                {/* Logo chữ trang web */}
                                <img src="https://res.cloudinary.com/dullorbci/image/upload/v1723888103/rg2do6iommv6wp840ixr.png" loading="lazy" className="sc-bCSQDp cJtnGK" />
                                {/* Logo ảnh trang web */}
                                {/* <img width="40" src="https://vietnamworks.com/assets-page-container/images/vnw_empower_growth_mini_logo.png?ver=249" alt="VietnamWorks - Nền tảng tuyển dụng, việc làm, tra cứu lương &amp; tư vấn nghề nghiệp hàng đầu Việt Nam" loading="lazy" className="sc-gAjtsA dhbLpn" /> */}
                            </a>
                        </h1>
                        <div style={{ width: "100%" }} className="sc-hClZaO iepeKq">
                            <div id="vnwLayout__row" style={{ position: "relative", maxWidth: "inherit", justifyContent: "space-between", width: "100%", padding: "0 10px" }} className="sc-sSmyr fdGNbR">
                                <div id="vnwLayout__col" className="sc-cegkxp fnXIET">
                                    <div className="sc-eVjwod gujvVy d-md-flex d-none">
                                        <div className="sc-exgAzj hruxAH Header_Search" style={{ maxWidth: "calc(100% - 450px" }}>
                                        </div>
                                        <div className="sc-kIxHyQ eesaxc">
                                            {/* <a href="https://www.vietnamworks.com/viec-lam?g=5&amp;utm_source_navi=header&amp;utm_medium_navi=intechlogo" title="VietnamWorks inTECH - việc làm IT trên VietnamWorks.com" className="sc-ggKVCX hTBdHF">
                                                <img src="https://vietnamworks.com/assets-page-container/images/vnw_intech_logo_white.svg?ver=249" alt="VietnamWorks inTECH - việc làm IT trên VietnamWorks.com" loading="lazy" className="sc-bCSQDp cJtnJk" />
                                                <img width="40" src="https://vietnamworks.com/assets-page-container/images/vnw_intech_logo_white.svg?ver=249" alt="VietnamWorks inTECH - việc làm IT trên VietnamWorks.com" loading="lazy" className="sc-gAjtsA dhbLmR" />
                                            </a> */}
                                            <div className="sc-fzimyC gChyuM">
                                                <div className="sc-ezWOmT kjwsGF Header_AllCate">
                                                    <div className="sc-flEoeP kCosHO">
                                                        <div style={{ lineHeight: "38px", width: "160px", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
                                                            <BsList />
                                                            <span>Tất cả danh mục</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <a href="https://employer.vietnamworks.com/?lang=1&amp;utm_source_navi=header&amp;utm_medium_navi=jsployersite" target="_blank" className="sc-gkPMqy etFDyw">
                                                <span>Nhà tuyển dụng</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sc-bRObDL gFYrLR">
                            <div className="sc-fzimyC gChyuM">
                                <div className="sc-ezWOmT kjwsGF Header_Lang">
                                    <button type="button" className="sc-kKbWWV iUPoZR btn-info btn-sm  ">Vi</button>
                                </div>
                            </div>
                            <div className="sc-biBMCU fmgDmC NotificationIcon" >
                                <div className="notification-icon Header_Noti">
                                    <button type="button" className="sc-kKbWWV iUPoZR btn-info btn-sm  " aria-label="Thông báo">
                                        <IoMdNotifications />
                                    </button>
                                </div>
                                <div id="desktopRedDotContainer">
                                </div>
                            </div>
                            <div className="sc-fTLrYA eXCBCp sc-jqorl kAIlcu">
                                <div onClick={() => handleClickBtnLogin()} className="sc-jPOJsI krqNeo">
                                    <button aria-label="profile-button" className="sc-cQZzPu kapIWZ Header_UMenu">
                                        <FaUser />
                                        <span className="d-md-flex d-none">Đăng nhập</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div ref={formRef} id="form-login" className="form-login" style={{ position: "fixed", top: "3.35rem", right: "2.5%", zIndex: "150" }}>
                {/* style="transition-property: opacity, transform, transform-origin; opacity: 1; transform: scaleY(1); transform-origin: center top; transition-duration: 250ms;" */}
                <div className="sc-hgRRfv hKDGed" >
                    <div className="sc-emIrwa hmTqcE">
                        <p className="sc-gRtvSG fCdZWY">Sinh viên đăng nhập</p>
                        <div className="sc-dUYLmH cThveb">
                            {/* <a href="https://www.vietnamworks.com/dang-nhap?type=facebook&amp;redirectURL=https%3A%2F%2Fwww.vietnamworks.com%2F%3Futm_source_navi%3Dheader%26utm_medium_navi%3Dvnwlogo%26utm_source_navi%3D%26utm_medium_navi%3DHeader&amp;t=1723887632579" className="sc-faUjhM vsUcT Header_LoginFB">
                                <svg fill="currentColor" className="" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                    <path d="M44,38.44A5.56,5.56,0,0,1,38.44,44H9.56A5.56,5.56,0,0,1,4,38.44V9.56A5.56,5.56,0,0,1,9.56,4H38.44A5.56,5.56,0,0,1,44,9.56Z" style={{ fill: "rgb(63, 81, 181)" }}></path>
                                    <path d="M35.52,25.11H31.78V39.56H26.22V25.11H22.89V20.67h3.33V18c0-3.9,1.62-6.21,6.22-6.21h3.78v4.44H33.68c-1.79,0-1.91.67-1.91,1.91v2.53h4.44Z" style={{ fill: "rgb(255, 255, 255)" }}></path>
                                </svg>
                                <span>Facebook</span>
                            </a> */}
                            <a href="https://www.vietnamworks.com/dang-nhap?type=google&amp;redirectURL=https%3A%2F%2Fwww.vietnamworks.com%2F%3Futm_source_navi%3Dheader%26utm_medium_navi%3Dvnwlogo%26utm_source_navi%3D%26utm_medium_navi%3DHeader&amp;t=1723887632579" className="sc-faUjhM vsUcT Header_LoginGG">
                                <svg fill="currentColor" className="" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                                    <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 33.652344 32.65625 29.222656 36 24 36 C 17.371094 36 12 30.628906 12 24 C 12 17.371094 17.371094 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 12.953125 4 4 12.953125 4 24 C 4 35.046875 12.953125 44 24 44 C 35.046875 44 44 35.046875 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(255, 193, 7)" }}></path>
                                    <path d="M 6.304688 14.691406 L 12.878906 19.511719 C 14.65625 15.109375 18.960938 12 24 12 C 27.058594 12 29.84375 13.152344 31.960938 15.039063 L 37.617188 9.382813 C 34.046875 6.054688 29.269531 4 24 4 C 16.316406 4 9.65625 8.335938 6.304688 14.691406 Z " style={{ fill: "rgb(255, 61, 0)" }}></path>
                                    <path d="M 24 44 C 29.164063 44 33.859375 42.023438 37.410156 38.808594 L 31.21875 33.570313 C 29.210938 35.089844 26.714844 36 24 36 C 18.796875 36 14.382813 32.683594 12.71875 28.054688 L 6.195313 33.078125 C 9.503906 39.554688 16.226563 44 24 44 Z " style={{ fill: "rgb(76, 175, 80)" }}></path>
                                    <path d="M 43.609375 20.082031 L 42 20.082031 L 42 20 L 24 20 L 24 28 L 35.304688 28 C 34.511719 30.238281 33.070313 32.164063 31.214844 33.570313 C 31.21875 33.570313 31.21875 33.570313 31.21875 33.570313 L 37.410156 38.808594 C 36.972656 39.203125 44 34 44 24 C 44 22.660156 43.863281 21.351563 43.609375 20.082031 Z " style={{ fill: "rgb(25, 118, 210)" }}></path>
                                </svg>
                                <span>Google</span>
                            </a>
                        </div>
                    </div>
                    <a className="sc-cezyBN iczlp Header_Login" onClick={() => handleShowForm()}>
                        <svg width="25" height="25" fill="#555555" className="" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path d="M 25 2 C 15.257933 2 6.9235076 8.0691703 3.5761719 16.636719 A 1.0001 1.0001 0 1 0 5.4375 17.363281 C 8.4921642 9.5448298 16.088067 4 25 4 C 36.609534 4 46 13.390466 46 25 C 46 36.609534 36.609534 46 25 46 C 16.088067 46 8.4921642 40.455171 5.4375 32.636719 A 1.0001 1.0001 0 1 0 3.5761719 33.363281 C 6.9235076 41.930829 15.257933 48 25 48 C 37.690466 48 48 37.690466 48 25 C 48 12.309534 37.690466 2 25 2 z M 25.990234 15.990234 A 1.0001 1.0001 0 0 0 25.292969 17.707031 L 31.585938 24 L 3 24 A 1.0001 1.0001 0 1 0 3 26 L 31.585938 26 L 25.292969 32.292969 A 1.0001 1.0001 0 1 0 26.707031 33.707031 L 34.707031 25.707031 A 1.0001 1.0001 0 0 0 34.707031 24.292969 L 26.707031 16.292969 A 1.0001 1.0001 0 0 0 25.990234 15.990234 z"></path>
                        </svg>
                        <span>Đăng nhập</span>
                    </a>
                    <a href="https://www.vietnamworks.com/dang-ky?redirectURL=https%3A%2F%2Fwww.vietnamworks.com%2F%3Futm_source_navi%3Dheader%26utm_medium_navi%3Dvnwlogo%26utm_source_navi%3D%26utm_medium_navi%3DHeader&amp;t=1723887632579&amp;utm_source_navi=header&amp;utm_medium_navi=register" className="sc-cezyBN bcmeti">
                        <svg width="25" height="25" fill="#555555" className="" stroke="unset" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
                            <path d="M 19.875 0.40625 C 15.203125 0.492188 12.21875 2.378906 10.9375 5.3125 C 9.714844 8.105469 9.988281 11.632813 10.875 15.28125 C 10.398438 15.839844 10.019531 16.589844 10.15625 17.71875 C 10.304688 18.949219 10.644531 19.824219 11.125 20.4375 C 11.390625 20.773438 11.738281 20.804688 12.0625 20.96875 C 12.238281 22.015625 12.53125 23.0625 12.96875 23.9375 C 13.21875 24.441406 13.503906 24.90625 13.78125 25.28125 C 13.90625 25.449219 14.085938 25.546875 14.21875 25.6875 C 14.226563 26.921875 14.230469 27.949219 14.125 29.25 C 13.800781 30.035156 13.042969 30.667969 11.8125 31.28125 C 10.542969 31.914063 8.890625 32.5 7.21875 33.21875 C 5.546875 33.9375 3.828125 34.8125 2.46875 36.1875 C 1.109375 37.5625 0.148438 39.449219 0 41.9375 L -0.0625 43 L 25 43 L 24.34375 41 L 2.25 41 C 2.53125 39.585938 3.058594 38.449219 3.90625 37.59375 C 4.972656 36.515625 6.425781 35.707031 8 35.03125 C 9.574219 34.355469 11.230469 33.820313 12.6875 33.09375 C 14.144531 32.367188 15.492188 31.410156 16.0625 29.875 L 16.125 29.625 C 16.277344 27.949219 16.21875 26.761719 16.21875 25.3125 L 16.21875 24.71875 L 15.6875 24.4375 C 15.777344 24.484375 15.5625 24.347656 15.375 24.09375 C 15.1875 23.839844 14.957031 23.476563 14.75 23.0625 C 14.335938 22.234375 13.996094 21.167969 13.90625 20.3125 L 13.8125 19.5 L 12.96875 19.4375 C 12.960938 19.4375 12.867188 19.449219 12.6875 19.21875 C 12.507813 18.988281 12.273438 18.480469 12.15625 17.5 C 12.058594 16.667969 12.480469 16.378906 12.4375 16.40625 L 13.09375 16 L 12.90625 15.28125 C 11.964844 11.65625 11.800781 8.363281 12.78125 6.125 C 13.757813 3.894531 15.75 2.492188 19.90625 2.40625 C 19.917969 2.40625 19.925781 2.40625 19.9375 2.40625 C 21.949219 2.414063 23.253906 3.003906 23.625 3.65625 L 23.875 4.0625 L 24.34375 4.125 C 25.734375 4.320313 26.53125 4.878906 27.09375 5.65625 C 27.65625 6.433594 27.96875 7.519531 28.0625 8.71875 C 28.25 11.117188 27.558594 13.910156 27.125 15.21875 L 26.875 16 L 27.5625 16.40625 C 27.519531 16.378906 27.945313 16.667969 27.84375 17.5 C 27.726563 18.480469 27.492188 18.988281 27.3125 19.21875 C 27.132813 19.449219 27.039063 19.4375 27.03125 19.4375 L 26.1875 19.5 L 26.09375 20.3125 C 26 21.175781 25.652344 22.234375 25.25 23.0625 C 25.046875 23.476563 24.839844 23.839844 24.65625 24.09375 C 24.472656 24.347656 24.28125 24.488281 24.375 24.4375 L 23.84375 24.71875 L 23.84375 25.3125 C 23.84375 26.757813 23.785156 27.949219 23.9375 29.625 L 23.9375 29.75 L 24 29.875 C 24.320313 30.738281 24.882813 31.605469 25.8125 32.15625 L 26.84375 30.4375 C 26.421875 30.1875 26.144531 29.757813 25.9375 29.25 C 25.832031 27.949219 25.835938 26.921875 25.84375 25.6875 C 25.972656 25.546875 26.160156 25.449219 26.28125 25.28125 C 26.554688 24.902344 26.816406 24.4375 27.0625 23.9375 C 27.488281 23.0625 27.796875 22.011719 27.96875 20.96875 C 28.28125 20.804688 28.617188 20.765625 28.875 20.4375 C 29.355469 19.824219 29.695313 18.949219 29.84375 17.71875 C 29.976563 16.625 29.609375 15.902344 29.15625 15.34375 C 29.644531 13.757813 30.269531 11.195313 30.0625 8.5625 C 29.949219 7.125 29.582031 5.691406 28.71875 4.5 C 27.929688 3.40625 26.648438 2.609375 25.03125 2.28125 C 23.980469 0.917969 22.089844 0.40625 19.90625 0.40625 Z M 38 26 C 31.382813 26 26 31.382813 26 38 C 26 44.617188 31.382813 50 38 50 C 44.617188 50 50 44.617188 50 38 C 50 31.382813 44.617188 26 38 26 Z M 38 28 C 43.535156 28 48 32.464844 48 38 C 48 43.535156 43.535156 48 38 48 C 32.464844 48 28 43.535156 28 38 C 28 32.464844 32.464844 28 38 28 Z M 37 32 L 37 37 L 32 37 L 32 39 L 37 39 L 37 44 L 39 44 L 39 39 L 44 39 L 44 37 L 39 37 L 39 32 Z">
                            </path>
                        </svg>
                        <span>Tạo tài khoản mới</span>
                    </a>
                </div>
            </div>
            <ModalFormLogin backdrop="static" show={isShowModal} setShow={setShowModal}/>
        </>

    );
}
export default Header;