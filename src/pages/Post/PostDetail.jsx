import { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Tag,
  message,
  Breadcrumb,
  Tooltip,
  Skeleton,
  Input,
  FloatButton,
} from "antd";
import {
  HomeOutlined,
  ShareAltOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import ReactionPicker from "../../components/Generate/ReactionPicker";
import HtmlContent from "./../../components/Generate/HtmlContent";
import { useForumDetail } from "../../composables/forum";
import { useTopicDetail } from "../../composables/topic";
import { usePostDetail } from "../../composables/post";
import { t } from "i18next";
import { formatDateTime } from "../../utils/day";
import {
  useCreateComment,
  useGetCommentRootByPostId,
} from "./../../composables/comment";
import CommentList from "./User/CommentList";
import { useQueryClient } from "@tanstack/react-query";

const { Title, Text } = Typography;
const { TextArea } = Input;

const PostDetail = () => {
  const { forumId, topicId, postId } = useParams();
  const { data: forum } = useForumDetail(forumId);
  const { data: topic } = useTopicDetail(topicId);
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
  const [userReaction, setUserReaction] = useState(null);
  const topRef = useRef(null);
  const commentInputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const queryClient = useQueryClient();

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

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      message.error("Vui lòng nhập nội dung bình luận!");
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
          setIsModalVisible(false);
        },
        onError: () => {
          message.error("Lỗi khi đăng bình luận!");
        },
      }
    );
  };

  const handleShare = () => {
    const hashtag = `/&hashtag=%23UTECAREERBRIDGE%0a%23HCMUTE%0aTham%20gia%20ngay!`;
    const ngrokUrl = import.meta.env.VITE_NGROK_URL;
    const updatedUrl = window.location.href.replace(
      "http://localhost:3000",
      ngrokUrl
    );
    console.log(updatedUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${updatedUrl}${hashtag}`,
      "_blank"
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (commentsData?.data && page !== 1) {
      setComments([...comments, ...commentsData.data.content]);
    }
  }, [commentsData]);
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
                  href: "/",
                  title: (
                    <>
                      <HomeOutlined />
                    </>
                  ),
                },
                {
                  href: "/forums",
                  title: "Diễn đàn",
                },
                {
                  href: `/forums/${forumId}/topics`,
                  title: forum?.data?.name || "Đang tải...",
                },
                {
                  href: `/forums/${forumId}/topics/${topicId}/posts`,
                  title: topic?.data?.title || "Đang tải...",
                },
                {
                  title: "Bài viết",
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          <div className="flex-grow">
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
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start">
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
                      <div>
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
                              title={`${t("post.lastUpdate")}: ${formatDateTime(
                                post.data?.updatedAt
                              )}`}
                            ></Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post content */}
                  <HtmlContent htmlString={post.data?.content} />

                  {/* Post footer */}
                  <div className="flex justify-between pt-4 border-t">
                    <div className="flex flex-wrap items-center justify-center flex-1">
                      <ReactionPicker
                        selected={userReaction}
                        setSelected={setUserReaction}
                        classNameIcon="text-xl"
                      />
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

            {/* Comments */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className="mb-0 !text-text-color">
                  {t("post.comment")} ({commentsData?.data.totalElements || 0})
                </Title>
              </div>
              {/* Add comment */}
              <Card
                className={` shadow-sm transition-all duration-500 ease-in-out  origin-top ${
                  isModalVisible
                    ? "max-h-screen scale-y-100 opacity-100 !mb-6"
                    : "max-h-0 scale-y-0 opacity-0 !mb-0"
                } `}
                ref={commentInputRef}
              >
                <Title level={5} className="!mb-4 flex items-center">
                  <CommentOutlined className="mr-2 text-2xl" />
                  {t("post.comment")}
                </Title>
                <div className="flex">
                  <div className="flex-grow">
                    <TextArea
                      rows={4}
                      placeholder={t("post.writeComment")}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button
                        loading={isCreatingComment}
                        type="primary"
                        onClick={handleCommentSubmit}
                      >
                        {t("post.comment")}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              <CommentList
                comments={comments}
                setComments={setComments}
                page={page}
                setPage={setPage}
                totalPage={commentsData?.data.totalPages}
                isPendingComments={isLoadingComments}
              />
            </div>
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

export default PostDetail;
