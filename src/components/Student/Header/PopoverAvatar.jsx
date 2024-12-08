import { DashboardOutlined, LogoutOutlined, SettingOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Flex, Menu, Popover, Typography } from "antd";
import React, { useEffect, useState } from "react";
import './PopoverAvatar.scss';
import { current, loading, stop } from "../../../redux/action/webSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logOut, removeToken } from "../../../services/apiService.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRedux } from "../../../utils/useRedux.jsx";
import { IoIosBusiness } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Tổng Quan' },
    { key: '2', icon: <SolutionOutlined />, label: 'Hồ Sơ Của Tôi' },
    { key: '3', icon: <IoIosBusiness />, label: 'Công Ty Của Tôi' },
    { key: '4', icon: <IoBriefcaseOutline />, label: 'Việc Làm Của Tôi' },
    { key: '6', icon: <SettingOutlined />, label: 'Đổi mật khẩu' },
    { key: '7', icon: <LogoutOutlined />, label: 'Đăng xuất' },
];
const navigationMap = {
    '1': '/dashboard',
    '2': '/profile',
    '3': '/my-company',
    '4': '/my-job',
    '6': '/account-management',
    '7': 'logout' // Đặt một giá trị đặc biệt cho logout
};
const CustomizePopover = ({ setIndex, setOpen }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const infor = useSelector(state => state.student);
    return (
        <>
            <Flex justify="space-between" align="center">
                <Flex vertical>
                    <Typography.Text>
                        {infor.lastName} {infor.firstName}
                    </Typography.Text>
                    <Typography.Text className="text-small" type="secondary">
                        {infor.email}
                    </Typography.Text>
                </Flex>
                <Button className="update-infor-btn" onClick={() => { navigate("/profile"); setOpen(false) }}> Cập nhật hồ sơ</Button>
            </Flex>
            <Divider className="my-1" />
            <Menu
                style={{ color: 'red' }}
                selectedKeys={-1}
                onClick={(e) => {
                    dispatch(current(e.key))
                    setIndex(e.key)
                    setOpen(false)
                }} items={menuItems} />
        </>
    )
}
const PopoverAvatar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const avatar = useSelector(state => state.student.profileImage);
    const { clearRedux } = useRedux();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(null);

    useEffect(() => {
        const logout = async () => {
            dispatch(loading());
            const res = await logOut();
            if (res.status === 'OK') {
                removeToken();
                dispatch(stop());
                clearRedux();
                toast.success(res.message);
                navigate('/home');
                return true;
            } else {
                toast.error(res.message);
                dispatch(stop());
            }
        }
        const navigateSideBar = async (e) => {
            const path = navigationMap[e];
            if (path) {
                if (path === 'logout') {
                    await logout();
                } else {
                    navigate(path);
                }
            }
        };
        navigateSideBar(index);
        setOpen(false);
    }, [index]);
    return (
        <Popover
            className="popover-avatar"
            open={open}
            onOpenChange={(e) => setOpen(e)}
            popupVisible
            arrow={false}
            placement="bottom"
            content={<CustomizePopover setIndex={setIndex} setOpen={(value) => setOpen(value)} />}
            trigger={['click']}
        >
            <Avatar size='large' icon={<UserOutlined />} src={avatar} />
        </Popover>
    );

}
export default PopoverAvatar;   