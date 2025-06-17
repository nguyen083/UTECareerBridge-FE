import { Tag } from "antd";
import { useTranslation } from "react-i18next";
const Status = ({ status }) => {
  const { t } = useTranslation();
  switch (status) {
    case "PENDING":
      return (
        <Tag className="!mx-auto w-fit" color="default">
          {t("student.myJobs.pending")}
        </Tag>
      );
    case "VIEWED":
      return (
        <Tag className="!mx-auto w-fit" color="blue">
          {t("student.myJobs.viewed")}
        </Tag>
      );
    case "APPROVED":
      return (
        <Tag className="!mx-auto w-fit" color="success">
          {t("student.myJobs.approved")}
        </Tag>
      );
    case "REJECTED":
      return (
        <Tag className="!mx-auto w-fit" color="error">
          {t("student.myJobs.rejected")}
        </Tag>
      );
    case "HIRED":
      return (
        <Tag className="!mx-auto w-fit" color="success">
          {t("student.myJobs.hired")}
        </Tag>
      );
    default:
      return (
        <Tag className="!mx-auto w-fit" color="default">
          {t("student.myJobs.unidentified")}
        </Tag>
      );
  }
};

export default Status;
