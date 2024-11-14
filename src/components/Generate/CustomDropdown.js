import React from 'react';
import { Row, Col, Typography, Button } from 'antd';
import './CustomDropdown.scss'; // Import file SCSS

const { Title } = Typography;

const CustomDropdown = () => {
    return (
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
    );
};

export default CustomDropdown;
