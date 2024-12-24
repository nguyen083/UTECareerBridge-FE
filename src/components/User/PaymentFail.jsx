import { Button, Result, Typography } from "antd";
import { useNavigate } from "react-router-dom";
const { Text, Title } = Typography;
const PaymentFail = () => {
    const navigate = useNavigate();
    return (
        <Result
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: '100vh' }}
            status="error"
            title={<Title className="f-24">Thanh toán thất bại!</Title>}
            subTitle={<Text type='secondary'>Đơn Hàng thanh toán không thành công. Vui lòng thử lại sau.</ Text>}
            extra={[
                <Button size="large" onClick={() => navigate('/employer')} type="primary" key="console">
                    Trở về
                </Button>,
            ]}
        />
    );
}
export default PaymentFail;