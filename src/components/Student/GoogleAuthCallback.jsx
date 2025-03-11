import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import auth from "../../services/api/auth";
import { message } from "antd";
import { setToken } from "../../services/apiService";
import { useRedux } from "../../utils/useRedux";

const GoogleAuthCallback = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");
    const state = queryParams.get("state");
    const navigate = useNavigate();
    const { login } = useRedux();

    useEffect(() => {
        if (code) {
            const param = { code, login_type: 'google', state };
            const role = atob(state);
            auth.sendCodeToBE(param).then(res => {
                console.log(res);
                if (res.status === 'OK') {
                    message.success(res.message);
                    setToken(res.data.token, res.data.refreshToken);
                    login(res);
                    if (role === 'student') {
                        navigate('/home', { replace: true });
                    } else if (role === 'employer') {
                        navigate('/employer', { replace: true });
                    }
                } else {
                    message.error(res.message);
                    if (role === 'student') {
                        navigate('/login', { replace: true });
                    } else if (role === 'employer') {
                        navigate('/employer/login', { replace: true });
                    }
                }
            }).catch(err => {
                message.error(err);
            });
        }

    }, []);
    return null; // Không hiển thị gì trên UI
};

export default GoogleAuthCallback;
