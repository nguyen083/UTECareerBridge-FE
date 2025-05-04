import {
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Flex,
  Menu,
  Popover,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import "./PopoverAvatar.scss";
import { loading, stop } from "../../../redux/action/webSlice.jsx";
import { useDispatch, useSelector } from "react-redux";
import { logOut, removeAllToken } from "../../../services/apiService.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useRedux } from "../../../utils/useRedux.jsx";
import { IoIosBusiness } from "react-icons/io";
import { IoBriefcaseOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const CustomizePopover = ({ setOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const infor = useSelector((state) => state.student);
  const { clearRedux } = useRedux();
  const location = useLocation();
  const { t } = useTranslation();

  const menuItems = [
    {
      key: "/dashboard",
      icon: <UserOutlined />,
      label: t("student.menu.dashboard"),
    },
    {
      key: "/profile",
      icon: <SolutionOutlined />,
      label: t("student.menu.myResume"),
    },
    {
      key: "/notification",
      icon: <BellOutlined />,
      label: t("student.menu.notification"),
    },
    {
      key: "/my-company",
      icon: <IoIosBusiness />,
      label: t("student.menu.myCompany"),
    },
    {
      key: "/my-job",
      icon: <IoBriefcaseOutline />,
      label: t("student.menu.myJob"),
    },
    {
      key: "/account-management",
      icon: <SettingOutlined />,
      label: t("student.menu.changePassword"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: t("student.menu.logout"),
    },
  ];

  const logout = async () => {
    dispatch(loading());
    const res = await logOut();
    if (res.status === "OK") {
      removeAllToken();
      dispatch(stop());
      clearRedux();
      message.success(res.message);
      navigate("/home");
      return true;
    } else {
      message.error(res.message);
      dispatch(stop());
    }
  };
  const handleMenu = async (menuItem) => {
    if (menuItem.key !== "logout") {
      navigate(menuItem.key);
    } else {
      await logout();
    }
    setOpen(false);
  };
  return (
    <>
      <Flex justify="space-between" align="center" gap={15}>
        <Flex vertical>
          <Typography.Text>
            {infor.lastName} {infor.firstName}
          </Typography.Text>
          <Typography.Text className="text-xs" type="secondary">
            {infor.email}
          </Typography.Text>
        </Flex>
        <Button
          size="small"
          className="update-infor-btn"
          onClick={() => {
            navigate("/profile");
            setOpen(false);
          }}
        >
          {t("student.menu.updateProfile")}
        </Button>
      </Flex>
      <Divider className="my-1" />
      <Menu
        className="popover-menu"
        style={{ color: "red" }}
        selectedKeys={[location.pathname]}
        onSelect={(key) => handleMenu(key)}
        items={menuItems}
      />
    </>
  );
};
const PopoverAvatar = () => {
  const avatar = useSelector((state) => state.student.profileImage);

  const [open, setOpen] = useState(false);

  return (
    <Popover
      className="cursor-pointer"
      open={open}
      onOpenChange={(e) => setOpen(e)}
      popupVisible
      arrow={false}
      placement="bottom"
      content={<CustomizePopover setOpen={(value) => setOpen(value)} />}
      trigger={["click"]}
    >
      <Avatar size="large" icon={<UserOutlined />} src={avatar} />
    </Popover>
  );
};
export default PopoverAvatar;
