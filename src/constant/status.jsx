import { Tag } from "antd";

const Status = ({ status }) => {
    switch (status) {
        case "PENDING":
            return <Tag color="default">Đang chờ</Tag>;
        case "VIEWED":
            return <Tag color="blue">Đã xem</Tag>;
        case "APPROVED":
            return <Tag color="success">Đã duyệt</Tag>;
        case "REJECTED":
            return <Tag color="error">Bị từ chối</Tag>;
        default:
            return <Tag color="default">Không xác định</Tag>;
    }
}

export default Status;