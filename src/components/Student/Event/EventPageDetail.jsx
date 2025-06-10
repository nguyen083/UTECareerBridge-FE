import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Descriptions,
  Card,
  Avatar,
  Flex,
  Tooltip,
  Timeline,
  message,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ShareAltOutlined,
  FacebookFilled,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import HtmlContent from "../../Generate/HtmlContent";
import { useParams } from "react-router-dom";
import { getEventDetail } from "../../../services/apiService";
import "./EventPageDetail.scss";
import { FaDotCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const EventDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [eventDetail, setEventDetail] = useState({});
  const [timeline, setTimeline] = useState([]);

  const fetchEventDetail = () => {
    getEventDetail(id)
      .then((response) => {
        setEventDetail(response.data);
        setTimeline(
          response.data.timeline.map((item, index) => ({
            key: index,
            label: (
              <Text className="text-lg text-hightlight">
                {item.timelineStart}
              </Text>
            ),
            children: (
              <Tooltip
                destroyTooltipOnHide={true}
                color="#4478c0"
                title={
                  <Text style={{ color: "#ffffff" }} className="text-base">
                    {item.timelineDescription}
                  </Text>
                }
                placement="top"
              >
                <Text className="cursor-pointer text-title">
                  {item.timelineTitle}
                </Text>
              </Tooltip>
            ),
            dot: <FaDotCircle className="text-[19px]" />,
          }))
        );
      })
      .catch((error) => {
        console.error("Lỗi khi lấy chi tiết sự kiện:", error);
      });
  };

  useEffect(() => {
    fetchEventDetail();
  }, [id]);

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        message.success(t("student.event.detail.copySuccess"));
      })
      .catch((err) => {
        console.error(t("student.event.detail.copyError"), err);
      });
  };
  const handleSharetoFacebook = () => {
    const hashtag = `/&hashtag=%23${eventDetail.eventType}%0a%23UTECAREERBRIDGE%0a%23HCMUTE%0aTham%20gia%20ngay!`;
    const updatedUrl = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${updatedUrl}${hashtag}`,
      "_blank"
    );
  };

  return (
    <BoxContainer padding={"0"}>
      <div style={{ maxWidth: "100%", margin: "0 auto", padding: "24px" }}>
        {/* Ảnh sự kiện */}
        <img
          src={eventDetail.eventImage}
          alt={eventDetail.eventTitle}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "24px",
          }}
        />

        <Row gutter={[24, 24]}>
          {/* Thông tin chính */}
          <Col xs={24} md={16}>
            <Flex vertical gap={24} className="w-full">
              <Title level={2}>{eventDetail.eventTitle}</Title>

              {/* Thẻ loại sự kiện */}
              <Space>
                <Text strong style={{ color: "#91CAFF" }}>
                  {t("student.event.detail.hashtag")}
                </Text>{" "}
                <Tag color="blue" key={eventDetail.eventType}>
                  {eventDetail.eventType}
                </Tag>
              </Space>
              <Card
                title={
                  <Text className="text-lg text-hightlight">
                    {t("student.event.detail.eventDescription")}
                  </Text>
                }
                className="shadow"
              >
                {/* Mô tả sự kiện */}
                <HtmlContent htmlString={eventDetail.eventDescription} />
              </Card>

              {/* Chi tiết sự kiện */}
              <Card className="shadow">
                <Descriptions column={1}>
                  <Descriptions.Item
                    className="flex items-center"
                    label={
                      <Space className="text-hightlight">
                        <CalendarOutlined />{" "}
                        {t("student.event.detail.eventTime")}
                      </Space>
                    }
                  >
                    <Text className="text-title">{eventDetail.eventDate}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="flex items-center"
                    label={
                      <Space className="text-hightlight">
                        <EnvironmentOutlined />{" "}
                        {t("student.event.detail.eventLocation")}
                      </Space>
                    }
                  >
                    <Text className="text-title">
                      {eventDetail.eventLocation}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Chương trình sự kiện */}
              <Card
                size="large"
                title={
                  <Text className="text-lg text-hightlight">
                    {t("student.event.detail.eventProgram")}
                  </Text>
                }
                className=" card_box_shadow card_timeline"
              >
                <Space direction="vertical" size={24} style={{ width: "100%" }}>
                  <Timeline
                    className="custom-timeline"
                    mode="alternate"
                    items={timeline}
                  />
                </Space>
              </Card>
            </Flex>
          </Col>

          {/* Sidebar */}
          <Col xs={24} md={8}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              {/* Thông tin nhà tổ chức */}
              <Card className="shadow">
                <Card.Meta
                  avatar={
                    <Avatar
                      src="https://res.cloudinary.com/utejobhub/image/upload/v1731551121/student/ua3ccjvawfxkb1yqqirb.png"
                      size={64}
                    />
                  }
                  title={t("student.event.detail.organizer")}
                  description={
                    <>
                      <Text className="text-sm" strong>
                        {" "}
                        {t("student.event.detail.contactInfo")}
                      </Text>{" "}
                      <Text className="text-sm" type="secondary">
                        {" "}
                        support@student.hcmute.edu.vn
                      </Text>
                    </>
                  }
                />
              </Card>

              {/* Nút hành động */}
              <Space direction="vertical" style={{ width: "100%" }}>
                <Button
                  block
                  size="large"
                  icon={<ShareAltOutlined />}
                  onClick={handleShareClick}
                >
                  {t("student.event.detail.share")}
                </Button>
                <Button
                  block
                  size="large"
                  icon={<FacebookFilled />}
                  onClick={handleSharetoFacebook}
                >
                  {t("student.event.detail.shareToFacebook")}
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </div>
    </BoxContainer>
  );
};

export default EventDetail;
