"use client"

import { useState } from "react"
import { Layout, Typography, Button, Input, Tabs, Badge, Card, Avatar, Space, Tag, Row, Col, Menu, Select } from "antd"
import { SearchOutlined, PlusOutlined, EyeOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import ReactionPicker from "../../components/Generate/ReactionPicker"

const { Content } = Layout
const { Title, Text, Paragraph } = Typography
const { TabPane } = Tabs
const { Option } = Select

const ForumPage = () => {
  const [activeTab, setActiveTab] = useState("newest")

  return (
    <Layout className="min-h-screen bg-white">


      <Content className="py-6 mx-10">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Row justify="space-between" align="middle" wrap>
            <Title className="!text-text-color" level={2} style={{ margin: 0 }}>
              UTE Career Forum
            </Title>
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Tạo bài viết mới
            </Button>
          </Row>

          <Input prefix={<SearchOutlined />} placeholder="Tìm kiếm bài viết, người viết, tag..." size="large" />

          <Row gutter={24}>
            <Col xs={24} lg={6}>
              <Space direction="vertical" style={{ width: "100%" }} size="large">
                <div>
                  <Title level={5}>Loại bài viết</Title>
                  <Menu mode="vertical" style={{ border: "none" }} defaultSelectedKeys={["all"]}>
                    <Menu.Item key="all">Tất cả</Menu.Item>
                    <Menu.Item key="blog">Blog</Menu.Item>
                    <Menu.Item key="question">Hỏi đáp</Menu.Item>
                    <Menu.Item key="discussion">Thảo luận</Menu.Item>
                    <Menu.Item key="job">Chia sẻ cơ hội việc làm</Menu.Item>
                  </Menu>
                </div>

                <div>
                  <Title level={5}>Lĩnh vực/Ngành nghề</Title>
                  <Select style={{ width: "100%" }} placeholder="Chọn ngành nghề" defaultValue="all">
                    <Option value="all">Tất cả</Option>
                    <Option value="it">Công nghệ thông tin</Option>
                    <Option value="marketing">Marketing</Option>
                    <Option value="accounting">Kế toán</Option>
                    <Option value="finance">Tài chính</Option>
                    <Option value="hr">Nhân sự</Option>
                  </Select>
                </div>

                <div>
                  <Title level={5}>Đối tượng viết bài</Title>
                  <Menu mode="vertical" style={{ border: "none" }} defaultSelectedKeys={["all"]}>
                    <Menu.Item key="all">Tất cả</Menu.Item>
                    <Menu.Item key="student">Sinh viên</Menu.Item>
                    <Menu.Item key="employer">Nhà tuyển dụng</Menu.Item>
                  </Menu>
                </div>
              </Space>
            </Col>

            <Col xs={24} lg={18}>
              <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" size="large">
                <TabPane tab="Mới nhất" key="newest">
                  <Space direction="vertical" size="middle" className="w-full mt-4">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </Space>
                </TabPane>
                <TabPane tab="Hot" key="hot">
                  <Space direction="vertical" size="middle" className="w-full mt-4">
                    {hotPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </Space>
                </TabPane>
                <TabPane tab="Theo ngành" key="field">
                  <Space direction="vertical" size="middle" className="w-full mt-4">
                    {fieldPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </Space>
                </TabPane>
              </Tabs>
            </Col>
          </Row>
        </Space>
      </Content>
    </Layout>
  )
}

function PostCard({ post }) {
  const getTagColor = (type) => {
    switch (type) {
      case "Blog":
        return "blue"
      case "Hỏi đáp":
        return "green"
      case "Thảo luận":
        return "purple"
      case "Chia sẻ cơ hội việc làm":
        return "red"
      default:
        return "default"
    }
  }

  return (
    <Card hoverable className="w-full">
      <Space direction="vertical" size="middle" className="w-full">
        <Row justify="space-between" align="top">
          <Space>
            <Avatar src={post.author.avatar || undefined} icon={!post.author.avatar && <UserOutlined />} size="large" />
            <div>
              <Text strong>{post.author.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {post.author.role} • {post.date}
              </Text>
            </div>
          </Space>
          <Badge
            count={post.type}
            style={{
              backgroundColor: getTagColor(post.type) === "default" ? "#f0f0f0" : undefined,
              color: getTagColor(post.type) === "default" ? "#000" : undefined,
            }}
            color={getTagColor(post.type)}
          />
        </Row>

        <Link to={`/posts/${post.id}`} style={{ color: "inherit" }}>
          <Title level={4} style={{ marginTop: 0, marginBottom: 8 }}>
            {post.title}
          </Title>
        </Link>

        <Paragraph ellipsis={{ rows: 2 }} style={{ color: "rgba(0, 0, 0, 0.45)" }}>
          {post.excerpt}
        </Paragraph>

        <Row justify="space-between" align="middle">
          <Space wrap>
            {post.tags.map((tag) => (
              <Tag key={tag} color="default" className="px-2 rounded-full">
                {tag}
              </Tag>
            ))}
          </Space>

          <Space>
            <Space>
              <ReactionPicker />
            </Space>
            <Space>
              <EyeOutlined />
              <Text type="secondary">{post.views}</Text>
            </Space>
            <Space>
              <MessageOutlined />
              <Text type="secondary">{post.comments}</Text>
            </Space>
          </Space>
        </Row>
      </Space>
    </Card>
  )
}

export default ForumPage;
// Dữ liệu mẫu
const posts = [
  {
    id: 1,
    title: "Kinh nghiệm phỏng vấn tại các công ty công nghệ lớn",
    excerpt:
      "Chia sẻ kinh nghiệm và các mẹo khi phỏng vấn tại các công ty công nghệ hàng đầu như Google, Facebook, và Amazon.",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    date: "2 giờ trước",
    type: "Blog",
    tags: ["Phỏng vấn", "IT", "Kinh nghiệm"],
    views: 245,
    comments: 18,
  },
  {
    id: 2,
    title: "Làm thế nào để xây dựng CV nổi bật cho sinh viên mới ra trường?",
    excerpt: "Hướng dẫn chi tiết cách tạo một CV ấn tượng dù bạn chưa có nhiều kinh nghiệm làm việc thực tế.",
    author: {
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nhà tuyển dụng",
    },
    date: "Hôm qua",
    type: "Thảo luận",
    tags: ["CV", "Tìm việc", "Sinh viên mới ra trường"],
    views: 532,
    comments: 47,
  },
  {
    id: 3,
    title: "Tuyển dụng vị trí Marketing Executive - Lương 15-20 triệu",
    excerpt:
      "Công ty ABC đang tìm kiếm ứng viên cho vị trí Marketing Executive với mức lương hấp dẫn và nhiều cơ hội thăng tiến.",
    author: {
      name: "Công ty ABC",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nhà tuyển dụng",
    },
    date: "3 ngày trước",
    type: "Chia sẻ cơ hội việc làm",
    tags: ["Marketing", "Tuyển dụng", "Full-time"],
    views: 789,
    comments: 12,
  },
  {
    id: 4,
    title: "Nên học thêm kỹ năng gì để tăng cơ hội việc làm trong ngành IT?",
    excerpt:
      "Mình đang là sinh viên năm 3 ngành CNTT và muốn biết nên tập trung vào những kỹ năng nào để dễ xin việc sau khi ra trường.",
    author: {
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    date: "1 tuần trước",
    type: "Hỏi đáp",
    tags: ["IT", "Kỹ năng", "Lộ trình học tập"],
    views: 1024,
    comments: 86,
  },
  {
    id: 5,
    title: "5 xu hướng nghề nghiệp hot nhất năm 2023",
    excerpt: "Phân tích chi tiết về các ngành nghề đang có nhu cầu cao và triển vọng phát triển trong tương lai gần.",
    author: {
      name: "Phạm Thị D",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nhà tuyển dụng",
    },
    date: "2 tuần trước",
    type: "Blog",
    tags: ["Xu hướng", "Nghề nghiệp", "2023"],
    views: 1567,
    comments: 34,
  },
]

const hotPosts = [
  {
    id: 6,
    title: "10 câu hỏi phỏng vấn thường gặp và cách trả lời hiệu quả",
    excerpt:
      "Tổng hợp những câu hỏi phỏng vấn phổ biến nhất và hướng dẫn cách trả lời để gây ấn tượng với nhà tuyển dụng.",
    author: {
      name: "Hoàng Văn E",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nhà tuyển dụng",
    },
    date: "1 tháng trước",
    type: "Blog",
    tags: ["Phỏng vấn", "Kỹ năng", "Tìm việc"],
    views: 5432,
    comments: 127,
  },
  {
    id: 7,
    title: "Kinh nghiệm làm việc remote cho các công ty nước ngoài",
    excerpt: "Chia sẻ về quá trình tìm việc, phỏng vấn và làm việc từ xa cho các công ty ở Mỹ và châu Âu.",
    author: {
      name: "Nguyễn Thị F",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    date: "3 tuần trước",
    type: "Thảo luận",
    tags: ["Remote", "Freelance", "Quốc tế"],
    views: 4321,
    comments: 98,
  },
  posts[3],
  posts[1],
  posts[4],
]

const fieldPosts = [
  posts[0],
  posts[3],
  {
    id: 8,
    title: "Tuyển dụng Kế toán tổng hợp - Kinh nghiệm 2 năm",
    excerpt: "Công ty XYZ cần tuyển kế toán tổng hợp có kinh nghiệm làm việc tối thiểu 2 năm trong lĩnh vực sản xuất.",
    author: {
      name: "Công ty XYZ",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Nhà tuyển dụng",
    },
    date: "5 ngày trước",
    type: "Chia sẻ cơ hội việc làm",
    tags: ["Kế toán", "Tuyển dụng", "Full-time"],
    views: 678,
    comments: 9,
  },
  {
    id: 9,
    title: "Kinh nghiệm thực tập tại Big4 ngành Kiểm toán",
    excerpt:
      "Chia sẻ quá trình ứng tuyển, phỏng vấn và làm việc tại một trong những công ty kiểm toán hàng đầu thế giới.",
    author: {
      name: "Trần Văn G",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Sinh viên",
    },
    date: "2 tuần trước",
    type: "Blog",
    tags: ["Kiểm toán", "Thực tập", "Big4"],
    views: 890,
    comments: 23,
  },
  posts[2],
]
