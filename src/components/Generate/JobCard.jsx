import { Card, Divider, Flex, List, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import Lable from "../../constant/Lable";
import "./JobCard.scss";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegMoneyBillAlt } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { useTranslation } from "react-i18next";
const { Text, Title, Paragraph } = Typography;

const JobCardSmall = ({ job }) => {
  const navigate = useNavigate();
  const handleClick = (key) => {
    navigate("/job/" + key);
  };
  const { t } = useTranslation();
  return (
    <div className="job-card-small">
      <List.Item className="flex items-start justify-between max-w-full p-3 overflow-hidden rounded-md shadow item-company">
        <List.Item.Meta
          style={{ cursor: "pointer" }}
          onClick={() => handleClick(job.jobId)}
          className="flex items-center w-full meta-description"
          avatar={
            <img
              src={job.employerResponse.companyLogo}
              className="h-20 !w-20 rounded mr-3 max-w-fit"
            />
          }
          description={
            <div>
              <Title
                level={5}
                className="w-full limit-text"
                ellipsis={{ tooltip: true, rows: 2 }}
              >
                {job.jobTitle}
              </Title>
              <Flex gap={5}>
                <IoIosBusiness size={18} />
                <Text className="text-sm limit-text">
                  {job.employerResponse.companyName}
                </Text>
              </Flex>

              <Flex
                align="center"
                gap={5}
                style={{ color: "#ff4d4f", fontSize: 14, margin: "8px 0" }}
              >
                <FaRegMoneyBillAlt size={18} />
                {job?.jobMinSalary?.toLocaleString("vi-VN")} -{" "}
                {job?.jobMaxSalary?.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}{" "}
                <div style={{ fontSize: 14 }}>{t("common.month")}</div>
              </Flex>
              <Flex gap={5}>
                <Text type="secondary">
                  <FaMapLocationDot size={18} />
                </Text>
                <Paragraph type="secondary limit-text mb-0">
                  {" "}
                  {job.jobLocation}
                </Paragraph>
              </Flex>
            </div>
          }
        />
        {/* <HeartOutlined /> */}
      </List.Item>
    </div>
  );
};
const JobCardLarge = ({ job, disable = false }) => {
  const navigate = useNavigate();
  const handleClick = (key) => {
    if (disable) return;
    else {
      navigate("/job/" + key);
    }
  };

  return (
    <Card
      onClick={() => handleClick(job.jobId)}
      className="w-full overflow-hidden job-card-large rounded-xl"
    >
      <Flex align="center" className="w-full">
        <img
          src={job.employerResponse.companyLogo}
          style={{ width: 100, height: 100, borderRadius: 4, marginRight: 12 }}
        />
        <div className="w-full">
          <Title
            level={5}
            className="flex items-center justify-between w-full cursor-pointer"
          >
            {job.jobTitle} {Lable(job.packageId)}
          </Title>
          <Paragraph className="flex items-center" type="secondary">
            <IoIosBusiness /> &ensp;
            {job.employerResponse.companyName}
          </Paragraph>
          <Flex align="center">
            <Flex
              align="center"
              gap={3}
              style={{ color: "#ff4d4f", fontSize: 14 }}
            >
              <FaRegMoneyBillAlt size={16} />
              &ensp;
              {job?.jobMinSalary} - {job?.jobMaxSalary}
            </Flex>
            <Divider type="vertical" />
            <Text className="flex items-center" type="secondary">
              <FaMapLocationDot />
              &ensp;
              {job.jobLocation}
            </Text>
          </Flex>
        </div>
      </Flex>
    </Card>
  );
};

const JobCardLargeApplicant = ({ job, setSelectedJob }) => {
  const handleClick = (key) => {
    setSelectedJob(key);
  };
  return (
    <div style={{ cursor: "pointer" }} onClick={() => handleClick(job.jobId)}>
      <div>
        <JobCardLarge job={job} disable={true} />
      </div>
    </div>
  );
};
export { JobCardSmall, JobCardLarge, JobCardLargeApplicant };
