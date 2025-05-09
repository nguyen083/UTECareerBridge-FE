import { useEffect, useState } from "react";
import { getOrderList } from "../../../services/apiService";
import BoxContainer from "../../Generate/BoxContainer";
import { Button, Table, Tag, Tooltip, message } from "antd";
import ModalDetailOrder from "./ModalDetailOrder";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { EyeOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const ListOrder = () => {
    const { t } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);
    const [openOrderModal, setOpenOrderModal] = useState(false);
    const [status, setStatus] = useState('PENDING');

    const fetchOrders = async (page, size) => {
        setLoading(true);           
        try {
            const response = await getOrderList(page - 1, size);
            setOrders(response.data.orders);
            setTotal(response.data.totalPage * size);
        } catch {
            message.error(t('employer.orders.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns = [
        {
            title: t('employer.orders.orderId'),
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: t('employer.orders.orderDate'),
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: t('employer.orders.couponCode'),
            dataIndex: 'couponCode',
            key: 'couponCode',
        },
        {
            title: t('employer.orders.total'),
            dataIndex: 'total',
            key: 'total',
            render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },

        {
            title: t('employer.orders.status'),
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (text) => text === 'PENDING' ? <Tag className="text-sm font-normal w-fit" color="default">{t('employer.orders.pending')}</Tag> : <Tag className="text-sm font-normal w-fit" color="green">{t('employer.orders.paid')}</Tag>,
        },
        {
            title: t('employer.orders.actions'),
            align: 'center',
            width: 200,
            render: (_, record) => record.paymentStatus === 'PENDING' ? <Tooltip color="blue" title={t('employer.orders.pay')}><Button icon={<FaMoneyCheckDollar size={20} />} type="text" onClick={() => { setOrder(record); setOpenOrderModal(true); setStatus(record.paymentStatus) }}></Button></Tooltip> :
                <Tooltip color="blue" title={t('employer.orders.view')}><Button icon={<EyeOutlined size={20} />} type="text" onClick={() => { setOrder(record); setOpenOrderModal(true); setStatus(record.paymentStatus) }}></Button></Tooltip>,
        },

    ];

    return (
        <>
            <BoxContainer className="shadow-md">
                <div className="title1">{t('employer.orders.title')}</div>
            </BoxContainer>
            <BoxContainer className="shadow-md">
                <Table
                    columns={columns}
                    dataSource={orders}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                    }}
                    loading={loading}
                    onChange={handleTableChange}
                    rowKey="orderId"
                />
            </BoxContainer>
            <ModalDetailOrder openOrderModal={openOrderModal} setOpenOrderModal={setOpenOrderModal} id={order?.orderId} status={status} />
        </>
    )
}
export default ListOrder;