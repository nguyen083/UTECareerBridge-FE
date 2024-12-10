import React from 'react';
import "./Footer.scss"
import { Row, Col, Typography, Divider, Space, Flex } from 'antd';
import { FacebookOutlined, LinkedinOutlined, YoutubeOutlined, InstagramOutlined, AppleOutlined, AndroidOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
    return (
        <footer style={{ backgroundColor: '#E1EDFC', color: '#fff', padding: '40px 40px' }}>
            <Row gutter={[32, 16]}>
                {/* Cột VietnamWorks */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>Ute Careerbridge</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Về Ute Careerbridge</Link>
                        <Link href="#" className='link-footer'>Về Ute inTECH</Link>
                        <Link href="#" className='link-footer'>Liên Hệ</Link>
                        <Link href="#" className='link-footer'>Hỏi Đáp</Link>
                        <Link href="#" className='link-footer'>Thỏa Thuận Sử Dụng</Link>
                        <Link href="#" className='link-footer'>Quy Định Bảo Mật</Link>
                    </Space>
                </Col>

                {/* Cột Dành cho Nhà tuyển dụng */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>Dành cho Nhà tuyển dụng</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Đăng tuyển dụng</Link>
                        <Link href="#" className='link-footer'>Tìm kiếm hồ sơ</Link>
                        <Link href="#" className='link-footer'>Liên hệ</Link>
                    </Space>
                </Col>


                {/* Cột Việc làm theo ngành nghề */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>Việc làm theo ngành nghề</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Kế toán</Link>
                        <Link href="#" className='link-footer'>Ngân hàng</Link>
                        <Link href="#" className='link-footer'>Công nghệ ô tô</Link>
                        <Link href="#" className='link-footer'>Công nghệ thông tin</Link>
                        <Link href="#" className='link-footer'>Xây dựng</Link>
                        <Link href="#" className='link-footer'>Tìm việc làm</Link>
                    </Space>
                </Col>
            </Row>

            <Divider style={{ backgroundColor: '#ccc' }} />

            {/* Phần ứng dụng và mạng xã hội */}

            <Flex justify='center'>
                <Space size='small'>
                    <Text style={{ color: '#1E4F94' }}>
                        Copyright ©2024 UTE CAREERBRIDGE
                    </Text>
                </Space>
            </Flex>
        </footer>
    );
};

export default FooterComponent;
