import { useState, useEffect, useRef, useMemo } from "react";
import truncate from "html-truncate";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Divider,
  Tag,
  Breadcrumb,
  Pagination,
  Drawer,
  Tabs,
  Flex,
  FloatButton,
  Empty,
  Modal,
  Spin,
  Form,
} from "antd";
import {
  HomeOutlined,
  ClockCircleOutlined,
  ArrowUpOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  PushpinOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useParams, Link, useSearchParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import HtmlContent from "../../../components/Generate/HtmlContent";
import { Newspaper } from "lucide-react";
import { useTopicDetail } from "../../../composables/topic";
import { useForumDetail } from "../../../composables/forum";
import { useTranslation } from "react-i18next";
import { useCreatePost, usePostByTopicId } from "../../../composables/post";
import { formatDateTime } from "../../../utils/day";
import ReactionPicker from "../../../components/Generate/ReactionPicker";
import {
  useGetCountReactionByPostId,
  useGetReactionByPostId,
} from "../../../composables/reaction";
import CustomizeQuill from "../../../components/Generate/CustomizeQuill";
const { Title, Text, Paragraph } = Typography;
const UserPostList = () => {
  const { forumId, topicId } = useParams();
  const { data: forum } = useForumDetail(forumId);
  const { data: topic, isPending: isPendingGetTopic } = useTopicDetail(topicId);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const topRef = useRef(null);
  const pageSize = 10;
  const { t } = useTranslation();
  const {
    data: posts,
    refetch: refetchPosts,
    isFetching: isFetchingGetPosts,
  } = usePostByTopicId(topicId, {
    page: page - 1,
    size: pageSize,
  });
  const { mutate: createPost, isPending: isPendingCreatePost } =
    useCreatePost();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [posts]);

  useEffect(() => {
    refetchPosts();
  }, [searchParams]);

  useEffect(() => {
    if (isModalVisible) {
      form.resetFields();
    }
  }, [isModalVisible]);

  const handleCreatePost = (values) => {
    const data = {
      content: values.content,
      topicId: +topicId,
    };
    createPost(data, {
      onSuccess: () => {
        setIsModalVisible(false);
        refetchPosts();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* Header */}
      <div className="sticky top-0 z-10 py-4 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <Breadcrumb
              className="mb-0"
              items={[
                {
                  title: (
                    <Link to="/">
                      <HomeOutlined />
                    </Link>
                  ),
                },
                {
                  title: <Link to="/forums">{t("forum.title")}</Link>,
                },
                {
                  title: (
                    <Link to={`/forums/${forumId}/topics`}>
                      {forum?.data?.name || t("common.loading")}
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link to={`/forums/${forumId}/topics/${topicId}/posts`}>
                      {topic?.data?.title || t("common.loading")}
                    </Link>
                  ),
                },
              ]}
            />
            <div className="flex items-center gap-2 md:hidden">
              <Button icon={<MenuOutlined />} onClick={() => {}} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          <div className="flex-grow">
            <Spin
              spinning={isFetchingGetPosts || isPendingGetTopic}
              active
              className="flex flex-col min-h-screen gap-4 py-auto"
            >
              {/* Topic header */}

              {topic?.data?.content !== undefined && (
                <TopicHeader topic={topic?.data} />
              )}
              <Flex className="justify-end">
                <Button
                  icon={<PlusOutlined />}
                  className="my-3"
                  type="primary"
                  onClick={() => {
                    setIsModalVisible(!isModalVisible);
                  }}
                >
                  Tạo bài viết
                </Button>
              </Flex>
              {/* Posts */}

              {posts?.data?.content?.map((post) => (
                <PostItem key={post.postId} post={post} />
              ))}
              {posts?.data?.totalElements === 0 && (
                <div className="flex justify-center mt-6">
                  <Empty description="Không có bài viết" />
                </div>
              )}

              {/* Pagination */}
              <div className="flex justify-center mt-6">
                <Pagination
                  current={page}
                  total={posts?.data?.totalElements}
                  pageSize={pageSize}
                  onChange={(page) => {
                    searchParams.set("page", page.toString());
                    setSearchParams(searchParams);
                  }}
                  showSizeChanger={false}
                />
              </div>
            </Spin>
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <FloatButton
        type="primary"
        shape="circle"
        icon={<ArrowUpOutlined />}
        size="large"
        onClick={scrollToTop}
        className="shadow-lg"
      />
      <Modal
        width={1000}
        centered
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Button
            loading={isPendingCreatePost}
            type="primary"
            onClick={() => form.submit()}
          >
            Tạo bài viết
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleCreatePost}>
          <Form.Item name="content" label="Bài viết">
            <CustomizeQuill />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

const PostItem = ({ post }) => {
  const { forumId, topicId } = useParams();
  const { t } = useTranslation();
  const { data: reactionCount } = useGetCountReactionByPostId(post.postId);

  const {
    data: reactionsData,
    refetch: refetchReactions,
    isPending: isPendingGetReactions,
  } = useGetReactionByPostId(post.postId);

  const [sortedReactions, setSortedReactions] = useState([]);
  const [modal, setModal] = useState(false);

  const mapReaction = {
    LIKE: "👍",
    DISLIKE: "👎",
    HAHA: "😆",
    LOVE: "❤️",
    WOW: "😮",
    SAD: "😢",
    ANGRY: "😡",
  };

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

  // Xử lý lấy chi tiết reaction khi mở modal
  const handleOpenModal = () => {
    setModal(true);
    // Chỉ fetch dữ liệu khi mở modal
    refetchReactions();
  };

  return (
    <>
      <Card
        key={post.postId}
        id={`post-${post.postId}`}
        className="mb-4 transition-shadow duration-300 shadow-sm hover:shadow-md"
      >
        <div className="flex flex-row">
          {/* User info */}
          <div className="mb-4 md:w-48 md:flex-shrink-0 md:pr-4 md:border-r md:mb-0">
            <div className="flex items-center md:flex-col md:items-center">
              <Avatar size={64} src={post.avatar} />
              <div className="ml-4 md:ml-0 md:mt-2 md:text-center">
                <Paragraph
                  className="text-sm font-semibold max-w-48"
                  ellipsis={{ rows: 2, tooltip: true }}
                >
                  {post.userName}
                </Paragraph>
                <Tag color="blue" className="mx-auto mt-1 w-fit">
                  {t(`role.${post.roleName}`)}
                </Tag>
              </div>
            </div>
          </div>
          {/* Post content */}
          <div className="flex flex-col justify-between flex-1 md:pl-4">
            <Link
              to={`/forums/${forumId}/topics/${topicId}/posts/${post.postId}`}
            >
              <HtmlContent htmlString={truncate(post.content, 300)} />
            </Link>

            <div>
              <Divider className="my-2" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ReactionPicker />
                  {sortedReactions.length > 0 && (
                    <div
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      <div className="flex">
                        {sortedReactions.slice(0, 3).map((reaction, index) => (
                          <span
                            key={reaction.type}
                            className={`z-${30 - index * 10} text-lg`}
                          >
                            {reaction.mapReaction}
                          </span>
                        ))}
                      </div>
                      <div>
                        <span className="text-sm font-semibold">
                          {reactionCount?.data?.totalCount > 0 &&
                            reactionCount?.data?.totalCount}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <ClockCircleOutlined className="mr-1" />
                  {formatDateTime(post.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <ReactionModal
        modal={modal}
        setModal={setModal}
        reactionsData={reactionsData}
        isPendingGetReactions={isPendingGetReactions}
        mapReaction={mapReaction}
      />
    </>
  );
};

const ReactionModal = ({
  modal,
  setModal,
  reactionsData,
  isPendingGetReactions,
  mapReaction,
}) => {
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
        <div className="px-4 text-xl">
          {mapReaction[type]} {reactionsByType[type].length}
        </div>
      ),
      children: (
        <div className="p-2 overflow-y-auto max-h-60">
          {reactionsByType[type].map((reaction) => (
            <div
              key={reaction.reactionId}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50"
            >
              <Avatar icon={<UserOutlined />} src={reaction.avatar} />
              <div>
                <div className="font-medium">{reaction.userName}</div>
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
    <Modal footer={null} open={modal} onCancel={handleClose} centered>
      <div className="pt-2">
        {isPendingGetReactions ? (
          <div className="flex justify-center p-6">
            <Spin />
          </div>
        ) : items.length > 0 ? (
          <Tabs defaultActiveKey={items[0]?.key} items={items} />
        ) : (
          <Empty description="Không có dữ liệu reaction" />
        )}
      </div>
    </Modal>
  );
};

const TopicHeader = ({ topic }) => {
  const [isInfoDrawerVisible, setIsInfoDrawerVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Card className="shadow-sm">
        <div>
          <Flex justify="space-between">
            <Flex align="center" gap={32}>
              <Title level={2} className="mb-1 !text-text-color">
                {topic?.title}
              </Title>
              {topic?.pinned && (
                <PushpinOutlined className="mb-[15px] text-red-500 text-3xl" />
              )}
            </Flex>
            <Button
              type="text"
              className="text-text-color-hover hover:!text-text-color hover:!bg-transparent"
              icon={<InfoCircleOutlined />}
              onClick={() => setIsInfoDrawerVisible(true)}
            >
              {t("post.inforTopic")}
            </Button>
          </Flex>
          <div className="flex justify-end w-full gap-1 mb-2">
            {topic?.tags?.map((tag) => (
              <Tag key={tag.id} color="blue">
                {tag.name}
              </Tag>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <Flex justify="space-between">
              <Flex align="center" gap={16}>
                <Avatar src={topic?.avatar} size="default" />
                <Text className="leading-none !text-text-color">
                  {topic?.userName}
                </Text>
              </Flex>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Newspaper className="w-4 h-4 text-text-color-hover" />
                  <Text className="text-sm lowercase text-text-color" strong>
                    {topic?.postCount || 0} {t("post.post")}
                  </Text>
                </div>
                <div className="flex items-center gap-1">
                  <Text className="text-sm text-text-color-hover">
                    {t("post.createdAt")}:
                  </Text>
                  <Text className="text-sm text-text-color" strong>
                    {topic?.createdAt}
                  </Text>
                </div>
              </div>
            </Flex>
          </div>
        </div>
      </Card>
      {/* Topic info drawer */}
      <Drawer
        title={t("post.inforTopic")}
        placement="right"
        onClose={() => setIsInfoDrawerVisible(false)}
        open={isInfoDrawerVisible}
        width={500}
      >
        <div className="space-y-4">
          <div>
            <Flex align="center" gap={16}>
              <Title level={4} className="!text-text-color">
                {t("post.topic")}
              </Title>
              {topic?.pinned && (
                <PushpinOutlined className="mb-[10px] text-red-500 text-xl" />
              )}
            </Flex>
            <Paragraph>{topic?.title}</Paragraph>
          </div>
          <div>
            <Title level={4} className="!text-text-color">
              {t("post.description")}
            </Title>
            <HtmlContent htmlString={topic?.content} />
          </div>
          <div>
            <Title level={4} className="!text-text-color">
              {t("post.tags")}
            </Title>
            <div className="flex flex-wrap gap-1">
              {topic?.tags?.map((tag) => (
                <Tag key={tag.id} color="blue" className="w-fit">
                  {tag.name}
                </Tag>
              ))}
            </div>
          </div>
          <Divider />
          <div>
            <Title level={4} className="!text-text-color">
              {t("post.statistic")}
            </Title>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text className="capitalize">{t("post.post")}:</Text>
                <Text strong>{topic?.postCount || 0}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="capitalize">{t("post.createdAt")}:</Text>
                <Text strong>{topic?.createdAt}</Text>
              </div>
              <div className="flex justify-between">
                <Text className="capitalize">{t("post.updatedAt")}:</Text>
                <Text strong>{topic?.updatedAt}</Text>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};
export default UserPostList;
