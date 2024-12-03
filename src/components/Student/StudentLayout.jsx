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
const { Header, Content, Footer } = Layout;
const { Title } = Typography;
const PopoverCategory = (
    <div className="dropdown-content">
        <Row gutter={[32, 16]}>
            <Col span={8}>
                <Title level={5}>Việc làm</Title>
                <Button type="text"  >Việc làm mới nhất</Button>
                <Button type="text"  >Tìm việc làm</Button>
                <Button type="text"  >Việc làm quản lý</Button>
            </Col>
            <Col span={8}>
                <Title level={5}>Việc của tôi</Title>
                <Button type="text"  >Việc đã lưu</Button>
                <Button type="text"  >Việc đã ứng tuyển</Button>
                <Button type="text"  >Thông báo việc làm</Button>
                <Button type="text"  >Việc dành cho bạn</Button>
            </Col>
            <Col span={8}>
                <Title level={5}>Công ty</Title>
                <Button type="text"  >Tất cả công ty</Button>
            </Col>
        </Row>
        <Row gutter={[32, 16]} style={{ marginTop: '20px' }}>
            <Col span={8}>
                <Title level={5}>Khám phá</Title>
            </Col>
        </Row>
        <Row gutter={[32, 16]}>
            <Col span={8}>

                <Button type="text"  >WowCV - Thư viện CV mẫu</Button>
                <Button type="text"  >HR Insider</Button>
                <Button type="text"  >Lộ trình sự nghiệp</Button>
            </Col>
            <Col span={8}>
                <Button type="text"  >Báo cáo lương</Button>
                <Button type="text"  >Công cụ tính lương</Button>
                <Button type="text"  >Trạm sạc</Button>
            </Col>
            <Col span={8}>
                <Button type="text"  >Câu hỏi phỏng vấn</Button>
                <Button type="text"  >Nhân số học</Button>
                <Button type="text"  >Career newbies</Button>
            </Col>
        </Row>
    </div>
)

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