"use client"

import { useState } from "react"
import { Calendar, Badge, Button, Modal, Card, Spin, Flex } from "antd"
import { VideoCameraOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { useListInterviewEmployer } from "../../../composables/interview"
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/vi';
import './InterviewList.scss'

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('vi');

const InterviewCalendar = () => {
  const { data: interviewsData, isLoading } = useListInterviewEmployer();
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState(null)

  const formatInterviewData = (data) => {
    if (!data || !data.data || !data.data.content) return [];
    return data.data.content.map(interview => {
      const parsedUtc = dayjs.utc(interview.scheduleDate, 'DD/MM/YYYY HH:mm:ss');
      const vietnamTime = parsedUtc.tz('Asia/Ho_Chi_Minh');
      const formattedDate = vietnamTime.format('DD/MM/YYYY HH:mm:ss');
      
      return {
        interview_id: interview.interviewId,
        schedule_date: formattedDate,
        duration: interview.duration,
        meeting_link: interview.meetingLink,
        status: interview.status.toLowerCase(),
        candidate_name: interview.studentName,
      };
    });
  };

  const interviews = formatInterviewData(interviewsData);

  const handleStartInterview = (interview) => {
    setSelectedInterview(interview)
    setIsModalVisible(true)
  }

  const joinMeeting = () => {
    if (selectedInterview) {
      window.open(selectedInterview.meeting_link, "_blank")
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "#1890ff" 
      case "in_progress":
        return "#fa8c16" 
      case "completed":
        return "#52c41a" 
      default:
        return "#d9d9d9" 
    }
  }

  const getStatusBgClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-[#1890ff]" 
      case "in_progress":
        return "bg-[#fa8c16]" 
      case "completed":
        return "bg-[#52c41a]" 
      default:
        return "bg-[#d9d9d9]" 
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "scheduled":
        return "Scheduled"
      case "in_progress":
        return "In Progress"
      case "completed":
        return "Completed"
      default:
        return status
    }
  }

  const getInterviewsForDate = (date) => {
    if (!interviews) return [];
    
    return interviews.filter((interview) => {
      const interviewDate = dayjs(interview.schedule_date, 'DD/MM/YYYY HH:mm:ss').utcOffset(7);
      return (
        interviewDate.date() === date.date() &&
        interviewDate.month() === date.month() &&
        interviewDate.year() === date.year()
      )
    })
  }

  // Custom calendar cell renderer
  const dateCellRender = (value) => {
    const dayInterviews = getInterviewsForDate(value)

    return (
      <ul className="p-0 m-0 list-none events">
        {dayInterviews.map((interview) => {
          return (
            <li key={interview.interview_id} className="mb-1">
              <Card
                className={`interview-card p-0 rounded cursor-pointer border-none shadow-sm text-white ${getStatusBgClass(interview.status)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartInterview(interview);
                }}
              >
                <div className="flex flex-col justify-between min-h-[60px]">
                  <div className="text-xs font-bold pb-1.5">
                    {dayjs(interview.schedule_date,'DD/MM/YYYY HH:mm:ss').utcOffset(7).format("h:mm")} - {dayjs(interview.schedule_date,'DD/MM/YYYY HH:mm:ss').utcOffset(7).add(interview.duration, 'minute').format("h:mm")}
                  </div>
                  <div className="text-sm font-medium mt-1.5">
                    {interview.candidate_name}
                  </div>
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
    )
  }

  // Custom month cell renderer
  const monthCellRender = (value) => {
    if (!interviews) return null;
    
    const monthInterviews = interviews.filter((interview) => {
      const interviewDate = dayjs(interview.schedule_date, 'DD/MM/YYYY HH:mm:ss').utcOffset(7);
      return interviewDate.month() === value.month() && interviewDate.year() === value.year()
    })

    const statusCounts = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
    }

    monthInterviews.forEach((interview) => {
      statusCounts[interview.status]++
    })

    return (
      <div className="p-2">
        <p>Total: {monthInterviews.length} interviews</p>
        <ul className="p-0 list-none">
          <li>
            <Badge color="#1890ff" text={`Scheduled: ${statusCounts.scheduled}`} />
          </li>
          <li>
            <Badge color="#fa8c16" text={`In Progress: ${statusCounts.in_progress}`} />
          </li>
          <li>
            <Badge color="#52c41a" text={`Completed: ${statusCounts.completed}`} />
          </li>
        </ul>
      </div>
    )
  }

  // Handle calendar date selection
  const onSelect = (date) => {
    const dayInterviews = getInterviewsForDate(date)
    if (dayInterviews.length > 0) {
      setSelectedInterview(dayInterviews[0])
      setIsModalVisible(true)
    }
  }

  // Get summary counts
  const getStatusCounts = () => {
    if (!interviews) return { scheduled: 0, in_progress: 0, completed: 0 };
    
    const counts = {
      scheduled: 0,
      in_progress: 0,
      completed: 0,
    }

    interviews.forEach((interview) => {
      counts[interview.status]++
    })

    return counts
  }

  const statusCounts = getStatusCounts()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Spin size="large" />
      </div>
    );
  }

  const getBadgeStyle = (color) => {
    return { backgroundColor: color };
  }

  return (
    <div className="p-6 interview-calendar">
      <Card>
        <div className="flex items-center justify-end mb-4">
          <Flex gap={16}>
            <Badge count={statusCounts.scheduled} style={getBadgeStyle("#1890ff")}>
              <Button type="primary" icon={<ClockCircleOutlined />} className="mr-2">
                Scheduled
              </Button>
            </Badge>
            <Badge count={statusCounts.in_progress} style={getBadgeStyle("#fa8c16")}>
              <Button type="default" icon={<VideoCameraOutlined />} className="mr-2">
                In Progress
              </Button>
            </Badge>
            <Badge count={statusCounts.completed} style={getBadgeStyle("#52c41a")}>
              <Button type="default" icon={<CheckCircleOutlined />}>
                Completed
              </Button>
            </Badge>
          </Flex>
        </div>

        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} onSelect={onSelect} />
      </Card>

      <Modal
        centered
        title={selectedInterview ? getStatusText(selectedInterview.status) + " Interview" : "Interview Details"}
        open={isModalVisible}
        onOk={
          selectedInterview && selectedInterview.status !== "completed" ? joinMeeting : () => setIsModalVisible(false)
        }
        onCancel={() => setIsModalVisible(false)}
        okText={selectedInterview && selectedInterview.status !== "completed" ? "Start Interview" : "OK"}
        okButtonProps={{
          type: selectedInterview && selectedInterview.status === "in_progress" ? "primary" : "default",
          danger: selectedInterview && selectedInterview.status === "in_progress",
        }}
        cancelText="Cancel"
      >
        {selectedInterview && (
          <div>
            <p>
              <strong>Candidate:</strong> {selectedInterview.candidate_name}
            </p>
            <p>
              <strong>Schedule:</strong> {dayjs(selectedInterview.schedule_date,'DD/MM/YYYY HH:mm:ss').utcOffset(7).format("DD/MM/YYYY HH:mm:ss")}
            </p>
            <p>
              <strong>Duration:</strong> {selectedInterview.duration} minutes
            </p>
            <p>
              <strong>Meeting Link:</strong>{" "}
              <a className="hover:underline" href={selectedInterview.meeting_link} target="_blank" rel="noopener noreferrer">
                {selectedInterview.meeting_link}
              </a>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge color={getStatusColor(selectedInterview.status)} text={getStatusText(selectedInterview.status)} />
            </p>
            {selectedInterview.status === "in_progress" && (
              <Button
                type="primary"
                danger
                icon={<VideoCameraOutlined />}
                onClick={joinMeeting}
                className="mt-4"
              >
                Join Interview
              </Button>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InterviewCalendar
