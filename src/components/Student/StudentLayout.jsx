import React, { useEffect, useState } from 'react';
import './StudentLayout.scss';
import '../Generate/CustomizePopover.scss';
import { Layout, theme, Image, Button, Flex, Popover, Row, Col, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import FooterComponent from '../Generate/Footer.jsx';
import Notification from '../Generate/Notification.jsx';
import { useDispatch, useSelector } from 'react-redux';
import PopoverAvatar from './Header/PopoverAvatar.jsx';
import { setInforStudent } from '../../redux/action/studentSlice.jsx';
import { getInforStudent } from '../../services/apiService.jsx';
import JobSearchBar from './Search/JobSearchBar.jsx';
const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const PopoverCategory = () => {
    const navigate = useNavigate();
    return (
        <div className="dropdown-content">
            <Row gutter={[32, 16]}>
                <Col span={8}>
                    <Title level={5}>Việc làm</Title>
                    <Button size='large' type="text" onClick={() => navigate('/search')} >Việc làm mới nhất</Button>
                    <Button size='large' type="text" onClick={() => navigate('/search')} >Tìm việc làm</Button>
                    <Button size='large' type="text" onClick={() => navigate('/search')} >Việc làm quản lý</Button>
                </Col>
                <Col span={8}>
                    <Title level={5}>Việc của tôi</Title>
                    <Button size='large' type="text"  >Việc đã lưu</Button>
                    <Button size='large' type="text" onClick={() => navigate('/my-job')}  >Việc đã ứng tuyển</Button>
                    <Button size='large' type="text"  >Thông báo việc làm</Button>
                    <Button size='large' type="text"  >Việc dành cho bạn</Button>
                </Col>
                <Col span={8}>
                    <Title level={5}>Công ty</Title>
                    <Button size='large' type="text"  >Tất cả công ty</Button>
                </Col>
            </Row>

        </div>
    )
}

const StudentLayout = () => {
    const navigate = useNavigate();
    const infor = useSelector(state => state?.user);
    const dispatch = useDispatch();
    // const {
    //     token: { colorBgContainer, borderRadiusLG },
    // } = theme.useToken();

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

    const nagigateLogin = () => {
        localStorage.getItem('accessToken') ? navigate('/employer') : navigate('/employer/login');
    }

    return (
        <Layout className='layout-student'>
            <Header
                className='header-student'
            >
                <Flex align='center' justify='space-between' className='w-100'>
                    <Image
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1723888103/rg2do6iommv6wp840ixr.png"
                        alt="Website Logo"
                        preview={false}
                        width={150}
                    />
                    <JobSearchBar onSearch={() => { }} />
                    <Flex gap={"1rem"}>
                        <Popover
                            overlayClassName='customize-popover'
                            placement='bottomRight'
                            arrow={false}
                            content={PopoverCategory}
                            trigger={['click']}
                        >
                            <Button className='rounded-pill btn-header' size='large'><Flex gap={4}><MenuOutlined /> <div className='d-none d-md-block'>Tất cả danh mục</div></Flex></Button>
                        </Popover>
                        <Button onClick={nagigateLogin} className='rounded-pill btn-header' size='large'>Nhà tuyển dụng</Button>
                        <Flex gap={"0.5rem"}>
                            <Notification userId={useSelector(state => state.user.userId)} />
                            {!localStorage.getItem('accessToken')
                                ? <Button
                                    onClick={() => navigate('/login')}
                                    className='rounded-pill btn-header btn-login' size='large'>
                                    <Flex gap={4} align='center'> <FaUser /><div className='d-none d-md-block'> Đăng nhập</div></Flex></Button> :
                                <PopoverAvatar />}
                        </Flex>
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