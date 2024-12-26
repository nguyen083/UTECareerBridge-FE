import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
const Page403 = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="403"
            title="403"
            subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
            extra={<Button onClick={() => navigate('/home')} size="large" type="primary">Trở về trang chủ</Button>}
        />
    );
};
export default Page403;