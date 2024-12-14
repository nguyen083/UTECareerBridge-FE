import { useEffect, useState } from "react";
import { getOrderList } from "../../../services/apiService";
import BoxContainer from "../../Generate/BoxContainer";
import { Button, Table, Tag, Tooltip, Typography, message } from "antd";
import ModalDetailOrder from "./ModalDetailOrder";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { EyeOutlined } from "@ant-design/icons";

const { Title } = Typography;
const ListOrder = () => {
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
        } catch (error) {
            message.error("Lỗi khi tải danh sách đơn hàng");
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
            title: 'ID Đơn hàng',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Ngày đặt hàng',
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: 'Mã Coupon',
            dataIndex: 'couponCode',
            key: 'couponCode',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            key: 'total',
            render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
        },

        {
            title: 'Trạng thái',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            render: (text) => text === 'PENDING' ? <Tag color="default">Chờ thanh toán</Tag> : <Tag color="green">Đã thanh toán</Tag>,
        },
        {
            title: ' Xem / Thanh toán',
            align: 'center',
            width: 200,
            render: (_, record) => record.paymentStatus === 'PENDING' ? <Tooltip color="blue" title="Thanh toán"><Button icon={<FaMoneyCheckDollar size={20} />} type="text" onClick={() => { setOrder(record); setOpenOrderModal(true); setStatus(record.paymentStatus) }}></Button></Tooltip> :
                <Tooltip color="blue" title="Xem chi tiết"><Button icon={<EyeOutlined size={20} />} type="text" onClick={() => { setOrder(record); setOpenOrderModal(true); setStatus(record.paymentStatus) }}></Button></Tooltip>,
        },

    ];

    return (
        <>
            <BoxContainer>
                <div className="title1">Đơn hàng</div>
            </BoxContainer>
            <BoxContainer>
                <Table
                    columns={columns}
                    dataSource={orders}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showQuickJumper: true,
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