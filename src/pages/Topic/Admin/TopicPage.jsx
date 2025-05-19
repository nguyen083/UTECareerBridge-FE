import {
  Typography,
  Button,
  Avatar,
  Modal,
  message,
  Table,
  Tooltip,
  Spin,
  Badge,
  Flex,
  Space,
  Tag,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PushpinOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  MessageOutlined,
  PlusOutlined,
  EyeOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAllTopicByForumId,
  useDeleteTopicMutation,
  usePinTopicMutation,
} from "../../../composables/topic";
import { useForumDetail } from "../../../composables/forum";
import { useTranslation } from "react-i18next";
import HtmlContent from "../../../components/Generate/HtmlContent";
import truncate from "html-truncate";

const { Title, Text } = Typography;
const { confirm } = Modal;

const TopicPage = () => {
  const { t } = useTranslation();
  const { forumId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination
  const size = parseInt(searchParams.get("size") || "10", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Fetch data
  const { data: forumData, isLoading: isLoadingForum } =
    useForumDetail(forumId);
  const {
    data: topicsData,
    isLoading: isLoadingTopics,
    isError: isErrorTopics,
  } = useAllTopicByForumId(forumId, { page: page - 1, size });

  // Mutations
  const deleteMutation = useDeleteTopicMutation();
  const pinMutation = usePinTopicMutation();

  // Pagination
  const handleChangePage = (page, pageSize) => {
    searchParams.set("page", page);
    searchParams.set("size", pageSize);
    setSearchParams(searchParams);
  };

  // Delete topic
  const handleDeleteTopic = (topic) => {
    confirm({
      centered: true,
      title: t("topic.delete.confirm_title"),
      icon: <ExclamationCircleOutlined />,
      content: t("topic.delete.confirm_message", { title: topic.title }),
      okText: t("topic.delete.button"),
      okType: "danger",
      cancelText: t("topic.delete.cancel"),
      onOk() {
        deleteMutation.mutate(topic.topicId, {
          onSuccess: () => {
            message.success(t("topic.delete.success"));
            queryClient.invalidateQueries({
              queryKey: ["topicsByForumId", forumId],
            });
          },
          onError: (error) => {
            message.error(t("topic.error.general", { message: error.message }));
          },
        });
      },
    });
  };

  // Toggle pin
  const handleTogglePin = (topicItem) => {
    pinMutation.mutate(topicItem.topicId, {
      onSuccess: () => {
        message.success(
          t(
            topicItem.pinned
              ? "topic.pin.success_unpin"
              : "topic.pin.success_pin"
          )
        );
        queryClient.setQueryData(
          ["topicsByForumId", forumId, { page: page - 1, size }],
          (old) => {
            const newData = {
              ...old,
              data: {
                ...old.data,
                content: old.data.content.map((topic) =>
                  topic.topicId === topicItem.topicId
                    ? { ...topic, pinned: !topicItem.pinned }
                    : topic
                ),
              },
            };
            return newData;
          }
        );
      },
      onError: (error) => {
        message.error(t("topic.error.general", { message: error.message }));
      },
    });
  };

  // Create new topic
  const handleCreateTopic = () => {
    navigate(`/admin/forums/${forumId}/new-topic`);
  };

  // Loading state
  if (isLoadingForum || isLoadingTopics) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (isErrorTopics) {
    return (
      <div className="p-8">
        <Text type="danger">{t("topic.error.loading")}</Text>
      </div>
    );
  }

  const topics = topicsData?.data?.content || [];
  const total = topicsData?.data?.totalElements || 0;
  const forum = forumData?.data;

  // Table columns
  const columns = [
    {
      title: t("topic.title"),
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-start">
          <div className="mr-3">
            <Avatar
              src={record.avatar}
              icon={!record.avatar && <UserOutlined />}
              size="large"
            />
          </div>
          <div>
            <Flex align="center" gap={8}>
              {record.pinned && (
                <Badge
                  count={<PushpinOutlined style={{ color: "#f5222d" }} />}
                  style={{ backgroundColor: "transparent" }}
                />
              )}
              <Text
                strong
                className="text-base cursor-pointer hover:text-primary"
                onClick={() =>
                  navigate(
                    `/admin/forums/${forumId}/topics/${record.topicId}/posts`
                  )
                }
              >
                {text}
              </Text>
            </Flex>
            <div className="mt-1">
              <HtmlContent htmlString={truncate(record?.content, 150)} />
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {record.tags && record.tags.length > 0 && (
                <>
                  {record.tags.slice(0, 3).map((tag) => (
                    <Tag key={tag.id} color="blue">
                      {tag.name}
                    </Tag>
                  ))}
                  {record.tags.length > 3 && (
                    <Tag color="blue">+{record.tags.length - 3}</Tag>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ),
      width: "50%",
    },
    {
      title: t("topic.author"),
      dataIndex: "userName",
      key: "userName",
      render: (text) => <Text strong>{text}</Text>,
      width: "15%",
    },
    {
      title: t("topic.posts"),
      dataIndex: "postCount",
      key: "postCount",
      render: (count) => (
        <Text>
          <MessageOutlined className="mr-2" />
          {count || 0}
        </Text>
      ),
      width: "7%",
    },
    {
      title: t("topic.created_at"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <Text className="text-sm text-gray-500">
          <CalendarOutlined className="mr-2" />
          {date.split(" ")[0]}
        </Text>
      ),
      width: "10%",
    },
    {
      title: t("topic.action"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title={t("topic.view")}>
            <Button
              icon={<EyeOutlined className="text-text-color" />}
              onClick={() =>
                navigate(
                  `/admin/forums/${forumId}/topics/${record.topicId}/posts`
                )
              }
            />
          </Tooltip>
          <Tooltip
            title={t(record.pinned ? "topic.pin.unpin" : "topic.pin.pin")}
          >
            <Button
              type={record.pinned ? "primary" : "default"}
              icon={<PushpinOutlined />}
              onClick={() => handleTogglePin(record)}
              loading={pinMutation.isPending}
            />
          </Tooltip>
          <Tooltip title={t("topic.delete.button")}>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteTopic(record)}
            />
          </Tooltip>
        </Space>
      ),
      width: "10%",
    },
  ];

  return (
    <div className="p-6">
      {/* Header Stats */}
      <Row gutter={16} className="mb-6">
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("topic.total_topics")}
              value={total}
              valueStyle={{ color: "#3f8600" }}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("topic.pinned_topics")}
              value={topics.filter((t) => t.pinned).length}
              valueStyle={{ color: "#cf1322" }}
              prefix={<PushpinOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false}>
            <Statistic
              title={t("topic.total_posts")}
              value={topics.reduce((sum, t) => sum + (t.postCount || 0), 0)}
              prefix={<MessageOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Forum Header & Actions */}
      <Card className="mb-6">
        <Flex justify="space-between" align="center">
          <div>
            <Title level={3} className="!mb-0 !text-text-color">
              {forum?.name || t("topic.loading")}
            </Title>
            <Text type="secondary">{forum?.description}</Text>
          </div>
          <Flex gap={12}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTopic}
            >
              {t("topic.create")}
            </Button>
          </Flex>
        </Flex>
      </Card>

      {/* Topic List */}
      <Card>
        <Title level={5} className="!m-0 !mb-4">
          {t("topic.list_title")}
        </Title>

        <Table
          dataSource={topics}
          columns={columns}
          rowKey="topicId"
          pagination={{
            current: page,
            pageSize: size,
            total: total,
            onChange: handleChangePage,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                "common.item"
              )}`,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          loading={isLoadingTopics}
        />
      </Card>
    </div>
  );
};

export default TopicPage;
