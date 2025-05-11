"use client";

import { Avatar, Typography, Button, Input, message, Modal, Tooltip, Badge } from "antd";
import {
  DeleteOutlined,
  MessageOutlined,
  SendOutlined,
  UserOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import {
  useCreateComment,
  useDeleteComment,
  useGetCommentChildrenByCommentId,
  useUpdateComment,
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
    <div className="mt-4 overflow-y-auto max-h-[70vh] scrollbar-webkit scrollbar-thin pr-1">
      {comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              isOpenModal={isOpenModal}
              key={comment.commentId}
              comment={comment}
              post={post}
            />
          ))}
          {!(page === totalPage && !isPendingComments) && (
            <div className="flex justify-center">
              <Button
                loading={isPendingComments}
                onClick={() => setPage(page + 1)}
                type="primary"
                className="font-medium bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
              >
                {t("common.seeMore")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center rounded-lg bg-gray-50 shadow-sm">
          <MessageOutlined
            style={{ fontSize: 48 }}
            className="mb-4 text-gray-300"
          />
          <Paragraph className="text-gray-500 text-base">{t("post.noComment")}</Paragraph>
        </div>
      )}
    </div>
  );
};

// Component for rendering a child comment with its own replies
const ChildCommentItem = ({
  childComment,
  post,
  isOpenModal,
  onDeleteChildComment,
}) => {
  const commentInputRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [isReply, setIsReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyComments, setReplyComments] = useState([]);
  const [replyCount, setReplyCount] = useState(childComment.replyCount || 0);
  const [page, setPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(childComment.content);
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
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment();
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
          setReplyComments([...replyComments, response.data]);
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
  const handleUpdateComment = (commentId, newContent) => {
    updateComment(
      { commentId, data: { content: newContent } },
      {
        onSuccess: () => {
          message.success(t("comment.updateSuccess"));
          const isThirdLevelComment = replyComments.some(
            (c) => c.commentId === commentId
          );

          if (isThirdLevelComment) {
            setReplyComments(
              replyComments.map((comment) =>
                comment.commentId === commentId
                  ? { ...comment, content: newContent, isEditing: false }
                  : comment
              )
            );
          } else {
            childComment.content = newContent;
            setIsEditing(false);
          }
        },
        onError: () => {
          message.error(t("comment.updateError"));
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

  const handleDeleteComment = (commentId, parentCommentId) => {
    Modal.confirm({
      title: t("comment.delete"),
      content: t("comment.deleteConfirm"),
      centered: true,
      onOk: () => {
        deleteComment(
          { commentId, parentCommentId },
          {
            onSuccess: () => {
              message.success(t("comment.deleteSuccess"));
              setReplyComments(
                replyComments.filter((c) => c.commentId !== commentId)
              );
              setReplyCount((prev) => prev - 1);
              onDeleteChildComment && onDeleteChildComment(commentId);
            },
            onError: () => {
              message.error(t("comment.deleteError"));
            },
          }
        );
      },
    });
  };
  useEffect(() => {
    if (commentInputRef.current && isReply) {
      commentInputRef.current.focus();
    }
  }, [isReply]);
  return (
    <div className="mb-3">
      <div className="flex items-start gap-3">
        <Avatar
          src={childComment.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 border-2 border-gray-100 shadow-sm"
          size={32}
        />
        <div className={`flex-col ${isEditing ? "w-full" : ""}`}>
          {isEditing ? (
            <div className="flex flex-col space-y-2 w-full">
              <TextArea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="rounded-xl shadow-sm border-gray-200"
                autoSize={{ minRows: 1, maxRows: 3 }}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    handleUpdateComment(childComment.commentId, editText)
                  }
                  loading={isUpdatingComment}
                  className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm"
                >
                  {t("common.save")}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(childComment.content);
                  }}
                  className="hover:border-gray-400"
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="px-3.5 py-2.5 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
                <div className="flex justify-between items-start">
                  <Text strong className="text-sm text-gray-800 mr-2">
                    {childComment.userName}
                  </Text>
                  <div className="flex mt-0.5">
                    {user.userId === childComment.userId && !isEditing && (
                      <Tooltip title={t("common.edit")}>
                        <Button
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          icon={<EditOutlined className="text-gray-500 hover:text-blue-500" />}
                          className="px-1 h-5"
                        />
                      </Tooltip>
                    )}
                    {(user.userId === childComment.userId ||
                      user.userId === post.data.userId ||
                      user.role === "admin") && !isEditing && (
                      <Tooltip title={t("common.delete")}>
                        <Button
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComment(
                              childComment.commentId,
                              childComment.parentCommentId
                            );
                          }}
                          loading={isDeletingComment}
                          icon={<DeleteOutlined className="text-gray-500 hover:text-red-500" />}
                          className="px-1 h-5"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Paragraph className="!my-1 text-sm text-gray-700">
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
            </div>
          )}
          
          {replyCount > 0 && (
            <div className="pl-2 mt-1">
              {replyComments.length > 0 ? (
                <></>
              ) : (
                <Button
                  type="text"
                  size="small"
                  loading={isFetchingCommentChild}
                  className="flex items-center px-0 text-xs font-medium hover:!bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => (page === 0 ? setPage(1) : null)}
                  icon={<MessageOutlined className="mr-1" />}
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
        <div className="pl-10 mt-2.5 space-y-3">
          {replyComments.map((replyComment) => (
            <div key={replyComment.commentId} className="flex items-start gap-2">
              <Avatar
                src={replyComment.avatar}
                icon={<UserOutlined />}
                className="flex-shrink-0 border-2 border-gray-100 shadow-sm"
                size={28}
              />
              <div
                className={`flex-col ${replyComment.isEditing ? "w-full" : ""}`}
              >
                {replyComment.isEditing ? (
                  <div className="flex flex-col space-y-2 w-full">
                    <TextArea
                      autoFocus
                      value={replyComment.editText}
                      onChange={(e) => {
                        const updatedComments = replyComments.map((c) =>
                          c.commentId === replyComment.commentId
                            ? { ...c, editText: e.target.value }
                            : c
                        );
                        setReplyComments(updatedComments);
                      }}
                      className="rounded-xl shadow-sm border-gray-200"
                      autoSize={{ minRows: 1, maxRows: 3 }}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="primary"
                        size="small"
                        onClick={() =>
                          handleUpdateComment(
                            replyComment.commentId,
                            replyComment.editText
                          )
                        }
                        loading={isUpdatingComment}
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        {t("common.save")}
                      </Button>
                      <Button
                        size="small"
                        onClick={() => {
                          const updatedComments = replyComments.map((c) =>
                            c.commentId === replyComment.commentId
                              ? { ...c, isEditing: false }
                              : c
                          );
                          setReplyComments(updatedComments);
                        }}
                      >
                        {t("common.cancel")}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-full px-3 py-2 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
                      <div className="flex justify-between items-start">
                        <Text strong className="text-sm text-gray-800 mr-2">
                          {replyComment.userName}
                        </Text>
                        <div className="flex mt-0.5">
                          {user.userId === replyComment.userId && !replyComment.isEditing && (
                            <Tooltip title={t("common.edit")}>
                              <Button
                                type="text"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const updatedComments = replyComments.map((c) =>
                                    c.commentId === replyComment.commentId
                                      ? { ...c, isEditing: true, editText: c.content }
                                      : c
                                  );
                                  setReplyComments(updatedComments);
                                }}
                                icon={<EditOutlined className="text-gray-500 hover:text-blue-500" />}
                                className="px-1 h-5"
                              />
                            </Tooltip>
                          )}
                          {(user.userId === replyComment.userId ||
                            user.userId === post.data.userId ||
                            user.role === "admin") && !replyComment.isEditing && (
                            <Tooltip title={t("common.delete")}>
                              <Button
                                type="text"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteComment(
                                    replyComment.commentId,
                                    replyComment.parentCommentId
                                  );
                                }}
                                loading={isDeletingComment}
                                icon={<DeleteOutlined className="text-gray-500 hover:text-red-500" />}
                                className="px-1 h-5"
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                      <Paragraph className="!my-1 text-sm text-gray-700">
                        {replyComment.content}
                      </Paragraph>
                    </div>
                    <div className="flex items-center pl-2 mt-1">
                      <span className="text-xs text-gray-500">
                        {replyComment.createdAt}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {replyComments.length < replyCount && (
            <div className="ml-10">
              <Button
                loading={isFetchingCommentChild}
                type="text"
                size="small"
                className="flex items-center text-xs font-medium text-blue-500 hover:text-blue-700"
                onClick={() => setPage(page + 1)}
                icon={<MessageOutlined className="mr-1" />}
              >
                {t("common.seeMore")}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Reply input for third level */}
      {isReply && (
        <div className="pl-10 mt-3">
          <div className="flex items-start gap-2">
            <Avatar
              src={student.profileImage || employer.companyLogo}
              icon={<UserOutlined />}
              className="flex-shrink-0 border-2 border-gray-100 shadow-sm"
              size={28}
            />
            <div className="flex-grow">
              <TextArea
                ref={commentInputRef}
                rows={1}
                placeholder={t("post.writeComment")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-gray-100 resize-none rounded-2xl shadow-sm border-transparent focus:border-blue-400 focus:bg-white transition-all"
                autoSize={{ minRows: 1, maxRows: 3 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    if (commentText.trim()) handleCommentSubmit();
                  }
                }}
              />
              <div className="flex justify-end mt-2">
                <Button
                  loading={isCreatingComment}
                  type="primary"
                  onClick={handleCommentSubmit}
                  size="small"
                  className="flex items-center rounded-full shadow-sm bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!commentText.trim()}
                  icon={<SendOutlined />}
                >
                  {t("comment.send") || "Gửi"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, post, isOpenModal }) => {
  const commentInputRef = useRef(null);
  const user = useSelector((state) => state.user);
  const [replyCommentCount, setReplyCommentCount] = useState(
    comment.replyCount
  );
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const { mutate: createComment, isPending: isCreatingComment } =
    useCreateComment();
  const [isReply, setIsReply] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const {
    data: commentChildData,
    isFetching: isFetchingCommentChild,
    refetch: refetchCommentChild,
  } = useGetCommentChildrenByCommentId(comment.commentId, page);
  const { mutate: deleteComment, isPending: isDeletingComment } =
    useDeleteComment();
  const { mutate: updateComment, isPending: isUpdatingComment } =
    useUpdateComment();
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
          setCommentChild([...commentChild, response.data]);
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
  const handleDeleteChildComment = (deletedCommentId) => {
    setCommentChild(
      commentChild.filter((c) => c.commentId !== deletedCommentId)
    );
    setReplyCommentCount((prev) => prev - 1);
  };
  const handleDeleteComment = (commentId, parentCommentId) => {
    Modal.confirm({
      title: t("comment.delete"),
      content: t("comment.deleteConfirm"),
      centered: true,
      okButtonProps: {
        className: "bg-red-500 hover:bg-red-600",
      },
      onOk: () => {
        deleteComment(
          { commentId, parentCommentId },
          {
            onSuccess: () => {
              message.success(t("comment.deleteSuccess"));
              if (parentCommentId) {
                setCommentChild(
                  commentChild.filter((c) => c.commentId !== commentId)
                );
                setReplyCommentCount((prev) => prev - 1);
              } else {
                setCommentChild(
                  commentChild.filter((c) => c.commentId !== commentId)
                );
                setReplyCommentCount((prev) => prev - 1);
              }
            },
            onError: () => {
              message.error(t("comment.deleteError"));
            },
          }
        );
      },
    });
  };
  const handleUpdateComment = (commentId, newContent) => {
    updateComment(
      { commentId, data: { content: newContent } },
      {
        onSuccess: () => {
          message.success(t("comment.updateSuccess"));
          const isSecondLevelComment = commentChild.some(
            (c) => c.commentId === commentId
          );

          if (isSecondLevelComment) {
            setCommentChild(
              commentChild.map((comment) =>
                comment.commentId === commentId
                  ? { ...comment, content: newContent, isEditing: false }
                  : comment
              )
            );
          } else {
            comment.content = newContent;
            setIsEditing(false);
          }
        },
        onError: () => {
          message.error(t("comment.updateError"));
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
      setCommentChild([...commentChild, ...commentChildData.data.comments]);
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
  useEffect(() => {
    if (commentInputRef.current && isReply) {
      commentInputRef.current.focus();
    }
  }, [isReply]);
  return (
    <div className="mb-5 transition-all duration-300">
      <div className="flex items-start gap-3">
        <Avatar
          src={comment.avatar}
          icon={<UserOutlined />}
          className="flex-shrink-0 border-2 border-gray-100 shadow-sm"
          size={38}
        />
        <div className={`flex-col ${isEditing ? "w-full" : ""} flex-grow`}>
          {isEditing ? (
            <div className="flex flex-col space-y-2 w-full">
              <TextArea
                autoFocus
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="rounded-xl shadow-sm border-gray-200"
                autoSize={{ minRows: 2, maxRows: 4 }}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  type="primary"
                  onClick={() => handleUpdateComment(comment.commentId, editText)}
                  loading={isUpdatingComment}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {t("common.save")}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                >
                  {t("common.cancel")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="px-4 py-2.5 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Text strong className="text-base text-gray-800">
                      {comment.userName}
                    </Text>
                    {comment.userId === post.data.userId && (
                      <Badge 
                        count="Author" 
                        color="blue" 
                        style={{ fontSize: '10px', padding: '0 6px', height: '16px', lineHeight: '16px' }} 
                      />
                    )}
                  </div>
                  <div className="flex">
                    {user.userId === comment.userId && !isEditing && (
                      <Tooltip title={t("common.edit")}>
                        <Button
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          icon={<EditOutlined className="text-gray-500 hover:text-blue-500" />}
                          className="px-1"
                        />
                      </Tooltip>
                    )}
                    {(user.userId === comment.userId ||
                      user.userId === post.data.userId ||
                      user.role === "admin") &&
                      !isEditing && (
                      <Tooltip title={t("common.delete")}>
                        <Button
                          type="text"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComment(
                              comment.commentId,
                              comment.parentCommentId
                            );
                          }}
                          loading={isDeletingComment}
                          icon={<DeleteOutlined className="text-gray-500 hover:text-red-500" />}
                          className="px-1"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
                <Paragraph className="text-sm text-gray-700 mt-1 mb-0.5">
                  {comment.content}
                </Paragraph>
              </div>
              <div className="flex items-center pl-2 mt-1.5 text-xs text-gray-500">
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
            </div>
          )}
          
          {comment.replyCount > 0 && (
            <div className="pl-2 mt-1.5">
              {commentChild.length > 0 ? (
                <></>
              ) : (
                <Button
                  type="text"
                  size="small"
                  loading={isFetchingMoreCommentChild}
                  className="flex items-center px-0 text-xs font-medium hover:!bg-transparent text-blue-500 hover:text-blue-700"
                  onClick={() => (page === 0 ? setPage(1) : null)}
                  icon={<MessageOutlined className="mr-1" />}
                >
                  {`${t("comment.view") || "Xem"} ${replyCommentCount} ${t("comment.replies") || "phản hồi"}`}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {commentChild.length > 0 && (
        <div className="pl-14 mt-3 space-y-4">
          {commentChild.map((childComment) => (
            <ChildCommentItem
              key={childComment.commentId}
              childComment={childComment}
              post={post}
              isOpenModal={isOpenModal}
              onDeleteChildComment={handleDeleteChildComment}
            />
          ))}

          {commentChild.length < replyCommentCount && (
            <div>
              <Button
                loading={isFetchingMoreCommentChild}
                type="text"
                size="small"
                className="flex items-center text-xs font-medium text-blue-500 hover:text-blue-700"
                onClick={() => setPage(page + 1)}
                icon={<MessageOutlined className="mr-1" />}
              >
                {t("common.seeMore")}
              </Button>
            </div>
          )}
        </div>
      )}

      {isReply && (
        <div className="pl-14 mt-3">
          <div className="flex items-start gap-2">
            <Avatar
              src={student.profileImage || employer.companyLogo}
              icon={<UserOutlined />}
              className="flex-shrink-0 border-2 border-gray-100 shadow-sm"
              size={32}
            />
            <div className="flex-grow">
              <TextArea
                ref={commentInputRef}
                rows={1}
                placeholder={t("post.writeComment")}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="bg-gray-100 resize-none rounded-2xl shadow-sm border-transparent focus:border-blue-400 focus:bg-white transition-all"
                autoSize={{ minRows: 2, maxRows: 4 }}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    if (commentText.trim()) handleCommentSubmit();
                  }
                }}
              />
              <div className="flex justify-end mt-2">
                <Button
                  loading={isCreatingComment}
                  type="primary"
                  onClick={handleCommentSubmit}
                  size="small"
                  className="flex items-center rounded-full shadow-sm bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!commentText.trim()}
                  icon={<SendOutlined />}
                >
                  {t("comment.send") || "Gửi"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentList;
