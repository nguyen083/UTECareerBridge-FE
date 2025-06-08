import { Divider, List, Card, Rate, Spin, Empty, Modal } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useEvaluationsByStudent } from "../../../composables/interview";
import { useSearchParams } from "react-router-dom";
import "./Evaluations.scss";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Evaluations = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const size = Number(searchParams.get("size")) || 10;
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const { data: evaluations, isLoading } = useEvaluationsByStudent({
    page: page - 1,
    size,
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page, size]);

  const handlePageChange = (newPage, newSize) => {
    newSize !== searchParams.get("size")
      ? setSearchParams({
          size: newSize.toString(),
        })
      : setSearchParams({
          page: newPage.toString(),
        });
  };

  const handleCardClick = (evaluation) => {
    setIsModalLoading(true);
    setSelectedEvaluation(evaluation);
    setIsModalVisible(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsModalLoading(false);
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvaluation(null);
  };

  if (isLoading) {
    return (
      <BoxContainer className="w-full">
        <div className="title1">{t("student.evaluations.title")}</div>
        <Divider />
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </BoxContainer>
    );
  }

  if (!evaluations?.content?.length) {
    return (
      <BoxContainer className="w-full">
        <div className="title1">{t("student.evaluations.title")}</div>
        <Divider />
        <Empty description={t("student.evaluations.noEvaluations")} />
      </BoxContainer>
    );
  }

  return (
    <BoxContainer className="w-full evaluations-container">
      <div className="mb-4 title1">{t("student.evaluations.title")}</div>
      <Divider className="mb-6" />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        dataSource={evaluations.content}
        pagination={{
          current: page,
          pageSize: size,
          total: evaluations.totalElements,
          onChange: handlePageChange,
          showSizeChanger: true,
          showTotal: (total) =>
            t("student.evaluations.totalEvaluations", { total }),
          pageSizeOptions: ["5", "10", "20", "50"],
        }}
        renderItem={(item) => (
          <List.Item>
            <Card
              className="w-full transition-all duration-300 cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  {item.recommendedPosition && (
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.recommendedPosition}
                    </h3>
                  )}
                  <p className="text-gray-600">
                    {t("student.evaluations.evaluatedBy")}:{" "}
                    <span className="font-medium">{item.evaluatedByName}</span>
                  </p>
                  <p className="text-gray-500">
                    {t("student.evaluations.date")}: {item.createdAt}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex flex-col items-end">
                    <p className="mb-1 text-gray-600">
                      {t("student.evaluations.overallRating")}
                    </p>
                    <Rate disabled defaultValue={item.overallRating} />
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title={t("student.evaluations.modalTitle")}
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
        className="evaluation-modal"
        destroyOnClose
      >
        <Spin spinning={isModalLoading}>
          {selectedEvaluation && (
            <div className="space-y-6">
              <div className="evaluation-header">
                <div className="position-title">
                  {selectedEvaluation.recommendedPosition}
                </div>
                <div className="evaluator-info">
                  <p>
                    {t("student.evaluations.evaluatedBy")}:{" "}
                    <span className="font-medium">
                      {selectedEvaluation.evaluatedByName}
                    </span>
                  </p>
                  <p>
                    {t("student.evaluations.date")}:{" "}
                    {selectedEvaluation.createdAt}
                  </p>
                </div>
                <div className="overall-rating">
                  <div className="rating-label">
                    {t("student.evaluations.overallRating")}
                  </div>
                  <Rate
                    disabled
                    defaultValue={selectedEvaluation.overallRating}
                  />
                </div>
              </div>

              <div className="rating-section">
                <div className="rating-item">
                  <div className="rating-label">
                    {t("student.evaluations.technicalSkills")}
                  </div>
                  <Rate
                    disabled
                    defaultValue={selectedEvaluation.technicalSkills}
                  />
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    {t("student.evaluations.communicationSkills")}
                  </div>
                  <Rate
                    disabled
                    defaultValue={selectedEvaluation.communicationSkills}
                  />
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    {t("student.evaluations.cultureFit")}
                  </div>
                  <Rate disabled defaultValue={selectedEvaluation.cultureFit} />
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    {t("student.evaluations.problemSolving")}
                  </div>
                  <Rate
                    disabled
                    defaultValue={selectedEvaluation.problemSolving}
                  />
                </div>
                <div className="rating-item">
                  <div className="rating-label">
                    {t("student.evaluations.attitude")}
                  </div>
                  <Rate disabled defaultValue={selectedEvaluation.attitude} />
                </div>
              </div>

              <div className="feedback-section">
                <div className="feedback-item">
                  <div className="feedback-label">
                    {t("student.evaluations.strengths")}
                  </div>
                  <div className="feedback-content">
                    {selectedEvaluation.strengths ||
                      t("student.evaluations.none")}
                  </div>
                </div>
                <div className="feedback-item">
                  <div className="feedback-label">
                    {t("student.evaluations.weaknesses")}
                  </div>
                  <div className="feedback-content">
                    {selectedEvaluation.weaknesses ||
                      t("student.evaluations.none")}
                  </div>
                </div>
                <div className="feedback-item">
                  <div className="feedback-label">
                    {t("student.evaluations.overallNotes")}
                  </div>
                  <div className="feedback-content">
                    {selectedEvaluation.overallNotes ||
                      t("student.evaluations.none")}
                  </div>
                </div>
              </div>

              <div className="salary-section">
                <div className="salary-label">
                  {t("student.evaluations.recommendedSalary")}
                </div>
                <div className="salary-amount">
                  {selectedEvaluation.recommendedSalary
                    ? `${selectedEvaluation.recommendedSalary.toLocaleString(
                        "vi-VN"
                      )} VNĐ`
                    : t("student.evaluations.notSpecified")}
                </div>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
    </BoxContainer>
  );
};

export default Evaluations;
