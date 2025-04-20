"use client"

import { useState, useEffect } from "react"
import { Card, List, Typography, Tag, Skeleton, Button, Input, Modal, Form, message } from "antd"
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Title, Paragraph, Text } = Typography

const ForumList = () => {
  const [forums, setForums] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [editingForum, setEditingForum] = useState(null)

  // Giả lập dữ liệu
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi API để lấy dữ liệu
    setTimeout(() => {
      setForums([
        {
          forum_id: 1,
          name: "Công nghệ",
          description: "Thảo luận về công nghệ, phần mềm, phần cứng và các xu hướng mới",
          is_active: true,
          created_at: "2023-01-15T08:30:00Z",
          topic_count: 125,
          post_count: 1250,
        },
        {
          forum_id: 2,
          name: "Giáo dục",
          description: "Chia sẻ kiến thức, tài liệu học tập và phương pháp giảng dạy",
          is_active: true,
          created_at: "2023-01-20T10:15:00Z",
          topic_count: 87,
          post_count: 932,
        },
        {
          forum_id: 3,
          name: "Giải trí",
          description: "Thảo luận về phim ảnh, âm nhạc, game và các hoạt động giải trí khác",
          is_active: true,
          created_at: "2023-02-05T14:45:00Z",
          topic_count: 210,
          post_count: 1876,
        },
        {
          forum_id: 4,
          name: "Sức khỏe",
          description: "Chia sẻ kiến thức về sức khỏe, dinh dưỡng và lối sống lành mạnh",
          is_active: true,
          created_at: "2023-02-10T09:20:00Z",
          topic_count: 65,
          post_count: 723,
        },
        {
          forum_id: 5,
          name: "Du lịch",
          description: "Chia sẻ kinh nghiệm du lịch, địa điểm thú vị và mẹo tiết kiệm chi phí",
          is_active: false,
          created_at: "2023-03-01T11:30:00Z",
          topic_count: 92,
          post_count: 845,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredForums = forums.filter(
    (forum) =>
      forum.name.toLowerCase().includes(searchText.toLowerCase()) ||
      forum.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const showModal = (forum = null) => {
    setEditingForum(forum)
    if (forum) {
      form.setFieldsValue({
        name: forum.name,
        description: forum.description,
        is_active: forum.is_active,
      })
    } else {
      form.resetFields()
    }
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const handleSubmit = (values) => {
    if (editingForum) {
      // Cập nhật forum
      const updatedForums = forums.map((forum) =>
        forum.forum_id === editingForum.forum_id ? { ...forum, ...values } : forum,
      )
      setForums(updatedForums)
      message.success("Cập nhật diễn đàn thành công!")
    } else {
      // Thêm forum mới
      const newForum = {
        forum_id: forums.length + 1,
        ...values,
        created_at: new Date().toISOString(),
        topic_count: 0,
        post_count: 0,
      }
      setForums([...forums, newForum])
      message.success("Tạo diễn đàn mới thành công!")
    }
    setIsModalVisible(false)
  }

  const handleDelete = (forumId) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa diễn đàn này không?",
      onOk() {
        const updatedForums = forums.filter((forum) => forum.forum_id !== forumId)
        setForums(updatedForums)
        message.success("Xóa diễn đàn thành công!")
      },
    })
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className="mb-0">
          Danh sách diễn đàn
        </Title>
        <div className="flex gap-4">
          <Input placeholder="Tìm kiếm diễn đàn" prefix={<SearchOutlined />} onChange={handleSearch} className="w-64" />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
            Tạo diễn đàn
          </Button>
        </div>
      </div>

      <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={filteredForums}
          renderItem={(forum) => (
            <List.Item key={forum.forum_id}>
              <Card
                hoverable
                className="h-full"
                actions={[
                  <Button key={forum.forum_id} type="text" icon={<EditOutlined />} onClick={() => showModal(forum)}>
                    Sửa
                  </Button>,
                  <Button key={forum.forum_id} type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(forum.forum_id)}>
                    Xóa
                  </Button>,
                ]}
                extra={forum.is_active ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Tạm khóa</Tag>}
              >
                <Link to={`/forums/${forum.forum_id}/topics`}>
                  <Title level={4}>{forum.name}</Title>
                </Link>
                <Paragraph className="mb-4 text-gray-600">{forum.description}</Paragraph>
                <div className="flex justify-between text-sm text-gray-500">
                  <div>
                    <Text strong>{forum.topic_count}</Text> chủ đề | <Text strong>{forum.post_count}</Text> bài viết
                  </div>
                  <div>Tạo ngày: {formatDate(forum.created_at)}</div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </Skeleton>

      <Modal
        title={editingForum ? "Chỉnh sửa diễn đàn" : "Tạo diễn đàn mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ is_active: true }}>
          <Form.Item
            name="name"
            label="Tên diễn đàn"
            rules={[{ required: true, message: "Vui lòng nhập tên diễn đàn!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả diễn đàn!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="is_active" valuePropName="checked">
            <Tag.CheckableTag checked={form.getFieldValue("is_active")}>Hoạt động</Tag.CheckableTag>
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Button onClick={handleCancel} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingForum ? "Cập nhật" : "Tạo mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ForumList
