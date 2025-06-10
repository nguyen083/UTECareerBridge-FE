import { useState, useEffect, useRef, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Tag,
  message,
  Tooltip,
  Skeleton,
  Input,
  FloatButton,
  Modal,
  Empty,
  Tabs,
  Flex,
  Form,
  Divider,
} from "antd";
import {
  ShareAltOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ArrowUpOutlined,
  UserOutlined,
  SendOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import ReactionPicker from "../../components/Generate/ReactionPicker";
import HtmlContent from "./../../components/Generate/HtmlContent";

import {
  useDeletePost,
  usePostDetail,
  useUpdatePost,
} from "../../composables/post";
import { t } from "i18next";
import { formatDateTime } from "../../utils/day";
import {
  useCreateComment,
  useGetCommentRootByPostId,
} from "./../../composables/comment";
import CommentList from "./User/CommentList";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  useCreateReaction,
  useDeleteReaction,
  useGetCountReactionByPostId,
  useGetReactionByPostId,
  useGetReactionByUserId,
} from "../../composables/reaction";
import CustomizeQuill from "../../components/Generate/CustomizeQuill";

const { Text } = Typography;
const { TextArea } = Input;

const PostDetail = () => {
  const { forumId, topicId, postId } = useParams();
  const { data: post } = usePostDetail(postId);
  const [page, setPage] = useState(1);
  const { data: commentsData, isFetching: isFetchingComments } =
    useGetCommentRootByPostId(postId, page);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [comments, setComments] = useState([]);
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const topRef = useRef(null);
  const commentInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const student = useSelector((state) => state.student);
  const employer = useSelector((state) => state.employer);

  // Reaction states and queries
  const [currentReaction, setCurrentReaction] = useState(null);
  const [reactionModal, setReactionModal] = useState(false);
  const [sortedReactions, setSortedReactions] = useState([]);

  const { data: reactionByUserId, refetch: refetchUserReaction } =
    useGetReactionByUserId(postId);
  const { data: reactionCount, refetch: refetchReactionCount } =
    useGetCountReactionByPostId(postId);
  const { mutate: createReaction } = useCreateReaction();
  const { mutate: deleteReaction } = useDeleteReaction();
  const {
    data: reactionsData,
    refetch: refetchReactions,
    isFetching: isFetchingGetReactions,
  } = useGetReactionByPostId(postId);
  const user = useSelector((state) => state.user);
  const [isUpdatePostModalVisible, setIsUpdatePostModalVisible] =
    useState(false);
  const [form] = Form.useForm();
  const { mutate: updatePost, isPending: isPendingUpdatePost } =
    useUpdatePost();
  const { mutate: deletePost } = useDeletePost();
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

  // Reverse mapping (emoji to reaction type)
  const emojiToReactionType = useMemo(() => {
    const mapping = {};
    Object.entries(mapReaction).forEach(([type, emoji]) => {
      mapping[emoji] = type;
    });
    return mapping;
  }, []);

  // Initialize current reaction from user data
  useEffect(() => {
    if (reactionByUserId?.data?.type) {
      setCurrentReaction(mapReaction[reactionByUserId.data.type]);
    } else {
      setCurrentReaction(null);
    }
  }, [reactionByUserId]);

  useEffect(() => {
    if (isUpdatePostModalVisible) {
      form.setFieldsValue({
        content: post?.data?.content,
      });
    }
  }, [isUpdatePostModalVisible]);

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

  // Handle direct button click (like/unlike toggle)
  const handleDirectButtonClick = (e) => {
    e.stopPropagation();
    if (!user.userId) {
      message.error(t("post.login"));
      return;
    }
    if (currentReaction) {
      // If already has a reaction, remove it
      setCurrentReaction(null);
      deleteReaction(postId, {
        onSuccess: () => {
          refetchReactionCount();
          refetchReactions();
          refetchUserReaction();
        },
      });
    } else {
      // If no reaction, add default like
      setCurrentReaction("👍");
      createReaction(
        { postId: postId, reactionType: "LIKE" },
        {
          onSuccess: () => {
            refetchReactionCount();
            refetchReactions();
            refetchUserReaction();
          },
        }
      );
    }
  };

  // Handle choosing a specific reaction from the picker
  const handleReactionPick = (newEmoji, e) => {
    e.stopPropagation();
    if (!user.userId) {
      message.error(t("post.login"));
      return;
    }
    // If clicking the same reaction, remove it
    if (newEmoji === currentReaction) {
      // Remove reaction
      setCurrentReaction(null);
      deleteReaction(postId, {
        onSuccess: () => {
          refetchReactionCount();
          refetchReactions();
          refetchUserReaction();
        },
      });
    } else {
      // Get the reaction type from emoji
      const newReactionType = emojiToReactionType[newEmoji];

      // If user already has a reaction, we need to replace it
      if (currentReaction) {
        // Delete existing reaction first
        setCurrentReaction(newEmoji);
        deleteReaction(postId, {
          onSuccess: () => {
            // Then create the new reaction
            createReaction(
              { postId: postId, reactionType: newReactionType },
              {
                onSuccess: () => {
                  refetchReactionCount();
                  refetchReactions();
                  refetchUserReaction();
                },
              }
            );
          },
        });
      } else {
        // Create new reaction directly
        setCurrentReaction(newEmoji);
        createReaction(
          { postId: postId, reactionType: newReactionType },
          {
            onSuccess: () => {
              refetchReactionCount();
              refetchReactions();
              refetchUserReaction();
            },
          }
        );
      }
    }
  };

  useEffect(() => {
    if (commentsData?.data && page === 1) {
      setComments(commentsData.data.content);
      setLoading(false);
    }
  }, [commentsData]);
  useEffect(() => {
    if (isFetchingComments) {
      setIsLoadingComments(true);
    } else {
      setIsLoadingComments(false);
    }
  }, [isFetchingComments]);

  // Auto focus TextArea when modal is opened
  useEffect(() => {
    if (isModalVisible && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  }, [isModalVisible]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCommentSubmit = () => {
    if (!user.userId) {
      message.error(t("post.login"));
      setCommentText("");
      return;
    }
    createComment(
      {
        postId: postId,
        content: commentText,
        parentId: null,
      },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(
            ["commentsRoot", postId, page],
            (oldData) => {
              if (!oldData) return oldData;
              const newData = { ...oldData };
              newData.data = {
                ...newData.data,
                content: [response.data, ...newData.data.content],
                totalElements: newData.data.totalElements + 1,
              };

              return newData;
            }
          );
          setComments([response.data, ...comments]);
          setCommentText("");
        },
        onError: () => {
          message.error(t("comment.createError"));
        },
      }
    );
  };

  const handleShare = () => {
    const hashtag = `/&hashtag=%23UTECAREERBRIDGE%0a%23HCMUTE%0aTham%20gia%20ngay!`;
    const updatedUrl = window.location.href;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${updatedUrl}${hashtag}`,
      "_blank"
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle opening reaction modal
  const handleOpenReactionModal = () => {
    setReactionModal(true);
    refetchReactions();
  };

  const handleUpdatePost = (values) => {
    updatePost(
      {
        id: postId,
        params: {
          content: values.content,
          topicId: +topicId,
        },
      },
      {
        onSuccess: () => {
          setIsUpdatePostModalVisible(false);
          message.success(t("post.updateSuccess"));
          queryClient.setQueryData(["post", postId], (oldData) => {
            return {
              ...oldData,
              data: {
                ...oldData.data,
                content: values.content,
              },
            };
          });
        },
        onError: () => {
          message.error(t("post.updateError"));
        },
      }
    );
  };

  const handleDeletePost = () => {
    Modal.confirm({
      title: t("post.delete"),
      content: t("post.deleteConfirm"),
      centered: true,
      onOk: () => {
        deletePost(postId, {
          onSuccess: () => {
            message.success(t("post.deleteSuccess"));
            navigate(`/forums/${forumId}/topics/${topicId}/posts`);
          },
        });
      },
    });
  };

  useEffect(() => {
    if (commentsData?.data && page !== 1) {
      setComments([...comments, ...commentsData.data.content]);
    }
  }, [commentsData]);
  return (
    <div className=" bg-gray-50" ref={topRef}>
      <div className="px-2 pt-6 mx-auto ">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          <div className="w-full">
            {/* Post */}
            <Skeleton
              loading={loading}
              active
              paragraph={{ rows: 15 }}
              className="mb-4"
            >
              {post && (
                <Card className="mb-6 shadow-sm">
                  {/* Post header */}
                  <div className="flex items-start justify-between w-full mb-6">
                    <div className="flex items-center w-full">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar
                          src={post.data?.avatar}
                          size={48}
                          className="mr-4"
                        />
                        <Tag color="blue" className="text-xs">
                          {t(`role.${post.data?.roleName}`)}
                        </Tag>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Text strong className="text-lg">
                            {post.data?.userName}
                          </Text>
                        </div>
                        <div className="text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {formatDateTime(post.data?.createdAt)}
                          {(post.data?.updatedAt !== post.data?.createdAt ||
                            post.updatedAt !== post.createdAt) && (
                            <Tooltip
                              destroyTooltipOnHide={true}
                              title={`${t("post.lastUpdate")}: ${formatDateTime(
                                post.data?.updatedAt
                              )}`}
                            ></Tooltip>
                          )}
                        </div>
                      </div>
                      {post.data.userId === user.userId && (
                        <Flex className="gap-2 justify-self-end">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setIsUpdatePostModalVisible(true)}
                          />
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleDeletePost}
                          />
                        </Flex>
                      )}
                    </div>
                  </div>

                  {/* Post content */}
                  <HtmlContent htmlString={post?.data?.content} />

                  {/* Post footer */}
                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex flex-wrap items-center justify-center flex-1">
                      <div className="flex items-center gap-4">
                        <ReactionPicker
                          selected={currentReaction}
                          onEmojiClick={handleReactionPick}
                          onButtonClick={handleDirectButtonClick}
                          classNameIcon="text-xl"
                        />
                        {sortedReactions.length > 0 && (
                          <div
                            className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full cursor-pointer"
                            onClick={handleOpenReactionModal}
                          >
                            <div className="flex">
                              {sortedReactions
                                .slice(0, 3)
                                .map((reaction, index) => (
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
                    </div>
                    <div className="flex justify-center flex-1 w-full border-x">
                      <Button
                        type="text"
                        size="large"
                        className="hover:!bg-transparent"
                        icon={<CommentOutlined />}
                        onClick={() => setIsModalVisible(!isModalVisible)}
                      >
                        {t("post.comment")}
                        {` (${commentsData?.data?.totalElements || 0})`}
                      </Button>
                    </div>
                    <div className="flex justify-center flex-1">
                      <Button
                        type="text"
                        size="large"
                        className="hover:!bg-transparent"
                        onClick={handleShare}
                        icon={<ShareAltOutlined />}
                      >
                        {t("post.share")}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </Skeleton>
            {/* Update post */}
            <Modal
              width={1000}
              centered
              open={isUpdatePostModalVisible}
              onCancel={() => setIsUpdatePostModalVisible(false)}
              footer={
                <Button
                  loading={isPendingUpdatePost}
                  type="primary"
                  onClick={() => form.submit()}
                >
                  {t("post.update")}
                </Button>
              }
            >
              <Form
                className="m-4"
                form={form}
                layout="vertical"
                onFinish={handleUpdatePost}
              >
                <Form.Item name="content" label={t("post.content")}>
                  <CustomizeQuill placeholder={t("post.placeholder")} />
                </Form.Item>
              </Form>
            </Modal>
            {/* Comments */}
            <Modal
              open={isModalVisible}
              className="w-full"
              width={800}
              centered
              onCancel={() => setIsModalVisible(false)}
              footer={
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={student.profileImage || employer.companyLogo}
                      icon={<UserOutlined />}
                      className="flex-shrink-0 mr-2"
                      size={32}
                    />
                    <div className="flex-grow">
                      <TextArea
                        ref={commentInputRef}
                        rows={1}
                        placeholder={t("post.writeComment")}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="bg-gray-100 resize-none rounded-3xl scrollbar-webkit scrollbar-thin"
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        onPressEnter={(e) => {
                          if (!e.shiftKey) {
                            e.preventDefault();
                            handleCommentSubmit();
                          }
                        }}
                      />
                    </div>
                    <Button
                      loading={isCreatingComment}
                      type="text"
                      onClick={handleCommentSubmit}
                      size="small"
                      className="rounded-full"
                      disabled={!commentText.trim()}
                      icon={
                        <SendOutlined className="!text-2xl text-text-color" />
                      }
                    ></Button>
                  </div>
                </div>
              }
            >
              <CommentList
                post={post}
                comments={comments}
                isOpenModal={isModalVisible}
                setComments={setComments}
                page={page}
                setPage={setPage}
                totalPage={commentsData?.data?.totalPages}
                isPendingComments={isLoadingComments}
              />
            </Modal>

            {/* Reactions Modal */}
            <ReactionModal
              modal={reactionModal}
              setModal={setReactionModal}
              reactionsData={reactionsData}
              isFetchingGetReactions={isFetchingGetReactions}
              mapReaction={mapReaction}
            />
          </div>
        </div>
      </div>

      {/* Back to top button */}
      <FloatButton
        type="primary"
        onClick={scrollToTop}
        className="shadow-lg"
        icon={<ArrowUpOutlined />}
        size="large"
      />
    </div>
  );
};

// Reaction Modal Component
export const ReactionModal = ({
  modal,
  setModal,
  reactionsData,
  isFetchingGetReactions,
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
    <Modal
      title={t("post.detailReactions")}
      footer={null}
      open={modal}
      onCancel={handleClose}
      centered
    >
      <div>
        {isFetchingGetReactions ? (
          <div>
            <Divider />
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ) : items.length > 0 ? (
          <Tabs size="small" defaultActiveKey={items[0]?.key} items={items} />
        ) : (
          <Empty description={t("post.noReactions")} />
        )}
      </div>
    </Modal>
  );
};

export default PostDetail;
