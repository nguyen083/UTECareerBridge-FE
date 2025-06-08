"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Calendar,
  Badge,
  Button,
  Modal,
  Card,
  Spin,
  Flex,
  Table,
  Tag,
  Typography,
  Space,
  Empty,
} from "antd";
import {
  VideoCameraOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  FieldTimeOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { useListInterviewEmployer } from "../../../composables/interview";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/vi";
import "./InterviewList.scss";

const { Text, Title } = Typography;

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale("vi");

const InterviewCalendar = ({ viewMode = "calendar" }) => {
  const { data: interviewsData, isLoading } = useListInterviewEmployer();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const formatInterviewData = (data) => {
    console.log(data);
    if (!data?.content) return [];
    return data?.content.map((interview) => {
      return {
        interview_id: interview.interviewId,
        schedule_date: interview.scheduleDate,
        duration: interview.duration,
        meeting_link: interview.meetingLink,
        status: interview.status.toLowerCase(),
        candidate_name: interview.studentName,
        job_title: interview.jobTitle || t("employer.job.title"),
        job_id: interview.jobId, // Thêm job_id để sử dụng cho trang đánh giá
        candidate_avatar: interview.studentAvatar,
        position:
          interview.position || t("employer.applicant.viewDetail.position"),
        key: interview.interviewId, // For table component
      };
    });
  };

  const interviews = formatInterviewData(interviewsData);

  const handleStartInterview = (interview) => {
    interview.meeting_link =
      interview.meeting_link + "?interviewId=" + interview.interview_id;
    setSelectedInterview(interview);
    setIsModalVisible(true);
  };

  const joinMeeting = () => {
    if (selectedInterview) {
      window.open(selectedInterview.meeting_link, "_blank");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#1890ff";
      case "in_progress":
        return "#fa8c16";
      case "completed":
        return "#52c41a";
      default:
        return "#d9d9d9";
    }
  };

  const getStatusBgClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-[#e6f7ff]";
      case "in_progress":
        return "bg-[#fff7e6]";
      case "completed":
        return "bg-[#f6ffed]";
      default:
        return "bg-[#f5f5f5]";
    }
  };

  const getBorderClass = (status) => {
    switch (status) {
      case "scheduled":
        return "border-l-[3px] border-l-[#1890ff]";
      case "in_progress":
        return "border-l-[3px] border-l-[#fa8c16]";
      case "completed":
        return "border-l-[3px] border-l-[#52c41a]";
      default:
        return "border-l-[3px] border-l-[#d9d9d9]";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return t("employer.interview.scheduled");
      case "in_progress":
        return t("employer.interview.in_progress");
      case "completed":
        return t("employer.interview.completed");
      default:
        return status;
    }
  };

  const getInterviewsForDate = (date) => {
    if (!interviews) return [];

    return interviews.filter((interview) => {
      const interviewDate = dayjs(
        interview.schedule_date,
        "DD/MM/YYYY HH:mm:ss"
      ).utcOffset(7);
      return (
        interviewDate.date() === date.date() &&
        interviewDate.month() === date.month() &&
        interviewDate.year() === date.year()
      );
    });
  };

  // Custom calendar cell renderer
  const dateCellRender = (value) => {
    const dayInterviews = getInterviewsForDate(value);
    if (dayInterviews.length === 0) return null;

    return (
      <ul className="p-0 m-0 list-none events">
        {dayInterviews.map((interview) => {
          return (
            <li key={interview.interview_id} className="mb-1">
              <Card
                className={`interview-card rounded cursor-pointer ${getStatusBgClass(
                  interview.status
                )} ${getBorderClass(
                  interview.status
                )} shadow-sm transition-all duration-300 hover:shadow-md`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartInterview(interview);
                }}
              >
                <Flex className="flex-col justify-between min-h-[60px]">
                  <Flex align="center" justify="space-between">
                    <Text className="text-xs font-medium">
                      {dayjs(interview.schedule_date, "DD/MM/YYYY HH:mm:ss")
                        .utcOffset(7)
                        .format("HH:mm")}
                    </Text>
                    <Tag
                      color={getStatusColor(interview.status)}
                      className="m-0"
                    >
                      {getStatusText(interview.status)}
                    </Tag>
                  </Flex>
                  <Text
                    className="mt-1 text-sm font-medium line-clamp-2"
                    ellipsis={{ tooltip: interview.candidate_name }}
                  >
                    {interview.candidate_name}
                  </Text>
                  <Text
                    type="secondary"
                    className="text-xs mt-0.5 line-clamp-1"
                    ellipsis={{ tooltip: interview.job_title }}
                  >
                    {interview.job_title}
                  </Text>
                </Flex>
              </Card>
            </li>
          );
        })}
      </ul>
    );
  };

  // Custom month cell renderer
  const monthCellRender = (value) => {
    if (!interviews) return null;

    const monthInterviews = interviews.filter((interview) => {
      const interviewDate = dayjs(
        interview.schedule_date,
        "DD/MM/YYYY HH:mm:ss"
      ).utcOffset(7);
      return (
        interviewDate.month() === value.month() &&
        interviewDate.year() === value.year()
      );
    });

    const statusCounts = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
    };

    monthInterviews.forEach((interview) => {
      statusCounts[interview.status]++;
    });

    return (
      <div className="p-2">
        <p className="font-medium">
          {t("common.total")}: {monthInterviews.length}{" "}
          {t("employer.interview.interviews")}
        </p>
        <ul className="p-0 list-none">
          <li>
            <Badge
              color="#1890ff"
              text={`${t("employer.interview.scheduled")}: ${
                statusCounts.scheduled
              }`}
            />
          </li>
          <li>
            <Badge
              color="#fa8c16"
              text={`${t("employer.interview.in_progress")}: ${
                statusCounts.in_progress
              }`}
            />
          </li>
          <li>
            <Badge
              color="#52c41a"
              text={`${t("employer.interview.completed")}: ${
                statusCounts.completed
              }`}
            />
          </li>
        </ul>
      </div>
    );
  };

  // Handle calendar date selection
  const onSelect = (date) => {
    const dayInterviews = getInterviewsForDate(date);
    if (dayInterviews.length > 0) {
      setSelectedInterview(dayInterviews[0]);
      setIsModalVisible(true);
    }
  };

  // Get summary counts
  const getStatusCounts = () => {
    if (!interviews) return { scheduled: 0, in_progress: 0, completed: 0 };

    const counts = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
    };

    interviews.forEach((interview) => {
      counts[interview.status]++;
    });

    return counts;
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Spin size="large" />
      </div>
    );
  }

  const getBadgeStyle = (color) => {
    return { backgroundColor: color };
  };

  // Table columns for list view
  const columns = [
    {
      title: t("employer.applicant.viewDetail.candidate"),
      dataIndex: "candidate_name",
      key: "candidate_name",
      render: (text, record) => (
        <Flex align="center" gap={8}>
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            {record.candidate_avatar ? (
              <img
                src={record.candidate_avatar}
                alt={text}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <UserOutlined />
            )}
          </div>
          <Text strong>{text}</Text>
        </Flex>
      ),
    },
    {
      title: t("employer.interview.schedule_time"),
      dataIndex: "schedule_date",
      key: "schedule_date",
      render: (text) => (
        <Flex align="center" gap={6}>
          <CalendarOutlined />
          <Text>
            {dayjs(text, "DD/MM/YYYY HH:mm:ss").format("DD/MM/YYYY HH:mm")}
          </Text>
        </Flex>
      ),
      sorter: (a, b) => {
        return (
          dayjs(a.schedule_date, "DD/MM/YYYY HH:mm:ss").unix() -
          dayjs(b.schedule_date, "DD/MM/YYYY HH:mm:ss").unix()
        );
      },
    },
    {
      title: t("employer.interview.duration"),
      dataIndex: "duration",
      key: "duration",
      render: (text) => (
        <Flex align="center" gap={6}>
          <FieldTimeOutlined />
          <Text>
            {text} {t("common.minutes")}
          </Text>
        </Flex>
      ),
    },
    {
      title: t("employer.orders.status"),
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag className="w-fit" color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: t("employer.interview.scheduled"), value: "scheduled" },
        { text: t("employer.interview.in_progress"), value: "in_progress" },
        { text: t("employer.interview.completed"), value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t("common.actions"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type={record.status === "in_progress" ? "primary" : "default"}
            icon={<VideoCameraOutlined />}
            size="small"
            disabled={record.status === "completed"}
            onClick={() => handleStartInterview(record)}
          >
            {record.status === "in_progress"
              ? t("meeting.join_link")
              : t("common.join")}
          </Button>
          {record.job_id && (
            <Button
              icon={<FileSearchOutlined />}
              size="small"
              onClick={() =>
                navigate(`/employer/interview/evaluations/job/${record.job_id}`)
              }
            >
              {t("employer.interview.view_evaluations")}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const renderCalendarView = () => (
    <div className="p-6 interview-calendar">
      <Flex className="flex-wrap items-center justify-between gap-4 mb-4">
        <Title level={4} className="m-0">
          {t("employer.interview.interview_calendar")}
        </Title>
        <Flex gap={16}>
          <Badge
            count={statusCounts.scheduled}
            style={getBadgeStyle("#1890ff")}
          >
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              className="mr-2 bg-[#e6f7ff] border-[#91caff]"
            >
              {t("employer.interview.scheduled")}
            </Button>
          </Badge>
          <Badge
            count={statusCounts.in_progress}
            style={getBadgeStyle("#fa8c16")}
          >
            <Button
              type="default"
              icon={<VideoCameraOutlined />}
              className="mr-2 bg-[#fff7e6] border-[#ffcb8b]"
            >
              {t("employer.interview.in_progress")}
            </Button>
          </Badge>
          <Badge
            count={statusCounts.completed}
            style={getBadgeStyle("#52c41a")}
          >
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              className="bg-[#f6ffed] border-[#b7eb8f]"
            >
              {t("employer.interview.completed")}
            </Button>
          </Badge>
        </Flex>
      </Flex>
      <Card className="calendar-card">
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
          onSelect={onSelect}
          className="interview-calendar-component"
        />
      </Card>
    </div>
  );

  const renderListView = () => (
    <div className="p-6 interview-list">
      <Flex className="flex-wrap items-center justify-between gap-4 mb-4">
        <Title level={4} className="m-0">
          {t("employer.interview.interview_schedule")}
        </Title>
        <Flex gap={16}>
          <Badge
            count={statusCounts.scheduled}
            style={getBadgeStyle("#1890ff")}
          >
            <Button
              type="default"
              icon={<ClockCircleOutlined />}
              className="mr-2 bg-[#e6f7ff] border-[#91caff]"
            >
              {t("employer.interview.scheduled")}
            </Button>
          </Badge>
          <Badge
            count={statusCounts.in_progress}
            style={getBadgeStyle("#fa8c16")}
          >
            <Button
              type="default"
              icon={<VideoCameraOutlined />}
              className="mr-2 bg-[#fff7e6] border-[#ffcb8b]"
            >
              {t("employer.interview.in_progress")}
            </Button>
          </Badge>
          <Badge
            count={statusCounts.completed}
            style={getBadgeStyle("#52c41a")}
          >
            <Button
              type="default"
              icon={<CheckCircleOutlined />}
              className="bg-[#f6ffed] border-[#b7eb8f]"
            >
              {t("employer.interview.completed")}
            </Button>
          </Badge>
        </Flex>
      </Flex>

      {interviews && interviews.length > 0 ? (
        <Table
          columns={columns}
          dataSource={interviews}
          pagination={{ pageSize: 6 }}
          rowClassName={(record) =>
            `interview-row ${getStatusBgClass(record.status)}`
          }
          rowKey="interview_id"
        />
      ) : (
        <Card>
          <Empty
            description={t("employer.interview.no_interviews_scheduled")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      )}
    </div>
  );

  return (
    <div className="interview-container">
      {viewMode === "calendar" ? renderCalendarView() : renderListView()}

      <Modal
        closable={false}
        centered
        title={
          selectedInterview
            ? getStatusText(selectedInterview.status) +
              " " +
              t("employer.interview.interview")
            : t("employer.interview.interview_details")
        }
        open={isModalVisible}
        onOk={
          selectedInterview && selectedInterview.status !== "completed"
            ? joinMeeting
            : () => setIsModalVisible(false)
        }
        onCancel={() => setIsModalVisible(false)}
        okText={
          selectedInterview && selectedInterview.status !== "completed"
            ? t("employer.interview.start_interview")
            : t("employer.interview.ok")
        }
        okButtonProps={{
          type:
            selectedInterview && selectedInterview.status === "in_progress"
              ? "primary"
              : "default",
          danger:
            selectedInterview && selectedInterview.status === "in_progress",
          icon:
            selectedInterview && selectedInterview.status === "in_progress" ? (
              <VideoCameraOutlined />
            ) : null,
        }}
        cancelText={t("common.close")}
        className="interview-modal"
      >
        {selectedInterview && (
          <div>
            <Card
              className={`interview-detail-card mb-4 ${getStatusBgClass(
                selectedInterview.status
              )} ${getBorderClass(selectedInterview.status)}`}
            >
              <Flex align="center" justify="space-between">
                <div>
                  <Title level={5} className="mb-1">
                    {selectedInterview.candidate_name}
                  </Title>
                  <Text type="secondary">
                    {selectedInterview.position ||
                      t("employer.applicant.viewDetail.candidate")}{" "}
                    • {selectedInterview.job_title}
                  </Text>
                </div>
                <Tag
                  color={getStatusColor(selectedInterview.status)}
                  className="px-2 py-1 text-sm"
                >
                  {getStatusText(selectedInterview.status)}
                </Tag>
              </Flex>
            </Card>

            <Flex vertical gap={16}>
              <Flex align="center" gap={12}>
                <CalendarOutlined className="text-lg text-blue-500" />
                <div>
                  <Text strong className="block">
                    {t("employer.interview.schedule_time")}
                  </Text>
                  <Text>
                    {dayjs(
                      selectedInterview.schedule_date,
                      "DD/MM/YYYY HH:mm:ss"
                    )
                      .utcOffset(7)
                      .format("dddd, DD/MM/YYYY")}
                  </Text>
                  <Text className="block">
                    {dayjs(
                      selectedInterview.schedule_date,
                      "DD/MM/YYYY HH:mm:ss"
                    )
                      .utcOffset(7)
                      .format("HH:mm")}{" "}
                    -{" "}
                    {dayjs(
                      selectedInterview.schedule_date,
                      "DD/MM/YYYY HH:mm:ss"
                    )
                      .utcOffset(7)
                      .add(selectedInterview.duration, "minute")
                      .format("HH:mm")}
                  </Text>
                </div>
              </Flex>

              <Flex align="center" gap={12}>
                <FieldTimeOutlined className="text-lg text-green-500" />
                <div>
                  <Text strong className="block">
                    {t("employer.interview.duration")}
                  </Text>
                  <Text>
                    {selectedInterview.duration} {t("common.minutes")}
                  </Text>
                </div>
              </Flex>

              <Flex align="center" gap={12}>
                <VideoCameraOutlined className="text-lg text-purple-500" />
                <div>
                  <Text strong className="block">
                    {t("employer.interview.meeting_link")}
                  </Text>
                  <a
                    className="text-blue-500 hover:underline"
                    href={selectedInterview.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedInterview.meeting_link}
                  </a>
                </div>
              </Flex>
            </Flex>

            {selectedInterview.status === "in_progress" && (
              <Button
                type="primary"
                block
                danger
                icon={<VideoCameraOutlined />}
                onClick={joinMeeting}
                className="mt-6"
                size="large"
              >
                {t("employer.interview.join_interview_now")}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewCalendar;
