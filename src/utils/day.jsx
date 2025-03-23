import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Kích hoạt plugin customParseFormat
dayjs.extend(customParseFormat);

// Hàm tính khoảng cách từ ngày nhập đến hôm nay


const checkThoiHan = ({ dateInput }) => {
    const tinhKhoangCach = (dateInput) => {
        const today = dayjs();
        const inputDate = dayjs(dateInput, 'DD/MM/YYYY');

        const daysDifference = today.diff(inputDate, 'day');

        return daysDifference;
    };
    const daysDifference = tinhKhoangCach(dateInput);
    if (daysDifference >= 0) {
        return <Tag className='w-fit' icon={<CloseCircleOutlined />} color="error"> Hết hạn</Tag>
    }
    return <Tag className='w-fit' icon={<ClockCircleOutlined />} color="success">Còn hiệu lực</Tag>
}


export { checkThoiHan };