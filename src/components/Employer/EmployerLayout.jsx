import React, { useEffect, useState } from 'react';
import './EmployerLayout.scss';
import { IoBusinessOutline } from "react-icons/io5";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { FaRegNewspaper } from "react-icons/fa";
import { BsTicketPerforated } from "react-icons/bs";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdManageAccounts, MdOutlineMessage } from "react-icons/md";
import { TiBusinessCard } from "react-icons/ti";
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setInfor } from '../../redux/action/employerSlice.jsx';
import { useRedux } from '../../utils/useRedux.jsx';
import FooterComponent from '../Generate/Footer.jsx';
import { AiOutlinePayCircle } from "react-icons/ai";
import { useTranslation } from 'react-i18next';

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
import { Layout, Menu, Avatar, Flex, Badge, Button, Tooltip, message, Space, Typography } from 'antd';
import { getInfor, logOut, removeToken } from '../../services/apiService.jsx';
import { loading, stop } from '../../redux/action/webSlice.jsx';
import COLOR from '../styles/_variables.jsx';
const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;
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

const itemHeader = [];


const EmployerLayout = () => {
    const { t } = useTranslation();
    const { clearRedux } = useRedux();
    const dispatch = useDispatch();
    const location = useLocation();
    const [defaultImage, setDefaultImage] = useState(null);
   
    const avatar = useSelector(state => state.employer.companyLogo);
    const user = useSelector(state => state.user);
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const itemSider = [
        { key: '/employer/dashboard', icon: <BarChartOutlined />, label: t('admin.employer.sidebar.dashboard') },
        { 
            key: '2', 
            icon: <UserOutlined />, 
            label: t('admin.employer.sidebar.account.title'), 
            children: [
                { 
                    key: '/employer/profile', 
                    label: t('admin.employer.sidebar.account.profile'), 
                    icon: <MdManageAccounts /> 
                }, 
                { 
                    key: '/employer/change-password', 
                    label: t('admin.employer.sidebar.account.changePassword'), 
                    icon: <RiLockPasswordLine /> 
                }
            ] 
        },
        { 
            key: '3', 
            icon: <IoBusinessOutline />, 
            label: t('admin.employer.sidebar.company.title'), 
            children: [
                { 
                    key: '/employer/company', 
                    label: t('admin.employer.sidebar.company.info'), 
                    icon: <TiBusinessCard /> 
                }, 
                { 
                    key: '/employer/business-certificate', 
                    label: t('admin.employer.sidebar.company.certificate'), 
                    icon: <FaRegNewspaper /> 
                }
            ] 
        },
        { key: '/employer/post-job', icon: <UploadOutlined />, label: t('admin.employer.sidebar.postJob') },
        { key: '/employer/applicant/list-job', icon: <TeamOutlined />, label: t('admin.employer.sidebar.applicant') },
        { key: '/employer/manage-list-jobs', icon: <LiaBriefcaseSolid />, label: t('admin.employer.sidebar.manageJobs') },
        { key: '/employer/list-resumes', icon: <SolutionOutlined />, label: t('admin.employer.sidebar.resumes') },
        { key: '/employer/list-order', icon: <AiOutlinePayCircle />, label: t('admin.employer.sidebar.orders') },
        { key: '/employer/chat', icon: <MdOutlineMessage />, label: t('admin.employer.sidebar.messages') },
        { key: '/employer/buy-service', icon: <BsTicketPerforated />, label: t('admin.employer.sidebar.services') },
        { key: 'logout', icon: <LogoutOutlined />, label: t('admin.employer.sidebar.logout') },
    ];

    useEffect(() => {
        const fetchData = async () => {
            let res = await getInfor();
           
            dispatch(setInfor(res.data));
            if (res.status !== 'OK') {
                message.error(t('admin.messages.error'));
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
            <Sider
                className='!border-r'
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }} trigger={null} collapsible collapsed={collapsed} breakpoint='lg' width={250} style={siderStyle} theme='light' /*collapsible*/ >
                <div className="demo-logo-vertical" >
                    <img src={defaultImage} alt="logo"
                        style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                </div>
                <Menu
                    onSelect={(key) => handleMenu(key)}
                    selectedKeys={[location.pathname]} theme='light' className="text-base" mode="inline" items={itemSider} background />
            </Sider>
            <Layout className='site-layout'>
                <Header
                    className='header-employer'>
                    <Flex align='center' justify='space-between' className='h-full'>
                        <MenuOutlined className='text-base' onClick={() => setCollapsed(!collapsed)} />
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
                            <Tooltip title={t('employer.header.cart')} placement='bottom' color={COLOR.bgTooltipColor}>
                                <Badge count={0}>
                                    <Button onClick={() => navigate('/employer/cart')} className='btn-header rounded-full btn-bell' size='large' type="text">
                                        <ShoppingCartOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip>
                            {/* <Tooltip title='Thông báo' placement='bottom' color={COLOR.bgTooltipColor}>
                                <Badge count={0}>
                                    <Button className='btn-header rounded-full btn-bell' size='large' type="text">
                                        <BellOutlined />
                                    </Button>
                                </Badge>
                            </Tooltip> */}
                            <Avatar size={'large'} className='avatar' icon={<UserOutlined />} src={avatar && <img src={avatar} alt='' />} />
                        </Flex>
                    </Flex>
                </Header>
                <Content className='content-employer'>
                    <Flex className='h-full' gap={"1rem"} vertical>
                        <Outlet />
                    </Flex>
                </Content>

            </Layout>
        </Layout >
    );
};
export default EmployerLayout;