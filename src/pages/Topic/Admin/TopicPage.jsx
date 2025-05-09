import { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Button,
  Input,
  Space,
  Tag,
  Avatar,
  Modal,
  Form,
  Select,
  message,
  Breadcrumb,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  PushpinOutlined,
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const TopicList = () => {
  const { forumId } = useParams();
  const [topics, setTopics] = useState([]);
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingTopic, setEditingTopic] = useState(null);
  const { t } = useTranslation();

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

      setTopics([
        {
          topic_id: 1,
          forum_id: Number.parseInt(forumId),
          user_id: 101,
          username: "nguyenvan",
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
          tags: ["React", "Frontend", "JavaScript"],
        },
        {
          topic_id: 2,
          forum_id: Number.parseInt(forumId),
          user_id: 102,
          username: "lethihong",
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
          tags: ["Next.js", "Gatsby", "React", "SSR"],
        },
        {
          topic_id: 3,
          forum_id: Number.parseInt(forumId),
          user_id: 103,
          username: "phamtuan",
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
          tags: ["CSS", "Tailwind", "Frontend"],
        },
        {
          topic_id: 4,
          forum_id: Number.parseInt(forumId),
          user_id: 104,
          username: "tranminh",
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
          tags: ["Ant Design", "Material-UI", "UI Library"],
        },
        {
          topic_id: 5,
          forum_id: Number.parseInt(forumId),
          user_id: 105,
          username: "hoangnam",
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
          tags: ["Performance", "React", "Optimization"],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, [forumId]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchText.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchText.toLowerCase()) ||
      topic.username.toLowerCase().includes(searchText.toLowerCase()) ||
      topic.tags.some((tag) =>
        tag.toLowerCase().includes(searchText.toLowerCase())
      )
  );

  const showModal = (topic = null) => {
    setEditingTopic(topic);
    if (topic) {
      form.setFieldsValue({
        title: topic.title,
        content: topic.content,
        tags: topic.tags,
        is_pinned: topic.is_pinned,
        is_close: topic.is_close,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    if (editingTopic) {
      // Cập nhật topic
      const updatedTopics = topics.map((topic) =>
        topic.topic_id === editingTopic.topic_id
          ? {
              ...topic,
              ...values,
              updated_at: new Date().toISOString(),
            }
          : topic
      );
      setTopics(updatedTopics);
      message.success("Cập nhật chủ đề thành công!");
    } else {
      // Thêm topic mới
      const newTopic = {
        topic_id: topics.length + 1,
        forum_id: Number.parseInt(forumId),
        user_id: 101, // Giả sử user_id của người dùng hiện tại
        username: "nguyenvan", // Giả sử username của người dùng hiện tại
        ...values,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "active",
        post_count: 0,
        last_post_at: null,
        last_post_by: null,
      };
      setTopics([...topics, newTopic]);
      message.success("Tạo chủ đề mới thành công!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = (topicId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa chủ đề này không?",
      onOk() {
        const updatedTopics = topics.filter(
          (topic) => topic.topic_id !== topicId
        );
        setTopics(updatedTopics);
        message.success("Xóa chủ đề thành công!");
      },
    });
  };

  const togglePin = (topicId) => {
    const updatedTopics = topics.map((topic) =>
      topic.topic_id === topicId
        ? { ...topic, is_pinned: !topic.is_pinned }
        : topic
    );
    setTopics(updatedTopics);
    message.success("Cập nhật trạng thái ghim thành công!");
  };

  const toggleClose = (topicId) => {
    const updatedTopics = topics.map((topic) =>
      topic.topic_id === topicId
        ? { ...topic, is_close: !topic.is_close }
        : topic
    );
    setTopics(updatedTopics);
    message.success("Cập nhật trạng thái khóa thành công!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    {
      title: "Chủ đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            {record.is_pinned && <PushpinOutlined className="text-red-500" />}
            {record.is_close && <LockOutlined className="text-gray-500" />}
            <Link
              to={`/forums/${forumId}/topics/${record.topic_id}/posts`}
              className="text-lg font-medium hover:text-blue-600"
            >
              {text}
            </Link>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">
            {record.tags.map((tag) => (
              <Tag key={tag} color="blue">
                {tag}
              </Tag>
            ))}
          </div>
          <div className="text-sm text-gray-500">
            <Space>
              <Avatar size="small" icon={<UserOutlined />} /> {record.username}
              <span>• {formatDate(record.created_at)}</span>
            </Space>
          </div>
        </div>
      ),
    },
    {
      title: "Thống kê",
      key: "stats",
      width: 150,
      render: (_, record) => (
        <div>
          <div className="mb-1">
            <EyeOutlined className="mr-1" /> {record.view_count} lượt xem
          </div>
          <div>
            <Text>{record.post_count} bài viết</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Bài viết mới nhất",
      key: "lastPost",
      width: 200,
      render: (_, record) => (
        <div>
          {record.last_post_at ? (
            <>
              <div className="text-sm">{formatDate(record.last_post_at)}</div>
              <div className="text-sm text-gray-500">
                bởi <Text strong>{record.last_post_by}</Text>
              </div>
            </>
          ) : (
            <Text type="secondary">Chưa có bài viết</Text>
          )}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
            icon={
              record.is_pinned ? (
                <PushpinOutlined className="text-red-500" />
              ) : (
                <PushpinOutlined />
              )
            }
            onClick={() => togglePin(record.topic_id)}
          />
          <Button
            type="text"
            icon={record.is_close ? <UnlockOutlined /> : <LockOutlined />}
            onClick={() => toggleClose(record.topic_id)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.topic_id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      <Breadcrumb
        className="mb-4"
        items={[
          {
            title: (
              <Link to="/">
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: <Link to="/forums">{t("forum.title") || "Diễn đàn"}</Link>,
          },
          {
            title: forum?.name || t("common.loading") || "Đang tải...",
          },
        ]}
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Title level={2} className="mb-1">
            {forum?.name || "Đang tải..."}
          </Title>
          <Text type="secondary">{forum?.description}</Text>
        </div>
        <div className="flex gap-4">
          <Input
            placeholder="Tìm kiếm chủ đề"
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            className="w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Tạo chủ đề
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredTopics}
        rowKey="topic_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} chủ đề`,
        }}
      />

      <Modal
        title={editingTopic ? "Chỉnh sửa chủ đề" : "Tạo chủ đề mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            is_pinned: false,
            is_close: false,
            tags: [],
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[
              { required: true, message: "Vui lòng nhập tiêu đề chủ đề!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung chủ đề!" },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ">
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Thêm thẻ"
              options={[
                { value: "React", label: "React" },
                { value: "JavaScript", label: "JavaScript" },
                { value: "CSS", label: "CSS" },
                { value: "HTML", label: "HTML" },
                { value: "Frontend", label: "Frontend" },
                { value: "Backend", label: "Backend" },
                { value: "Node.js", label: "Node.js" },
                { value: "Database", label: "Database" },
              ]}
            />
          </Form.Item>
          <div className="flex gap-4 mb-4">
            <Form.Item
              name="is_pinned"
              valuePropName="checked"
              className="mb-0"
            >
              <Tag.CheckableTag checked={form.getFieldValue("is_pinned")}>
                <PushpinOutlined /> Ghim chủ đề
              </Tag.CheckableTag>
            </Form.Item>
            <Form.Item name="is_close" valuePropName="checked" className="mb-0">
              <Tag.CheckableTag checked={form.getFieldValue("is_close")}>
                <LockOutlined /> Khóa chủ đề
              </Tag.CheckableTag>
            </Form.Item>
          </div>
          <Form.Item className="mb-0 text-right">
            <Button onClick={handleCancel} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingTopic ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TopicList;
