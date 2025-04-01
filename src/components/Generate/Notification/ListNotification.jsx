import { Table, Typography } from "antd";
import { useEffect, useState } from "react";
import notification from "../../../services/api/notification";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import fakeData from "./fakeData";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

const ListNotification = ({ type = "system" }) => {
    const [notifications, setNotifications] = useState([]);
    const id = useSelector(state => state.user.userId);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const columns = [
        {
          title: t('notification.table.title'),
          dataIndex: 'title',
          key: 'title',
          ellipsis: true,
          width: '80%',
          render: text => <Text className="cursor-pointer hover:underline hover:text-text-color-hover" onClick={() => {
            navigate(`/notification/${id}`);
          }}>{text}</Text>,
        },
        {
          title: t('notification.table.time'),
          dataIndex: 'createdAt',
          key: 'createdAt',
          width: '20%',
          render: text => <p className="text-sm text-gray-500">{new Date(text).toLocaleString()}</p>,
        },
    ]


    const getNotification = async () => {
        try {
            setLoading(true);
            const response = await notification.getNotification({ id, page, pageSize, type });
            setNotifications(response.data.data);
            setTotal(response.data.total);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        // getNotification();
        setNotifications(fakeData);
    }, [page, pageSize]);
    return (
        <Table 
        columns={columns} 
        dataSource={notifications} 
        loading={loading} 
        pagination={{ page, pageSize, total,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            showSizeChanger: true, 
            onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
        },
        pageSizeOptions: ['5', '10', '15', '20'],
        }} />
    )
}

export default ListNotification;
