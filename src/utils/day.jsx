import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Kích hoạt plugin customParseFormat
dayjs.extend(customParseFormat);

// Hàm tính khoảng cách từ ngày nhập đến hôm nay
const tinhKhoangCach = (dateInput) => {
    const today = dayjs(); // Ngày hiện tại
    const inputDate = dayjs(dateInput, 'DD/MM/YYYY'); // Ngày nhập vào với định dạng dd/mm/yyyy

    const daysDifference = today.diff(inputDate, 'day'); // Tính khoảng cách theo ngày

    return daysDifference;
};

const checkThoiHan = ({ dateInput }) => {
    const daysDifference = tinhKhoangCach(dateInput);
    if (daysDifference < 0) {
        return <Tag icon={<CloseCircleOutlined />} color="error"> Hết hạn</Tag>
    }
    return <Tag icon={<ClockCircleOutlined />} color="success">Còn hiệu lực</Tag>
}


export { tinhKhoangCach, checkThoiHan };