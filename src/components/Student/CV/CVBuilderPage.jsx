import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Alert,
  Spin,
  Row,
  Col,
  Card,
  Popconfirm,
  message,
  Tooltip,
  Tag,
  Empty,
  Badge,
} from "antd";
import {
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  CalendarOutlined,
  FilePdfOutlined,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import CVBuilder from "./CVBuilder";
import PDFThumbnail from "./PDFThumbnail";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getAllCV, deleteCV } from "../../../services/apiService";

const { Title, Text } = Typography;

const CVBuilderPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [existingCVs, setExistingCVs] = useState([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const user = useSelector((state) => state.student);

  useEffect(() => {
    fetchCVs();
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
    return <CVBuilder onFinish={handleFinish} existingCvData={selectedCV} />;
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
                        </div>
                      )
                    }
                    actions={[
                      <Tooltip key="view" title={t("cv.builder.view")}>
                        <Button
                          type="text"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            cv.resumeFile &&
                            window.open(cv.resumeFile, "_blank")
                          }
                        />
                      </Tooltip>,
                      <Tooltip key="edit" title={t("cv.builder.edit")}>
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => handleEditCV(cv)}
                        />
                      </Tooltip>,
                      <Tooltip
                        key="download"
                        title={t("cv.builder.download.title")}
                      >
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          onClick={() =>
                            cv.resumeFile &&
                            window.open(cv.resumeFile, "_blank")
                          }
                          disabled={!cv.resumeFile}
                        />
                      </Tooltip>,
                      <Popconfirm
                        key="delete"
                        title={t("cv.builder.deleteConfirmTitle")}
                        description={t("cv.builder.deleteConfirmDesc")}
                        onConfirm={() => handleDeleteCV(cv.resumeId)}
                        okText={t("common.yes")}
                        cancelText={t("common.no")}
                      >
                        <Tooltip key="delete" title={t("cv.builder.delete")}>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                          />
                        </Tooltip>
                      </Popconfirm>,
                    ]}
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

      <style jsx>{`
        .cv-builder-page {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-title {
          display: flex;
          align-items: center;
          margin-bottom: 8px !important;
        }

        .page-description {
          font-size: 16px;
          opacity: 0.8;
        }

        .create-cv-button {
          padding: 0 20px;
          height: 42px;
          border-radius: 8px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .create-cv-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .empty-state {
          padding: 60px 0;
          text-align: center;
          background: #fafafa;
          border-radius: 8px;
          margin: 24px 0;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .features-container {
          margin-top: 32px;
        }

        .features-title {
          position: relative;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }

        .features-title:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 60px;
          height: 3px;
          background-color: #1890ff;
          border-radius: 3px;
        }

        .features-section {
          margin-top: 16px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-top: 24px;
        }

        .feature-item {
          padding: 24px;
          border-radius: 10px;
          background-color: #f9f9f9;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #f0f0f0;
        }

        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          border-color: #e6f7ff;
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .cv-card {
          transition: all 0.3s ease;
          overflow: hidden;
          border-radius: 8px;
          height: 100%;
        }

        .cv-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .cv-thumbnail-container {
          position: relative;
          overflow: hidden;
          height: 220px;
        }

        .cv-thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cv-card:hover .cv-thumbnail-overlay {
          opacity: 1;
        }

        .overlay-button {
          margin: 6px;
          border-radius: 6px;
          padding: 0 16px;
          height: 36px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .edit-button {
          background-color: #1890ff;
        }

        .view-button {
          background-color: white;
          color: #1890ff;
        }

        .card-meta-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
        }

        .cv-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
          font-weight: 500;
        }

        .card-tags {
          display: flex;
          gap: 4px;
          margin-left: 4px;
        }

        .cv-tag {
          margin: 0;
          font-size: 11px;
          line-height: 1.4;
          padding: 0 6px;
        }

        .template-tag {
          text-transform: capitalize;
        }

        .cv-date {
          display: flex;
          align-items: center;
          font-size: 12px;
        }

        .date-icon {
          margin-right: 6px;
          opacity: 0.7;
        }
      `}</style>
    </>
  );
};

export default CVBuilderPage;
