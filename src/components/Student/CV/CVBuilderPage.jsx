import { useState, useEffect } from "react";
import "./CVBuilderPage.scss";
import {
  Typography,
  Button,
  Spin,
  Row,
  Col,
  Card,
  message,
  Tag,
  Empty,
  Badge,
  Modal,
} from "antd";
import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import CVBuilder from "./CVBuilder";
import PDFThumbnail from "./PDFThumbnail";
import { useTranslation } from "react-i18next";
import { getAllCV, deleteCV } from "../../../services/apiService";
import { useQueryClient } from "@tanstack/react-query";

const { Title, Text } = Typography;

const CVBuilderPage = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [existingCVs, setExistingCVs] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);

  useEffect(() => {
    fetchCVs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await getAllCV();

      if (response && response.data) {
        const builderCVs = response.data.filter(
          (cv) =>
            cv.theme !== null &&
            !(Array.isArray(cv.theme) && cv.theme.length === 0) &&
            !(
              typeof cv.theme === "object" && Object.keys(cv.theme).length === 0
            )
        );
        console.log("CVs:", response.data);
        setExistingCVs(builderCVs);
      }
    } catch (error) {
      console.error("Error fetching CVs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setSelectedCV(null);
    setShowBuilder(true);
  };

  const handleEditCV = (cv) => {
    setSelectedCV(cv);
    setShowBuilder(true);
  };

  const handleDeleteCV = async (cvId) => {
    try {
      const response = await deleteCV(cvId);
      if (response && response.status === "OK") {
        queryClient.invalidateQueries({ queryKey: ["resume"] });
        message.success(t("cv.builder.deleteSuccess"));
        fetchCVs();
      } else {
        message.error(t("cv.builder.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting CV:", error);
      message.error(t("cv.builder.deleteError"));
    }
  };

  const handleFinish = () => {
    fetchCVs();
    setShowBuilder(false);
  };

  const getRandomGradient = (color) => {
    const gradients = [
      `linear-gradient(135deg, ${color}40, ${color}10)`,
      `linear-gradient(45deg, ${color}30, ${color}05)`,
      `linear-gradient(to right, ${color}25, ${color}08)`,
      `linear-gradient(to bottom, ${color}35, ${color}05)`,
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  if (loading) {
    return (
      <BoxContainer className="shadow-md">
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <Text style={{ display: "block", marginTop: 16 }}>
            {t("common.loading")}
          </Text>
        </div>
      </BoxContainer>
    );
  }

  if (showBuilder) {
    return (
      <CVBuilder
        setShowBuilder={setShowBuilder}
        onFinish={handleFinish}
        existingCvData={selectedCV}
      />
    );
  }

  return (
    <>
      <BoxContainer className="shadow-md cv-builder-page">
        <div className="page-header">
          <div>
            <Title level={3} className="page-title !text-text-color">
              {t("cv.builder.pageTitle")}
              <Badge
                count="Beta"
                style={{
                  backgroundColor: "#52c41a",
                  marginLeft: 12,
                  marginTop: -2,
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              />
            </Title>
            <Text type="secondary" className="page-description">
              {t("cv.builder.pageDescription")}
            </Text>
          </div>
          <Button
            type="primary"
            icon={<FileAddOutlined />}
            onClick={handleCreateNew}
            className="create-cv-button"
            size="large"
          >
            {t("cv.builder.createNew")}
          </Button>
        </div>

        {existingCVs.length === 0 ? (
          <div className="empty-state">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text
                    style={{
                      fontSize: "16px",
                      display: "block",
                      marginBottom: 16,
                    }}
                  >
                    {t("cv.builder.noExistingCVs")}
                  </Text>
                  <Text type="secondary">{t("cv.builder.createFirstCV")}</Text>
                </div>
              }
            >
              <Button
                type="primary"
                size="large"
                icon={<FileAddOutlined />}
                onClick={handleCreateNew}
              >
                {t("cv.builder.createNew")}
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="cv-list">
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              {existingCVs.map((cv) => (
                <Col xs={24} sm={12} md={8} lg={6} key={cv.resumeId}>
                  <Card
                    className="cv-card"
                    hoverable
                    cover={
                      cv.resumeFile ? (
                        <div className="cv-thumbnail-container">
                          <PDFThumbnail pdfUrl={cv.resumeFile} height={220} />
                          <div className="cv-thumbnail-overlay">
                            <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => handleEditCV(cv)}
                              className="overlay-button edit-button"
                            >
                              {t("cv.builder.edit")}
                            </Button>
                            <Button
                              icon={<EyeOutlined />}
                              onClick={() =>
                                window.open(cv.resumeFile, "_blank")
                              }
                              className="overlay-button view-button"
                            >
                              {t("cv.builder.view")}
                            </Button>
                          </div>
                          <Button
                            onClick={() => {
                              Modal.confirm({
                                centered: true,
                                title: t("cv.builder.deleteConfirmTitle"),
                                description: t("cv.builder.deleteConfirmDesc"),
                                onOk: () => handleDeleteCV(cv.resumeId),
                              });
                            }}
                            danger
                            icon={<DeleteOutlined />}
                            className="delete-button"
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              zIndex: 10,
                              width: "32px",
                              height: "32px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="cv-card-preview"
                          style={{
                            height: 220,
                            overflow: "hidden",
                            background: cv.theme?.color
                              ? getRandomGradient(cv.theme.color)
                              : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                            position: "relative",
                            borderBottom: "1px solid #f0f0f0",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              height: "50px",
                              backgroundColor: cv.theme?.color || "#1890ff",
                              width: "100%",
                              position: "relative",
                            }}
                          >
                            <div
                              className="cv-template-badge"
                              style={{
                                position: "absolute",
                                top: "8px",
                                right: "8px",
                                backgroundColor: "#ffffff",
                                color: cv.theme?.color || "#1890ff",
                                padding: "2px 10px",
                                borderRadius: "12px",
                                fontSize: "11px",
                                fontWeight: "bold",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                              }}
                            >
                              {cv.theme?.id || "Modern"}
                            </div>
                          </div>

                          <div
                            style={{
                              display: "flex",
                              padding: "16px",
                              flex: "1",
                              backgroundColor: "rgba(255, 255, 255, 0.9)",
                            }}
                          >
                            <div
                              style={{
                                width: "70px",
                                height: "70px",
                                backgroundColor: "#e8f2ff",
                                borderRadius: "50%",
                                marginRight: "16px",
                                border: `2px solid ${
                                  cv.theme?.color || "#1890ff"
                                }30`,
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
                                />
                              </svg>
                            </div>

                            <div style={{ flex: 1 }}>
                              <div
                                style={{
                                  height: "12px",
                                  width: "80%",
                                  backgroundColor: "#ddd",
                                  borderRadius: "4px",
                                  marginBottom: "12px",
                                }}
                              ></div>
                              <div
                                style={{
                                  height: "10px",
                                  width: "60%",
                                  backgroundColor: "#eee",
                                  borderRadius: "3px",
                                  marginBottom: "12px",
                                }}
                              ></div>
                              <div
                                style={{
                                  height: "6px",
                                  width: "90%",
                                  backgroundColor: "#f2f2f2",
                                  borderRadius: "2px",
                                  marginBottom: "8px",
                                }}
                              ></div>
                              <div
                                style={{
                                  height: "6px",
                                  width: "85%",
                                  backgroundColor: "#f2f2f2",
                                  borderRadius: "2px",
                                  marginBottom: "8px",
                                }}
                              ></div>
                              <div
                                style={{
                                  height: "6px",
                                  width: "70%",
                                  backgroundColor: "#f2f2f2",
                                  borderRadius: "2px",
                                }}
                              ></div>
                            </div>
                          </div>

                          <div className="cv-thumbnail-overlay">
                            <Button
                              type="primary"
                              icon={<EditOutlined />}
                              onClick={() => handleEditCV(cv)}
                              className="overlay-button edit-button"
                            >
                              {t("cv.builder.edit")}
                            </Button>
                          </div>

                          <Button
                            onClick={() => {
                              Modal.confirm({
                                centered: true,
                                title: t("cv.builder.deleteConfirmTitle"),
                                description: t("cv.builder.deleteConfirmDesc"),
                                onOk: () => handleDeleteCV(cv.resumeId),
                              });
                            }}
                            danger
                            icon={<DeleteOutlined />}
                            className="delete-button"
                            style={{
                              position: "absolute",
                              top: "8px",
                              right: "8px",
                              zIndex: 10,
                              width: "32px",
                              height: "32px",
                              padding: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "50%",
                            }}
                          />
                        </div>
                      )
                    }
                  >
                    <Card.Meta
                      title={
                        <div className="card-meta-title">
                          <span className="cv-title">
                            {cv.resumeTitle || t("cv.untitled")}
                          </span>

                          <div className="card-tags">
                            {cv.isPublic && (
                              <Tag color="green" className="cv-tag">
                                {t("cv.builder.public")}
                              </Tag>
                            )}
                            {cv.theme?.id && (
                              <Tag
                                color={cv.theme.color}
                                className="cv-tag template-tag"
                                style={{
                                  backgroundColor: `${cv.theme.color}15`,
                                  color: cv.theme.color,
                                  border: `1px solid ${cv.theme.color}30`,
                                }}
                              >
                                {cv.theme.id.charAt(0).toUpperCase() +
                                  cv.theme.id.slice(1)}
                              </Tag>
                            )}
                          </div>
                        </div>
                      }
                      description={
                        <Text type="secondary" className="cv-date">
                          <CalendarOutlined className="date-icon" />
                          {new Date(
                            cv.updatedAt || cv.createdAt
                          ).toLocaleDateString()}
                        </Text>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </BoxContainer>

      <BoxContainer className="shadow-md features-container">
        <div className="features-section">
          <Title level={4} className="features-title">
            {t("cv.builder.features.title")}
          </Title>

          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">✏️</div>
              <Title level={5}>{t("cv.builder.features.dragDrop.title")}</Title>
              <Text>{t("cv.builder.features.dragDrop.description")}</Text>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🎨</div>
              <Title level={5}>
                {t("cv.builder.features.templates.title")}
              </Title>
              <Text>{t("cv.builder.features.templates.description")}</Text>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <Title level={5}>
                {t("cv.builder.features.responsive.title")}
              </Title>
              <Text>{t("cv.builder.features.responsive.description")}</Text>
            </div>

            <div className="feature-item">
              <div className="feature-icon">💾</div>
              <Title level={5}>{t("cv.builder.features.save.title")}</Title>
              <Text>{t("cv.builder.features.save.description")}</Text>
            </div>
          </div>
        </div>
      </BoxContainer>
    </>
  );
};

export default CVBuilderPage;
