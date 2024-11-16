import { FaPhotoVideo } from "react-icons/fa";
import { Flex, Typography } from 'antd';
import React from 'react';
import BoxContainer from './BoxContainer';
const { Text } = Typography;

const YouTubeVideo = ({ link }) => {
    return (
        <Flex justify="center" align="center">
            {link !== null ?
                <div style={{ position: 'relative', height: 0, paddingBottom: '45%', width: "80%", overflow: 'hidden' }}>
                    <iframe
                        width="100%"
                        height="100%"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        src={link}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Embedded YouTube Video"
                    />
                </div> :
                <BoxContainer background="#F6F8FB" padding="2rem" width="100%" >
                    <Flex vertical gap={1} justify='center' align='center' >
                        <FaPhotoVideo style={{ height: 80, width: 'auto', color: "#B2B4B6" }} />
                        <Text type="secondary">Không có video giới thiệu</Text>
                    </Flex>
                </BoxContainer>
            }
        </Flex >
    );
};

export default YouTubeVideo;
