"use client";

import { useState } from "react";
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const formatInterviewData = (data) => {
    if (!data || !data.data || !data.data.content) return [];
    return data.data.content.map((interview) => {
      const parsedUtc = dayjs.utc(
        interview.scheduleDate,
        "DD/MM/YYYY HH:mm:ss"
      );
      const vietnamTime = parsedUtc.tz("Asia/Ho_Chi_Minh");
      const formattedDate = vietnamTime.format("DD/MM/YYYY HH:mm:ss");

      return {
        interview_id: interview.interviewId,
        schedule_date: formattedDate,
        duration: interview.duration,
        meeting_link: interview.meetingLink,
        status: interview.status.toLowerCase(),
        candidate_name: interview.studentName,
        job_title: interview.jobTitle || "Job Position",
        candidate_avatar: interview.studentAvatar,
        position: interview.position || "Position",
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
        return "Scheduled";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
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
          Total: {monthInterviews.length} interviews
        </p>
        <ul className="p-0 list-none">
          <li>
            <Badge
              color="#1890ff"
              text={`Scheduled: ${statusCounts.scheduled}`}
            />
          </li>
          <li>
            <Badge
              color="#fa8c16"
              text={`In Progress: ${statusCounts.in_progress}`}
            />
          </li>
          <li>
            <Badge
              color="#52c41a"
              text={`Completed: ${statusCounts.completed}`}
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
      title: "Candidate",
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
      title: "Job Position",
      dataIndex: "job_title",
      key: "job_title",
      render: (text) => <Text ellipsis={{ tooltip: text }}>{text}</Text>,
    },
    {
      title: "Schedule Date",
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
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (text) => (
        <Flex align="center" gap={6}>
          <FieldTimeOutlined />
          <Text>{text} min</Text>
        </Flex>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
      filters: [
        { text: "Scheduled", value: "scheduled" },
        { text: "In Progress", value: "in_progress" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Action",
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
            {record.status === "in_progress" ? "Join Now" : "Details"}
          </Button>
        </Space>
      ),
    },
  ];

  const renderCalendarView = () => (
    <div className="p-6 interview-calendar">
      <Flex className="flex-wrap items-center justify-between gap-4 mb-4">
        <Title level={4} className="m-0">
          Interview Calendar
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
              Scheduled
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
              In Progress
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
              Completed
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
          Interview Schedule
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
              Scheduled
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
              In Progress
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
              Completed
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
            description="No interviews scheduled"
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
        centered
        title={
          selectedInterview
            ? getStatusText(selectedInterview.status) + " Interview"
            : "Interview Details"
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
            ? "Start Interview"
            : "OK"
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
        cancelText="Close"
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
                    {selectedInterview.position || "Candidate"} •{" "}
                    {selectedInterview.job_title}
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
                    Schedule Time
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
                    Duration
                  </Text>
                  <Text>{selectedInterview.duration} minutes</Text>
                </div>
              </Flex>

              <Flex align="center" gap={12}>
                <VideoCameraOutlined className="text-lg text-purple-500" />
                <div>
                  <Text strong className="block">
                    Meeting Link
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
                Join Interview Now
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InterviewCalendar;
