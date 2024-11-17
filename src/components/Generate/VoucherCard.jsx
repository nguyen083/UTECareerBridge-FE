import React from 'react';
import { Button, Divider, Tag } from 'antd';
import './VoucherCard.scss';

const VoucherCard = () => {
    return (
        <div className="voucher-card">
            <div className="voucher-left">
                <div className="voucher-label">Voucher</div>
            </div>
            <Divider type="vertical" className="voucher-divider" />
            <div className="voucher-content">
                <h3>Giảm 30%</h3>
                <p>Thời gian còn lại: 14 ngày : 9 giờ : 51 phút</p>
                <div className="voucher-code">
                    <Tag color="orange">FOF69JGTDQ...</Tag>
                    <Button type="primary" className="voucher-button">Dùng ngay</Button>
                </div>
            </div>
        </div>
    );
};

export default VoucherCard;
