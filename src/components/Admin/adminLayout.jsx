import React, { useEffect, useState } from 'react';
import './adminLayout.scss';
import NotificationPopover from './NotificationPopover';
import Notification from '../Generate/Notification.jsx';
import {
    DashboardOutlined,
    UserOutlined,
    SettingOutlined,
    LogoutOutlined,
    BellOutlined,
    TeamOutlined,
    FileTextOutlined,
    DollarOutlined,
    BarChartOutlined,
    GlobalOutlined,
    QuestionCircleOutlined,
    MessageOutlined,
    SearchOutlined,
    MenuOutlined
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Flex, Badge, Space, message } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut, removeToken } from '../../services/apiService';
import { current, loading, stop } from '../../redux/action/webSlice';
import { useRedux } from '../../utils/useRedux.jsx';

const { Header, Content, Footer, Sider } = Layout;

const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: '#f0f2f5',
};

const itemSider = [
    {
        key: '/admin/dashboard',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
    },
    {
        key: '2',
        icon: <TeamOutlined />,
        label: 'Quản lý người dùng',
        children: [
            { key: '/admin/manage-students', label: 'Ứng viên' },
            { key: '/admin/manage-employers', label: 'Nhà tuyển dụng' },
        ]
    },
    {
        key: '3',
        icon: <FileTextOutlined />,
        label: 'Quản lý công ty',
        children: [
            { key: '/admin/company-approval', label: 'Duyệt công ty' },
            { key: '/admin/post-approval', label: 'Duyệt bài đăng' },
        ]
    },
    {
        key: '4',
        icon: <DollarOutlined />,
        label: 'Quản lý giao dịch',
        children: [
            { key: '/admin/service-packages', label: 'Gói dịch vụ' },
            { key: '/admin/transactions', label: 'Lịch sử giao dịch' },
            { key: '/admin/revenue', label: 'Báo cáo doanh thu' }
        ]
    },
    {
        key: '5',
        icon: <BarChartOutlined />,
        label: 'Thống kê & Báo cáo',
        children: [
            { key: '/admin/statistics', label: 'Thống kê tổng quan' },
            { key: '/admin/reports', label: 'Báo cáo chi tiết' }
        ]
    },
    {
        key: '6',
        icon: <GlobalOutlined />,
        label: 'Quản lý nội dung',
        children: [
            { key: '/admin/news-events', label: 'Tin tức & Sự kiện' },
            { key: '/admin/banners', label: 'Banner & Quảng cáo' },
            { key: '/admin/pages', label: 'Trang tĩnh' }
        ]
    },
    {
        key: '7',
        icon: <QuestionCircleOutlined />,
        label: 'Hỗ trợ',
        children: [
            { key: '/admin/support-tickets', label: 'Ticket hỗ trợ' },
            { key: '/admin/faq', label: 'FAQ' }
        ]
    },
    {
        key: '8',
        icon: <SettingOutlined />,
        label: 'Cài đặt hệ thống',
        children: [
            { key: '/admin/settings', label: 'Cấu hình chung' },
            { key: '/admin/roles', label: 'Phân quyền' },
            { key: '/admin/logs', label: 'Nhật ký hệ thống' }
        ]
    },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];



const AdminLayout = () => {
    const location = useLocation();
    const { clearRedux } = useRedux();
    const dispatch = useDispatch();
    const [defaultImage, setDefaultImage] = useState(null);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const adminInfo = useSelector(state => state.admin);
    const name = `${adminInfo?.firstName || ''} ${adminInfo?.lastName || ''}`;
    const avatar = adminInfo?.avatar;
    const notifications = useSelector(state => state.notifications?.unread || 0);
    const messages = useSelector(state => state.messages?.unread || 0);
    useEffect(() => {
        // const fetchData = async () => {
        //     let res = await getInfor();
        //     //Lưu thông tin người dùng vào redux
        //     dispatch(setInfor(res.data));
        //     if (res.status !== 'OK') {
        //         message.error('Có lỗi xảy ra');
        //     }
        // };

        // if (!localStorage.getItem('accessToken')) {
        //     navigate('/admin/login');
        // } else {
        //     fetchData();
        // }
    }, []);

    const handleNavigation = async (key) => {
        if (key.key === 'logout') {
            try {
                dispatch(loading());
                const res = await logOut();
                if (res.status === 'OK') {
                    clearRedux();
                    removeToken();
                    navigate('/');
                    message.success(res.message);
                } else {
                    message.error(res.message);
                }
            } catch (error) {
                message.error(error.message);
            } finally {
                dispatch(stop());
            }
        } else {
            navigate(key.key);
        }
    };

    useEffect(() => {
        setDefaultImage("https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png")
    }, [])
    if (!localStorage.getItem('accessToken')) {
        return null;
    }

    return (
        <Layout hasSider>
            <Sider trigger={null} collapsible collapsed={collapsed}
                breakpoint="lg"
                width={260}
                style={siderStyle}
                theme="light"
            >
                <div className="admin-logo">
                    <img
                        src={defaultImage}
                        alt="Admin Logo"
                        className="admin-logo-img"
                    />
                </div>
                <Menu
                    onSelect={
                        (key) => handleNavigation(key)
                    }
                    selectedKeys={[location.pathname]}
                    theme="light"
                    mode="inline"
                    items={itemSider}
                    className="admin-menu"
                />
            </Sider>
            <Layout className="site-layout">
                <Header className="admin-header">
                    <Flex>
                        <MenuOutlined className='font-size' onClick={() => setCollapsed(!collapsed)} />
                        <div className='search-container'>
                            <div>
                                <SearchOutlined className='search-icon' />
                            </div>
                            <div className='search-bar'>
                                <input type="text" placeholder="Tìm kiếm" className="search-input" />
                            </div>

                        </div>
                    </Flex>
                    <Space size={24}>
                        <Badge count={messages} overflowCount={10}>
                            <MessageOutlined className="message-icon" />
                        </Badge>
                        {/* <NotificationPopover /> */}
                        <Notification userId={1} />

                        <Space>
                            <Avatar
                                size="large"
                                icon={<UserOutlined />}
                                src={avatar}
                                className="admin-avatar"
                            />
                            <span className="admin-name">{name}</span>
                        </Space>
                    </Space>
                </Header>
                <Content className="admin-content">
                    <Flex gap="1rem" vertical>
                        <Outlet />
                    </Flex>
                </Content>
                <Footer className="admin-footer">
                    © {new Date().getFullYear()} Job Support System - All Rights Reserved
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;