"use client"

import { useState, useEffect, useRef } from "react"
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
  Dropdown,
  Menu,
  Skeleton,
  Input,
  Drawer,
  List,
  Affix,
  Tabs,
  Progress,
  Radio,
} from "antd"
import {
  HomeOutlined,
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  SmileOutlined,
  HeartOutlined,
  ShareAltOutlined,
  BookOutlined,
  BellOutlined,
  MoreOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CommentOutlined,
  UserOutlined,
  ArrowUpOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LinkOutlined,
  FlagOutlined,
  StarOutlined,
  MenuOutlined,
} from "@ant-design/icons"
import { Link, useParams } from "react-router-dom"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { TextArea } = Input

const PostDetail = () => {
  const { forumId, topicId, postId } = useParams()
  const [post, setPost] = useState(null)
  const [topic, setTopic] = useState(null)
  const [forum, setForum] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isReplyModalVisible, setIsReplyModalVisible] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [commentText, setCommentText] = useState("")
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [reactionStats, setReactionStats] = useState({})
  const [userReaction, setUserReaction] = useState(null)
  const topRef = useRef(null)
  const commentInputRef = useRef(null)

  // Cấu hình Quill
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  }

  const formats = ["header", "bold", "italic", "underline", "list", "bullet", "link", "image"]

  // Giả lập dữ liệu
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu
    setTimeout(() => {
      setForum({
        forum_id: Number.parseInt(forumId),
        name: "Công nghệ",
        description: "Thảo luận về công nghệ, phần mềm, phần cứng và các xu hướng mới",
        is_active: true,
        created_at: "2023-01-15T08:30:00Z",
      })

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
      })

      setPost({
        post_id: Number.parseInt(postId || "1"),
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
<p><img src="/placeholder.svg?height=300&width=600" alt="React ecosystem" /></p>
<h2>Ví dụ đơn giản về React Component</h2>
<pre><code>import React from 'react';

function Welcome(props) {
  return &lt;h1&gt;Hello, {props.name}&lt;/h1&gt;;
}

export default Welcome;</code></pre>
<p>Đây là một component đơn giản trong React, nó nhận vào một prop là "name" và hiển thị một thông điệp chào mừng.</p>
<h2>Kết luận</h2>
<p>React là một công cụ mạnh mẽ cho việc xây dựng giao diện người dùng. Kết hợp với các thư viện UI phổ biến, nó giúp các nhà phát triển xây dựng ứng dụng web hiện đại một cách nhanh chóng và hiệu quả.</p>`,
        created_at: "2023-05-10T08:30:00Z",
        updated_at: "2023-05-10T08:30:00Z",
        reactions: {
          like: 15,
          dislike: 2,
          heart: 8,
          smile: 5,
        },
        view_count: 324,
        is_best_answer: true,
      })

      setComments([
        {
          comment_id: 1,
          post_id: Number.parseInt(postId || "1"),
          user_id: 102,
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          content: "Bài viết rất hay và chi tiết. Tôi đặc biệt thích phần so sánh giữa các thư viện UI.",
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
          is_author: true,
        },
      ])

      setRelatedPosts([
        {
          post_id: 2,
          topic_id: Number.parseInt(topicId),
          title: "So sánh Next.js và Gatsby cho các dự án React",
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          created_at: "2023-05-12T09:15:00Z",
          view_count: 876,
          comment_count: 18,
        },
        {
          post_id: 3,
          topic_id: Number.parseInt(topicId),
          title: "Tailwind CSS: Ưu và nhược điểm",
          username: "phamtuan",
          avatar: "/placeholder.svg?height=40&width=40",
          created_at: "2023-05-15T10:45:00Z",
          view_count: 654,
          comment_count: 12,
        },
        {
          post_id: 4,
          topic_id: Number.parseInt(topicId),
          title: "Ant Design vs Material-UI: Nên chọn thư viện UI nào?",
          username: "tranminh",
          avatar: "/placeholder.svg?height=40&width=40",
          created_at: "2023-05-18T14:20:00Z",
          view_count: 789,
          comment_count: 9,
        },
      ])

      setActiveUsers([
        { user_id: 101, username: "nguyenvan", avatar: "/placeholder.svg?height=40&width=40", post_count: 1250 },
        { user_id: 105, username: "hoangnam", avatar: "/placeholder.svg?height=40&width=40", post_count: 789 },
        { user_id: 103, username: "phamtuan", avatar: "/placeholder.svg?height=40&width=40", post_count: 342 },
        { user_id: 102, username: "lethihong", avatar: "/placeholder.svg?height=40&width=40", post_count: 87 },
        { user_id: 104, username: "tranminh", avatar: "/placeholder.svg?height=40&width=40", post_count: 56 },
      ])

      setReactionStats({
        like: 15,
        dislike: 2,
        heart: 8,
        smile: 5,
      })

      setUserReaction("like")
      setIsBookmarked(true)
      setIsSubscribed(true)

      setLoading(false)
    }, 1000)
  }, [forumId, topicId, postId])

  const handleReply = () => {
    setReplyContent("")
    setIsReplyModalVisible(true)
  }

  const handleReplyCancel = () => {
    setIsReplyModalVisible(false)
  }

  const handleReplySubmit = () => {
    if (!replyContent.trim()) {
      message.error("Vui lòng nhập nội dung bình luận!")
      return
    }

    const newComment = {
      comment_id: comments.length + 1,
      post_id: Number.parseInt(postId || "1"),
      user_id: 101, // Giả sử user_id của người dùng hiện tại
      username: "nguyenvan", // Giả sử username của người dùng hiện tại
      avatar: "/placeholder.svg?height=40&width=40",
      content: replyContent,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reactions: {},
      is_author: true,
    }
    setComments([...comments, newComment])
    setIsReplyModalVisible(false)
    message.success("Đã đăng bình luận thành công!")
  }

  const handleCommentSubmit = () => {
    if (!commentText.trim()) {
      message.error("Vui lòng nhập nội dung bình luận!")
      return
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
    }
    setComments([...comments, newComment])
    setCommentText("")
    message.success("Đã đăng bình luận thành công!")
  }

  const handleReaction = (type) => {
    if (userReaction === type) {
      // Bỏ reaction
      setUserReaction(null)
      setReactionStats({
        ...reactionStats,
        [type]: reactionStats[type] - 1,
      })
    } else {
      // Thay đổi reaction
      if (userReaction) {
        setReactionStats({
          ...reactionStats,
          [userReaction]: reactionStats[userReaction] - 1,
          [type]: (reactionStats[type] || 0) + 1,
        })
      } else {
        setReactionStats({
          ...reactionStats,
          [type]: (reactionStats[type] || 0) + 1,
        })
      }
      setUserReaction(type)
    }
  }

  const handleCommentReaction = (commentId, type) => {
    const updatedComments = comments.map((comment) => {
      if (comment.comment_id === commentId) {
        const currentReactions = { ...comment.reactions }
        if (currentReactions[type]) {
          currentReactions[type] += 1
        } else {
          currentReactions[type] = 1
        }
        return { ...comment, reactions: currentReactions }
      }
      return comment
    })
    setComments(updatedComments)
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    message.success(isBookmarked ? "Đã xóa khỏi danh sách đánh dấu" : "Đã thêm vào danh sách đánh dấu")
  }

  const toggleSubscribe = () => {
    setIsSubscribed(!isSubscribed)
    message.success(isSubscribed ? "Đã hủy đăng ký nhận thông báo" : "Đã đăng ký nhận thông báo khi có bài viết mới")
  }

  const handleShare = () => {
    // Trong thực tế, bạn sẽ triển khai chức năng chia sẻ
    message.success("Đã sao chép liên kết vào clipboard")
  }

  const handleReport = () => {
    // Trong thực tế, bạn sẽ triển khai chức năng báo cáo
    Modal.confirm({
      title: "Báo cáo bài viết",
      content: (
        <div>
          <p>Vui lòng chọn lý do báo cáo:</p>
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="spam">Spam</Radio>
              <Radio value="inappropriate">Nội dung không phù hợp</Radio>
              <Radio value="offensive">Nội dung xúc phạm</Radio>
              <Radio value="copyright">Vi phạm bản quyền</Radio>
              <Radio value="other">Khác</Radio>
            </Space>
          </Radio.Group>
          <TextArea placeholder="Mô tả chi tiết..." rows={4} className="mt-4" />
        </div>
      ),
      okText: "Báo cáo",
      cancelText: "Hủy",
      onOk() {
        message.success("Đã gửi báo cáo của bạn")
      },
    })
  }

  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToComments = () => {
    commentInputRef.current?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => {
      const input = commentInputRef.current?.querySelector("textarea")
      if (input) {
        input.focus()
      }
    }, 500)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTimeDifference = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} giây trước`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} phút trước`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`
    } else {
      return formatDate(dateString)
    }
  }

  const getTotalReactions = () => {
    return Object.values(reactionStats).reduce((sum, count) => sum + count, 0)
  }

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
              <Breadcrumb.Item href={`/forums/${forumId}/topics`}>{forum?.name || "Đang tải..."}</Breadcrumb.Item>
              <Breadcrumb.Item href={`/forums/${forumId}/topics/${topicId}/posts`}>
                {topic?.title || "Đang tải..."}
              </Breadcrumb.Item>
              <Breadcrumb.Item>Bài viết</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center gap-2 md:hidden">
              <Button icon={<MenuOutlined />} onClick={() => setIsSidebarVisible(true)} />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Main content */}
          <div className="flex-grow">
            {/* Post */}
            <Skeleton loading={loading} active paragraph={{ rows: 15 }} className="mb-4">
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
                          {post.is_best_answer && (
                            <Tag color="green">
                              <StarOutlined /> Bài viết hay
                            </Tag>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          <ClockCircleOutlined className="mr-1" />
                          {formatDateTime(post.created_at)}
                          {post.updated_at !== post.created_at && (
                            <Tooltip title={`Cập nhật lần cuối: ${formatDateTime(post.updated_at)}`}>
                              <span className="ml-2">(đã chỉnh sửa)</span>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Tooltip title={isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}>
                        <Button
                          type="text"
                          icon={isBookmarked ? <BookOutlined className="text-blue-500" /> : <BookOutlined />}
                          onClick={toggleBookmark}
                        />
                      </Tooltip>
                      <Tooltip title="Chia sẻ">
                        <Button type="text" icon={<ShareAltOutlined />} onClick={handleShare} />
                      </Tooltip>
                      <Dropdown
                        overlay={
                          <Menu>
                            <Menu.Item key="copy" icon={<LinkOutlined />} onClick={handleShare}>
                              Sao chép liên kết
                            </Menu.Item>
                            <Menu.Item key="report" icon={<FlagOutlined />} onClick={handleReport}>
                              Báo cáo bài viết
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["click"]}
                      >
                        <Button type="text" icon={<MoreOutlined />} />
                      </Dropdown>
                    </div>
                  </div>

                  {/* Post content */}
                  <div
                    className="mb-6 post-content quill-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  ></div>

                  {/* Post footer */}
                  <div className="pt-4 border-t">
                    <div className="flex flex-wrap items-center justify-between">
                      <div className="flex gap-3">
                        <Tooltip title="Thích">
                          <Button
                            type={userReaction === "like" ? "primary" : "default"}
                            icon={<LikeOutlined />}
                            onClick={() => handleReaction("like")}
                          >
                            {reactionStats.like > 0 && reactionStats.like}
                          </Button>
                        </Tooltip>
                        <Tooltip title="Không thích">
                          <Button
                            type={userReaction === "dislike" ? "primary" : "default"}
                            icon={<DislikeOutlined />}
                            onClick={() => handleReaction("dislike")}
                          >
                            {reactionStats.dislike > 0 && reactionStats.dislike}
                          </Button>
                        </Tooltip>
                        <Tooltip title="Yêu thích">
                          <Button
                            type={userReaction === "heart" ? "primary" : "default"}
                            icon={<HeartOutlined />}
                            onClick={() => handleReaction("heart")}
                            danger={userReaction === "heart"}
                          >
                            {reactionStats.heart > 0 && reactionStats.heart}
                          </Button>
                        </Tooltip>
                        <Tooltip title="Cười">
                          <Button
                            type={userReaction === "smile" ? "primary" : "default"}
                            icon={<SmileOutlined />}
                            onClick={() => handleReaction("smile")}
                          >
                            {reactionStats.smile > 0 && reactionStats.smile}
                          </Button>
                        </Tooltip>
                      </div>
                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <Button icon={<EyeOutlined />}>{post.view_count} lượt xem</Button>
                        <Button icon={<CommentOutlined />} onClick={scrollToComments}>
                          {comments.length} bình luận
                        </Button>
                      </div>
                    </div>

                    {getTotalReactions() > 0 && (
                      <div className="mt-4">
                        <Text type="secondary">Phản ứng của người đọc:</Text>
                        <div className="flex gap-4 mt-2">
                          {reactionStats.like > 0 && (
                            <div className="flex flex-col items-center">
                              <Progress
                                type="circle"
                                percent={Math.round((reactionStats.like / getTotalReactions()) * 100)}
                                width={40}
                                format={() => <LikeOutlined />}
                              />
                              <Text className="mt-1">{reactionStats.like}</Text>
                            </div>
                          )}
                          {reactionStats.heart > 0 && (
                            <div className="flex flex-col items-center">
                              <Progress
                                type="circle"
                                percent={Math.round((reactionStats.heart / getTotalReactions()) * 100)}
                                width={40}
                                format={() => <HeartOutlined />}
                                strokeColor="#ff4d4f"
                              />
                              <Text className="mt-1">{reactionStats.heart}</Text>
                            </div>
                          )}
                          {reactionStats.smile > 0 && (
                            <div className="flex flex-col items-center">
                              <Progress
                                type="circle"
                                percent={Math.round((reactionStats.smile / getTotalReactions()) * 100)}
                                width={40}
                                format={() => <SmileOutlined />}
                                strokeColor="#faad14"
                              />
                              <Text className="mt-1">{reactionStats.smile}</Text>
                            </div>
                          )}
                          {reactionStats.dislike > 0 && (
                            <div className="flex flex-col items-center">
                              <Progress
                                type="circle"
                                percent={Math.round((reactionStats.dislike / getTotalReactions()) * 100)}
                                width={40}
                                format={() => <DislikeOutlined />}
                                strokeColor="#bfbfbf"
                              />
                              <Text className="mt-1">{reactionStats.dislike}</Text>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
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
                <Avatar src="/placeholder.svg?height=40&width=40" className="flex-shrink-0 mr-3" />
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
              <Skeleton loading={loading} active paragraph={{ rows: 3 }} className="mb-4">
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.comment_id} className="shadow-sm">
                        <div className="flex">
                          <Avatar src={comment.avatar} className="flex-shrink-0 mr-3" />
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
                              <Dropdown
                                overlay={
                                  <Menu>
                                    <Menu.Item key="reply" icon={<CommentOutlined />} onClick={handleReply}>
                                      Trả lời
                                    </Menu.Item>
                                    <Menu.Item key="report" icon={<FlagOutlined />} onClick={handleReport}>
                                      Báo cáo
                                    </Menu.Item>
                                  </Menu>
                                }
                                trigger={["click"]}
                              >
                                <Button type="text" icon={<MoreOutlined />} />
                              </Dropdown>
                            </div>
                            <Paragraph className="mt-2">{comment.content}</Paragraph>
                            <div className="flex gap-2 mt-2">
                              <Button
                                type="text"
                                size="small"
                                icon={<LikeOutlined />}
                                onClick={() => handleCommentReaction(comment.comment_id, "like")}
                              >
                                {comment.reactions.like > 0 && comment.reactions.like}
                              </Button>
                              <Button
                                type="text"
                                size="small"
                                icon={<HeartOutlined />}
                                onClick={() => handleCommentReaction(comment.comment_id, "heart")}
                              >
                                {comment.reactions.heart > 0 && comment.reactions.heart}
                              </Button>
                              <Button type="text" size="small" icon={<CommentOutlined />} onClick={handleReply}>
                                Trả lời
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="py-8 text-center">
                    <MessageOutlined style={{ fontSize: 48 }} className="mb-4 text-gray-300" />
                    <Paragraph>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</Paragraph>
                  </Card>
                )}
              </Skeleton>
            </div>

           

            {/* Navigation */}
            <div className="flex justify-between mb-6">
              <Button icon={<ArrowLeftOutlined />}>Bài viết trước</Button>
              <Button type="primary" onClick={scrollToTop}>
                <ArrowUpOutlined /> Lên đầu trang
              </Button>
              <Button icon={<ArrowRightOutlined />}>Bài viết tiếp theo</Button>
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <div className="flex-shrink-0 hidden md:block w-80">
            <div className="space-y-4">
              {/* Topic info */}
              <Card title="Thông tin chủ đề" className="shadow-sm">
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
                    <Tag key={tag} color="blue" className="cursor-pointer hover:opacity-80">
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
                <div className="flex justify-between">
                  <Button type="primary" ghost onClick={toggleBookmark} icon={<BookOutlined />}>
                    {isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
                  </Button>
                  <Button type="primary" ghost onClick={toggleSubscribe} icon={<BellOutlined />}>
                    {isSubscribed ? "Hủy đăng ký" : "Đăng ký"}
                  </Button>
                </div>
              </Card>

              {/* Related posts */}
              <Card title="Bài viết liên quan" className="shadow-sm">
                <List
                  itemLayout="horizontal"
                  dataSource={relatedPosts}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={
                          <Link to={`/forums/${forumId}/topics/${item.topic_id}/posts/${item.post_id}`}>
                            {item.title}
                          </Link>
                        }
                        description={
                          <Space>
                            <span>
                              <UserOutlined /> {item.username}
                            </span>
                            <span>
                              <EyeOutlined /> {item.view_count}
                            </span>
                            <span>
                              <CommentOutlined /> {item.comment_count}
                            </span>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              {/* Active users */}
              <Card title="Thành viên tích cực" className="shadow-sm">
                <List
                  itemLayout="horizontal"
                  dataSource={activeUsers}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<Link to={`/users/${item.user_id}`}>{item.username}</Link>}
                        description={`${item.post_count} bài viết`}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </div>
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
                <Tag key={tag} color="blue" className="cursor-pointer hover:opacity-80">
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
            <div className="flex justify-between">
              <Button type="primary" ghost onClick={toggleBookmark} icon={<BookOutlined />}>
                {isBookmarked ? "Bỏ đánh dấu" : "Đánh dấu"}
              </Button>
              <Button type="primary" ghost onClick={toggleSubscribe} icon={<BellOutlined />}>
                {isSubscribed ? "Hủy đăng ký" : "Đăng ký"}
              </Button>
            </div>
          </TabPane>
          <TabPane tab="Bài viết liên quan" key="2">
            <List
              itemLayout="horizontal"
              dataSource={relatedPosts}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <Link to={`/forums/${forumId}/topics/${item.topic_id}/posts/${item.post_id}`}>{item.title}</Link>
                    }
                    description={
                      <Space>
                        <span>
                          <UserOutlined /> {item.username}
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
                    title={<Link to={`/users/${item.user_id}`}>{item.username}</Link>}
                    description={`${item.post_count} bài viết`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Drawer>

      {/* Reply modal */}
      <Modal
        title="Thêm bình luận"
        open={isReplyModalVisible}
        onCancel={handleReplyCancel}
        onOk={handleReplySubmit}
        width={700}
        okText="Đăng bình luận"
        cancelText="Hủy"
      >
        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={replyContent}
            onChange={setReplyContent}
            modules={modules}
            formats={formats}
            style={{ height: "200px", marginBottom: "40px" }}
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
  )
}

export default PostDetail
