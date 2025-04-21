import { useState, useEffect, useRef } from "react";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Divider,
  Tag,
  message,
  Breadcrumb,
  Tooltip,
  Skeleton,
  Input,
  Drawer,
  Tabs,
  FloatButton,
  Flex,
} from "antd";
import {
  HomeOutlined,
  MessageOutlined,
  ShareAltOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  ArrowUpOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import ReactionPicker from "../../components/Generate/ReactionPicker";
import HtmlContent from "./../../components/Generate/HtmlContent";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const PostDetail = () => {
  const { forumId, topicId, postId } = useParams();
  const [post, setPost] = useState(null);
  const [topic, setTopic] = useState(null);
  const [forum, setForum] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [userReaction, setUserReaction] = useState(null);
  const topRef = useRef(null);
  const commentInputRef = useRef(null);

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

      setPost({
        post_id: Number.parseInt(postId || "1"),
        topic_id: Number.parseInt(topicId),
        user_id: 101,
        username: "nguyenvan",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Quản trị viên",
        post_count: 1250,
        join_date: "2022-01-10",
        content: `<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
    
    <!-- Post Header -->
    <header style="margin-bottom: 30px;">
        <h1 style="color: #2c3e50; font-size: 2.5rem; margin-bottom: 10px;">The Art of Inline CSS Styling</h1>
        <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <img src="/placeholder.svg?height=50&width=50" alt="Author Avatar" style="width: 50px; height: 50px; border-radius: 50%; margin-right: 15px;">
            <div>
                <p style="margin: 0; font-weight: bold; color: #2c3e50;">John Doe</p>
                <p style="margin: 0; color: #7f8c8d; font-size: 0.9rem;">Published on May 15, 2023 • 5 min read</p>
            </div>
        </div>
        <div style="height: 300px; background-color: #f5f5f5; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; border-radius: 8px; overflow: hidden;">
            <img src="/placeholder.svg?height=300&width=800" alt="Featured Image" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    </header>

    <!-- Post Content -->
    <main style="margin-bottom: 40px;">
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
            Inline CSS is a method of applying CSS styling directly within HTML elements using the style attribute. While it's generally recommended to separate content (HTML) from presentation (CSS), inline styles can be useful in certain scenarios.
        </p>

        <h2 style="color: #2c3e50; font-size: 1.8rem; margin: 30px 0 15px 0; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">When to Use Inline CSS</h2>
        
        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
            Inline CSS can be particularly useful in the following situations:
        </p>

        <ul style="margin-bottom: 20px; padding-left: 20px;">
            <li style="margin-bottom: 10px;">When you need to apply styles to a single element</li>
            <li style="margin-bottom: 10px;">For HTML emails where external stylesheets aren't fully supported</li>
            <li style="margin-bottom: 10px;">When quickly prototyping or testing styles</li>
            <li style="margin-bottom: 10px;">In situations where you can't modify external stylesheets</li>
        </ul>

        <h2 style="color: #2c3e50; font-size: 1.8rem; margin: 30px 0 15px 0; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Advantages of Inline CSS</h2>

        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
            Inline styles have several advantages in specific contexts:
        </p>

        <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin-bottom: 20px; border-radius: 0 8px 8px 0;">
            <p style="margin: 0; font-style: italic;">
                "Inline CSS can improve page load performance by eliminating the need for an external CSS file, which reduces HTTP requests."
            </p>
        </div>

        <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 20px;">
            Additionally, inline styles have the highest specificity in the CSS cascade, meaning they will override styles defined in external stylesheets or style tags.
        </p>

        <h2 style="color: #2c3e50; font-size: 1.8rem; margin: 30px 0 15px 0; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">Code Example</h2>

        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; overflow-x: auto;">
            <code style="font-family: monospace; color: #333;">
                &lt;div style="color: blue; font-size: 18px; margin: 20px;"&gt;<br>
                &nbsp;&nbsp;This text is styled using inline CSS.<br>
                &lt;/div&gt;
            </code>
        </div>
    </main>

    <!-- Post Footer -->
    <footer style="border-top: 1px solid #ecf0f1; padding-top: 20px;">
        <div style="margin-bottom: 20px;">
            <span style="font-weight: bold; margin-right: 10px;">Tags:</span>
            <span style="background-color: #e0f7fa; color: #00838f; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; margin-right: 10px;">HTML</span>
            <span style="background-color: #e0f7fa; color: #00838f; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; margin-right: 10px;">CSS</span>
            <span style="background-color: #e0f7fa; color: #00838f; padding: 5px 10px; border-radius: 20px; font-size: 0.9rem;">Web Development</span>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <span style="font-weight: bold; margin-right: 10px;">Share:</span>
                <a href="#" style="text-decoration: none; color: #3b5998; margin-right: 15px; font-size: 1.2rem;">Facebook</a>
                <a href="#" style="text-decoration: none; color: #1da1f2; margin-right: 15px; font-size: 1.2rem;">Twitter</a>
                <a href="#" style="text-decoration: none; color: #0077b5; font-size: 1.2rem;">LinkedIn</a>
            </div>
            <button style="background-color: #2ecc71; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-weight: bold;">Like Post</button>
        </div>
    </footer>
    
</body>`,
        created_at: "2023-05-10T08:30:00Z",
        updated_at: "2023-05-10T08:30:00Z",
        reactions: {
          like: 15,
          dislike: 2,
          heart: 8,
          smile: 5,
        },
        view_count: 324,
      });

      setComments([
        {
          comment_id: 1,
          post_id: Number.parseInt(postId || "1"),
          user_id: 102,
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          content:
            "Bài viết rất hay và chi tiết. Tôi đặc biệt thích phần so sánh giữa các thư viện UI.",
          created_at: "2023-05-10T09:15:00Z",
          updated_at: "2023-05-10T09:15:00Z",
          reactions: {
            like: 3,
            heart: 1,
          },
        },
        {
          comment_id: 2,
          post_id: Number.parseInt(postId || "1"),
          user_id: 103,
          username: "phamtuan",
          avatar: "/placeholder.svg?height=40&width=40",
          content:
            "Tôi đã sử dụng cả Ant Design và Material-UI, và tôi thấy Ant Design có nhiều component hơn và dễ tùy chỉnh hơn. Tuy nhiên, Material-UI có vẻ phổ biến hơn trong cộng đồng React.",
          created_at: "2023-05-10T10:30:00Z",
          updated_at: "2023-05-10T10:30:00Z",
          reactions: {
            like: 5,
            smile: 2,
          },
        },
        {
          comment_id: 3,
          post_id: Number.parseInt(postId || "1"),
          user_id: 104,
          username: "tranminh",
          avatar: "/placeholder.svg?height=40&width=40",
          content:
            "Bạn có thể chia sẻ thêm về cách tối ưu hiệu suất khi sử dụng React không? Tôi đang gặp một số vấn đề với ứng dụng của mình.",
          created_at: "2023-05-10T11:45:00Z",
          updated_at: "2023-05-10T11:45:00Z",
          reactions: {
            like: 2,
          },
        },
        {
          comment_id: 4,
          post_id: Number.parseInt(postId || "1"),
          user_id: 101,
          username: "nguyenvan",
          avatar: "/placeholder.svg?height=40&width=40",
          content:
            "Cảm ơn mọi người đã quan tâm! @tranminh: Để tối ưu hiệu suất React, bạn nên sử dụng React.memo, useMemo, useCallback để tránh render không cần thiết, và sử dụng các công cụ như React DevTools để phát hiện vấn đề hiệu suất.",
          created_at: "2023-05-10T13:20:00Z",
          updated_at: "2023-05-10T13:20:00Z",
          reactions: {
            like: 4,
            heart: 2,
          },
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [forumId, topicId, postId]);

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      message.error("Vui lòng nhập nội dung bình luận!");
      return;
    }

    const newComment = {
      comment_id: comments.length + 1,
      post_id: Number.parseInt(postId || "1"),
      user_id: 101, // Giả sử user_id của người dùng hiện tại
      username: "nguyenvan", // Giả sử username của người dùng hiện tại
      avatar: "/placeholder.svg?height=40&width=40",
      content: commentText,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: {},
      is_author: true,
    };
    setComments([...comments, newComment]);
    setCommentText("");
    message.success("Đã đăng bình luận thành công!");
  };

  const handleShare = () => {
    message.success("Đã sao chép liên kết vào clipboard");
  };

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeDifference = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    } else {
      return formatDate(dateString);
    }
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
              <Breadcrumb.Item
                href={`/forums/${forumId}/topics/${topicId}/posts`}
              >
                {topic?.title || "Đang tải..."}
              </Breadcrumb.Item>
              <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <Avatar src={post.avatar} size={48} className="mr-4" />
                      <div>
                        <div className="flex items-center gap-2">
                          <Text strong className="text-lg">
                            {post.username}
                          </Text>
                          <Tag color="blue">{post.role}</Tag>
                        </div>
                        <div className="text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {formatDateTime(post.created_at)}
                          {post.updated_at !== post.created_at && (
                            <Tooltip
                              title={`Cập nhật lần cuối: ${formatDateTime(
                                post.updated_at
                              )}`}
                            >
                              <span className="ml-2">(đã chỉnh sửa)</span>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="text"
                        className="hover:!bg-transparent"
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                      >
                        Chia sẻ
                      </Button>
                    </div>
                  </div>

                  {/* Post content */}
                  <HtmlContent htmlString={post.content} />

                  {/* Post footer */}
                  <div className="pt-4 border-t">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex gap-3">
                        <ReactionPicker
                          selected={userReaction}
                          setSelected={setUserReaction}
                          classNameIcon="text-xl"
                        />
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button
                          icon={<EyeOutlined />}
                          className="hover:!bg-transparent cursor-auto"
                          type="text"
                        >
                          {post.view_count} lượt xem
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Skeleton>

            {/* Comments */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Title level={4} className="mb-0">
                  Bình luận ({comments.length})
                </Title>
              </div>
              {/* Add comment */}
              <Card className="mb-6 shadow-sm" ref={commentInputRef}>
                <Title level={5} className="mb-4">
                  Thêm bình luận
                </Title>
                <div className="flex">
                  <Avatar
                    src="/placeholder.svg?height=40&width=40"
                    className="flex-shrink-0 mr-3"
                  />
                  <div className="flex-grow">
                    <TextArea
                      rows={4}
                      placeholder="Viết bình luận của bạn..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="mb-3"
                    />
                    <div className="flex justify-end">
                      <Button type="primary" onClick={handleCommentSubmit}>
                        Đăng bình luận
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              <Skeleton
                loading={loading}
                active
                paragraph={{ rows: 3 }}
                className="mb-4"
              >
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.comment_id} className="shadow-sm">
                        <div className="flex">
                          <Avatar
                            src={comment.avatar}
                            className="flex-shrink-0 mr-3"
                          />
                          <div className="flex-grow">
                            <div className="flex items-start justify-between">
                              <div>
                                <Text strong>{comment.username}</Text>
                                {comment.is_author && (
                                  <Tag color="blue" className="ml-2">
                                    Tác giả
                                  </Tag>
                                )}
                                <div className="text-xs text-gray-500">
                                  <ClockCircleOutlined className="mr-1" />
                                  {getTimeDifference(comment.created_at)}
                                </div>
                              </div>
                            </div>
                            <Paragraph className="mt-2">
                              {comment.content}
                            </Paragraph>
                            <Flex justify="end">
                              <Button
                                type="text"
                                size="small"
                                icon={<CommentOutlined />}
                              >
                                Trả lời
                              </Button>
                            </Flex>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="py-8 text-center">
                    <MessageOutlined
                      style={{ fontSize: 48 }}
                      className="mb-4 text-gray-300"
                    />
                    <Paragraph>
                      Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                    </Paragraph>
                  </Card>
                )}
              </Skeleton>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mb-6"></div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar drawer */}
      <Drawer
        title="Thông tin"
        placement="right"
        onClose={() => setIsSidebarVisible(false)}
        open={isSidebarVisible}
        width={300}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Chủ đề" key="1">
            <div className="mb-3">
              <Link
                to={`/forums/${forumId}/topics/${topicId}/posts`}
                className="text-lg font-medium hover:text-blue-600"
              >
                {topic?.title}
              </Link>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {topic?.tags.map((tag) => (
                <Tag
                  key={tag}
                  color="blue"
                  className="cursor-pointer hover:opacity-80"
                >
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Text>Tác giả:</Text>
                <Text strong>{topic?.username}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Ngày tạo:</Text>
                <Text>{topic ? formatDate(topic.created_at) : ""}</Text>
              </div>
              <div className="flex justify-between">
                <Text>Lượt xem:</Text>
                <Text>{topic?.view_count}</Text>
              </div>
            </div>
            <Divider className="my-3" />
          </TabPane>
        </Tabs>
      </Drawer>

      {/* Back to top button */}
      <FloatButton>
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowUpOutlined />}
          size="large"
          onClick={scrollToTop}
          className="shadow-lg"
        />
      </FloatButton>
    </div>
  );
};

export default PostDetail;
