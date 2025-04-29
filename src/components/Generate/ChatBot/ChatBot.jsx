import { useCallback, useRef, useState, useEffect } from "react";
import { Card, Flex, FloatButton, Image, Popover, Input, Button } from "antd";

import "./ChatBot.scss";
import { ReceiverChat, SenderChat } from "../../../pages/Chat/ContainerofChat";
import { connectStomp } from "../../../utils/stompConfig";
import { SendOutlined } from "@ant-design/icons";
import chat from "../../../services/api/chat";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const { TextArea } = Input;
const ChatBot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const divRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const currentUserId = "current-user";
  const lang = useSelector((state) => state.web.lang || "en");

  const generateSessionId = () => {
    const storedId = localStorage.getItem("chatbotSessionId");
    if (storedId) {
      return storedId;
    }

    const newId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("chatbotSessionId", newId);
    return newId;
  };

  const cleanMarkdownText = (text) => {
    if (!text) return "";

    // First check if the text already contains HTML <a> tags - if so, preserve them
    if (text.includes("<a href=")) {
      // Convert markdown list items to HTML list items
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
        .replace(/\*\s+(.*?)(\n|$)/g, "<li>$1</li>")
        .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>")
        .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
        .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
        .replace(/#### (.*?)(\n|$)/g, "<h4>$1</h4>")
        .replace(/##### (.*?)(\n|$)/g, "<h5>$1</h5>")
        .replace(/###### (.*?)(\n|$)/g, "<h6>$1</h6>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>");
    }

    // If no HTML tags, process markdown including converting markdown links to HTML
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/\*\s+(.*?)(\n|$)/g, "<li>$1</li>")
      .replace(/# (.*?)(\n|$)/g, "<h1>$1</h1>")
      .replace(/## (.*?)(\n|$)/g, "<h2>$1</h2>")
      .replace(/### (.*?)(\n|$)/g, "<h3>$1</h3>")
      .replace(/#### (.*?)(\n|$)/g, "<h4>$1</h4>")
      .replace(/##### (.*?)(\n|$)/g, "<h5>$1</h5>")
      .replace(/###### (.*?)(\n|$)/g, "<h6>$1</h6>")
      .replace(/\n\n/g, "<br><br>")
      .replace(/\n/g, "<br>");
  };

  const onConnected = useCallback((client) => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setStompClient(client);
    client.subscribe("/chatbot/" + newSessionId, (response) => {
      const responseBody = JSON.parse(response.body);
      const messageContent = responseBody.message.content;
      console.log("Message content:", cleanMarkdownText(messageContent));

      if (messageContent) {
        const botMessage = {
          content: cleanMarkdownText(messageContent),
          senderId: "chatbot",
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error("No message content found in response:", responseBody);
      }
    });
  }, []);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    connectStomp(onConnected, (error) => {
      console.error("Lỗi kết nối:", error);
    });
    return () => {};
  }, [onConnected]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      content: newMessage,
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const payload = {
      sessionId: sessionId,
      content: newMessage,
      language: lang,
    };

    chat.sendMessageToChatBot(stompClient, payload);
    setNewMessage("");
  };
  return (
    <Card
      title={
        <Flex className="text-white" align="center" gap={6}>
          <Image size={30} src="src\assets\chatbot.png" preview={false} />{" "}
          ChatBot
        </Flex>
      }
    >
      <div className="flex flex-col h-fit">
        <div
          className="chat-messages-container !min-h-[600px] !min-w-[500px] !max-h-[600px] !max-w-[500px] flex flex-col gap-4 overflow-x-auto px-4"
          ref={divRef}
        >
          <style>{`
                        .chat-messages-container {
                            margin: 0 -16px;
                            padding: 0 16px;
                        }
                        .chat-messages-container::-webkit-scrollbar {
                            width: 6px;
                            margin-right: -6px;
                        }
                        .chat-messages-container::-webkit-scrollbar-track {
                            background: #f1f1f1;
                            border-radius: 3px;
                        }
                        .chat-messages-container::-webkit-scrollbar-thumb {
                            background: #888;
                            border-radius: 3px;
                        }
                        .chat-messages-container::-webkit-scrollbar-thumb:hover {
                            background: #555;
                        }
                    `}</style>
          {messages.map((message, index) => {
            if (message.senderId === currentUserId) {
              return <SenderChat key={index} message={message} />;
            }
            {
              return <ReceiverChat key={index} message={message} />;
            }
          })}
        </div>
        <Flex
          className="w-full h-auto p-2 "
          gap={2}
          justify="center"
          align="flex-end"
        >
          <TextArea
            className="h-auto overflow-hidden resize-none rounded-3xl"
            placeholder={t("chatbot.placeholderInput")}
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
      </div>
    </Card>
  );
};

const IconChatBot = () => {
  return (
    <div className="popover-chat">
      <Popover
        overlayClassName="chatbot"
        className="p-0 "
        placement="leftBottom"
        content={ChatBot}
        trigger="click"
      >
        <FloatButton
          className="w-14 h-14"
          icon={
            <Image size={40} src="src\assets\chatbot.png" preview={false} />
          }
        />
      </Popover>
    </div>
  );
};
export default IconChatBot;
