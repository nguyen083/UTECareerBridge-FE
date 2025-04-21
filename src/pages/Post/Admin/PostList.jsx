"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Avatar,
  Divider,
  Tag,
  Modal,
  message,
  Breadcrumb,
  Dropdown,
  Menu,
  Tooltip,
  Pagination,
} from "antd";
import {
  UserOutlined,
  HomeOutlined,
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  SmileOutlined,
  HeartOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const { Title, Text, Paragraph } = Typography;

const PostList = () => {
  const { forumId, topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState(null);
  const [forum, setForum] = useState(null);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

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

  // Giả lập dữ liệu
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu
    setTimeout(() => {
      setForum({
        forum_id: Number.parseInt(forumId),
        name: "Công nghệ",
        description:
          "Thảo luận về công nghệ, phần mềm, phần cứng và các xu hướng mới",
        is_active: true,
        created_at: "2023-01-15T08:30:00Z",
      });

      setTopic({
        topic_id: Number.parseInt(topicId),
        forum_id: Number.parseInt(forumId),
        user_id: 101,
        username: "nguyenvan",
        title: "Tổng quan về React và các thư viện UI phổ biến",
        content:
          "React là một thư viện JavaScript phổ biến để xây dựng giao diện người dùng. Bài viết này sẽ giới thiệu về React và các thư viện UI phổ biến như Ant Design, Material-UI, và Tailwind CSS.",
        view_count: 1250,
        is_pinned: true,
        is_close: false,
        created_at: "2023-05-10T08:30:00Z",
        updated_at: "2023-05-15T10:45:00Z",
        status: "active",
        tags: ["React", "Frontend", "JavaScript"],
      });

      setPosts([
        {
          post_id: 1,
          topic_id: Number.parseInt(topicId),
          user_id: 101,
          username: "nguyenvan",
          avatar: null,
          content: `<h1>React là gì?</h1>
<p>React là một thư viện JavaScript để xây dựng giao diện người dùng. Nó được phát triển bởi Facebook và được sử dụng rộng rãi trong ngành công nghiệp phần mềm.</p>
<h2>Ưu điểm của React</h2>
<ul>
  <li><strong>Component-Based</strong>: React cho phép bạn xây dựng UI từ các component độc lập, có thể tái sử dụng.</li>
  <li><strong>Virtual DOM</strong>: React sử dụng Virtual DOM để tối ưu hóa việc render, giúp ứng dụng chạy nhanh hơn.</li>
  <li><strong>One-way Data Binding</strong>: React sử dụng luồng dữ liệu một chiều, giúp code dễ hiểu và dễ debug hơn.</li>
</ul>
<h2>Các thư viện UI phổ biến cho React</h2>
<ol>
  <li><strong>Ant Design</strong>: Một hệ thống thiết kế và thư viện UI cho React, được phát triển bởi Alibaba.</li>
  <li><strong>Material-UI</strong>: Thư viện UI dựa trên Material Design của Google.</li>
  <li><strong>Tailwind CSS</strong>: Framework CSS tiện ích, giúp xây dựng UI nhanh chóng mà không cần viết CSS tùy chỉnh.</li>
</ol>`,
          created_at: "2023-05-10T08:30:00Z",
          updated_at: "2023-05-10T08:30:00Z",
          reactions: [
            { user_id: 102, reaction_type: "like" },
            { user_id: 103, reaction_type: "like" },
            { user_id: 104, reaction_type: "heart" },
          ],
        },
        {
          post_id: 2,
          topic_id: Number.parseInt(topicId),
          user_id: 102,
          username: "lethihong",
          avatar: null,
          content:
            "<p>Tôi đã sử dụng cả Ant Design và Material-UI trong các dự án của mình. Cả hai đều rất tốt, nhưng tôi thấy Ant Design có nhiều component hơn và dễ tùy chỉnh hơn. Tuy nhiên, Material-UI có vẻ phổ biến hơn trong cộng đồng React.</p>",
          created_at: "2023-05-10T09:15:00Z",
          updated_at: "2023-05-10T09:15:00Z",
          reactions: [
            { user_id: 101, reaction_type: "like" },
            { user_id: 103, reaction_type: "smile" },
          ],
        },
        {
          post_id: 3,
          topic_id: Number.parseInt(topicId),
          user_id: 103,
          username: "phamtuan",
          avatar: null,
          content:
            "<p>Tôi thích Tailwind CSS vì nó giúp tôi xây dựng UI nhanh chóng mà không cần viết nhiều CSS. Tuy nhiên, nó có thể làm cho HTML trở nên dài và khó đọc hơn. Có ai có kinh nghiệm kết hợp Tailwind với các thư viện UI như Ant Design hoặc Material-UI không?</p>",
          created_at: "2023-05-10T10:30:00Z",
          updated_at: "2023-05-10T10:30:00Z",
          reactions: [
            { user_id: 101, reaction_type: "like" },
            { user_id: 102, reaction_type: "like" },
            { user_id: 104, reaction_type: "like" },
            { user_id: 105, reaction_type: "like" },
          ],
        },
        {
          post_id: 4,
          topic_id: Number.parseInt(topicId),
          user_id: 104,
          username: "tranminh",
          avatar: null,
          content:
            "<p>Tôi đã kết hợp Tailwind CSS với Ant Design trong một dự án gần đây. Bạn cần phải cẩn thận với các xung đột CSS, nhưng nhìn chung nó hoạt động tốt. Tôi sử dụng Ant Design cho các component phức tạp như Table, Form, và Modal, và sử dụng Tailwind CSS cho layout và styling chung.</p>",
          created_at: "2023-05-10T11:45:00Z",
          updated_at: "2023-05-10T11:45:00Z",
          reactions: [
            { user_id: 103, reaction_type: "like" },
            { user_id: 105, reaction_type: "like" },
          ],
        },
        {
          post_id: 5,
          topic_id: Number.parseInt(topicId),
          user_id: 105,
          username: "hoangnam",
          avatar: null,
          content:
            "<p>Một điều quan trọng khi chọn thư viện UI là xem xét kích thước bundle của nó. Material-UI và Ant Design đều khá lớn, có thể ảnh hưởng đến thời gian tải trang. Nếu bạn quan tâm đến hiệu suất, bạn có thể xem xét các thư viện nhẹ hơn như Chakra UI hoặc sử dụng CSS-in-JS với styled-components.</p>",
          created_at: "2023-05-10T13:20:00Z",
          updated_at: "2023-05-10T13:20:00Z",
          reactions: [
            { user_id: 101, reaction_type: "like" },
            { user_id: 102, reaction_type: "like" },
            { user_id: 103, reaction_type: "like" },
            { user_id: 104, reaction_type: "heart" },
          ],
        },
      ]);
    }, 1000);
  }, [forumId, topicId]);

  const handleReply = () => {
    setReplyContent("");
    setIsReplyModalVisible(true);
  };

  const handleReplyCancel = () => {
    setIsReplyModalVisible(false);
  };

  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      message.error("Vui lòng nhập nội dung bài viết!");
      return;
    }

    const newPost = {
      post_id: posts.length + 1,
      topic_id: Number.parseInt(topicId),
      user_id: 101, // Giả sử user_id của người dùng hiện tại
      username: "nguyenvan", // Giả sử username của người dùng hiện tại
      avatar: null,
      content: replyContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: [],
    };
    setPosts([...posts, newPost]);
    setIsReplyModalVisible(false);
    message.success("Đã đăng bài viết thành công!");
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setIsEditModalVisible(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = () => {
    if (!editContent.trim()) {
      message.error("Vui lòng nhập nội dung bài viết!");
      return;
    }

    const updatedPosts = posts.map((post) =>
      post.post_id === editingPost.post_id
        ? {
            ...post,
            content: editContent,
            updated_at: new Date().toISOString(),
          }
        : post
    );
    setPosts(updatedPosts);
    setIsEditModalVisible(false);
    message.success("Cập nhật bài viết thành công!");
  };

  const handleDelete = (postId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      onOk() {
        const updatedPosts = posts.filter((post) => post.post_id !== postId);
        setPosts(updatedPosts);
        message.success("Xóa bài viết thành công!");
      },
    });
  };

  const handleReaction = (postId, reactionType) => {
    const userId = 101; // Giả sử user_id của người dùng hiện tại

    const updatedPosts = posts.map((post) => {
      if (post.post_id === postId) {
        // Kiểm tra xem người dùng đã reaction chưa
        const existingReactionIndex = post.reactions.findIndex(
          (r) => r.user_id === userId
        );

        if (existingReactionIndex !== -1) {
          // Nếu đã reaction với cùng loại, xóa reaction
          if (
            post.reactions[existingReactionIndex].reaction_type === reactionType
          ) {
            return {
              ...post,
              reactions: post.reactions.filter(
                (_, index) => index !== existingReactionIndex
              ),
            };
          }
          // Nếu đã reaction với loại khác, cập nhật loại
          else {
            const newReactions = [...post.reactions];
            newReactions[existingReactionIndex] = {
              user_id: userId,
              reaction_type: reactionType,
            };
            return {
              ...post,
              reactions: newReactions,
            };
          }
        }
        // Nếu chưa reaction, thêm mới
        else {
          return {
            ...post,
            reactions: [
              ...post.reactions,
              { user_id: userId, reaction_type: reactionType },
            ],
          };
        }
      }
      return post;
    });

    setPosts(updatedPosts);
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

  const getReactionCount = (reactions, type) => {
    return reactions.filter((r) => r.reaction_type === type).length;
  };

  const hasUserReacted = (reactions, type) => {
    const userId = 101; // Giả sử user_id của người dùng hiện tại
    return reactions.some(
      (r) => r.user_id === userId && r.reaction_type === type
    );
  };

  const paginatedPosts = posts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item href="/">
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item href="/forums">Diễn đàn</Breadcrumb.Item>
        <Breadcrumb.Item href={`/forums/${forumId}/topics`}>
          {forum?.name || "Đang tải..."}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{topic?.title || "Đang tải..."}</Breadcrumb.Item>
      </Breadcrumb>

      {topic && (
        <Card className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <Title level={2} className="mb-1">
                {topic.title}
              </Title>
              <div className="flex flex-wrap gap-1 mb-2">
                {topic.tags.map((tag) => (
                  <Tag key={tag} color="blue">
                    {tag}
                  </Tag>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <Space>
                  <span>
                    Tạo bởi <Text strong>{topic.username}</Text>
                  </span>
                  <span>• {formatDate(topic.created_at)}</span>
                  <span>
                    • <EyeOutlined /> {topic.view_count} lượt xem
                  </span>
                </Space>
              </div>
            </div>
            <div className="flex gap-2">
              {!topic.is_close && (
                <Button type="primary" onClick={handleReply}>
                  <MessageOutlined /> Trả lời
                </Button>
              )}
            </div>
          </div>
          <Paragraph>{topic.content}</Paragraph>
        </Card>
      )}

      {paginatedPosts.map((post) => (
        <Card key={post.post_id} className="mb-4">
          <div className="flex">
            <div className="flex-shrink-0 w-40 pr-4 border-r">
              <div className="flex flex-col items-center">
                <Avatar size={64} icon={<UserOutlined />} />
                <Text strong className="mt-2">
                  {post.username}
                </Text>
                <Text type="secondary" className="text-xs">
                  Thành viên
                </Text>
                <div className="mt-2 text-xs text-gray-500">
                  Tham gia: {formatDate(post.created_at).split(",")[0]}
                </div>
              </div>
            </div>
            <div className="flex-grow pl-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {formatDate(post.created_at)}
                  {post.updated_at !== post.created_at && (
                    <Tooltip
                      title={`Cập nhật lần cuối: ${formatDate(
                        post.updated_at
                      )}`}
                    >
                      <span className="ml-2">(đã chỉnh sửa)</span>
                    </Tooltip>
                  )}
                </div>
                <div>
                  <Dropdown
                    overlay={
                      <Menu>
                        {post.user_id === 101 && ( // Giả sử user_id của người dùng hiện tại
                          <>
                            <Menu.Item
                              key="edit"
                              onClick={() => handleEdit(post)}
                            >
                              <EditOutlined /> Chỉnh sửa
                            </Menu.Item>
                            <Menu.Item
                              key="delete"
                              danger
                              onClick={() => handleDelete(post.post_id)}
                            >
                              <DeleteOutlined /> Xóa
                            </Menu.Item>
                          </>
                        )}
                        <Menu.Item key="report">
                          <FileTextOutlined /> Báo cáo
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={["click"]}
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
              </div>
              <div
                className="mb-4 post-content quill-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
              <Divider className="my-2" />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Tooltip title="Thích">
                    <Button
                      type="text"
                      icon={<LikeOutlined />}
                      className={
                        hasUserReacted(post.reactions, "like")
                          ? "text-blue-500"
                          : ""
                      }
                      onClick={() => handleReaction(post.post_id, "like")}
                    >
                      {getReactionCount(post.reactions, "like") > 0 &&
                        getReactionCount(post.reactions, "like")}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Không thích">
                    <Button
                      type="text"
                      icon={<DislikeOutlined />}
                      className={
                        hasUserReacted(post.reactions, "dislike")
                          ? "text-red-500"
                          : ""
                      }
                      onClick={() => handleReaction(post.post_id, "dislike")}
                    >
                      {getReactionCount(post.reactions, "dislike") > 0 &&
                        getReactionCount(post.reactions, "dislike")}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Cười">
                    <Button
                      type="text"
                      icon={<SmileOutlined />}
                      className={
                        hasUserReacted(post.reactions, "smile")
                          ? "text-yellow-500"
                          : ""
                      }
                      onClick={() => handleReaction(post.post_id, "smile")}
                    >
                      {getReactionCount(post.reactions, "smile") > 0 &&
                        getReactionCount(post.reactions, "smile")}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Yêu thích">
                    <Button
                      type="text"
                      icon={<HeartOutlined />}
                      className={
                        hasUserReacted(post.reactions, "heart")
                          ? "text-pink-500"
                          : ""
                      }
                      onClick={() => handleReaction(post.post_id, "heart")}
                    >
                      {getReactionCount(post.reactions, "heart") > 0 &&
                        getReactionCount(post.reactions, "heart")}
                    </Button>
                  </Tooltip>
                </div>
                <div>
                  <Button type="text" onClick={() => handleReply()}>
                    <CommentOutlined /> Trả lời
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={posts.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>

      {!topic?.is_close && (
        <div className="mt-6 text-center">
          <Button type="primary" size="large" onClick={handleReply}>
            <MessageOutlined /> Trả lời chủ đề này
          </Button>
        </div>
      )}

      <Modal
        title="Trả lời"
        open={isReplyModalVisible}
        onCancel={handleReplyCancel}
        onOk={handleReplySubmit}
        width={800}
        okText="Đăng bài"
        cancelText="Hủy"
      >
        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={replyContent}
            onChange={setReplyContent}
            modules={modules}
            formats={formats}
            style={{ height: "300px", marginBottom: "40px" }}
          />
        </div>
      </Modal>

      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        onOk={handleEditSubmit}
        width={800}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={editContent}
            onChange={setEditContent}
            modules={modules}
            formats={formats}
            style={{ height: "300px", marginBottom: "40px" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default PostList;
