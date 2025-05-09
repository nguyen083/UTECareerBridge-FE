import { useEffect, useState } from "react";
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
  Breadcrumb,
  Empty,
  Tooltip,
  Divider,
  Radio,
  Drawer,
  Flex,
  Pagination,
  message,
  Spin,
  Row,
  Col,
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
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { formatDate } from "../../../utils/day";
import CustomizeQuill from "../../../components/Generate/CustomizeQuill";
import { Newspaper } from "lucide-react";
import { useForumDetail } from "../../../composables/forum";
import { useTranslation } from "react-i18next";
import {
  useCreateTopicMutation,
  useSearchTopic,
} from "../../../composables/topic";
import { useAllTag, useCreateTag } from "../../../composables/tag";
import HtmlContent from "../../../components/Generate/HtmlContent";
import truncate from "html-truncate";
const { Title, Paragraph, Text } = Typography;

const { Search } = Input;
const TopicList = () => {
  const { forumId } = useParams();
  const { data: forum, isLoading: isLoadingForum } = useForumDetail(forumId);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const pageSize = 10;
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAtDesc"
  );
  const { mutate: createTopic, isPending: isPendingCreateTopic } =
    useCreateTopicMutation();
  const [selectedTags, setSelectedTags] = useState(() => {
    const tagsParam = searchParams.get("tags");
    return tagsParam ? tagsParam.split(",").map((tag) => Number(tag)) : [];
  });
  const { data: tags } = useAllTag();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [formTag] = Form.useForm();
  const [viewMode, setViewMode] = useState("card");
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const { mutate: createTag, isPending: isPendingCreateTag } = useCreateTag();
  const {
    data: topics,
    isLoading: isLoadingGetTopic,
    isFetching: isFetchingGetTopic,
    refetch: refetchTopics,
  } = useSearchTopic({
    forumId: forumId,
    page: page - 1,
    size: 10,
    keyword: searchText,
    sortBy: sortBy,
    tags: searchParams.get("tags") || "",
  });
  const search = (value) => {
    setSearchText(value);
    searchParams.set("search", value);
    setSearchParams(searchParams);
  };

  useEffect(() => {
    refetchTopics();
  }, [searchParams]);

  const handleCancel = () => {
    form.resetFields();
    setIsModalVisible(false);
  };

  const sortOptions = [
    {
      label: "Mới nhất",
      value: "createdAtDesc",
      icon: <ClockCircleOutlined />,
    },
    { label: "Cũ nhất", value: "createdAtAsc", icon: <CalendarOutlined /> },
    {
      label: "Cập nhật gần đây",
      value: "updatedAtDesc",
      icon: <RiseOutlined />,
    },
  ];

  const handleApplyFilter = () => {
    setIsFilterDrawerVisible(false);
    searchParams.set("page", 1);
    searchParams.set("sortBy", sortBy);
    searchParams.set("tags", selectedTags.join(","));
    setSearchParams(searchParams);
  };

  const handleResetFilter = () => {
    setIsFilterDrawerVisible(false);
    searchParams.delete("page");
    searchParams.delete("sortBy");
    searchParams.delete("tags");
    setSortBy("createdAtDesc");
    setSelectedTags(null);
    setSearchParams(searchParams);
  };

  const handleCreateTopic = (values) => {
    console.log(values);
    createTopic(
      {
        forumId,
        title: values.title,
        content: values.content,
        tags: values.tags,
      },
      {
        onSuccess: () => {
          form.resetFields();
          setIsModalVisible(false);
        },
        onError: () => {
          message.error(t("topic.createError"));
        },
      }
    );
  };

  const handleAddTag = (values) => {
    createTag(
      {
        name: values.name,
        description: "",
      },
      {
        onSuccess: () => {
          formTag.resetFields();
        },
        onError: () => {
          message.error(t("tag.createError"));
        },
      }
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [topics]);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 py-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Breadcrumb
              className="mb-0"
              items={[
                {
                  title: (
                    <Link to="/">
                      <HomeOutlined />
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link to="/forums">
                      {t("forum.title") || t("forum.title")}
                    </Link>
                  ),
                },
                {
                  title: forum?.data?.name || t("common.loading"),
                },
              ]}
            />
            <div className="flex items-center gap-2 md:hidden">
              <Button icon={<MenuOutlined />} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-2 py-6 mx-auto ">
        <div className="flex flex-col gap-6">
          {/* Main content */}

          <Spin
            spinning={isLoadingForum || isLoadingGetTopic || isFetchingGetTopic}
            className="mx-auto mb-6"
          >
            <div className="flex-grow">
              {/* Forum header */}
              <div className="">
                {forum && (
                  <Card className="mb-6 shadow-sm">
                    <div className="flex items-start justify-between ">
                      <div className="w-full">
                        <Title
                          level={2}
                          className="mb-1 !text-text-color truncate"
                        >
                          {forum?.data?.name}
                        </Title>
                        <Paragraph className="mb-2 text-text-color-hover">
                          {forum?.data?.description}
                        </Paragraph>
                        <div className="flex items-center justify-end text-text-color-hover">
                          <span className="flex items-center gap-1">
                            <Text className="text-sm text-text-color-hover">
                              {t("forum.listForum.createDate")}:
                            </Text>
                            <Text className="text-sm text-text-color" strong>
                              {forum
                                ? formatDate(forum?.data?.createdAt)
                                : "N/A"}
                            </Text>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Search and filters */}
              <div className="flex flex-col items-center justify-between gap-3 mb-4 sm:flex-row">
                <div className="w-full sm:w-auto">
                  <Search
                    size="large"
                    placeholder={t("topic.search")}
                    enterButton={<SearchOutlined />}
                    className="w-full sm:w-96"
                    onSearch={search}
                    allowClear
                    onChange={(e) => {
                      if (!e.target.value) {
                        search("");
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between w-full gap-2 sm:w-auto sm:justify-end">
                  <div className="hidden gap-2 md:flex">
                    <Button
                      icon={<FilterOutlined />}
                      onClick={() => setIsFilterDrawerVisible(true)}
                    >
                      {t("topic.filter")}
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
                      onClick={() => setIsModalVisible(!isModalVisible)}
                    >
                      <span className="hidden sm:inline">
                        {t("topic.addTopic")}
                      </span>
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
                    onFinish={handleCreateTopic}
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
                        dropdownRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: "8px 0" }} />
                            <Form
                              size="middle"
                              form={formTag}
                              onFinish={handleAddTag}
                              className="flex gap-2"
                            >
                              <Form.Item name="name" className="flex-1">
                                <Input
                                  className="w-full"
                                  placeholder="Nhập tên thẻ"
                                  onKeyDown={(e) => e.stopPropagation()}
                                />
                              </Form.Item>
                              <Form.Item>
                                <Button
                                  loading={isPendingCreateTag}
                                  type="text"
                                  icon={<PlusOutlined />}
                                  htmlType="submit"
                                >
                                  {t("tag.create")}
                                </Button>
                              </Form.Item>
                            </Form>
                          </>
                        )}
                        placeholder="Chọn thẻ"
                        options={tags?.data?.content?.map((tag) => ({
                          value: String(tag.tagId),
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isPendingCreateTopic}
                      >
                        Tạo chủ đề
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </div>

              {/* Topics list */}
              {topics?.data?.content?.length > 0 ? (
                <div
                  className={
                    viewMode === "card"
                      ? "grid gap-4"
                      : "border rounded-lg bg-white p-4"
                  }
                >
                  {viewMode === "card"
                    ? topics?.data?.content?.map((topic) => (
                        <TopicCard key={topic.id} topic={topic} />
                      ))
                    : topics?.data?.content?.map((topic) => (
                        <TopicListItem key={topic.id} topic={topic} />
                      ))}
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
              <Flex justify="center">
                <Pagination
                  total={topics?.data?.totalElements}
                  pageSize={pageSize}
                  current={page}
                  onChange={(page) => {
                    searchParams.set("page", page);
                    setSearchParams(searchParams);
                  }}
                />
              </Flex>
            </div>
          </Spin>
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
            <Button className="w-full" onClick={handleResetFilter}>
              Đặt lại
            </Button>
            <Button
              className="w-full"
              type="primary"
              onClick={handleApplyFilter}
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
              value={selectedTags}
              onChange={(values) => {
                setSelectedTags(values);
              }}
              options={tags?.data?.content?.map((tag) => ({
                value: tag.tagId,
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

const TopicCard = ({ topic }) => {
  const { t } = useTranslation();
  const { forumId } = useParams();
  const navigate = useNavigate();
  return (
    <Card
      key={topic?.topicId}
      onClick={() => {
        navigate(`/forums/${forumId}/topics/${topic?.topicId}/posts`);
      }}
      className="mb-4 transition-shadow duration-300 cursor-pointer hover:shadow-md"
      bodyStyle={{ padding: "16px" }}
    >
      <div className="flex items-start">
        <div className="flex flex-col items-center gap-2 mr-4 !min-w-28 ">
          <Avatar icon={<UserOutlined />} src={topic.avatar} size={60} />
          <Tag className="text-sm !mr-0" color="blue">
            {t(`topic.${topic?.roleName}`)}
          </Tag>
        </div>
        <div className="flex-grow">
          <Row>
            <Col span={18}>
              <div className="flex items-center gap-2 mb-1">
                {topic?.pinned && (
                  <Tooltip title="Chủ đề ghim">
                    <PushpinOutlined className="text-red-500" />
                  </Tooltip>
                )}
                <span className="text-lg font-medium hover:text-text-color-hover text-text-color">
                  {topic?.title}
                </span>
              </div>
            </Col>
            <Col span={6}>
              <div className="flex flex-wrap justify-end gap-1 mb-2">
                {topic?.tags?.map((tag) => (
                  <Tag
                    key={tag.tagId}
                    color="blue"
                    className="cursor-pointer hover:opacity-80"
                  >
                    {tag.name}
                  </Tag>
                ))}
              </div>
            </Col>
          </Row>
          <HtmlContent htmlString={truncate(topic?.content, 300)} />
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>
                <UserOutlined className="mr-1" /> {topic?.userName}
              </span>
              <span>
                <ClockCircleOutlined className="mr-1" /> {topic?.createdAt}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Tooltip title="Số bài viết">
                <span className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> {topic?.postCount || 0}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const TopicListItem = ({ topic }) => {
  const { forumId } = useParams();
  return (
    <div
      key={topic?.topicId}
      className="px-2 py-3 transition-colors duration-300 border-b last:border-b-0 hover:bg-gray-50"
    >
      <div className="flex items-start">
        <div className="hidden mr-4 sm:block">
          <Avatar icon={<UserOutlined />} src={topic?.avatar} size={40} />
        </div>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {topic?.pinned && (
              <Tooltip title="Chủ đề ghim">
                <PushpinOutlined className="text-red-500" />
              </Tooltip>
            )}
            {topic?.close && (
              <Tooltip title="Chủ đề đã khóa">
                <LockOutlined className="text-gray-500" />
              </Tooltip>
            )}

            <Link
              to={`/forums/${forumId}/topics/${topic?.topicId}/posts`}
              className="text-base font-medium text-text-color hover:text-text-color-hover"
            >
              {topic?.title}
            </Link>
          </div>
          <div className="flex flex-wrap justify-end gap-1 mb-2">
            {topic?.tags?.slice(0, 5).map((tag) => (
              <Tag
                key={tag.tagId}
                color="blue"
                className="cursor-pointer hover:opacity-80"
              >
                {tag.name}
              </Tag>
            ))}
            {topic?.tags?.length > 5 && (
              <Tag color="blue" className="cursor-pointer hover:opacity-80">
                +{topic?.tags?.length - 5}
              </Tag>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2 sm:gap-4">
              <span>
                <UserOutlined className="mr-1" /> {topic?.userName}
              </span>
              <span>
                <ClockCircleOutlined className="mr-1" /> {topic?.createdAt}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Tooltip title="Số bài viết">
                <span className="flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> {topic?.postCount || 0}
                </span>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicList;
