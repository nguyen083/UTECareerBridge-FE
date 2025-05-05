import { Card, Divider, Flex, List, Typography, Tag, Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import Lable from '../../constant/Lable';
import './JobCard.scss';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';
import { MdOutlineCalendarMonth } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
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
    const { t } = useTranslation();
    const handleClick = (key) => {
        setSelectedJob(key);
    };
    
    // Format deadline to display time remaining
    const getDeadlineDisplay = () => {
        if (!job.jobDeadline) return <Tag color="default">{t('job.noDeadline', 'Không có hạn')}</Tag>;
        
        const deadline = dayjs(job.jobDeadline);
        const today = dayjs();
        const daysLeft = deadline.diff(today, 'day');
        
        if (daysLeft <= 0) {
            return <Tag color="error">{t('job.expired', 'Hết hạn')}</Tag>;
        } else if (daysLeft <= 3) {
            return <Tag color="warning">{daysLeft} {t('job.daysLeft', 'ngày còn lại')}</Tag>;
        } else {
            return <Tag color="processing">{dayjs(job.jobDeadline).format('DD/MM/YYYY')}</Tag>;
        }
    };
    
    // Handle missing company data
    const companyLogo = job.employerResponse?.companyLogo || 'https://via.placeholder.com/100';
    const companyName = job.employerResponse?.companyName || t('common.unknownCompany', 'Công ty không xác định');
    
    return (
        <div className="job-card-large-applicant" onClick={() => handleClick(job.jobId)}>
            <Flex align="center" gap={16}>
                <div className="company-logo-container">
                    <img
                        src={companyLogo}
                        alt={companyName}
                        className="company-logo"
                        onError={(e) => {e.target.src = 'https://via.placeholder.com/100'; e.target.onerror = null;}}
                    />
                </div>
                
                <div className="job-content">
                    <Flex justify="space-between" align="center" className="job-header">
                        <Title level={5} className="job-title">{job.jobTitle || t('common.untitledJob', 'Chưa có tiêu đề')}</Title>
                        {job.totalApplicant > 0 && (
                            <Badge 
                                count={job.totalApplicant} 
                                className="job-applicants"
                                overflowCount={99} 
                                title={`${job.totalApplicant} ${t('employer.applicant.listJob.applicants', 'ứng viên')}`}
                            />
                        )}
                    </Flex>
                    
                    <div className="company-name">
                        <IoIosBusiness className="icon" />
                        <Text>{companyName}</Text>
                    </div>
                    
                    <Flex wrap="wrap" gap={24} className="job-details">
                        <Flex align="center" className="job-detail-item">
                            <FaRegMoneyBillAlt className="icon salary-icon" />
                            <Text>
                                {typeof job?.jobMinSalary === 'string' ? job.jobMinSalary : '0'} - {typeof job?.jobMaxSalary === 'string' ? job.jobMaxSalary.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 VND'}/{t('common.month', 'tháng')}
                            </Text>
                        </Flex>
                        
                        <Flex align="center" className="job-detail-item">
                            <FaMapLocationDot className="icon location-icon" />
                            <Text>{job.jobLocation || t('common.noLocation', 'Không có địa điểm')}</Text>
                        </Flex>
                        
                        <Flex align="center" className="job-detail-item">
                            <MdOutlineCalendarMonth className="icon" />
                            {getDeadlineDisplay()}
                        </Flex>
                    </Flex>
                    
                    <Flex gap={8} className="job-skills" wrap="wrap">
                        {job.skillResponses && job.skillResponses.length > 0 ? (
                            <>
                                {job.skillResponses.slice(0, 3).map((skill, index) => (
                                    <Tag key={index} color="blue">{skill.skillName}</Tag>
                                ))}
                                {job.skillResponses.length > 3 && (
                                    <Tag>+{job.skillResponses.length - 3}</Tag>
                                )}
                            </>
                        ) : (
                            <Tag color="default">{t('common.noSkills', 'Không có kỹ năng')}</Tag>
                        )}
                    </Flex>
                </div>
            </Flex>
        </div>
    );
}
export { JobCardSmall, JobCardLarge, JobCardLargeApplicant };
