import { Descriptions, Flex, Modal, Radio, message, Typography, Table, Button, Avatar } from "antd";
import { useEffect, useState } from "react";
import { getDetailOrder, getOrderById, createPayment } from "../../../services/apiService";
import './ModalDetailOrder.scss';
const { Title, Text } = Typography;


const OrderDetailTable = ({ data }) => {
    // Định nghĩa cột cho bảng
    console.log(data);
    const columns = [
        {
            title: 'Tên gói',
            dataIndex: 'packageName', // Truy cập đến packageName trong nested object
            key: 'packageName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount', // Truy cập đến amount trong nested object
            key: 'amount',
        },
        {
            title: 'Giá',
            dataIndex: 'price', // price là thuộc tính của đối tượng trong mảng
            key: 'price',
            render: (text) => text.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }), // Hiển thị giá dưới dạng tiền tệ
        },
    ];

    // Chuyển đổi dữ liệu thành dạng phù hợp với Table
    const tableData = data?.map((item) => ({
        key: item.detailId,
        packageName: item.packageResponse.packageName, // Kết hợp thông tin từ packageResponse vào
        amount: item.amount,
        price: item.price,
    }));

    return <>
        <Title className="pt-2" strong level={5}>Danh sách gói dịch vụ</Title>
        <Table columns={columns} dataSource={tableData} pagination={false} />
    </>
};


const ModalDetailOrder = ({ openOrderModal, setOpenOrderModal, id, status = 'PENDING' }) => {
    const [order, setOrder] = useState(null);
    const [detailOrder, setDetailOrder] = useState(null);



    useEffect(() => {
        if (id) {
            getDetailOrder(id).then((res) => {
                setDetailOrder(res.data);
            });
            getOrderById(id).then((res) => {
                setOrder(res.data);
            });
        }
    }, [id]);


    const handlePayment = () => {
        createPayment(order?.orderId).then((res) => {
            if (res.status === 'OK') {
                setOpenOrderModal(false);
                window.open(res.data, '_blank');
            } else {
                message.error(res.message);
            }
        });
    }
    return (
        <>
            <Modal
                className="modal-detail-order"
                width={800}
                onCancel={() => setOpenOrderModal(false)}
                centered
                title={<Title strong level={4}>Chi tiết đơn hàng</Title>}
                open={openOrderModal}

                footer={
                    status === 'PENDING' ? <>
                        <Button size='large' type="default" onClick={() => setOpenOrderModal(false)}>Hủy</Button>
                        <Button size='large' type="primary" onClick={handlePayment}>Thanh toán</Button>
                    </> : null}

            >
                <Flex vertical gap={16} className="modal-detail-order-content">
                    <Descriptions title={<Title strong level={5}>Thông tin đơn hàng</Title>} column={1} bordered>
                        <Descriptions.Item label="ID Đơn hàng">{order?.orderId}</Descriptions.Item>
                        <Descriptions.Item label="Công ty">{order?.employer.companyName}</Descriptions.Item>
                        <Descriptions.Item label="Mã Coupon">{order?.couponCode}</Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt hàng">{order?.orderDate}</Descriptions.Item>
                        <Descriptions.Item label="Tổng tiền">{order?.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Descriptions.Item>
                    </Descriptions>
                    <OrderDetailTable data={detailOrder} />
                    {status === 'PENDING' && <> <Title strong level={5}>Chọn phương thức thanh toán</Title>
                        <Radio.Group value={1}>
                            <Flex vertical gap={16}>
                                <Flex className="border border-1 p-2 rounded-2" align="center" gap={16}>
                                    <Radio value={1} />
                                    <Avatar shape="square" size={64} src={"https://res.cloudinary.com/utejobhub/image/upload/v1733687883/vnpay_vgngax.png"} />
                                    <Text strong>Ví điện tử VNPAY</Text>
                                </Flex>
                                <Flex className="border border-1 p-2 rounded-2" align="center" gap={16}>
                                    <Radio value={2} />
                                    <Avatar shape="square" size={64} src={"https://res.cloudinary.com/utejobhub/image/upload/v1733688330/ATMCard_r2pfq0.png"} />
                                    <Text strong>Thẻ ATM và Tài khoản ngân hàng</Text>
                                </Flex>
                                <Flex className="border border-1 p-2 rounded-2" align="center" gap={16}>
                                    <Radio value={3} />
                                    <Avatar shape="square" size={64} src={"https://res.cloudinary.com/utejobhub/image/upload/v1733688425/phan-loai-the-thanh-toan-quoc-te_rjgejr.jpg"} />
                                    <Text strong>Thẻ thanh toán quốc tế</Text>
                                </Flex>
                            </Flex>


                        </Radio.Group></>}
                </Flex>
            </Modal ></>
    )
}
export default ModalDetailOrder;