import { ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const checkThoiHan = ({ dateInput }) => {
    const tinhKhoangCach = (dateInput) => {
        const today = dayjs();
        const inputDate = dayjs(dateInput, 'DD/MM/YYYY');

        const daysDifference = today.diff(inputDate, 'day');

        return daysDifference;
    };
    const daysDifference = tinhKhoangCach(dateInput);
    if (daysDifference >= 0) {
        return <Tag className='!mx-auto w-fit' icon={<CloseCircleOutlined />} color="error"> Hết hạn</Tag>
    }
    return <Tag className='!mx-auto w-fit' icon={<ClockCircleOutlined />} color="success">Còn hiệu lực</Tag>
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }


export { checkThoiHan, formatDate };