import React, { useEffect, useState } from 'react';
import './EmployerLayout.scss';
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { Outlet, useNavigate } from 'react-router-dom';
import {
    BarChartOutlined,
    LogoutOutlined,
    SolutionOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Modal,  } from 'antd';
import { getInfor, logOut } from '../../services/apiService';
import { toast } from 'react-toastify';
const { Header, Content, Footer, Sider } = Layout;
const itemSider = [
    { key: '1', icon: <BarChartOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Tài khoản', children: [{ key: '2.1', label: 'Thông tin cá nhân', icon: <MdManageAccounts /> }, { key: '2.2', label: 'Đổi mật khẩu', icon: <RiLockPasswordLine /> }] },
    { key: '3', icon: <IoBusinessOutline />, label: 'Công ty' },
    { key: '4', icon: <UploadOutlined />, label: 'Đăng tuyển' },
    { key: '5', icon: <TeamOutlined />, label: 'Ứng viên' },
    { key: '6', icon: <LiaBriefcaseSolid />, label: 'Việc làm' },
    { key: '7', icon: <SolutionOutlined />, label: 'Hồ sơ' },
    { key: '8', icon: <IoIosPeople />, label: 'Phỏng vấn' },
    { key: '9', icon: <MdOutlineMessage />, label: 'Tin nhắn' },
    { key: '10', icon: <BellOutlined />, label: 'Thông báo' },
    { key: '11', icon: <BsTicketPerforated />, label: 'Gói dịch vụ' },
    { key: '12', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];
const itemHeader = [
    { key: '1', label: 'Việc làm' },
    { key: '2', label: 'Tuyển dụng' },
    { key: '3', label: 'Sự kiện' },
    { key: '4', label: 'Liên hệ' },
    { key: '5', label: 'Điều khoản' },
    { key: '6', label: 'Về chúng tôi' },
];
const navigationMap = {
    '1': '/employer',
    '2.1': '/employer/profile',
    '2.2': '#',
    '3': '/employer/company',
    '4': '#',
    '5': '#',
    '6': '#',
    '7': '#',
    '8': '#',
    '9': '#',
    '10': '#',
    '11': '#',
    '12': 'logout' // Đặt một giá trị đặc biệt cho logout
  };

const EmployerLayout = () => {
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            let res = await getInfor();
            if (res.status === 'OK') {
                setName(res.data.firstName + ' ' + res.data.last_name);
                setAvatar(res.data.background_image);
            } else {
                toast.error('Có lỗi xảy ra');
            }
        };
        fetchData();
    }, []);
    const logout = async () => {
        const res = await logOut();
        if (res.status === 'OK') {
            localStorage.removeItem('accessToken');
            // Xóa cookie refreshToken
            document.cookie = 'refreshToken=';
            navigate('/login');
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    }
    const navigateSideBar = async (e) => {

        const path = navigationMap[e.key];
        if (path) {
          if (path === 'logout') {
            await logout();
          } else {
            navigate(path);
          }
        }
    };
    return (

        <Layout hasSider>
            <Sider breakpoint='lg' width={250} className='sider' theme='light' /*collapsible*/ >
                <div className="demo-logo-vertical" >
                    <img src="https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png" alt="logo"
                        style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                </div>
                <Menu onClick={navigateSideBar} theme='light' style={{ fontSize: "1rem" }} mode="inline" defaultSelectedKeys={['1']} items={itemSider} background />
            </Sider>
            <Layout>
                <Header

                    className='header-employer'>
                    <Menu
                        className="menu-header"
                        theme='light'
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={itemHeader}

                        style={{
                            fontSize: '1rem',
                            flex: 1,
                            minWidth: 0
                        }} />
                    <div className="d-flex gap-2 " style={{ height: "100%", alignItems: "center" }}>
                        <Avatar className='avatar' icon={<UserOutlined />} src={avatar && <img src={avatar} />} />
                        <span className={`username d-none d-md-inline`}>{name}</span>
                    </div>
                </Header>
                <Content className='content-employer'>
                    <Outlet />
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>

    );
};
export default EmployerLayout;