import React from 'react';
import "./Footer.scss"
import { Row, Col, Typography, Divider, Space } from 'antd';
import { FacebookOutlined, LinkedinOutlined, YoutubeOutlined, InstagramOutlined, AppleOutlined, AndroidOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
    return (
        <footer style={{ backgroundColor: '#001744', color: '#fff', padding: '40px 40px' }}>
            <Row gutter={[32, 16]}>
                {/* Cột VietnamWorks */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>VietnamWorks</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Về VietnamWorks</Link>
                        <Link href="#" className='link-footer'>Về VietnamWorks inTECH</Link>
                        <Link href="#" className='link-footer'>Liên Hệ</Link>
                        <Link href="#" className='link-footer'>Hỏi Đáp</Link>
                        <Link href="#" className='link-footer'>Thỏa Thuận Sử Dụng</Link>
                        <Link href="#" className='link-footer'>Quy Định Bảo Mật</Link>
                        <Link href="#" className='link-footer'>Quy Chế Hoạt Động Sàn Giao Dịch</Link>
                        <Link href="#" className='link-footer'>Sơ Đồ Trang Web</Link>
                    </Space>
                </Col>

                {/* Cột Dành cho Nhà tuyển dụng */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Dành cho Nhà tuyển dụng</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Đăng tuyển dụng</Link>
                        <Link href="#" className='link-footer'>Tìm kiếm hồ sơ</Link>
                        <Link href="#" className='link-footer'>Sản phẩm Dịch vụ khác</Link>
                        <Link href="#" className='link-footer'>Liên hệ</Link>
                    </Space>
                </Col>

                {/* Cột Việc làm theo khu vực */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Việc làm theo khu vực</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Hồ Chí Minh</Link>
                        <Link href="#" className='link-footer'>Hà Nội</Link>
                        <Link href="#" className='link-footer'>Hải Phòng</Link>
                        <Link href="#" className='link-footer'>Đà Nẵng</Link>
                        <Link href="#" className='link-footer'>Cần Thơ</Link>
                        <Link href="#" className='link-footer'>Xem tất cả khu vực</Link>
                    </Space>
                </Col>

                {/* Cột Việc làm theo ngành nghề */}
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Việc làm theo ngành nghề</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>Kế toán</Link>
                        <Link href="#" className='link-footer'>Ngân hàng</Link>
                        <Link href="#" className='link-footer'>Phần mềm máy tính</Link>
                        <Link href="#" className='link-footer'>IT Support / Help Desk</Link>
                        <Link href="#" className='link-footer'>Xây dựng</Link>
                        <Link href="#" className='link-footer'>Tìm việc làm</Link>
                    </Space>
                </Col>
            </Row>

            <Divider style={{ backgroundColor: '#ccc' }} />

            {/* Phần ứng dụng và mạng xã hội */}
            <Row gutter={[32, 16]} justify="space-between">
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Ứng dụng di động</Title>
                    <Space>
                        <AppleOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                        <AndroidOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                    </Space>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Title level={5} style={{ color: '#fff' }}>Theo dõi VietnamWorks trên</Title>
                    <Space>
                        <FacebookOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                        <LinkedinOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                        <YoutubeOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                        <InstagramOutlined style={{ fontSize: '24px', color: '#ccc' }} />
                    </Space>
                </Col>
            </Row>

            <Text style={{ color: '#ccc', marginTop: '20px', display: 'block' }}>
                Copyright © Công Ty Cổ Phần Navigos Group Việt Nam
            </Text>
        </footer>
    );
};

export default FooterComponent;
