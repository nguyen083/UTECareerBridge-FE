import React from 'react';
import './HomePage.scss';
import { Layout, theme, Image, Dropdown, Button, Flex, Badge } from 'antd';
import { BellOutlined, MenuOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import FooterComponent from './Footer';
import CustomDropdown from '../Generate/CustomDropdown.js';
const { Header, Content, Footer } = Layout;



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
                        <Dropdown
                            overlay={<CustomDropdown />}
                            trigger={['click']}
                        >
                            <Button className='rounded-pill btn-header' size='large'><MenuOutlined /> Tất cả danh mục</Button>
                        </Dropdown>
                        <Button onClick={nagigateLogin} className='rounded-pill btn-header' size='large'>Nhà tuyển dụng</Button>
                        <Flex gap={"0.5rem"}>
                            <Dropdown
                                placement='bottom'
                                overlay={<CustomDropdown />}
                                trigger={['click']}>
                                <Badge count={0}>
                                    <Button className='btn-header rounded-circle btn-bell' size='large' type="text">
                                        <BellOutlined />
                                    </Button>
                                </Badge>
                            </Dropdown>
                            <Button onClick={() => navigate('/login')} className='rounded-pill btn-header btn-login' size='large'><FaUser />Đăng nhập</Button>

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