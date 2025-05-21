import { useState, useEffect, useMemo } from "react";
import {
  Typography,
  Button,
  Space,
  Avatar,
  Modal,
  message,
  Tooltip,
  Pagination,
  Tag,
  Card,
  Empty,
  Spin,
  Tabs,
  Flex,
  Row,
  Col,
  Statistic,
  Dropdown,
} from "antd";
import {
  UserOutlined,
  MessageOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  CalendarOutlined,
  EyeOutlined,
  FilterOutlined,
  ReadOutlined,
  FireOutlined,
  MoreOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useParams, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useTranslation } from "react-i18next";
import HtmlContent from "../../../components/Generate/HtmlContent";
import {
  usePostByTopicId,
  useCreatePost,
  useDeletePost,
} from "../../../composables/post";
import {
  useGetCountReactionByPostId,
  useGetReactionByPostId,
} from "../../../composables/reaction";
import { formatDateTime } from "../../../utils/day";

const { Title, Text } = Typography;
const { confirm } = Modal;

const PostList = () => {
  const { t } = useTranslation();
  const { forumId, topicId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const size = Number(searchParams.get("size")) || 10;
  const page = Number(searchParams.get("page")) || 1;

  // Mutations
  const createPostMutation = useCreatePost();
  const deletePostMutation = useDeletePost();

  // Fetch posts using usePostByTopicId
  const { data: postsData, isLoading } = usePostByTopicId(topicId, {
    page: page - 1,
    size: size,
  });

  // Map posts data from API response
  const posts =
    postsData?.data?.content?.map((post) => ({
      post_id: post.postId,
      topic_id: post.topicId,
      user_id: post.userId,
      username: post.userName,
      avatar: post.avatar,
      content: post.content,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      reactionCount: post.reactionCount,
      commentCount: post.commentCount,
      active: post.active,
      roleName: post.roleName,
    })) || [];

  // Get pagination info from API response
  const totalElements = postsData?.data?.totalElements || 0;

  // Cấu hình Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
    "color",
    "background",
  ];

  const handleReply = () => {
    setReplyContent("");
    setIsReplyModalVisible(true);
  };

  const handleReplyCancel = () => {
    setIsReplyModalVisible(false);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) {
      message.error(t("post.list.content_required"));
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        topicId: Number(topicId),
        content: replyContent,
      });

      setIsReplyModalVisible(false);
      message.success(t("post.list.post_success"));
    } catch {
      message.error(t("post.list.post_error"));
    }
  };

  const handleDelete = (postId) => {
    confirm({
      centered: true,
      title: t("post.list.delete.confirm_title"),
      icon: <ExclamationCircleOutlined />,
      content: t("post.list.delete.confirm_message"),
      okText: t("post.list.delete.button"),
      okType: "danger",
      cancelText: t("post.list.delete.cancel"),
      onOk: async () => {
        try {
          await deletePostMutation.mutateAsync(postId);
          message.success(t("post.list.delete.success"));
        } catch {
          message.error(t("post.list.delete.error"));
        }
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionsMenu = {
    items: [
      {
        key: "1",
        label: t("post.export"),
        icon: <LinkOutlined />,
      },
      {
        key: "2",
        label: t("post.filter"),
        icon: <FilterOutlined />,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  const topic = postsData?.data?.topic;

  return (
    <div>
      {/* Stats Section */}
      {topic && (
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Card bordered={false}>
              <Statistic
                title={t("post.total_posts")}
                value={totalElements}
                prefix={<ReadOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <Statistic
                title={t("post.total_reactions")}
                value={posts.reduce(
                  (sum, post) => sum + (post.reactionCount || 0),
                  0
                )}
                prefix={<FireOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false}>
              <Statistic
                title={t("post.total_comments")}
                value={posts.reduce(
                  (sum, post) => sum + (post.commentCount || 0),
                  0
                )}
                prefix={<MessageOutlined />}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Topic Header Card */}
      {topic && (
        <Card className="mb-6 shadow-sm">
          <Flex justify="space-between" align="start">
            <div>
              <Title level={3} className="!mb-0 !text-text-color">
                {topic.title}
              </Title>
              <div className="flex flex-wrap gap-1 mt-2">
                {topic.tags?.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className="mt-2 text-gray-500">
                <Space>
                  <Avatar
                    size="small"
                    src={topic.avatar}
                    icon={!topic.avatar && <UserOutlined />}
                  />
                  <span>
                    {t("post.list.created_by")}{" "}
                    <Text strong>{topic.username}</Text>
                  </span>
                  <span>•</span>
                  <span>
                    <CalendarOutlined className="mr-1" />
                    {formatDate(topic.createdAt)}
                  </span>
                </Space>
              </div>
            </div>
            <Flex gap={12}>
              {!topic.isClosed && (
                <Button
                  type="primary"
                  onClick={handleReply}
                  icon={<MessageOutlined />}
                >
                  {t("post.list.reply")}
                </Button>
              )}
              <Dropdown menu={actionsMenu}>
                <Button icon={<MoreOutlined />} />
              </Dropdown>
            </Flex>
          </Flex>

          <div className="p-4 mt-4 rounded-lg bg-gray-50">
            <HtmlContent htmlString={topic.content} />
          </div>
        </Card>
      )}

      {/* Posts List */}
      <Card
        title={
          <Flex justify="space-between" align="center">
            <Title level={5} className="!m-0">
              {t("post.list.title")}
            </Title>
          </Flex>
        }
        className="shadow-sm"
      >
        <Spin spinning={isLoading}>
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostItem
                  key={post.post_id}
                  post={post}
                  onDelete={handleDelete}
                  topicId={topicId}
                  forumId={forumId}
                />
              ))}
              {totalElements > 0 && (
                <div className="flex justify-end mt-4">
                  <Pagination
                    current={page}
                    total={totalElements}
                    pageSize={size}
                    onChange={(currentPage, pageSize) => {
                      pageSize === size
                        ? setSearchParams({ page: currentPage, size })
                        : setSearchParams({ size: pageSize });
                    }}
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
                        "common.item"
                      )}`
                    }
                    showSizeChanger={true}
                    pageSizeOptions={["10", "20", "50"]}
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty description={t("post.list.no_posts")} />
          )}
        </Spin>
      </Card>

      {/* Create Post Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <MessageOutlined />
            <span>{t("post.list.reply")}</span>
          </div>
        }
        open={isReplyModalVisible}
        onCancel={handleReplyCancel}
        onOk={handleReplySubmit}
        width={800}
        okText={t("post.list.post_button")}
        cancelText={t("post.list.cancel")}
        confirmLoading={createPostMutation.isPending}
        centered
      >
        <ReactQuill
          theme="snow"
          value={replyContent}
          onChange={setReplyContent}
          modules={modules}
          formats={formats}
          style={{ height: "300px", marginBottom: "40px" }}
          placeholder={t("post.placeholder")}
        />
      </Modal>
    </div>
  );
};

const PostItem = ({ post, onDelete, topicId, forumId }) => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const { data: reactionCount } = useGetCountReactionByPostId(post.post_id);
  const {
    data: reactionsData,
    refetch: refetchReactions,
    isPending: isPendingGetReactions,
  } = useGetReactionByPostId(post.post_id);

  const [sortedReactions, setSortedReactions] = useState([]);

  // Reaction emoji mapping
  const mapReaction = {
    LIKE: "👍",
    DISLIKE: "👎",
    HAHA: "😆",
    LOVE: "❤️",
    WOW: "😮",
    SAD: "😢",
    ANGRY: "😡",
  };

  // Process reaction count data
  useEffect(() => {
    if (reactionCount?.data) {
      const reactions = {
        LIKE: reactionCount.data.likeCount,
        DISLIKE: reactionCount.data.dislikeCount,
        LOVE: reactionCount.data.loveCount,
        HAHA: reactionCount.data.hahaCount,
        WOW: reactionCount.data.wowCount,
        SAD: reactionCount.data.sadCount,
        ANGRY: reactionCount.data.angryCount,
      };
      const result = Object.entries(reactions)
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([key, value]) => ({
          type: key,
          mapReaction: mapReaction[key],
          value,
        }));
      setSortedReactions(result);
    }
  }, [reactionCount]);

  // Handle opening modal
  const handleOpenModal = (e) => {
    e.stopPropagation();
    setModal(true);
    refetchReactions();
  };

  return (
    <div>
      <Card
        className="transition-all duration-300 border border-gray-100 hover:shadow-md"
        bodyStyle={{ padding: "16px" }}
      >
        <div className="relative">
          {/* Header with user info and delete button */}
          <Flex justify="space-between" align="center" className="mb-4">
            <Flex align="center" gap={12}>
              <Flex align="center" gap={12} vertical>
                <Avatar
                  size={40}
                  src={post.avatar}
                  icon={!post.avatar && <UserOutlined />}
                  className="border border-gray-200"
                />
                <Tag className="text-xs p-0.5" color="blue">
                  {t(`role.${post.roleName}`)}
                </Tag>
              </Flex>
              <div className="flex flex-col gap-2">
                <Text strong className="text-base">
                  {post.username}
                </Text>
                <div className="text-sm text-gray-500">
                  <CalendarOutlined className="mr-1" />{" "}
                  {formatDateTime(post.created_at)}
                </div>
              </div>
            </Flex>
            <Space>
              <Tooltip destroyTooltipOnHide={true} title={t("post.view")}>
                <Button
                  icon={<EyeOutlined className="text-text-color" />}
                  onClick={() => {
                    window.open(
                      `/forums/${forumId}/topics/${topicId}/posts/${post.post_id}`,
                      "_blank"
                    );
                  }}
                />
              </Tooltip>
              {post.active && (
                <Tooltip
                  destroyTooltipOnHide={true}
                  title={t("post.list.delete.button")}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(post.post_id);
                    }}
                  />
                </Tooltip>
              )}
            </Space>
          </Flex>

          {/* Content */}
          <div className="p-4 my-4 rounded-lg bg-gray-50">
            <HtmlContent htmlString={post.content} />
          </div>

          {/* Footer with reactions, comments and timestamp */}
          <Flex
            justify="space-between"
            align="center"
            className="pt-3 mt-4 border-t border-gray-100"
          >
            <Flex gap={16} align="center">
              {sortedReactions.length > 0 && (
                <Button
                  type="text"
                  onClick={handleOpenModal}
                  className="flex items-center px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <div className="flex">
                    {sortedReactions.slice(0, 3).map((reaction, index) => (
                      <span
                        key={reaction.type}
                        className={`text-lg -ml-1 first:ml-0`}
                        style={{ zIndex: 30 - index * 10 }}
                      >
                        {reaction.mapReaction}
                      </span>
                    ))}
                  </div>
                  <span className="ml-1 text-sm font-semibold text-gray-700">
                    {reactionCount?.data?.totalCount > 0 &&
                      reactionCount?.data?.totalCount}
                  </span>
                </Button>
              )}
              <Button
                type="text"
                icon={<MessageOutlined />}
                className="flex items-center hover:!bg-transparent cursor-default"
              >
                <span className="ml-1">{post.commentCount}</span>
              </Button>
            </Flex>
            <Text type="secondary" className="text-sm">
              {post.updated_at !== post.created_at && (
                <span className="italic">
                  {t("post.edited")} {formatDateTime(post.updated_at)}
                </span>
              )}
            </Text>
          </Flex>
        </div>
      </Card>
      <ReactionModal
        modal={modal}
        setModal={setModal}
        reactionsData={reactionsData}
        isPendingGetReactions={isPendingGetReactions}
        mapReaction={mapReaction}
      />
    </div>
  );
};

const ReactionModal = ({
  modal,
  setModal,
  reactionsData,
  isPendingGetReactions,
  mapReaction,
}) => {
  const { t } = useTranslation();
  const items = useMemo(() => {
    if (
      !reactionsData?.data?.content ||
      reactionsData.data.content.length === 0
    ) {
      return [];
    }

    // Tạo object để lưu reactions theo loại
    const reactionsByType = {};

    // Nhóm các reaction theo loại
    reactionsData.data.content.forEach((reaction) => {
      if (!reactionsByType[reaction.type]) {
        reactionsByType[reaction.type] = [];
      }
      reactionsByType[reaction.type].push(reaction);
    });

    // Tạo items cho Tabs component
    return Object.keys(reactionsByType).map((type) => ({
      key: type,
      label: (
        <div className="flex items-center gap-2 px-4 text-xl">
          <span className="text-2xl">{mapReaction[type]}</span>
          <span className="font-medium">{reactionsByType[type].length}</span>
        </div>
      ),
      children: (
        <div className="p-2 overflow-y-auto max-h-60">
          {reactionsByType[type].map((reaction) => (
            <div
              key={reaction.reactionId}
              className="flex items-center gap-3 p-3 transition-colors rounded-md hover:bg-gray-50"
            >
              <Avatar
                icon={<UserOutlined />}
                src={reaction.avatar}
                size={40}
                className="border border-gray-200"
              />
              <div>
                <div className="font-medium text-gray-800">
                  {reaction.userName}
                </div>
                <div className="text-xs text-gray-500">
                  {reaction.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
    }));
  }, [reactionsData, mapReaction]);

  const handleClose = () => {
    setModal(false);
  };

  return (
    <Modal
      width={700}
      title={
        <span className="text-xl font-semibold">
          {t("post.reaction.title")}
        </span>
      }
      footer={null}
      open={modal}
      onCancel={handleClose}
      centered
      styles={{
        header: {
          borderBottom: "1px solid #f0f0f0",
          padding: "16px 24px",
        },
        body: {
          padding: "0",
        },
      }}
    >
      <div className="pt-2">
        {isPendingGetReactions ? (
          <div className="flex justify-center p-8">
            <Spin size="large" />
          </div>
        ) : items.length > 0 ? (
          <Tabs
            defaultActiveKey={items[0]?.key}
            items={items}
            type="card"
            className="px-4"
          />
        ) : (
          <Empty
            description={t("post.reaction.no_data")}
            className="py-8"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </Modal>
  );
};

export default PostList;
