import React from 'react';
import './HomePage.scss';
import '../Generate/CustomizePopover.scss';
import { Layout, theme, Image, Button, Flex, Popover, Row, Col, Typography, Avatar } from 'antd';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import FooterComponent from '../Generate/Footer.jsx';
import Notification from '../Generate/Notification.jsx';
import { useSelector } from 'react-redux';
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

const HomePage = () => {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
                            <Button className='rounded-pill btn-header' size='large'><MenuOutlined /> <div>Tất cả danh mục</div></Button>
                        </Popover>
                        <Button onClick={nagigateLogin} className='rounded-pill btn-header' size='large'>Nhà tuyển dụng</Button>
                        <Flex gap={"0.5rem"}>
                            {/* <Popover
                                placement='bottom'
                                content={<div></div>}
                                trigger={['click']}>
                                <Tooltip title='Thông báo' placement='bottom' color={COLOR.bgTooltipColor}>
                                    <Badge count={0}>
                                        <Button className='btn-header rounded-circle btn-bell' size='large' type="text">
                                            <BellOutlined />
                                        </Button>
                                    </Badge>
                                </Tooltip>
                            </Popover> */}
                            <Notification userId={useSelector(state => state.user.userId)} />
                            {!localStorage.getItem('accessToken')
                                ? <Button
                                    onClick={() => navigate('/login')}
                                    className='rounded-pill btn-header btn-login' size='large'>
                                    <FaUser />Đăng nhập</Button> :
                                <Avatar size={'large'} className='avatar' icon={<UserOutlined />} />}
                            {/* src={avatar && <img src={avatar} alt='' />}  */}
                        </Flex>
                    </Flex>
                </Flex>
            </Header>
            <Content
                className='content-student'
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: "100vh",
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    Contentt
                </div>
            </Content>
            <Footer className='p-0'>
                <FooterComponent />
            </Footer>
        </Layout>
    );
};
export default HomePage;