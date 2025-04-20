import { useState, useEffect, useRef } from "react";
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
  Tooltip,
  Pagination,
  Skeleton,
  Affix,
  Drawer,
  List,
  Tabs,
} from "antd";
import {
  HomeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  BookOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  BellOutlined,
  ArrowUpOutlined,
  MenuOutlined,
  InfoCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useParams, Link } from "react-router-dom";
import ReactionPicker from "./../../../components/Generate/ReactionPicker";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const UserPostList = () => {
  const { forumId, topicId } = useParams();
  const [posts, setPosts] = useState([]);
  const [topic, setTopic] = useState(null);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isInfoDrawerVisible, setIsInfoDrawerVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const topRef = useRef(null);
  const pageSize = 5;

  // Cấu hình Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "list",
    "bullet",
    "link",
    "image",
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
        avatar: "/placeholder.svg?height=40&width=40",
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
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Quản trị viên",
          post_count: 1250,
          join_date: "2022-01-10",
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
</ol>
<p><img src="/placeholder.svg?height=300&width=600" alt="React ecosystem" /></p>`,
          created_at: "2023-05-10T08:30:00Z",
          updated_at: "2023-05-10T08:30:00Z",
          reactions: [
            { user_id: 102, reaction_type: "like" },
            { user_id: 103, reaction_type: "like" },
            { user_id: 104, reaction_type: "heart" },
          ],
          is_best_answer: true,
        },
        {
          post_id: 2,
          topic_id: Number.parseInt(topicId),
          user_id: 102,
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Thành viên",
          post_count: 87,
          join_date: "2022-03-15",
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
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Thành viên tích cực",
          post_count: 342,
          join_date: "2022-02-20",
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
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Thành viên",
          post_count: 56,
          join_date: "2022-05-05",
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
          avatar: "/placeholder.svg?height=40&width=40",
          role: "Chuyên gia",
          post_count: 789,
          join_date: "2021-11-10",
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

      setRelatedTopics([
        {
          topic_id: 10,
          title: "So sánh Next.js và Gatsby cho các dự án React",
          post_count: 18,
          view_count: 876,
        },
        {
          topic_id: 11,
          title: "Tailwind CSS: Ưu và nhược điểm",
          post_count: 12,
          view_count: 654,
        },
        {
          topic_id: 12,
          title: "Ant Design vs Material-UI: Nên chọn thư viện UI nào?",
          post_count: 9,
          view_count: 789,
        },
      ]);

      setActiveUsers([
        {
          user_id: 101,
          username: "nguyenvan",
          avatar: "/placeholder.svg?height=40&width=40",
          post_count: 1250,
        },
        {
          user_id: 105,
          username: "hoangnam",
          avatar: "/placeholder.svg?height=40&width=40",
          post_count: 789,
        },
        {
          user_id: 103,
          username: "phamtuan",
          avatar: "/placeholder.svg?height=40&width=40",
          post_count: 342,
        },
        {
          user_id: 102,
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          post_count: 87,
        },
        {
          user_id: 104,
          username: "tranminh",
          avatar: "/placeholder.svg?height=40&width=40",
          post_count: 56,
        },
      ]);

      setLoading(false);
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
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Thành viên",
      post_count: 1250,
      join_date: "2022-01-10",
      content: replyContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: [],
    };
    setPosts([...posts, newPost]);
    setIsReplyModalVisible(false);
    message.success("Đã đăng bài viết thành công!");
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

  const paginatedPosts = posts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    message.success(
      isBookmarked
        ? "Đã xóa khỏi danh sách đánh dấu"
        : "Đã thêm vào danh sách đánh dấu"
    );
  };

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed);
    message.success(
      isSubscribed
        ? "Đã hủy đăng ký nhận thông báo"
        : "Đã đăng ký nhận thông báo khi có bài viết mới"
    );
  };

  const handleShare = () => {
    // Trong thực tế, bạn sẽ triển khai chức năng chia sẻ
    message.success("Đã sao chép liên kết vào clipboard");
  };

  return (
    <div className="min-h-screen bg-gray-50" ref={topRef}>
      {/* Header */}
      <div className="sticky top-0 z-10 py-4 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/forums">Diễn đàn</Breadcrumb.Item>
              <Breadcrumb.Item href={`/forums/${forumId}/topics`}>
                {forum?.name || "Đang tải..."}
              </Breadcrumb.Item>
              <Breadcrumb.Item>{topic?.title || "Đang tải..."}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center gap-2 md:hidden">
              <Button
                icon={<MenuOutlined />}
                onClick={() => setIsSidebarVisible(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          <div className="flex-grow">
            {/* Topic header */}
            <Skeleton loading={loading} active paragraph={{ rows: 3 }}>
              {topic && (
                <Card className="mb-6 shadow-sm">
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
                        <Space wrap>
                          <span>
                            <Avatar src={topic.avatar} size="small" />{" "}
                            <Text strong>{topic.username}</Text>
                          </span>
                          <span>
                            <ClockCircleOutlined />{" "}
                            {formatDate(topic.created_at)}
                          </span>
                          <span>
                            <EyeOutlined /> {topic.view_count} lượt xem
                          </span>
                          <span>
                            <CommentOutlined /> {posts.length} bài viết
                          </span>
                        </Space>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip
                        title={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
                      >
                        <Button
                          type="text"
                          icon={
                            isBookmarked ? (
                              <BookOutlined className="text-blue-500" />
                            ) : (
                              <BookOutlined />
                            )
                          }
                          onClick={toggleBookmark}
                        />
                      </Tooltip>
                      <Tooltip
                        title={
                          isSubscribed
                            ? "Hủy đăng ký"
                            : "Đăng ký nhận thông báo"
                        }
                      >
                        <Button
                          type="text"
                          icon={
                            isSubscribed ? (
                              <BellOutlined className="text-blue-500" />
                            ) : (
                              <BellOutlined />
                            )
                          }
                          onClick={toggleSubscribe}
                        />
                      </Tooltip>
                      <Tooltip title="Chia sẻ">
                        <Button
                          type="text"
                          icon={<ShareAltOutlined />}
                          onClick={handleShare}
                        />
                      </Tooltip>
                      <Tooltip title="Thông tin chủ đề">
                        <Button
                          type="text"
                          icon={<InfoCircleOutlined />}
                          onClick={() => setIsInfoDrawerVisible(true)}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              )}
            </Skeleton>

            {/* Posts */}
            <Skeleton
              loading={loading}
              active
              paragraph={{ rows: 10 }}
              className="mb-4"
            >
              {paginatedPosts.map((post, index) => (
                <Card
                  key={post.post_id}
                  id={`post-${post.post_id}`}
                  className="mb-4 transition-shadow duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* User info */}
                    <div className="mb-4 md:w-48 md:flex-shrink-0 md:pr-4 md:border-r md:mb-0">
                      <div className="flex items-center md:flex-col md:items-center">
                        <div className="flex items-center md:flex-col">
                          <Avatar size={64} src={post.avatar} />
                          <div className="ml-4 md:ml-0 md:mt-2 md:text-center">
                            <Text strong className="block">
                              {post.username}
                            </Text>
                            <Tag color="blue" className="mt-1">
                              {post.role}
                            </Tag>
                          </div>
                        </div>
                        <div className="hidden mt-3 text-xs text-center text-gray-500 md:block">
                          <div>Bài viết: {post.post_count}</div>
                          <div>
                            Tham gia:{" "}
                            {new Date(post.join_date).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post content */}
                    <div className="flex-grow md:pl-4">
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
                        <div className="flex items-center">
                          {post.is_best_answer && (
                            <Tag color="green" className="mr-2">
                              <StarFilled /> Câu trả lời hay nhất
                            </Tag>
                          )}
                          <Text type="secondary" className="text-xs">
                            #{index + 1 + (currentPage - 1) * pageSize}
                          </Text>
                        </div>
                      </div>
                      <Link
                        to={`/forums/${forumId}/topics/${topicId}/posts/${post.post_id}`}
                      >
                        <div
                          className="mb-4 post-content quill-content"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        ></div>
                      </Link>
                      <Divider className="my-2" />

                      <div className="flex items-center justify-between">
                        <ReactionPicker />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </Skeleton>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                total={posts.length}
                pageSize={pageSize}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>

            {/* Reply button */}
            {!topic?.is_close && (
              <div className="mt-6 text-center">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleReply}
                  icon={<MessageOutlined />}
                >
                  Trả lời chủ đề này
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar - Desktop */}
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <Drawer
        title="Thông tin chủ đề"
        placement="right"
        onClose={() => setIsSidebarVisible(false)}
        open={isSidebarVisible}
        width={300}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Thông tin" key="1">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text>Lượt xem:</Text>
                <Text strong>{topic?.view_count || 0}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Bài viết:</Text>
                <Text strong>{posts.length}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Tạo ngày:</Text>
                <Text strong>
                  {topic ? formatDate(topic.created_at).split(",")[0] : ""}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text>Cập nhật:</Text>
                <Text strong>
                  {topic ? formatDate(topic.updated_at).split(",")[0] : ""}
                </Text>
              </div>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between">
              <Button
                type="primary"
                ghost
                onClick={toggleBookmark}
                icon={<BookOutlined />}
              >
                {isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
              </Button>
              <Button
                type="primary"
                ghost
                onClick={toggleSubscribe}
                icon={<BellOutlined />}
              >
                {isSubscribed ? "Hủy đăng ký" : "Đăng ký"}
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Chủ đề liên quan" key="2">
            <List
              itemLayout="horizontal"
              dataSource={relatedTopics}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Link
                        to={`/forums/${forumId}/topics/${item.topic_id}/posts`}
                      >
                        {item.title}
                      </Link>
                    }
                    description={
                      <Space>
                        <span>
                          <CommentOutlined /> {item.post_count}
                        </span>
                        <span>
                          <EyeOutlined /> {item.view_count}
                        </span>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="Thành viên" key="3">
            <List
              itemLayout="horizontal"
              dataSource={activeUsers}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <Link to={`/users/${item.user_id}`}>{item.username}</Link>
                    }
                    description={`${item.post_count} bài viết`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Drawer>

      {/* Topic info drawer */}
      <Drawer
        title="Thông tin chi tiết"
        placement="right"
        onClose={() => setIsInfoDrawerVisible(false)}
        open={isInfoDrawerVisible}
        width={400}
      >
        <div className="space-y-4">
          <div>
            <Title level={4}>Chủ đề</Title>
            <Paragraph>{topic?.title}</Paragraph>
          </div>
          <div>
            <Title level={4}>Mô tả</Title>
            <Paragraph>{topic?.content}</Paragraph>
          </div>
          <div>
            <Title level={4}>Thẻ</Title>
            <div>
              {topic?.tags.map((tag) => (
                <Tag key={tag} color="blue" className="mb-1">
                  {tag}
                </Tag>
              ))}
            </div>
          </div>
          <Divider />
          <div>
            <Title level={4}>Thống kê</Title>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text>Lượt xem:</Text>
                <Text strong>{topic?.view_count || 0}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Bài viết:</Text>
                <Text strong>{posts.length}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Tạo ngày:</Text>
                <Text strong>{topic ? formatDate(topic.created_at) : ""}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Cập nhật:</Text>
                <Text strong>{topic ? formatDate(topic.updated_at) : ""}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Trạng thái:</Text>
                <Text strong>{topic?.is_close ? "Đã khóa" : "Đang mở"}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Ghim:</Text>
                <Text strong>{topic?.is_pinned ? "Có" : "Không"}</Text>
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Reply modal */}
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

      {/* Back to top button */}
      <Affix style={{ position: "fixed", bottom: 50, right: 50 }}>
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowUpOutlined />}
          size="large"
          onClick={scrollToTop}
          className="shadow-lg"
        />
      </Affix>

      <style>{`
        .quill-content h1 {
          font-size: 2em;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .quill-content h2 {
          font-size: 1.5em;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .quill-content h3 {
          font-size: 1.17em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .quill-content h4 {
          font-size: 1em;
          margin-top: 1.33em;
          margin-bottom: 1.33em;
        }
        .quill-content ul, .quill-content ol {
          padding-left: 2em;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .quill-content ul {
          list-style-type: disc;
        }
        .quill-content ol {
          list-style-type: decimal;
        }
        .quill-content p {
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .quill-content img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .quill-content blockquote {
          border-left: 4px solid #ccc;
          padding-left: 16px;
          margin: 1em 0;
          color: #666;
        }
        .quill-content pre {
          background-color: #f0f0f0;
          padding: 8px;
          border-radius: 4px;
          overflow-x: auto;
        }
        .quill-content code {
          background-color: #f0f0f0;
          padding: 2px 4px;
          border-radius: 4px;
          font-family: monospace;
        }
        
        @media (max-width: 768px) {
          .quill-content img {
            width: 100%;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default UserPostList;
