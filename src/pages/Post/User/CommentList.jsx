import { Card, Avatar, Typography, Button, Flex } from "antd";
import {
  ClockCircleOutlined,
  CommentOutlined,
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Text, Paragraph } = Typography;

const CommentList = ({
  comments = [],
  setComments,
  page,
  setPage,
  totalPage,
  isPendingComments,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      {comments.length > 0 ? (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem key={comment.commentId} comment={comment} />
          ))}
          {!(page === totalPage && !isPendingComments) && (
            <Button
              loading={isPendingComments}
              onClick={() => setPage(page + 1)}
            >
              Xem thêm
            </Button>
          )}
        </div>
      ) : (
        <Card className="py-8 text-center">
          <MessageOutlined
            style={{ fontSize: 48 }}
            className="mb-4 text-gray-300"
          />
          <Paragraph>{t("post.noComment")}</Paragraph>
        </Card>
      )}
    </div>
  );
};

const CommentItem = ({ comment }) => {
  return (
    <>
      <Card key={comment.commentId} className="shadow-sm" size="small">
        <div className="flex">
          <Avatar
            src={comment.avatar}
            icon={<UserOutlined />}
            className="flex-shrink-0 mr-3"
          />
          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <Text strong>{comment.userName}</Text>
                <div className="text-xs text-gray-500">
                  <ClockCircleOutlined className="mr-1" />
                  {comment.createdAt}
                </div>
              </div>
            </div>
            <Paragraph className="!my-1">{comment.content}</Paragraph>
            <Flex justify="end">
              <Button type="text" size="small" icon={<CommentOutlined />}>
                Trả lời
              </Button>
            </Flex>
          </div>
        </div>
      </Card>
    </>
  );
};

export default CommentList;
