import { Card, Avatar, Typography, Button, Flex, Input, message } from "antd";
import {
  ClockCircleOutlined,
  CommentOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useCreateComment,
  useGetCommentChildrenByCommentId,
} from "../../../composables/comment";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

const CommentList = ({
  comments = [],
  page,
  setPage,
  totalPage,
  isPendingComments,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))}
          {!(page === totalPage && !isPendingComments) && (
            <Button
              loading={isPendingComments}
              onClick={() => setPage(page + 1)}
            >
              Xem thêm
            </Button>
          )}
        </div>
      ) : (
        <Card className="py-8 text-center">
          <MessageOutlined
            style={{ fontSize: 48 }}
            className="mb-4 text-gray-300"
          />
          <Paragraph>{t("post.noComment")}</Paragraph>
        </Card>
      )}
    </div>
  );
};

const CommentItem = ({ comment }) => {
  const [replyCommentCount, setReplyCommentCount] = useState(
    comment.replyCount
  );
  const { postId } = useParams();
  const [page, setPage] = useState(0);
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const [isReply, setIsReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const {
    data: commentChildData,
    isFetching: isFetchingCommentChild,
    refetch: refetchCommentChild,
  } = useGetCommentChildrenByCommentId(comment.commentId, page);
  const [commentChild, setCommentChild] = useState([]);
  const { t } = useTranslation();
  const handleCommentSubmit = () => {
    createComment(
      {
        postId: +postId,
        content: commentText,
        parentId: comment.commentId,
      },
      {
        onSuccess: (response) => {
          setReplyCommentCount(replyCommentCount + 1);
          setCommentChild([response.data, ...commentChild]);
          setCommentText("");
          setIsReply(false);
        },
        onError: () => {
          message.error("Lỗi khi đăng bình luận!");
        },
      }
    );
  };
  useEffect(() => {
    if (commentChildData?.data && page === 1) {
      setCommentChild(commentChildData.data.comments);
    }
  }, [commentChildData]);
  useEffect(() => {
    if (commentChildData?.data && page !== 1) {
      setCommentChild([...commentChild, ...commentChildData.data.comments]);
    }
  }, [commentChildData]);
  useEffect(() => {
    if (page !== 0) {
      refetchCommentChild();
    }
  }, [page]);
  return (
    <div>
      <Card key={comment.commentId} className="shadow-sm" size="small">
        <div className="flex">
          <Avatar
            src={comment.avatar}
            icon={<UserOutlined />}
            className="flex-shrink-0 mr-3"
          />
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <Text strong>{comment.userName}</Text>
                <div className="text-xs text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {comment.createdAt}
                </div>
              </div>
            </div>
            <Paragraph className="!my-1">{comment.content}</Paragraph>
            <Flex justify="end">
              <Button
                type="text"
                size="small"
                icon={<CommentOutlined />}
                onClick={() => setIsReply(!isReply)}
              >
                Trả lời
              </Button>
            </Flex>
          </div>
        </div>
      </Card>
      {isReply && (
        <Card
          className={` shadow-sm mt-2 !transition-all !duration-500 !ease-in-out !origin-top ${
            isReply
              ? "max-h-screen scale-y-100 opacity-100 !mb-6"
              : "max-h-0 scale-y-0 opacity-0 !mb-0"
          } `}
        >
          <Title level={5} className="!mb-4 flex items-center">
            <CommentOutlined className="mr-2 text-2xl" />
            {t("comment.reply")}
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
      )}
      {comment.replyCount > 0 && (
        <div className="flex justify-start !w-full">
          <div className="w-4 mt-2 border-b border-l border-gray-300 rounded-bl"></div>
          <div className="flex flex-col flex-1 gap-2 mt-2">
            {commentChild?.map((commentChild) => (
              <Card
                key={commentChild.commentId}
                className="!w-full shadow-sm"
                size="small"
              >
                <div className="flex">
                  <Avatar
                    src={commentChild.avatar}
                    icon={<UserOutlined />}
                    className="flex-shrink-0 mr-3"
                  />
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <Text strong>{commentChild.userName}</Text>
                        <div className="text-xs text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {commentChild.createdAt}
                        </div>
                      </div>
                    </div>
                    <Paragraph className="!my-1">
                      {commentChild.content}
                    </Paragraph>
                  </div>
                </div>
              </Card>
            ))}
            {commentChild.length < replyCommentCount && (
              <Button
                loading={isFetchingCommentChild}
                type="text"
                size="small"
                className="hover:!bg-transparent !text-text-color translate-y-3 self-start"
                onClick={() => setPage(page + 1)}
              >
                {t("common.seeMore")}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
