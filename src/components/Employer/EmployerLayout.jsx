import React, { useEffect, useState } from 'react';
import './EmployerLayout.scss';
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { IoIosPeople } from "react-icons/io";
import { FaRegNewspaper } from "react-icons/fa";
import { MdOutlineMessage } from "react-icons/md";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setInfor, setInitEmployer } from '../../redux/action/employerSlice.jsx';
import FooterComponent from '../Generate/Footer.jsx';

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
import { Layout, Menu, Avatar, Flex, Badge, Button, Tooltip, } from 'antd';
import { getInfor, getToken, logOut, removeToken } from '../../services/apiService.jsx';
import { toast } from 'react-toastify';
import { current, loading, stop } from '../../redux/action/webSlice.jsx';
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
    { key: '1', icon: <BarChartOutlined />, label: 'Dashboard' },
    { key: '2', icon: <UserOutlined />, label: 'Tài khoản', children: [{ key: '2.1', label: 'Thông tin cá nhân', icon: <MdManageAccounts /> }, { key: '2.2', label: 'Đổi mật khẩu', icon: <RiLockPasswordLine /> }] },
    { key: '3', icon: <IoBusinessOutline />, label: 'Công ty', children: [{ key: '3.1', label: 'Thông tin công ty', icon: <TiBusinessCard /> }, { key: '3.2', label: 'Giấy chứng nhận', icon: <FaRegNewspaper /> }] },
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
    '2.2': '/employer/change-password',
    '3.1': '/employer/company',
    '3.2': '/employer/business-certificate',
    '4': '/employer/post-job',
    '5': '#',
    '6': 'manage-list-jobs',
    '7': '#',
    '8': '#',
    '9': '#',
    '10': '#',
    '11': '/employer/buy-service',
    '12': 'logout' // Đặt một giá trị đặc biệt cho logout
};

const EmployerLayout = () => {
    const dispatch = useDispatch();
    const [defaultImage, setDefaultImage] = useState(null);
    const name = useSelector(state => state.employer.firstName) + ' ' + useSelector(state => state.employer.lastName);
    const avatar = useSelector(state => state.employer.companyLogo);
    const user = useSelector(state => state.user);
    const [index, setIndex] = useState();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            getToken();
            let res = await getInfor();
            //Lưu thông tin người dùng vào redux
            dispatch(setInfor(res.data));
            if (res.status !== 'OK') {
                toast.error('Có lỗi xảy ra');
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
    useEffect(() => {
        const logout = async () => {
            dispatch(loading());
            const res = await logOut();
            if (res.status === 'OK') {
                removeToken();
                dispatch(stop());
                toast.success(res.message);
                dispatch(setInitEmployer());
                navigate('login');
            } else {
                toast.error(res.message);
                dispatch(stop());
            }
        }
        const navigateSideBar = async (e) => {
            const path = navigationMap[e];
            if (path) {
                if (path === 'logout') {
                    await logout();
                } else {
                    navigate(path);
                }
            }
        };
        navigateSideBar(index);
    }, [index]);
    useEffect(() => {
        setDefaultImage("https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png")
    }, [])
    if (localStorage.getItem('accessToken') === null) {
        return null;
    }
    return (
        <Layout hasSider>
            <Sider onBreakpoint={(broken) => {
                setCollapsed(broken);
            }} trigger={null} collapsible collapsed={collapsed} breakpoint='lg' width={250} style={siderStyle} theme='light' /*collapsible*/ >
                <div className="demo-logo-vertical" >
                    <img src={defaultImage} alt="logo"
                        style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                </div>
                <Menu onClick={(e) => {
                    dispatch(current(e.key))
                    setIndex(e.key)
                }} selectedKeys={[index]} theme='light' style={{ fontSize: "1rem" }} mode="inline" items={itemSider} background />
            </Sider>
            <Layout className='site-layout'>
                <Header
                    className='header-employer'>
                    <Flex align='center' justify='space-between'>
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
                                    <Button className='btn-header rounded-circle btn-bell' size='large' type="text">
                                        <ShoppingCartOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip>
                            <Tooltip title='Thông báo' placement='bottom' color={COLOR.bgTooltipColor}>
                                <Badge count={0}>
                                    <Button className='btn-header rounded-circle btn-bell' size='large' type="text">
                                        <BellOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip>
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