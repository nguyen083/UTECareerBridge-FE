import { BellOutlined, SyncOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Flex, List, Popover, Tag, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import COLOR from "../styles/_variables";
import "./Notification.scss"; // Import file SCSS
import { getAllNotificationById } from "../../services/apiService";
import { useNavigate } from "react-router-dom";

const ListNotification = ({ notification, userId }) => {
    const navigate = useNavigate();
    return (
        <List
            locale={{
                emptyText: !userId ? (
                    <Flex vertical justify="center" align="center" gap={8}>
                        <Typography.Text className="notification-login-text" type="secondary">
                            Đăng nhập để xem thông báo
                        </Typography.Text>
                        <Button className="login-button" type="primary" onClick={() => navigate("/login")}>
                            Đăng nhập
                        </Button>
                    </Flex>
                ) : (
                    <Typography.Text type="secondary">Không có thông báo mới</Typography.Text>
                ),
            }}
            className="notification-list"
            itemLayout="horizontal"
            dataSource={notification}
            renderItem={(item) => (
                <List.Item>
                    <List.Item.Meta
                        title={
                            <Flex justify="space-between">
                                <Typography.Text
                                    className="fs-6 notification-title"
                                    strong
                                    ellipsis={{ tooltip: item.title }}
                                    onClick={() => window.open(item.url, '_blank')}
                                >
                                    {item.title}
                                </Typography.Text>
                                {item.read === true && <Tag color="red">Mới</Tag>}
                            </Flex>
                        }
                        description={
                            <>
                                <Typography.Paragraph ellipsis={{ rows: 3 }}>
                                    {item.content}
                                </Typography.Paragraph>
                                <Divider />
                                <Flex justify="end">
                                    <Typography.Text type="secondary">
                                        {new Date(item.notificationDate).toLocaleString('vi-VN')}
                                    </Typography.Text>
                                </Flex>
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    );
};

const Notification = ({ userId = null }) => {
    const [notification, setNotification] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            if (userId === null) return;
            const response = await getAllNotificationById(userId);
            setNotification(response);
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        handleRefresh();
    }, []);

    return (
        <Popover
            arrow={false}
            placement="bottom"
            title={
                <Flex justify="space-between">
                    <Typography.Title className="notification-title-header" level={5}>
                        Thông báo
                    </Typography.Title>
                    <Tooltip color={COLOR.bgTooltipColor} title="Làm mới">
                        <SyncOutlined className="me-2" spin={loading} onClick={handleRefresh} />
                    </Tooltip>
                </Flex>
            }
            content={<ListNotification notification={notification} userId={userId} />}
            trigger={['click']}
        >
            <Tooltip title="Thông báo" placement="bottom" color={COLOR.bgTooltipColor}>
                <Badge count={notification.filter((item) => item.read === true).length}>
                    <Button className="btn-header rounded-circle btn-bell" size="large" type="text">
                        <BellOutlined />
                    </Button>
                </Badge>
            </Tooltip>
        </Popover>
    );
};

export default Notification;
