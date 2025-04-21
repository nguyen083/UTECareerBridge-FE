// import { useSate } from "react";
import {
  Card,
  List,
  Typography,
  Spin,
  Input,
  Image,
  Pagination,
  Flex,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useSearchForum } from "../../composables/forum";
import BoxContainer from "../../components/Generate/BoxContainer";
import { formatDate } from "../../utils/day";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const { Title, Paragraph } = Typography;

const ForumList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  // const { data: forums, isLoading } = useForumActive(page);
  const { data: forums, isLoading } = useSearchForum({
    page: page - 1,
    size: 12,
    keyword: keyword,
  });
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(keyword);

  const handleSearch = (value) => {
    setSearchText(value);
    navigate(`/forums?page=${page}&keyword=${value}`);
  };

  return (
    <div className="mx-auto ">
      <div className="flex flex-col items-start mb-6">
        <BoxContainer className="w-full mb-6">
          <Title level={2} className="!mb-0 !text-text-color">
            {t("forum.listForum.title")}
          </Title>
        </BoxContainer>
        <div className="flex gap-4">
          <Input.Search
            size="large"
            allowClear
            placeholder={t("forum.listForum.search")}
            enterButton={<SearchOutlined />}
            onSearch={(value) => handleSearch(value)}
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            className="w-96"
          />
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <List
          className="!w-full"
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 3, xl: 4, xxl: 4 }}
          dataSource={forums?.data?.content}
          renderItem={(forum) => (
            <List.Item key={forum.forumId} className="!h-full !items-stretch">
              <Card
                onClick={() => navigate(`/forums/${forum.forumId}/topics`)}
                hoverable
                className="flex flex-col !h-full rounded-md overflow-hidden shadow"
                cover={<Image src={forum?.image} size={100} preview={false} />}
              >
                <Paragraph
                  ellipsis={{ rows: 1, tooltip: true }}
                  className="flex-1 text-lg font-semibold text-text-color"
                >
                  {forum.name}
                </Paragraph>
                <Paragraph
                  ellipsis={{ rows: 2, tooltip: true }}
                  className="flex-grow mb-4 text-gray-600 "
                >
                  {forum.description}
                </Paragraph>
                <div className="flex justify-end mt-auto text-xs text-gray-500">
                  <div>
                    {t("forum.listForum.createDate")}:{" "}
                    {formatDate(forum.createdAt)}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}
      <Flex justify="center" className="mt-4">
        <Pagination
          current={page}
          total={forums?.data?.totalElements}
          pageSize={forums?.data?.size}
          onChange={(page) => navigate(`/forums?page=${page}`)}
        />
      </Flex>
    </div>
  );
};

export default ForumList;
