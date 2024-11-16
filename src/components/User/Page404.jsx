import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
const Page404 = () => {
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button onClick={() => navigate('/home')} size="large" type="primary">Trở về trang chủ</Button>}
        />
    );
}
export default Page404;