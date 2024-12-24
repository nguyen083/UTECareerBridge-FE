import React, { useEffect, useState } from 'react';
import './EmployerLayout.scss';
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { FaRegNewspaper } from "react-icons/fa";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setInfor } from '../../redux/action/employerSlice.jsx';
import { useRedux } from '../../utils/useRedux.jsx';
import FooterComponent from '../Generate/Footer.jsx';
import { AiOutlinePayCircle } from "react-icons/ai";

import {
    BarChartOutlined,
    LogoutOutlined,
    SolutionOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    BellOutlined,
    MenuOutlined,
    ShoppingCartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Avatar, Flex, Badge, Button, Tooltip, message } from 'antd';
import { getInfor, logOut, removeToken } from '../../services/apiService.jsx';
import { loading, stop } from '../../redux/action/webSlice.jsx';
import COLOR from '../styles/_variables.jsx';
const { Header, Content, Footer, Sider } = Layout;
const siderStyle = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: 'thin',
    scrollbarColor: 'unset',
};
const itemSider = [
    { key: '/employer/dashboard', icon: <BarChartOutlined />, label: 'Thống kê' },
    { key: '2', icon: <UserOutlined />, label: 'Tài khoản', children: [{ key: '/employer/profile', label: 'Thông tin cá nhân', icon: <MdManageAccounts /> }, { key: '/employer/change-password', label: 'Đổi mật khẩu', icon: <RiLockPasswordLine /> }] },
    { key: '3', icon: <IoBusinessOutline />, label: 'Công ty', children: [{ key: '/employer/company', label: 'Thông tin công ty', icon: <TiBusinessCard /> }, { key: '/employer/business-certificate', label: 'Giấy chứng nhận', icon: <FaRegNewspaper /> }] },
    { key: '/employer/post-job', icon: <UploadOutlined />, label: 'Đăng tuyển' },
    { key: '/employer/applicant/list-job', icon: <TeamOutlined />, label: 'Ứng viên' },
    { key: '/employer/manage-list-jobs', icon: <LiaBriefcaseSolid />, label: 'Việc làm' },
    { key: '/employer/list-resumes', icon: <SolutionOutlined />, label: 'Hồ sơ' },
    { key: '/employer/list-order', icon: <AiOutlinePayCircle />, label: 'Đơn hàng' },
    // { key: '/employer/interview', icon: <IoIosPeople />, label: 'Phỏng vấn' },
    // { key: '/employer/message', icon: <MdOutlineMessage />, label: 'Tin nhắn' },
    // { key: '/employer/notification', icon: <BellOutlined />, label: 'Thông báo' },
    { key: '/employer/buy-service', icon: <BsTicketPerforated />, label: 'Gói dịch vụ' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];
const itemHeader = [
    // { key: '1', label: 'Việc làm' },
    // { key: '2', label: 'Tuyển dụng' },
    // { key: '3', label: 'Sự kiện' },
    // { key: '4', label: 'Liên hệ' },
    // { key: '5', label: 'Điều khoản' },
    // { key: '6', label: 'Về chúng tôi' },
];


const EmployerLayout = () => {
    const { clearRedux } = useRedux();
    const dispatch = useDispatch();
    const location = useLocation();
    const [defaultImage, setDefaultImage] = useState(null);
    // const name = useSelector(state => state.employer.firstName) + ' ' + useSelector(state => state.employer.lastName);
    const avatar = useSelector(state => state.employer.companyLogo);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            let res = await getInfor();
            //Lưu thông tin người dùng vào redux
            dispatch(setInfor(res.data));
            if (res.status !== 'OK') {
                message.error('Có lỗi xảy ra');
            }
        };
        if (localStorage.getItem('accessToken') === null) {
            window.location.href = '/employer/login';
        }
        else {
            if (user.role === 'employer') {
                fetchData();
            }
            else
                window.location.href = '/employer/login';
        }
    }, []);
    const logout = async () => {
        dispatch(loading());
        try {
            const res = await logOut();
            if (res.status === 'OK') {
                removeToken();
                message.success(res.message);
                navigate('login');
                clearRedux();

            } else {
                message.error(res.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            dispatch(stop());
        }
    }

    useEffect(() => {
        setDefaultImage("https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png")
    }, [])
    if (localStorage.getItem('accessToken') === null) {
        return null;
    }
    const handleMenu = (key) => {
        if (key.key === 'logout') {
            logout();
        } else {
            navigate(key.key);
        }
    };
    return (
        <Layout hasSider>
            <Sider onBreakpoint={(broken) => {
                setCollapsed(broken);
            }} trigger={null} collapsible collapsed={collapsed} breakpoint='lg' width={250} style={siderStyle} theme='light' /*collapsible*/ >
                <div className="demo-logo-vertical" >
                    <img src={defaultImage} alt="logo"
                        style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                </div>
                <Menu
                    onSelect={(key) => handleMenu(key)}
                    selectedKeys={[location.pathname]} theme='light' style={{ fontSize: "1rem" }} mode="inline" items={itemSider} background />
            </Sider>
            <Layout className='site-layout'>
                <Header
                    className='header-employer'>
                    <Flex align='center' justify='space-between' className='h-100'>
                        <MenuOutlined className='font-size' onClick={() => setCollapsed(!collapsed)} />
                        <div>
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
                        </div>
                        <Flex gap={20} align='center'>
                            <Tooltip title='Giỏ hàng' placement='bottom' color={COLOR.bgTooltipColor}>
                                <Badge count={0}>
                                    <Button onClick={() => navigate('/employer/cart')} className='btn-header rounded-circle btn-bell' size='large' type="text">
                                        <ShoppingCartOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip>
                            {/* <Tooltip title='Thông báo' placement='bottom' color={COLOR.bgTooltipColor}>
                                <Badge count={0}>
                                    <Button className='btn-header rounded-circle btn-bell' size='large' type="text">
                                        <BellOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip> */}
                            <Avatar size={'large'} className='avatar' icon={<UserOutlined />} src={avatar && <img src={avatar} alt='' />} />
                            {/* <span className={`username d-none d-lg-inline`}>{name}</span> */}
                        </Flex>
                    </Flex>
                </Header>
                <Content className='content-employer'>
                    <Flex gap={"1rem"} vertical>
                        <Outlet />
                    </Flex>
                </Content>
                <Footer className='p-0'>
                    <FooterComponent />
                </Footer>
            </Layout>
        </Layout >
    );
};
export default EmployerLayout;