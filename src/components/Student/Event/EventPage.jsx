import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Tag,
  Space,
  Select,
  Pagination,
  Empty,
  Skeleton,
  Flex,
  message,
} from "antd";
import { CalendarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import { getAllEvent } from "../../../services/apiService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaFilter } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const EventPage = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [eventType, setEventType] = useState(searchParams.get("eventType"));
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 8;
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const params = {
        page: page - 1,
        size: size,
        eventType: eventType,
      };

      await getAllEvent(params)
        .then((res) => {
          if (res.status === "OK") {
            setEvents(res.data.eventResponses);
            setTotal(res.data.totalPages);
          } else {
            message.error(res.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi tải sự kiện:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchEvents();
  }, [searchParams]);

  const handlePageChange = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  const handleSizeChange = (current, size) => {
    searchParams.set("size", size);
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const handleEventTypeChange = (value) => {
    setEventType(value);
    if (value) {
      searchParams.set("eventType", value);
    } else {
      searchParams.delete("eventType");
    }
    searchParams.set("page", 1);
    setSearchParams(searchParams);
  };

  const showEventDetails = (event) => {
    console.log(event);
    navigate(`/event-detail/${event?.eventId}`);
  };

  return (
    <div className="p-6 bg-gray-100">
      <Flex className="mb-6" justify="space-between" align="center">
        <BoxContainer width="100%">
          <Flex justify="space-between" align="center">
            <div className="title1">{t("student.event.title")}</div>
            <Select
              size="large"
              allowClear
              style={{ width: 200 }}
              placeholder={t("student.event.filterByType")}
              onChange={handleEventTypeChange}
              value={eventType}
              prefix={<FaFilter color="#1E4F94" style={{ marginRight: 8 }} />}
            >
              <Select.Option value="SEMINAR">
                {t("student.event.eventTypes.seminar")}
              </Select.Option>
              <Select.Option value="CONFERENCE">
                {t("student.event.eventTypes.conference")}
              </Select.Option>
              <Select.Option value="WORKSHOP">
                {t("student.event.eventTypes.workshop")}
              </Select.Option>
              <Select.Option value="CAREER_FAIR">
                {t("student.event.eventTypes.careerFair")}
              </Select.Option>
              <Select.Option value="WEBINAR">
                {t("student.event.eventTypes.webinar")}
              </Select.Option>
            </Select>
          </Flex>
        </BoxContainer>
      </Flex>

      <BoxContainer width="100%">
        {/* Danh sách sự kiện */}
        {loading ? (
          <Row gutter={[16, 16]}>
            {[...Array(4)].map((_, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6}>
                <Skeleton active />
              </Col>
            ))}
          </Row>
        ) : events.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {events.map((event) => (
                <Col key={event?.eventId} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="bg-opacity-50 border-2 bg-blue-50"
                    bordered={true}
                    onClick={() => showEventDetails(event)}
                    hoverable
                    cover={
                      <img
                        alt={event.eventTitle}
                        src={event.eventImage}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <Text className="text-text-color">
                          {event.eventTitle}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" className="w-full">
                          <Text className="text-gray-400">
                            <CalendarOutlined /> {event.eventDate}
                          </Text>
                          <Text className="text-primary">
                            <EnvironmentOutlined /> {event.eventLocation}
                          </Text>
                          <Flex justify="space-between">
                            <Tag color="blue">{event?.eventType}</Tag>
                          </Flex>
                        </Space>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Phân trang */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={page}
                pageSize={size}
                total={total * size}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["8", "16", "24"]}
                onShowSizeChange={handleSizeChange}
              />
            </div>
          </>
        ) : (
          <Empty description={t("student.event.noEvents")} />
        )}
      </BoxContainer>
    </div>
  );
};

export default EventPage;
