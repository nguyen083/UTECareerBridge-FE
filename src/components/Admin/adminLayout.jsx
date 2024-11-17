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
import { Layout, Menu, Avatar, Flex, Badge, Space } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInfor, getToken, logOut, removeToken } from '../../services/apiService';
import { toast } from 'react-toastify';
import { loading, stop } from '../../redux/action/webSlice';
import { setNull } from '../../redux/action/userSlice.jsx';

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
        key: '1',
        icon: <DashboardOutlined />,
        label: 'Tổng quan',
    },
    {
        key: '2',
        icon: <TeamOutlined />,
        label: 'Quản lý người dùng',
        children: [
            { key: '2.1', label: 'Ứng viên' },
            { key: '2.2', label: 'Nhà tuyển dụng' },
            { key: '2.3', label: 'Quản trị viên' }
        ]
    },
    {
        key: '3',
        icon: <FileTextOutlined />,
        label: 'Quản lý bài đăng',
        children: [
            { key: '3.1', label: 'Tin tuyển dụng' },
            { key: '3.2', label: 'Tin ứng tuyển' },
            { key: '3.3', label: 'Duyệt bài đăng' }
        ]
    },
    {
        key: '4',
        icon: <DollarOutlined />,
        label: 'Quản lý giao dịch',
        children: [
            { key: '4.1', label: 'Gói dịch vụ' },
            { key: '4.2', label: 'Lịch sử giao dịch' },
            { key: '4.3', label: 'Báo cáo doanh thu' }
        ]
    },
    {
        key: '5',
        icon: <BarChartOutlined />,
        label: 'Thống kê & Báo cáo',
        children: [
            { key: '5.1', label: 'Thống kê tổng quan' },
            { key: '5.2', label: 'Báo cáo chi tiết' }
        ]
    },
    {
        key: '6',
        icon: <GlobalOutlined />,
        label: 'Quản lý nội dung',
        children: [
            { key: '6.1', label: 'Tin tức & Sự kiện' },
            { key: '6.2', label: 'Banner & Quảng cáo' },
            { key: '6.3', label: 'Trang tĩnh' }
        ]
    },
    {
        key: '7',
        icon: <QuestionCircleOutlined />,
        label: 'Hỗ trợ',
        children: [
            { key: '7.1', label: 'Ticket hỗ trợ' },
            { key: '7.2', label: 'FAQ' }
        ]
    },
    {
        key: '8',
        icon: <SettingOutlined />,
        label: 'Cài đặt hệ thống',
        children: [
            { key: '8.1', label: 'Cấu hình chung' },
            { key: '8.2', label: 'Phân quyền' },
            { key: '8.3', label: 'Nhật ký hệ thống' }
        ]
    },
    { key: '9', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];

const navigationMap = {
    '1': '/admin/dashboard',
    '2.1': '/admin/manage-students',
    '2.2': '/admin/manage-employers',
    '2.3': '/admin/administrators',
    '3.1': '/admin/job-posts',
    '3.2': '/admin/applications',
    '3.3': '/admin/post-approval',
    '4.1': '/admin/service-packages',
    '4.2': '/admin/transactions',
    '4.3': '/admin/revenue',
    '5.1': '/admin/statistics',
    '5.2': '/admin/reports',
    '6.1': '/admin/news-events',
    '6.2': '/admin/banners',
    '6.3': '/admin/pages',
    '7.1': '/admin/support-tickets',
    '7.2': '/admin/faq',
    '8.1': '/admin/settings',
    '8.2': '/admin/roles',
    '8.3': '/admin/logs',
    '9': 'logout'
};

const AdminLayout = () => {
    const dispatch = useDispatch();
    const [defaultImage, setDefaultImage] = useState(null);
    const navigate = useNavigate();
    const [current, setCurrent] = useState('1');
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
        //         toast.error('Có lỗi xảy ra');
        //     }
        // };

        // if (!localStorage.getItem('accessToken')) {
        //     navigate('/admin/login');
        // } else {
        //     fetchData();
        // }
    }, []);

    useEffect(() => {
        const handleNavigation = async (key) => {
            const path = navigationMap[key];
            if (path === 'logout') {
                try {
                    dispatch(loading());
                    const res = await logOut();
                    if (res.status === 'OK') {
                        dispatch(setNull());
                        removeToken();
                        navigate('/admin/login');
                        toast.success('Đăng xuất thành công');
                    } else {
                        toast.error('Đăng xuất thất bại');
                    }
                } catch (error) {
                    toast.error('Có lỗi xảy ra');
                } finally {
                    dispatch(stop());
                }
            } else if (path) {
                navigate(path);
            }
        };

        handleNavigation(current);
    }, [current]);

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
                    onClick={(e) => setCurrent(e.key)}
                    selectedKeys={[current]}
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