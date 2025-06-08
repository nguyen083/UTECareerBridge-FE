import { useState, useEffect } from "react";
import { List, Card, Flex, Typography, Empty, Tag, Skeleton } from "antd";
import { getAllJobEmployer } from "../../services/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosBusiness } from "react-icons/io";
import { FaMapLocationDot } from "react-icons/fa6";
import { FaRegMoneyBillAlt, FaRegClock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./JobList.scss";
import { getTimeAgo } from "../../utils/day";
import dayjs from "dayjs";

const { Title, Paragraph } = Typography;

const JobList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,
        limit: pageSize,
      };
      await getAllJobEmployer(id, params).then((res) => {
        if (res.status === "OK" && res.data) {
          const data = res.data.jobResponses.map((item) => {
            return {
              jobId: item.jobId,
              logo: item.employerResponse.companyLogo,
              title: item.jobTitle,
              company: item.employerResponse.companyName,
              jobMinSalary: item.jobMinSalary,
              jobMaxSalary: item.jobMaxSalary,
              rejectionReason: item.rejectionReason,
              jobLocation: item.jobLocation,
              createdAt: item.createdAt,
              isHot: item.isHot,
              isUrgent: item.isUrgent,
            };
          });

          setData(data);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.totalPages * pageSize,
          });
        }
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleListChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize,
    });
  };

  const formatTime = (time) => {
    const date = dayjs(time, "DD/MM/YYYY").toDate();
    const { key, value } = getTimeAgo(date);
    return t(key, { value });
  };

  const handleClick = (key) => {
    navigate("/jobs/" + key);
  };

  return (
    <div className="job-list-container">
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleListChange,
          showSizeChanger: true,
          className: "job-pagination",
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={t("student.layout.jobs.noJob")}
              className="empty-jobs"
            />
          ),
        }}
        renderItem={(item) => (
          <List.Item className="job-list-item">
            {loading ? (
              <Card className="job-card-skeleton">
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ) : (
              <Card
                hoverable
                className="job-card"
                bodyStyle={{ padding: 16 }}
                onClick={() => handleClick(item.jobId)}
              >
                <Flex align="center" className="job-content">
                  <div className="job-logo-container">
                    <img
                      src={item.logo}
                      alt={item.company}
                      className="job-logo"
                    />
                  </div>
                  <div className="job-details">
                    <Flex align="center" justify="space-between">
                      <div className="job-title-container">
                        <Title level={5} className="job-title">
                          {item.title}
                        </Title>
                        <Flex gap={8} className="job-tags">
                          {item.isHot && (
                            <Tag color="red" className="job-tag">
                              {t("common.hot")}
                            </Tag>
                          )}
                          {item.isUrgent && (
                            <Tag color="orange" className="job-tag">
                              {t("common.urgent")}
                            </Tag>
                          )}
                        </Flex>
                      </div>
                      <div className="job-time">
                        <FaRegClock /> {formatTime(item?.createdAt)}
                      </div>
                    </Flex>

                    <Paragraph className="company-name">
                      <IoIosBusiness /> {item.company}
                    </Paragraph>

                    <Flex align="center" className="job-salary">
                      <FaRegMoneyBillAlt />
                      <div>
                        {item?.jobMinSalary?.toLocaleString("vi-VN")} -{" "}
                        {item?.jobMaxSalary?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                    </Flex>

                    <Paragraph className="job-location">
                      <FaMapLocationDot /> {item.jobLocation}
                    </Paragraph>
                  </div>
                </Flex>
              </Card>
            )}
          </List.Item>
        )}
      />
    </div>
  );
};

export default JobList;
