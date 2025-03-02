import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const GoogleAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get("code");

        if (code) {
            console.log("Google Auth Code:", code);

            // Gửi code lên backend để xử lý đăng nhập
            fetch("http://localhost:5000/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Server Response:", data);

                    // Lưu token vào localStorage hoặc context
                    if (data.token) {
                        localStorage.setItem("token", data.token);
                    }

                    // Điều hướng về trang chính hoặc dashboard
                    navigate("/dashboard");
                })
                .catch(error => {
                    console.error("Error:", error);
                    navigate("/login"); // Nếu lỗi, quay về trang đăng nhập
                });
        } else {
            navigate("/login"); // Nếu không có code, quay về trang login
        }
    }, [location, navigate]);

    return null; // Không hiển thị gì trên UI
};

export default GoogleAuthCallback;
