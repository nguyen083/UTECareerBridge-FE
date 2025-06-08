import { Table, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import notification from "../../../services/api/notification";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { connectStomp } from "../../../utils/stompConfig";

import { useNavigate } from "react-router-dom";
import clsx from "clsx";
const { Text } = Typography;

const ListNotification = ({ type = "system" }) => {
  const [notifications, setNotifications] = useState([]);
  const id = useSelector((state) => state.user.userId);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const { t } = useTranslation();
  const role = useSelector((state) => state.user.role);

  const navigate = useNavigate();
  useEffect(() => {
    setPage(1);
  }, [type]);

  const columns = [
    {
      title: t("notification.table.title"),
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      width: "80%",
      render: (text, record) => (
        <Text
          className={clsx(
            "text-base transition-colors duration-200 hover:underline hover:text-blue-600",
            !record.read && "font-semibold"
          )}
        >
          {text}
        </Text>
      ),
    },
    {
      title: t("notification.table.time"),
      dataIndex: "notificationDate",
      key: "notificationDate",
      width: "20%",
      render: (text) => (
        <p className="text-sm text-gray-500 whitespace-nowrap">
          {new Date(text).toLocaleString()}
        </p>
      ),
    },
  ];

  const getNotification = useCallback(async () => {
    if (type === "system") {
      try {
        setLoading(true);
        const response = await notification.getNotificationBroadcast({
          page: page - 1,
          size,
        });
        setNotifications(response.data.content);
        setTotal(response.data.totalElements);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        const response = await notification.getNotificationPersonal(id, {
          page: page - 1,
          size,
        });
        setNotifications(response.data.content);
        setTotal(response.data.totalElements);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }, [id, page, size, type]);

  const onConnected = useCallback(
    (client) => {
      if (client) {
        let subscription = null;
        if (type === "system") {
          subscription = client.subscribe(
            "/notifications/broadcast",
            (response) => {
              try {
                const messageData = JSON.parse(response.body);
                console.log("Broadcast notification received:", messageData);
                setNotifications((prevNotifications) => [
                  messageData,
                  ...prevNotifications,
                ]);
                setTotal((prevTotal) => prevTotal + 1);
              } catch (error) {
                console.error("Lỗi khi xử lý dữ liệu từ WebSocket:", error);
              }
            }
          );
        } else {
          subscription = client.subscribe(
            "/user/" + id + "/notifications/personal",
            (response) => {
              try {
                const messageData = JSON.parse(response.body);
                console.log("Personal notification received:", messageData);

                setNotifications((prevNotifications) => [
                  messageData,
                  ...prevNotifications,
                ]);
                setTotal((prevTotal) => prevTotal + 1);
              } catch (error) {
                console.error("Lỗi khi xử lý dữ liệu từ WebSocket:", error);
              }
            }
          );
        }

        return subscription;
      }
      return null;
    },
    [id, type]
  );

  useEffect(() => {
    getNotification();
  }, [getNotification]);

  useEffect(() => {
    connectStomp(
      (client) => {
        onConnected(client);
      },
      (error) => {
        console.error("Lỗi kết nối:", error);
      }
    );

    return () => {};
  }, [onConnected]);

  return (
    <>
      <Table
        columns={columns}
        dataSource={notifications}
        loading={loading}
        rowKey="notificationId"
        rowClassName={(record, index) =>
          `${index % 2 === 0 ? "bg-white" : "bg-gray-50"} 
          cursor-pointer hover:bg-blue-50 transition-colors duration-200`
        }
        onRow={(record) => ({
          onClick: () => {
            if (role === "admin")
              navigate(`/admin/notification/${record.notificationId}`);
            else if (role === "employer")
              navigate(`/employer/notification/${record.notificationId}`);
            else navigate(`/notification/${record.notificationId}`);
          },
          className: "hover:shadow-sm transition-shadow duration-200",
        })}
        pagination={{
          current: page,
          pageSize: size,
          total,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
              "common.item"
            )}`,
          onChange: (page, pageSize) => {
            setPage(page);
            setSize(pageSize);
          },
          pageSizeOptions: [10, 20, 50, 100],
          className: "mt-6",
          style: { marginBottom: 24 },
        }}
        className="overflow-hidden "
      />
    </>
  );
};

export default ListNotification;
