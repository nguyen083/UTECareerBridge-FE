import "./ChangePassword.scss";
const ChangePassword = () => {
    return (
        <div className="form-change-password">
            <div className="title">
                Đặt lại mật khẩu
            </div>
            <div className="description form-text">
                Hãy nhập mật khẩu mới cho người dùng: <span style={{color: "blue"}}>abc@gmail.com</span>
            </div>

        </div>
    );
};
export default ChangePassword;