import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  Alert,
  Layout,
  Typography,
  Card,
  Progress,
  Divider,
  Switch,
  Tooltip,
  Spin,
} from "antd";
import { useRecommendJob } from "../../../composables/job";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaPercentage } from "react-icons/fa";
import { AppstoreOutlined, BarsOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const RecommendJob = () => {
  const { t } = useTranslation();
  const userId = useSelector((state) => state.user.userId);
  const { data: recommendJob = [], isPending } = useRecommendJob(userId);
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list"); // 'grid' hoặc 'list'

  const formatSalary = (salary) => {
    if (!salary) return "0";

    // Nếu salary lớn hơn 1000 thì giả sử là VND, còn không thì là USD
    if (salary > 1000) {
      return new Intl.NumberFormat("vi-VN").format(salary) + " VND";
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(salary);
    }
  };

  const handleViewDetail = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Card hiển thị dạng lưới (grid)
  const renderGridCard = (job) => (
    <Card
      key={`grid-${job.job_id}`}
      hoverable
      className="h-full transition-all shadow-md cursor-pointer hover:shadow-lg"
      onClick={() => handleViewDetail(job.job_id)}
      cover={
        <div className="flex items-center justify-center h-32 p-4 bg-background-color">
          <img
            src={job.logo || "https://via.placeholder.com/150"}
            alt={job.company_name}
            className="object-contain max-h-full"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <Title level={5} className="!mb-1 line-clamp-2" title={job.job_title}>
          {job.job_title}
        </Title>
        <Text className="font-medium text-gray-700">{job.company_name}</Text>

        <div className="flex items-center text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-1" />
          <Text className="text-gray-600">{job.job_location}</Text>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FaMoneyBillWave className="mr-1" />
          <Text className="text-gray-600">
            {formatSalary(job.job_min_salary)} -{" "}
            {formatSalary(job.job_max_salary)}
          </Text>
        </div>

        <Divider className="my-2" />

        <div className="mb-2">
          <Text className="flex items-center text-sm text-gray-600">
            <FaPercentage className="mr-1" /> {t("cv.analysis.result.match")}:
          </Text>
          <Progress
            percent={Math.round(job.score * 100)}
            size="small"
            status="active"
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
          />
        </div>

        <Paragraph className="mb-3 text-xs italic text-gray-500">
          &ldquo;{job.reason}&rdquo;
        </Paragraph>
      </div>
    </Card>
  );

  // Card hiển thị dạng danh sách nằm ngang (list)
  const renderListCard = (job) => (
    <Card
      key={`list-${job.job_id}`}
      hoverable
      className="w-full mb-4 transition-all shadow-md cursor-pointer hover:shadow-lg"
      bodyStyle={{ padding: 0 }}
      onClick={() => handleViewDetail(job.job_id)}
    >
      <div className="flex flex-col md:flex-row">
        {/* Logo bên trái */}
        <div className="flex items-center justify-center h-32 p-4 bg-gray-50 md:w-48">
          <img
            src={job.logo || "https://via.placeholder.com/150"}
            alt={job.company_name}
            className="object-contain max-w-full max-h-full"
          />
        </div>

        {/* Thông tin bên phải */}
        <div className="flex-1 p-4">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="flex-1">
              <Title
                level={5}
                className="!mb-1 line-clamp-2"
                title={job.job_title}
              >
                {job.job_title}
              </Title>
              <Text className="font-medium text-gray-700">
                {job.company_name}
              </Text>

              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <FaMapMarkerAlt className="mr-1" />
                  <Text className="text-gray-600">{job.job_location}</Text>
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <FaMoneyBillWave className="mr-1" />
                  <Text className="text-gray-600">
                    {formatSalary(job.job_min_salary)} -{" "}
                    {formatSalary(job.job_max_salary)}
                  </Text>
                </div>
              </div>

              <Paragraph className="mt-2 text-xs italic text-gray-500">
                &ldquo;{job.reason}&rdquo;
              </Paragraph>
            </div>

            <div className="flex flex-col items-center justify-center mt-3 md:w-24 md:mt-0 md:ml-4">
              <Tooltip
                title={`${Math.round(job.score * 100)}% ${t(
                  "cv.analysis.result.match"
                )}`}
              >
                <Progress
                  type="circle"
                  percent={Math.round(job.score * 100)}
                  size={80}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <Layout>
      <Content>
        <BoxContainer className="shadow-lg" padding="40px">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Title
                level={3}
                className="text-2xl font-bold !text-text-color !mb-0"
              >
                {t("student.recommend.title")}
              </Title>
              <div className="flex items-center gap-2">
                <Text className="text-gray-500">
                  {viewMode === "grid" ? t("gridMode") : t("listMode")}
                </Text>
                <Switch
                  checkedChildren={<BarsOutlined />}
                  unCheckedChildren={<AppstoreOutlined />}
                  checked={viewMode === "list"}
                  onChange={(checked) => setViewMode(checked ? "list" : "grid")}
                  className="mr-2"
                />
              </div>
            </div>

            <Alert
              className="p-6"
              message={t("student.recommend.description")}
              type="info"
            />

            <Spin spinning={isPending} tip={t("common.loading")} size="large">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
                  {recommendJob &&
                  recommendJob.length > 0 &&
                  isPending === false ? (
                    recommendJob.map((job) => renderGridCard(job))
                  ) : (
                    <div className="py-8 text-center col-span-full">
                      <Text className="text-gray-500">
                        {t("student.dashboard.noRecommendedJobs")}
                      </Text>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4">
                  {recommendJob && recommendJob.length > 0 ? (
                    recommendJob.map((job) => renderListCard(job))
                  ) : (
                    <div className="py-8 text-center">
                      <Text className="text-gray-500">
                        {t("student.dashboard.noRecommendedJobs")}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </Spin>
          </div>
        </BoxContainer>
      </Content>
    </Layout>
  );
};

export default RecommendJob;
