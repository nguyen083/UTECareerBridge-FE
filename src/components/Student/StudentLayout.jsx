import React, { useEffect, useState } from 'react';
import './StudentLayout.scss';
import '../Generate/CustomizePopover.scss';
import { Layout, Image, Button, Flex, Popover, Row, Col, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { LuLanguages } from "react-icons/lu";
import { FaUser } from 'react-icons/fa6';
import FooterComponent from '../Generate/Footer.jsx';
import Notification from '../Generate/Notification.jsx';
import { useDispatch, useSelector } from 'react-redux';
import PopoverAvatar from './Header/PopoverAvatar.jsx';
import { setInforStudent } from '../../redux/action/studentSlice.jsx';
import { getInforStudent } from '../../services/apiService.jsx';
import JobSearchBar from './Search/JobSearchBar.jsx';
import path from '../../constant/path.jsx';
import { useTranslation } from 'react-i18next';
import { setLang as setLanguageLocalStorage } from '../../redux/action/webSlice.jsx';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const PopoverCategory = () => {
    const navigate = useNavigate();
    const infor = useSelector(state => state?.user);
    return (
        <div className="dropdown-content">
            <Row gutter={[32, 16]}>
                <Col span={8}>
                    <Title level={5}>Việc làm</Title>
                    <Button size='large' type="text" onClick={() => navigate('/search', { state: { filters: { jobStatus: 'newest' } } })} >Việc làm mới nhất</Button>
                    <Button size='large' type="text" onClick={() => navigate('/search')} >Tìm việc làm</Button>
                    {/* <Button size='large' type="text" onClick={() => navigate('/search')} >Việc làm quản lý</Button> */}
                </Col>
                <Col span={8}>
                    <Title level={5}>Việc của tôi</Title>
                    <Button size='large' type="text" onClick={() => { infor.role === 'student' ? navigate('/my-job#job-saved') : navigate('login') }} >Việc đã lưu</Button>
                    <Button size='large' type="text" onClick={() => { infor.role === 'student' ? navigate('/my-job#job-applied') : navigate('login') }} >Việc đã ứng tuyển</Button>
                    {/* <Button size='large' type="text"  >Thông báo việc làm</Button>
                    <Button size='large' type="text"  >Việc dành cho bạn</Button> */}
                </Col>
                <Col span={8}>
                    <Title level={5}>Sự kiện</Title>
                    <Button size='large' type="text" onClick={() => navigate('/event')}>Tất cả sự kiện</Button>
                </Col>
            </Row>

        </div>
    )
}

const StudentLayout = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const infor = useSelector(state => state?.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem('accessToken');
    const [lang, setLang] = useState(useSelector(state => state.web.lang));

    useEffect(() => {
        if (infor.role === 'student') {
            getInforStudent().then(res => {
                if (res.status === 'OK') {
                    dispatch(setInforStudent(res.data));
                }
            }).catch(err => {
                console.log(err);
            })
        }

    }, []);
    const changeLanguage = () => {
        if (lang === "en") {
            i18n.changeLanguage("vi");
            setLang("vi");
            dispatch(setLanguageLocalStorage("vi"));
        } else {
            i18n.changeLanguage("en");
            setLang("en");
            dispatch(setLanguageLocalStorage("en"));
        }
    };
    const nagigateLogin = () => {
        infor.role === 'employer' ? navigate('/employer') : navigate('/employer/login');
    }

    return (
        <Layout className='layout-student'>
            <Header
                className='header-student'
            >
                <Flex align='center' justify='space-between' className='w-full'>
                    <Image
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate('/')}
                        src={path.logo}
                        alt="Website Logo"
                        preview={false}
                        width={150}
                    />
                    <JobSearchBar onSearch={() => { }} />
                    <Flex gap={"1rem"} align='center'>
                        <Button onClick={() => { token ? navigate('/chat') : navigate('/login') }} className='rounded-full btn-header' size='large'>Nhắn tin</Button>
                        <Popover
                            overlayClassName='customize-popover'
                            placement='bottomRight'
                            arrow={false}
                            content={PopoverCategory}
                            trigger={['click']}
                        >
                            <Button className='rounded-full btn-header' size='large'><Flex gap={4}><MenuOutlined /> <div className='hidden md:block'>Tất cả danh mục</div></Flex></Button>
                        </Popover>
                        <div className="flex space-x-8 items-center">
                        <Button onClick={nagigateLogin} className='rounded-full btn-header' size='large'>Nhà tuyển dụng</Button>
                        <LuLanguages size={24} onClick={changeLanguage} className="text-blue-400" />
                        <Flex gap={"0.5rem"}>
                            <Notification userId={useSelector(state => state.user.userId)} />
                            {infor.role !== 'student'
                                ? <Button
                                    onClick={() => navigate('/login')}
                                    className='rounded-full btn-header btn-login' size='large'>
                                    <Flex gap={4} align='center'> <FaUser /><div className='hidden md:block'> Đăng nhập</div></Flex></Button> :
                                <PopoverAvatar />}
                        </Flex>
                        </div>
                    </Flex>
                </Flex>
            </Header>
            <Content
                className='content-student'
            >
                <Outlet />
            </Content>
            <Footer className='p-0'>
                <FooterComponent />
            </Footer>
        </Layout>
    );
};
export default StudentLayout;