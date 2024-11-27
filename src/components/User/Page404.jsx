import { Button, Result } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { stop } from "../../redux/action/webSlice";
const Page404 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(stop());
    }, []);
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