"use client";

import { Avatar, Typography, Button, Input, message } from "antd";
import { MessageOutlined, SendOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  useCreateComment,
  useGetCommentChildrenByCommentId,
} from "../../../composables/comment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const CommentList = ({
  isOpenModal,
  comments = [],
  page,
  setPage,
  totalPage,
  isPendingComments,
  post,
}) => {
  const { t } = useTranslation();
  return (
    <div className="mt-4 overflow-y-scroll max-h-[70vh] scrollbar-webkit scrollbar-thin">
      {comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              isOpenModal={isOpenModal}
              key={comment.commentId}
              comment={comment}
              post={post}
            />
          ))}
          {!(page === totalPage && !isPendingComments) && (
            <Button
              loading={isPendingComments}
              onClick={() => setPage(page + 1)}
              type="text"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              {t("common.seeMore")}
            </Button>
          )}
        </div>
      ) : (
        <div className="py-6 text-center rounded-lg bg-gray-50">
          <MessageOutlined
            style={{ fontSize: 48 }}
            className="mb-4 text-gray-300"
          />
          <Paragraph className="text-gray-500">{t("post.noComment")}</Paragraph>
        </div>
      )}
    </div>
  );
};

// Component for rendering a child comment with its own replies
const ChildCommentItem = ({ childComment, post, isOpenModal }) => {
  const [isReply, setIsReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyComments, setReplyComments] = useState([]);
  const [replyCount, setReplyCount] = useState(childComment.replyCount || 0);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const {
    data: commentChildData,
    isFetching: isFetchingCommentChild,
    refetch: refetchCommentChild,
  } = useGetCommentChildrenByCommentId(childComment.commentId, page);
  const student = useSelector((state) => state.student);
  const employer = useSelector((state) => state.employer);

  const handleCommentSubmit = () => {
    createComment(
      {
        postId: +post.data.postId,
        content: commentText,
        parentId: childComment.commentId,
      },
      {
        onSuccess: (response) => {
          setReplyCount(replyCount + 1);
          setReplyComments([response.data, ...replyComments]);
          setCommentText("");
          setIsReply(false);
        },
        onError: () => {
          message.error(t("comment.login"));
          navigate("/login");
        },
      }
    );
  };
  useEffect(() => {
    if (!isOpenModal) {
      setCommentText("");
      setIsReply(false);
    }
  }, [isOpenModal]);
  useEffect(() => {
    if (commentChildData?.data && page === 1) {
      setReplyComments(commentChildData.data.comments);
    }
  }, [commentChildData]);

  useEffect(() => {
    if (commentChildData?.data && page !== 1) {
      setReplyComments([...commentChildData.data.comments, ...replyComments]);
    }
  }, [commentChildData]);

  useEffect(() => {
    if (page !== 0) {
      refetchCommentChild();
    }
  }, [page]);

  return (
    <div className="mb-2">
      <div className="flex items-start">
        <Avatar
          src={childComment.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 mr-2"
          size={32}
        />
        <div className="flex-col">
          <div className="px-3 py-2 bg-gray-100 rounded-2xl">
            <Text strong className="text-sm">
              {childComment.userName}
            </Text>
            <Paragraph className="!my-1 text-sm">
              {childComment.content}
            </Paragraph>
          </div>
          <div className="flex items-center pl-2 mt-1 text-xs text-gray-500">
            <Button
              type="text"
              size="small"
              className="px-1 text-xs font-medium text-gray-600 hover:text-blue-600"
              onClick={() => setIsReply(!isReply)}
            >
              {t("comment.reply")}
            </Button>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">
              {childComment.createdAt}
            </span>
          </div>

          {replyCount > 0 && (
            <div className="pl-2 mt-1">
              {replyComments.length > 0 ? (
                <span className="text-sm text-gray-500">{`${replyCount} phản hồi`}</span>
              ) : (
                <Button
                  type="text"
                  size="small"
                  loading={isFetchingCommentChild}
                  className="flex items-center px-0 text-xs font-medium hover:!bg-transparent text-text-color hover:text-text-color-hover"
                  onClick={() => (page === 0 ? setPage(1) : null)}
                >
                  {`Xem ${replyCount} phản hồi`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Third level replies */}
      {replyComments.length > 0 && (
        <div className="pl-8 mt-2 space-y-2">
          {replyComments.map((replyComment) => (
            <div key={replyComment.commentId} className="flex items-start">
              <Avatar
                src={replyComment.avatar}
                icon={<UserOutlined />}
                className="flex-shrink-0 mr-2"
                size={28}
              />
              <div className="flex-col">
                <div className="px-3 py-2 bg-gray-100 rounded-2xl">
                  <Text strong className="text-sm">
                    {replyComment.userName}
                  </Text>
                  <Paragraph className="!my-1 text-sm">
                    {replyComment.content}
                  </Paragraph>
                </div>
                <div className="flex items-center pl-2 mt-1 text-xs text-gray-500">
                  <span className="text-xs text-gray-500">
                    {replyComment.createdAt}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {replyComments.length < replyCount && (
            <Button
              loading={isFetchingCommentChild}
              type="text"
              size="small"
              className="ml-8 text-xs font-medium text-blue-600 hover:text-blue-800"
              onClick={() => setPage(page + 1)}
            >
              {t("common.seeMore")}
            </Button>
          )}
        </div>
      )}

      {/* Reply input for third level */}
      {isReply && (
        <div className="pl-8 mt-2">
          <div className="flex items-center gap-2">
            <Avatar
              src={student.profileImage || employer.companyLogo}
              icon={<UserOutlined />}
              className="flex-shrink-0 mr-2"
              size={28}
            />
            <div className="flex-grow">
              <TextArea
                rows={1}
                placeholder={t("post.writeComment")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-gray-100 resize-none rounded-3xl scrollbar-webkit scrollbar-thin"
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </div>
            <Button
              loading={isCreatingComment}
              type="text"
              onClick={handleCommentSubmit}
              size="small"
              className="rounded-full"
              disabled={!commentText.trim()}
              icon={<SendOutlined className="!text-2xl text-text-color" />}
            ></Button>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, post, isOpenModal }) => {
  const [replyCommentCount, setReplyCommentCount] = useState(
    comment.replyCount
  );
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const [isReply, setIsReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const {
    data: commentChildData,
    isFetching: isFetchingCommentChild,
    refetch: refetchCommentChild,
  } = useGetCommentChildrenByCommentId(comment.commentId, page);
  const [isFetchingMoreCommentChild, setIsFetchingMoreCommentChild] =
    useState(false);
  const [commentChild, setCommentChild] = useState([]);
  const { t } = useTranslation();
  const student = useSelector((state) => state.student);
  const employer = useSelector((state) => state.employer);
  const handleCommentSubmit = () => {
    createComment(
      {
        postId: +post.data.postId,
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
          message.error(t("comment.login"));
          navigate("/login");
        },
      }
    );
  };
  useEffect(() => {
    if (!isOpenModal) {
      setCommentText("");
      setIsReply(false);
    }
  }, [isOpenModal]);
  useEffect(() => {
    if (commentChildData?.data && page === 1) {
      setCommentChild(commentChildData.data.comments);
    }
  }, [commentChildData]);
  useEffect(() => {
    if (commentChildData?.data && page !== 1) {
      setCommentChild([...commentChildData.data.comments, ...commentChild]);
    }
  }, [commentChildData]);
  useEffect(() => {
    if (page !== 0) {
      refetchCommentChild();
    }
  }, [page]);
  useEffect(() => {
    if (isFetchingCommentChild) {
      setIsFetchingMoreCommentChild(true);
    } else {
      setIsFetchingMoreCommentChild(false);
    }
  }, [isFetchingCommentChild]);
  return (
    <div className="mb-3">
      <div className="flex items-start">
        <Avatar
          src={comment.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 mr-3"
          size={36}
        />
        <div className="flex-col">
          <div className="px-3 py-2 bg-gray-100 rounded-2xl">
            <div className="flex items-start justify-between">
              <div>
                <Text strong className="text-sm">
                  {comment.userName}
                </Text>
              </div>
            </div>
            <Paragraph className="!my-1 text-sm">{comment.content}</Paragraph>
          </div>
          <div className="flex items-center pl-2 mt-1 text-xs text-gray-500">
            <Button
              type="text"
              size="small"
              className="px-1 text-xs font-medium text-gray-600 hover:text-blue-600"
              onClick={() => setIsReply(!isReply)}
            >
              {t("comment.reply")}
            </Button>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{comment.createdAt}</span>
          </div>

          {comment.replyCount > 0 && (
            <div className="pl-2 mt-1">
              {commentChild.length > 0 ? (
                <span className="text-sm text-gray-500">{`${replyCommentCount} phản hồi`}</span>
              ) : (
                <Button
                  type="text"
                  size="small"
                  loading={isFetchingMoreCommentChild}
                  className="flex items-center px-0 text-xs font-medium hover:!bg-transparent text-text-color hover:text-text-color-hover"
                  onClick={() => (page === 0 ? setPage(1) : null)}
                >
                  {`Xem ${replyCommentCount} phản hồi`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {commentChild.length > 0 && (
        <div className="pl-12 mt-2 space-y-3">
          {commentChild.map((childComment) => (
            <ChildCommentItem
              key={childComment.commentId}
              childComment={childComment}
              post={post}
              isOpenModal={isOpenModal}
            />
          ))}

          {commentChild.length < replyCommentCount && (
            <Button
              loading={isFetchingMoreCommentChild}
              type="text"
              size="small"
              className="ml-10 text-xs font-medium text-blue-600 hover:text-blue-800"
              onClick={() => setPage(page + 1)}
            >
              {t("common.seeMore")}
            </Button>
          )}
        </div>
      )}

      {isReply && (
        <div className="pl-12 mt-2">
          <div className="flex items-center gap-2 ">
            <Avatar
              src={student.profileImage || employer.companyLogo}
              icon={<UserOutlined />}
              className="flex-shrink-0 mr-2"
              size={32}
            />
            <div className="flex-grow">
              <TextArea
                rows={1}
                placeholder={t("post.writeComment")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-gray-100 resize-none rounded-3xl scrollbar-webkit scrollbar-thin"
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
            </div>
            <Button
              loading={isCreatingComment}
              type="text"
              onClick={handleCommentSubmit}
              size="small"
              className="rounded-full"
              disabled={!commentText.trim()}
              icon={<SendOutlined className="!text-2xl text-text-color" />}
            ></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
