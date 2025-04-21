import { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Form,
  Select,
  message,
  Breadcrumb,
  Empty,
  Skeleton,
  Tooltip,
  Divider,
  Radio,
  Drawer,
  Flex,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  PushpinOutlined,
  LockOutlined,
  UserOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  MenuOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { formatDate } from "../../../utils/day";
import CustomizeQuill from "../../../components/Generate/CustomizeQuill";
import { Newspaper } from "lucide-react";

const { Title, Paragraph, Text } = Typography;

const TopicList = () => {
  const { forumId } = useParams();
  const [topics, setTopics] = useState([]);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [viewMode, setViewMode] = useState("card"); // card or list
  const [sortBy, setSortBy] = useState("latest");
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [popularTags, setPopularTags] = useState([]);

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
        topic_count: 125,
        post_count: 1250,
        subscriber_count: 450,
        is_subscribed: true,
      });

      setTopics([
        {
          topic_id: 1,
          forum_id: Number.parseInt(forumId),
          user_id: 101,
          username: "nguyenvan",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Tổng quan về React và các thư viện UI phổ biến",
          content:
            "React là một thư viện JavaScript phổ biến để xây dựng giao diện người dùng...",
          view_count: 1250,
          is_pinned: true,
          is_close: false,
          created_at: "2023-05-10T08:30:00Z",
          updated_at: "2023-05-15T10:45:00Z",
          status: "active",
          post_count: 24,
          last_post_at: "2023-05-20T14:30:00Z",
          last_post_by: "tranminh",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["React", "Frontend", "JavaScript"],
        },
        {
          topic_id: 2,
          forum_id: Number.parseInt(forumId),
          user_id: 102,
          username: "lethihong",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "So sánh Next.js và Gatsby cho các dự án React",
          content:
            "Next.js và Gatsby là hai framework phổ biến dựa trên React...",
          view_count: 876,
          is_pinned: false,
          is_close: false,
          created_at: "2023-05-12T09:15:00Z",
          updated_at: "2023-05-14T11:20:00Z",
          status: "active",
          post_count: 18,
          last_post_at: "2023-05-19T16:45:00Z",
          last_post_by: "phamtuan",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["Next.js", "Gatsby", "React", "SSR"],
        },
        {
          topic_id: 3,
          forum_id: Number.parseInt(forumId),
          user_id: 103,
          username: "phamtuan",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Tailwind CSS: Ưu và nhược điểm",
          content: "Tailwind CSS là một framework CSS tiện ích...",
          view_count: 654,
          is_pinned: false,
          is_close: true,
          created_at: "2023-05-15T10:45:00Z",
          updated_at: "2023-05-16T14:30:00Z",
          status: "active",
          post_count: 12,
          last_post_at: "2023-05-18T09:30:00Z",
          last_post_by: "nguyenvan",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["CSS", "Tailwind", "Frontend"],
        },
        {
          topic_id: 4,
          forum_id: Number.parseInt(forumId),
          user_id: 104,
          username: "tranminh",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Ant Design vs Material-UI: Nên chọn thư viện UI nào?",
          content: "So sánh hai thư viện UI phổ biến cho React...",
          view_count: 789,
          is_pinned: false,
          is_close: false,
          created_at: "2023-05-18T14:20:00Z",
          updated_at: "2023-05-19T08:15:00Z",
          status: "active",
          post_count: 9,
          last_post_at: "2023-05-21T11:45:00Z",
          last_post_by: "lethihong",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["Ant Design", "Material-UI", "UI Library"],
        },
        {
          topic_id: 5,
          forum_id: Number.parseInt(forumId),
          user_id: 105,
          username: "hoangnam",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Tối ưu hiệu suất cho ứng dụng React",
          content:
            "Các kỹ thuật và công cụ để tối ưu hiệu suất cho ứng dụng React...",
          view_count: 567,
          is_pinned: true,
          is_close: false,
          created_at: "2023-05-20T11:30:00Z",
          updated_at: "2023-05-21T09:45:00Z",
          status: "active",
          post_count: 7,
          last_post_at: "2023-05-22T15:30:00Z",
          last_post_by: "hoangnam",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["Performance", "React", "Optimization"],
        },
        {
          topic_id: 6,
          forum_id: Number.parseInt(forumId),
          user_id: 106,
          username: "thuhuong",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Hướng dẫn sử dụng React Hooks toàn tập",
          content:
            "Tìm hiểu về các hooks phổ biến trong React và cách sử dụng chúng...",
          view_count: 1120,
          is_pinned: false,
          is_close: false,
          created_at: "2023-05-22T08:45:00Z",
          updated_at: "2023-05-22T08:45:00Z",
          status: "active",
          post_count: 15,
          last_post_at: "2023-05-23T10:15:00Z",
          last_post_by: "nguyenvan",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["React", "Hooks", "Frontend", "JavaScript"],
        },
        {
          topic_id: 7,
          forum_id: Number.parseInt(forumId),
          user_id: 107,
          username: "ducmanh",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "Xây dựng ứng dụng React Native với Expo",
          content:
            "Hướng dẫn từng bước để xây dựng ứng dụng di động với React Native và Expo...",
          view_count: 678,
          is_pinned: false,
          is_close: false,
          created_at: "2023-05-23T09:30:00Z",
          updated_at: "2023-05-23T09:30:00Z",
          status: "active",
          post_count: 8,
          last_post_at: "2023-05-24T14:20:00Z",
          last_post_by: "thuhuong",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["React Native", "Expo", "Mobile", "JavaScript"],
        },
        {
          topic_id: 8,
          forum_id: Number.parseInt(forumId),
          user_id: 108,
          username: "thanhbinh",
          avatar: "/placeholder.svg?height=40&width=40",
          title: "GraphQL vs REST API: So sánh và ứng dụng",
          content:
            "Phân tích ưu nhược điểm của GraphQL và REST API trong các ứng dụng web hiện đại...",
          view_count: 542,
          is_pinned: false,
          is_close: false,
          created_at: "2023-05-24T10:15:00Z",
          updated_at: "2023-05-24T10:15:00Z",
          status: "active",
          post_count: 11,
          last_post_at: "2023-05-25T11:30:00Z",
          last_post_by: "ducmanh",
          last_post_avatar: "/placeholder.svg?height=40&width=40",
          tags: ["GraphQL", "REST API", "Backend", "API"],
        },
      ]);

      setPopularTags([
        { name: "React", count: 42 },
        { name: "JavaScript", count: 38 },
        { name: "Frontend", count: 35 },
        { name: "CSS", count: 28 },
        { name: "Next.js", count: 24 },
        { name: "Tailwind", count: 22 },
        { name: "TypeScript", count: 20 },
        { name: "Node.js", count: 18 },
        { name: "API", count: 15 },
        { name: "Performance", count: 12 },
      ]);

      setLoading(false);
    }, 1000);
  }, [forumId]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Lọc chủ đề dựa trên tìm kiếm, tab, bộ lọc và sắp xếp
  const getFilteredTopics = () => {
    let filtered = [...topics];

    // Lọc theo tìm kiếm
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (topic) =>
          topic.title.toLowerCase().includes(searchLower) ||
          topic.content.toLowerCase().includes(searchLower) ||
          topic.username.toLowerCase().includes(searchLower) ||
          topic.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sắp xếp
    if (sortBy === "latest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "most_viewed") {
      filtered.sort((a, b) => b.view_count - a.view_count);
    } else if (sortBy === "most_replied") {
      filtered.sort((a, b) => b.post_count - a.post_count);
    } else if (sortBy === "recently_updated") {
      filtered.sort(
        (a, b) => new Date(b.last_post_at) - new Date(a.last_post_at)
      );
    }

    return filtered;
  };

  const filteredTopics = getFilteredTopics();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const handleSubmit = (values) => {
    // Trong thực tế, bạn sẽ gọi API để tạo chủ đề mới
    const newTopic = {
      topic_id: topics.length + 1,
      forum_id: Number.parseInt(forumId),
      user_id: 101, // Giả sử user_id của người dùng hiện tại
      username: "nguyenvan", // Giả sử username của người dùng hiện tại
      avatar: "/placeholder.svg?height=40&width=40",
      ...values,
      view_count: 0,
      is_pinned: false,
      is_close: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: "active",
      post_count: 1,
      last_post_at: new Date().toISOString(),
      last_post_by: "nguyenvan",
      last_post_avatar: "/placeholder.svg?height=40&width=40",
    };
    setTopics([newTopic, ...topics]);
    setIsModalVisible(false);
    message.success("Tạo chủ đề mới thành công!");
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

  const renderTopicCard = (topic) => (
    <Card
      key={topic.topic_id}
      className="mb-4 transition-shadow duration-300 hover:shadow-md"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-start">
        <div className="flex flex-col items-center gap-2 mr-4 w-28 ">
          <Avatar icon={<UserOutlined />} src={topic.avatar} size={60} />
          {Math.random() > 0.5 ? (
            <Tag className="text-sm !mr-0" color="blue">
              {"nhà tuyển dụng"}
            </Tag>
          ) : (
            <Tag className="text-sm !mr-0" color="blue">
              {"Quản trị viên"}
            </Tag>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {topic.is_pinned && (
              <Tooltip title="Chủ đề ghim">
                <PushpinOutlined className="text-red-500" />
              </Tooltip>
            )}
            {topic.is_close && (
              <Tooltip title="Chủ đề đã khóa">
                <LockOutlined className="text-gray-500" />
              </Tooltip>
            )}
            <Link
              to={`/forums/${forumId}/topics/${topic.topic_id}/posts`}
              className="text-lg font-medium hover:text-text-color-hover text-text-color"
            >
              {topic.title}
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-1 mb-2">
            {topic.tags.map((tag) => (
              <Tag
                key={tag}
                color="blue"
                className="cursor-pointer hover:opacity-80"
              >
                {tag}
              </Tag>
            ))}
          </div>
          <Paragraph
            ellipsis={{ rows: 2 }}
            className="mb-2 text-sm text-text-color-hover"
            title={topic.content}
          >
            {topic.content}
          </Paragraph>
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                <UserOutlined className="mr-1" /> {topic.username}
              </span>
              <span>
                <ClockCircleOutlined className="mr-1" />{" "}
                {getTimeDifference(topic.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip title="Số bài viết">
                <span className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> {topic.post_count}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderTopicListItem = (topic) => (
    <div
      key={topic.topic_id}
      className="px-2 py-3 transition-colors duration-300 border-b last:border-b-0 hover:bg-gray-50"
    >
      <div className="flex items-start">
        <div className="hidden mr-4 sm:block">
          <Avatar icon={<UserOutlined />} src={topic?.user?.avatar} size={40} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {topic.is_pinned && (
              <Tooltip title="Chủ đề ghim">
                <PushpinOutlined className="text-red-500" />
              </Tooltip>
            )}
            {topic.is_close && (
              <Tooltip title="Chủ đề đã khóa">
                <LockOutlined className="text-gray-500" />
              </Tooltip>
            )}

            <Link
              to={`/forums/${forumId}/topics/${topic.topic_id}/posts`}
              className="text-base font-medium text-text-color hover:text-text-color-hover"
            >
              {topic.title}
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-1 mb-2">
            {topic.tags.slice(0, 5).map((tag) => (
              <Tag
                key={tag}
                color="blue"
                className="cursor-pointer hover:opacity-80"
              >
                {tag}
              </Tag>
            ))}
            {topic.tags.length > 5 && (
              <Tag color="blue" className="cursor-pointer hover:opacity-80">
                +{topic.tags.length - 5}
              </Tag>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2 sm:gap-4">
              <span>
                <UserOutlined className="mr-1" /> {topic.username}
              </span>
              <span>
                <ClockCircleOutlined className="mr-1" />{" "}
                {getTimeDifference(topic.created_at)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Tooltip title="Số bài viết">
                <span className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> {topic.post_count}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const sortOptions = [
    { label: "Mới nhất", value: "latest", icon: <ClockCircleOutlined /> },
    { label: "Cũ nhất", value: "oldest", icon: <CalendarOutlined /> },
    {
      label: "Cập nhật gần đây",
      value: "recently_updated",
      icon: <RiseOutlined />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 py-4 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <Breadcrumb className="mb-0">
              <Breadcrumb.Item href="/">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="/forums">Diễn đàn</Breadcrumb.Item>
              <Breadcrumb.Item>{forum?.name || "Đang tải..."}</Breadcrumb.Item>
            </Breadcrumb>
            <div className="flex items-center gap-2 md:hidden">
              <Button
                icon={<MenuOutlined />}
                onClick={() => setIsFilterDrawerVisible(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col gap-6">
          {/* Main content */}
          <div className="flex-grow">
            {/* Forum header */}
            <Skeleton loading={loading} active paragraph={{ rows: 2 }}>
              {forum && (
                <Card className="mb-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <Title level={2} className="mb-1 !text-text-color">
                        {forum.name}
                      </Title>
                      <Paragraph className="mb-2 text-text-color-hover">
                        {forum.description}
                      </Paragraph>
                      <div className="flex flex-wrap gap-4 text-text-color-hover">
                        <span>
                          <AppstoreOutlined className="mr-1" />{" "}
                          <Text className="text-text-color" strong>
                            {forum.topic_count}
                          </Text>{" "}
                          chủ đề
                        </span>
                        <span className="flex items-center gap-1">
                          <Newspaper className="w-4 h-4" />
                          <Text className="text-text-color" strong>
                            {forum.post_count}
                          </Text>{" "}
                          bài viết
                        </span>
                        <span>
                          <Text className="text-sm text-text-color-hover">
                            Ngày tạo:{" "}
                          </Text>
                          <Text className="text-sm text-text-color" strong>
                            {forum ? formatDate(forum.created_at) : "N/A"}
                          </Text>
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </Skeleton>

            {/* Search and filters */}
            <div className="flex flex-col items-center justify-between gap-3 mb-4 sm:flex-row">
              <div className="w-full sm:w-auto">
                <Input
                  size="large"
                  placeholder="Tìm kiếm chủ đề"
                  prefix={<SearchOutlined />}
                  onChange={handleSearch}
                  className="w-full sm:w-96"
                  allowClear
                />
              </div>
              <div className="flex justify-between w-full gap-2 sm:w-auto sm:justify-end">
                <div className="hidden gap-2 md:flex">
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => setIsFilterDrawerVisible(true)}
                  >
                    Lọc chủ đề
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    icon={<UnorderedListOutlined />}
                    type={viewMode === "list" ? "primary" : "default"}
                    onClick={() => setViewMode("list")}
                  />
                  <Button
                    icon={<AppstoreOutlined />}
                    type={viewMode === "card" ? "primary" : "default"}
                    onClick={() => setViewMode("card")}
                  />
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={showModal}
                  >
                    <span className="hidden sm:inline">Tạo chủ đề</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Create topic drawer */}
            <div
              className={`transition-all duration-500 ease-in-out  origin-top ${
                isModalVisible
                  ? "max-h-screen scale-y-100 opacity-100 !mb-8"
                  : "max-h-0 scale-y-0 opacity-0 !mb-0"
              } `}
            >
              <Card
                className="mb-3 transition-shadow duration-300"
                bodyStyle={{ padding: "16px" }}
              >
                <Form
                  size="large"
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    tags: [],
                  }}
                >
                  <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tiêu đề chủ đề!",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tiêu đề chủ đề" />
                  </Form.Item>
                  <Form.Item name="tags" label="Thẻ">
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Thêm thẻ"
                      options={popularTags.map((tag) => ({
                        value: tag.name,
                        label: tag.name,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name="content"
                    label="Nội dung"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập nội dung chủ đề!",
                      },
                    ]}
                  >
                    <CustomizeQuill />
                  </Form.Item>

                  <Form.Item className="mb-0 text-right">
                    <Button onClick={handleCancel} className="mr-2">
                      Hủy
                    </Button>
                    <Button type="primary" htmlType="submit">
                      Tạo chủ đề
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>

            {/* Topics list */}
            <Skeleton
              loading={loading}
              active
              paragraph={{ rows: 10 }}
              className="mb-4"
            >
              {filteredTopics.length > 0 ? (
                <div
                  className={
                    viewMode === "card"
                      ? "grid gap-4"
                      : "border rounded-lg bg-white p-4"
                  }
                >
                  {viewMode === "card"
                    ? filteredTopics.map(renderTopicCard)
                    : filteredTopics.map(renderTopicListItem)}
                </div>
              ) : (
                <Empty
                  description={
                    <span>
                      Không tìm thấy chủ đề nào
                      {searchText && ` phù hợp với từ khóa "${searchText}"`}
                    </span>
                  }
                />
              )}
            </Skeleton>
          </div>
        </div>
      </div>

      {/* Filter drawer */}
      <Drawer
        title={
          <Title className="!mb-0 leading-0 !text-text-color" level={5}>
            Bộ lọc & Sắp xếp
          </Title>
        }
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={400}
        footer={
          <Flex gap={16}>
            {" "}
            <Button
              className="w-full"
              onClick={() => setIsFilterDrawerVisible(false)}
            >
              Đặt lại
            </Button>
            <Button
              className="w-full"
              type="primary"
              onClick={() => setIsFilterDrawerVisible(false)}
            >
              Áp dụng
            </Button>
          </Flex>
        }
      >
        <div className="space-y-6">
          <div>
            <Title level={5}>Sắp xếp theo</Title>
            <Radio.Group
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {sortOptions.map((option) => (
                  <Radio
                    value={option.value}
                    key={option.value}
                    className="w-full py-2"
                  >
                    <Space>
                      {option.icon} {option.label}
                    </Space>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>
          <Divider />
          <div>
            <Title level={5}>Thẻ phổ biến</Title>
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="Chọn thẻ để lọc"
              maxTagCount="responsive"
              allowClear
              onChange={(values) => {
                if (values.length > 0) {
                  setSearchText(values.join(" "));
                } else {
                  setSearchText("");
                }
              }}
              options={popularTags.map((tag) => ({
                value: tag.name,
                label: tag.name,
              }))}
              className="mb-4"
            />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default TopicList;
