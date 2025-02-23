import { Avatar, Button, Card, Carousel, Flex, Image, Typography } from "antd";
import React from "react";
import "./Banner.scss";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;


const Banner = ({ ads }) => {
  const navigate = useNavigate();
  const handleNavigate = (id) => {
    navigate(`/company/${id}`);
  };
  return (
    <>
      <Carousel autoplay
        arrows
        className="w-3/4 mx-auto"
      >
        {ads.map((ad) => (
          <Card
            className="body-card"
            key={ad?.employerResponse?.id}
            cover={<Image
              height={422}
              preview={false}
              src={ad?.employerResponse?.backgroundImage}
              alt={ad?.employerResponse?.companyName}
            />}
          >
            <Flex align="center" justify="space-between">
              <Flex gap={"1rem"} align="center" >
                <Avatar shape="square" src={ad?.employerResponse.companyLogo} size={100} />
                <Text className="text-2xl font-medium company-name">{ad?.employerResponse?.companyName}</Text>
              </Flex>
              <Button
                onClick={() => handleNavigate(ad?.employerResponse?.id)}
                size="large" type="default">Tìm hiểu thêm</Button>
            </Flex>
          </Card>
        ))}
      </Carousel>
    </>
  );
};

export default Banner;
