import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const checkThoiHan = ({ dateInput }) => {
  const tinhKhoangCach = (dateInput) => {
    const today = dayjs();
    const inputDate = dayjs(dateInput, "DD/MM/YYYY");

    const daysDifference = today.diff(inputDate, "day");

    return daysDifference;
  };
  const daysDifference = tinhKhoangCach(dateInput);
  if (daysDifference >= 0) {
    return (
      <Tag
        className="!mx-auto w-fit"
        icon={<CloseCircleOutlined />}
        color="error"
      >
        {" "}
        Hết hạn
      </Tag>
    );
  }
  return (
    <Tag
      className="!mx-auto w-fit"
      icon={<ClockCircleOutlined />}
      color="success"
    >
      Còn hiệu lực
    </Tag>
  );
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getTimeAgo = (date) => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return { key: "common.today" };
  } else if (diffDays === 1) {
    return { key: "common.yesterday" };
  } else if (diffDays < 7) {
    return { key: "common.daysAgo", value: diffDays };
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return {
      key: weeks === 1 ? "common.weekAgo" : "common.weeksAgo",
      value: weeks,
    };
  } else {
    const months = Math.floor(diffDays / 30);
    return {
      key: months === 1 ? "common.monthAgo" : "common.monthsAgo",
      value: months,
    };
  }
};

export { checkThoiHan, formatDate, formatDateTime, getTimeAgo };
