import {
  Card,
  Button,
  Typography,
  Image,
  Tooltip,
  Spin,
  Pagination,
  Badge,
  Row,
  Col,
  Flex,
  message,
  Modal,
  Divider,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useDeleteForumMutation,
  useForumActive,
} from "../../../composables/forum";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import CreateForumModal from "./components/CreateForumModal";
import EditForumModal from "./components/EditForumModal";
import { useTranslation } from "react-i18next";
import BoxContainer from "../../../components/Generate/BoxContainer";

const { Text, Paragraph } = Typography;
const { confirm } = Modal;
const { Meta } = Card;

const ForumPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const size = parseInt(searchParams.get("size") || "8", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const navigate = useNavigate();
  const { data: forumData, isLoading, isError } = useForumActive(page, size);
  const deleteMutation = useDeleteForumMutation();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedForum, setSelectedForum] = useState(null);

  const handleDeleteForum = (forum) => {
    confirm({
      centered: true,
      title: t("forum.delete.confirm_title"),
      icon: <ExclamationCircleOutlined />,
      content: t("forum.delete.confirm_message", { name: forum.name }),
      okText: t("forum.delete.button"),
      okType: "danger",
      cancelText: t("forum.delete.cancel"),
      onOk() {
        deleteMutation.mutate(forum.forumId, {
          onSuccess: () => {
            message.success(t("forum.delete.success"));
            queryClient.invalidateQueries({
              queryKey: ["forumsActive", page, size],
            });
          },
        });
      },
    });
  };

  const handleChangePage = (page) => {
    searchParams.set("page", page);
    setSearchParams(searchParams);
  };

  // Modal functions - Create
  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateModalSuccess = () => {
    setIsCreateModalOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["forumsActive", page, size],
    });
    message.success(t("forum.create.success"));
  };

  // Modal functions - Edit
  const showEditModal = (forum) => {
    setSelectedForum(forum);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedForum(null);
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedForum(null);
    queryClient.invalidateQueries({
      queryKey: ["forumsActive", page, size],
    });
    message.success(t("forum.edit.success"));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Text type="danger">{t("forum.error.loading")}</Text>
      </div>
    );
  }

  const total = forumData?.data?.totalElements || 0;

  return (
    <BoxContainer width="100%" className="shadow-md">
      <span className="title1">{t("forum.management")}</span>
      <Divider />
      <div className="flex items-center justify-end mb-6">
        <Button
          icon={<PlusOutlined />}
          type="primary"
          size="middle"
          onClick={showCreateModal}
        >
          {t("forum.add_new")}
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {forumData?.data?.content?.map((forum) => (
          <Col xs={24} sm={12} md={8} lg={6} key={forum.forumId}>
            <Badge.Ribbon
              text={
                forum.active
                  ? t("forum.status.active")
                  : t("forum.status.inactive")
              }
              color={forum.active ? "green" : "default"}
              placement="end"
            >
              <Card
                cover={
                  <div className="overflow-hidden">
                    <Image
                      preview={false}
                      src={forum.image}
                      alt={forum.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                }
                actions={[
                  <Tooltip title={t("forum.actions.edit")} key="edit">
                    <EditOutlined
                      key="edit"
                      className="!text-text-color"
                      onClick={() => showEditModal(forum)}
                    />
                  </Tooltip>,
                  <Tooltip title={t("forum.actions.delete")} key="delete">
                    <DeleteOutlined
                      key="delete"
                      className="!text-red-500"
                      onClick={() => handleDeleteForum(forum)}
                    />
                  </Tooltip>,
                ]}
                className="h-full !shadow-sm"
              >
                <Meta
                  title={
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/forums/${forum.forumId}/topics`);
                      }}
                    >
                      <Tooltip title={forum.name}>
                        <Text ellipsis className="font-medium">
                          {forum.name}
                        </Text>
                      </Tooltip>
                    </div>
                  }
                  description={
                    <div className="space-y-2">
                      <Paragraph
                        ellipsis={{ rows: 2, tooltip: forum.description }}
                        className="text-sm"
                      >
                        {forum.description}
                      </Paragraph>

                      <Flex justify="end" align="center" className="mt-2">
                        <Flex
                          align="center"
                          gap="small"
                          className="mt-3 text-xs text-gray-500"
                        >
                          <CalendarOutlined />
                          <span>
                            {format(new Date(forum.createdAt), "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </span>
                        </Flex>
                      </Flex>
                    </div>
                  }
                />
              </Card>
            </Badge.Ribbon>
          </Col>
        ))}
      </Row>

      <div className="flex justify-end mt-6">
        <Pagination
          current={page}
          pageSize={size}
          total={total}
          onChange={handleChangePage}
          showSizeChanger={false}
        />
      </div>

      {/* Modal tạo diễn đàn */}
      <CreateForumModal
        open={isCreateModalOpen}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateModalSuccess}
      />

      {/* Modal chỉnh sửa diễn đàn */}
      {selectedForum && (
        <EditForumModal
          open={isEditModalOpen}
          onCancel={handleEditModalClose}
          onSuccess={handleEditModalSuccess}
          forumData={selectedForum}
        />
      )}
    </BoxContainer>
  );
};

export default ForumPage;
