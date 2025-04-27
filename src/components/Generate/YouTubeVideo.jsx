import { FaPhotoVideo } from "react-icons/fa";
import { Flex, Typography } from "antd";
import { useTranslation } from "react-i18next";
import BoxContainer from "./BoxContainer";
import "./YouTubeVideo.scss";

const { Text } = Typography;

const YouTubeVideo = ({ link }) => {
  const { t } = useTranslation();

  return (
    <Flex justify="center" align="center" className="youtube-container">
      {link !== null ? (
        <div className="video-wrapper">
          <iframe
            width="100%"
            height="100%"
            src={link}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded YouTube Video"
          />
        </div>
      ) : (
        <BoxContainer
          background="#F6F8FB"
          padding="2rem"
          width="100%"
          className="no-video"
        >
          <Flex vertical gap={1} justify="center" align="center">
            <FaPhotoVideo className="video-icon" />
            <Text type="secondary">{t("student.layout.jobs.noVideo")}</Text>
          </Flex>
        </BoxContainer>
      )}
    </Flex>
  );
};

export default YouTubeVideo;
