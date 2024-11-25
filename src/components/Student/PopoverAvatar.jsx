import { BellOutlined, DashboardFilled, DashboardOutlined, LogoutOutlined, SolutionOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Flex, Menu, Popover, Typography } from "antd";
import React, { useEffect, useState } from "react";
import './PopoverAvatar.scss';
import { LiaBriefcaseSolid } from "react-icons/lia";
import { MdOutlineMessage } from "react-icons/md";
import { current, loading, stop } from "../../redux/action/webSlice";
import { useDispatch, useSelector } from "react-redux";
import { logOut, removeToken } from "../../services/apiService";
import { setNull } from "../../redux/action/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const menuItems = [
    { key: '1', icon: <DashboardOutlined />, label: 'Tổng Quan' },
    { key: '2', icon: <SolutionOutlined />, label: 'Hồ Sơ Của Tôi' },
    { key: '3', icon: <LiaBriefcaseSolid />, label: 'Công Ty Của Tôi' },
    { key: '4', icon: <TeamOutlined />, label: 'Việc Làm Của Tôi' },
    { key: '5', icon: <MdOutlineMessage />, label: 'Thông Báo Việc Làm' },
    { key: '6', icon: <BellOutlined />, label: 'Quản Lý Tài Khoản' },
    { key: '7', icon: <LogoutOutlined />, label: 'Thoát' },
];
const navigationMap = {
    '1': 'tổng quan',
    '2': 'hồ sơ của tôi',
    '3': 'công ty của tôi',
    '4': 'việc làm của tôi',
    '5': 'thông báo việc làm',
    '6': 'quản lý tài khoản',
    '7': 'logout' // Đặt một giá trị đặc biệt cho logout
};
const CustomizePopover = ({ setIndex }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <>
            <Flex justify="space-between" align="center">
                <Flex vertical>
                    <Typography.Text>
                        Tên
                    </Typography.Text>
                    <Typography.Text className="text-small" type="secondary">
                        email
                    </Typography.Text>
                </Flex>
                <Button className="update-infor-btn" onClick={() => navigate("/profile")}> Cập nhật hồ sơ</Button>
            </Flex>
            <Divider className="my-1" />
            <Menu
                style={{ color: 'red' }}
                selectedKeys={-1}
                onClick={(e) => {
                    dispatch(current(e.key))
                    setIndex(e.key)
                }} items={menuItems} />
        </>
    )
}
const PopoverAvatar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(null);


    useEffect(() => {

    }, [open]);
    useEffect(() => {
        const logout = async () => {
            dispatch(loading());
            const res = await logOut();
            if (res.status === 'OK') {
                removeToken();
                dispatch(stop());
                toast.success(res.message);
                dispatch(setNull());
                navigate('/home');
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
            open={open}
            onOpenChange={(e) => setOpen(e)}
            popupVisible
            arrow={false}
            placement="bottom"
            content={<CustomizePopover setIndex={setIndex} />}
            trigger={['click']}
        >
            <Avatar size={'large'} icon={<UserOutlined />} />
            {/* src={avatar && <img src={avatar} />} */}
        </Popover>
    );

}
export default PopoverAvatar;   