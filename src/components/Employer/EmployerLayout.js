import React, { useState } from 'react';
import './EmployerLayout.scss';
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { IoIosPeople } from "react-icons/io";
import { MdOutlineMessage } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { Outlet } from 'react-router-dom';
import {
    BarChartOutlined,
    LogoutOutlined,
    SolutionOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    BellOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme, Avatar } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

const itemSider = [
    { key: '1', icon: <BarChartOutlined />, label: 'Dashboard' },
    { key: '2', icon: <IoBusinessOutline />, label: 'Công ty' },
    { key: '3', icon: <UploadOutlined />, label: 'Đăng tuyển' },
    { key: '4', icon: <TeamOutlined />, label: 'Ứng viên' },
    { key: '5', icon: <LiaBriefcaseSolid />, label: 'Việc làm' },
    { key: '6', icon: <SolutionOutlined />, label: 'Hồ sơ' },
    { key: '7', icon: <IoIosPeople />, label: 'Phỏng vấn' },
    { key: '9', icon: <MdOutlineMessage />, label: 'Tin nhắn' },
    { key: '10', icon: <BellOutlined />, label: 'Thông báo' },
    { key: '11', icon: <BsTicketPerforated />, label: 'Gói dịch vụ' },
    { key: '12', icon: <RiLockPasswordLine />, label: 'Đổi mật khẩu' },
    { key: '13', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];
const itemHeader = [
    { key: '1', label: 'Việc làm' },
    { key: '2', label: 'Tuyển dụng' },
    { key: '3', label: 'Sự kiện' },
    { key: '4', label: 'Liên hệ' },
    { key: '5', label: 'Điều khoản' },
    { key: '6', label: 'Về chúng tôi' },
];


const EmployerLayout = () => {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const [name, setName] = useState('Nguyễn Huỳnh Nguyên');

    return (

        <Layout hasSider>
            <Sider className='sider' theme='dark'>
                <div className="demo-logo-vertical" >
                    <img src="https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png" alt="logo" 
                     style={{ width: "80%", height: "80%", objectFit: "contain" }}/>
                </div>
                <Menu theme='dark' style={{ fontSize: "1rem" }} mode="inline" defaultSelectedKeys={['1']} items={itemSider} background />
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
                    <div className="d-flex gap-2 me-5" style={{ height: "100%", alignItems: "center" }}>
                        <Avatar size={45} icon={<UserOutlined/>} src={<img src={"https://res.cloudinary.com/utejobhub/image/upload/v1726556316/demo/zeklxmv28quelifvcefo.jpg"}/>} />
                        <span style={{ fontWeight: '500' }}>{name}</span>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}>
                    <div
                        style={{
                            padding: 24,

                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}>
                        <Outlet />
                    </div>
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