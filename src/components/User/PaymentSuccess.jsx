import { Button, Result, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import Crossfire from "react-canvas-confetti/dist/presets/crossfire";
import Explosion from "react-canvas-confetti/dist/presets/explosion";
import Pride from "react-canvas-confetti/dist/presets/pride";

const { Text, Title } = Typography;
const PaymentSuccess = () => {
    const navigate = useNavigate();
    return (

        <>
            <Pride autorun={{ speed: 5 }} />
            <Result
                className="d-flex justify-content-center align-items-center flex-column"
                style={{ height: '100vh' }}
                status="success"
                title={<Title className="f-24">Thanh toán thành công!</Title>}
                subTitle={<Text type="secondary"> Đơn hàng đã được thanh toán thành công. Vui lòng trở về để tiếp tục!</ Text>}
                extra={[
                    <Button size="large" onClick={() => navigate('/employer')} type="primary" key="console">
                        Trở về
                    </Button>
                ]}
            />
        </>
    );
}
export default PaymentSuccess;