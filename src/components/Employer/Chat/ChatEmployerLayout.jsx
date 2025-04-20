import { Col, Empty, Flex, Row, Space, Typography, Input, Button } from "antd";
import { ListConversation } from "../../../pages/Chat/CardofChat";
import { ReceiverChat, SenderChat } from "../../../pages/Chat/ContainerofChat";
import { SendOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import chat from "../../../services/api/chat";
import { useSelector } from "react-redux";
import {
  connectStomp,
  subscribeToTopic,
  unsubscribeFromTopic,
} from "../../../utils/stompConfig";
import { customScrollbarCSS } from "../../../constant/scrollbar";

const { Text } = Typography;
const { TextArea } = Input;

const ChatEmployerLayout = () => {
  const ConversationTopic = "/topic/conversation/";
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { t } = useTranslation();
  const { recipientId } = useParams();
  const senderId = useSelector((state) => state.user.userId);
  const divRef = useRef(null);
  const currentConversationRef = useRef(null);

  const getConversationId = (id1, id2) => {
    return parseInt(id1) < parseInt(id2) ? `${id1}-${id2}` : `${id2}-${id1}`;
  };

  useEffect(() => {
    if (recipientId && senderId) {
      chat
        .loadMessages({ user2Id: recipientId, user1Id: senderId })
        .then((res) => {
          setMessages(res.data.content);
        })
        .catch((err) => {
          console.error(err);
        });

      const conversationId = getConversationId(senderId, recipientId);
      currentConversationRef.current = conversationId;
      const topic = ConversationTopic + conversationId;

      connectStomp(() => {
        subscribeToTopic(topic, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      });
    }

    return () => {
      if (currentConversationRef.current) {
        const topic = ConversationTopic + currentConversationRef.current;
        unsubscribeFromTopic(topic);
        currentConversationRef.current = null;
      }
    };
  }, [recipientId, senderId]);

  useEffect(() => {
    if (divRef !== null) {
      divRef.current?.scrollTo({
        top: divRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const sendMessage = () => {
    const message = {
      senderId: senderId,
      recipientId: recipientId,
      content: newMessage,
    };

    chat.sendMessage(message);

    setNewMessage("");
  };

  return (
    <>
      <Row className="h-full overflow-hidden border rounded-s-lg">
        <Col
          span={18}
          className="flex flex-col bg-white border border-x-gray-200"
        >
          <Space
            direction="vertical"
            className="w-full h-auto px-2 py-3 border-b bg-card-color"
          >
            <Text className="text-base font-bold text-text-color ">
              {t("employer.chat.title")}
            </Text>
          </Space>
          {recipientId ? (
            <>
              <div
                className="w-full max-h-[703px] flex-1 overflow-y-auto flex flex-col p-2 gap-4 "
                ref={divRef}
              >
                <style>{customScrollbarCSS}</style>
                {messages.length === 0 && (
                  <Empty className="mt-36" description={t("no_message")} />
                )}
                {messages.map((message, index) => {
                  if (message.senderId === senderId) {
                    return <SenderChat key={index} message={message} />;
                  }
                  {
                    return <ReceiverChat key={index} message={message} />;
                  }
                })}
              </div>
              <Flex
                className=" p-2 w-full mb-4 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                gap={16}
                justify="center"
                align="flex-end"
              >
                <TextArea
                  className="h-auto overflow-hidden resize-none rounded-3xl"
                  placeholder={t("enter_message")}
                  size="large"
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (newMessage.trim()) {
                        sendMessage();
                      }
                    }
                  }}
                />
                <Flex className="min-h-[41px]" justify="center" align="center">
                  <Button
                    size="large"
                    type="text"
                    icon={<SendOutlined className="text-3xl text-blue-600" />}
                    onClick={() => sendMessage()}
                  ></Button>
                </Flex>
              </Flex>
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Empty
                image={Empty.PRESENTED_IMAGE_DEFAULT}
                description={t("choose_conversation")}
              />
            </div>
          )}
        </Col>
        <Col span={6} className="min-h-full bg-white border-l">
          <Space
            direction="vertical"
            className="w-full h-auto px-2 py-3 border-b shadow-sm"
          >
            <Text className="text-base font-bold text-text-color ">
              {t("employer.chat.title")}
            </Text>
          </Space>
          <ListConversation className="min-h-full" />
        </Col>
      </Row>
    </>
  );
};
export default ChatEmployerLayout;
