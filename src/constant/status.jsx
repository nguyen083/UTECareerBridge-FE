import { Tag } from "antd";

const Status = ({ status }) => {
    switch (status) {
        case "PENDING":
            return <Tag className="!mx-auto w-fit" color="default">Đang chờ</Tag>;
        case "VIEWED":
            return <Tag className="!mx-auto w-fit" color="blue">Đã xem</Tag>;
        case "APPROVED":
            return <Tag className="!mx-auto w-fit" color="success">Đã duyệt</Tag>;
        case "REJECTED":
            return <Tag className="!mx-auto w-fit" color="error">Bị từ chối</Tag>;
        default:
            return <Tag className="!mx-auto w-fit" color="default">Không xác định</Tag>;
    }
}

export default Status;