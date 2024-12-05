import { SearchOutlined } from "@ant-design/icons";
import { Input, Card, Typography, Flex } from "antd";
import React from "react";
import Banner from "./Banner";
import FeaturedJobs from "./FeaturedJobs";
import "./HomePage.scss";
import JobCategory from "./JobCategory";
import TopCompany from "./TopCompany";
import OrtherCard from "./OtherCard";
import BoxContainer from "../../Generate/BoxContainer";
import COLOR from "../../styles/_variables";
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';
const { Search } = Input;

const HomePage = () => {
  const onSearch = (value) => {
    console.log("Search:", value);
  };

  return (
    <BoxContainer padding="0 0 1rem 0" width={"90%"} className="mx-auto box_shadow" borderRadius="0px" background={COLOR.backgroundColor}>
      <Flex gap={16} vertical className="homepage">
        <div className="gradient-background">
          <Alert
            className="rounded-0"
            type="info"
            closable
            // banner
            message={
              <Marquee pauseOnHover gradient={false} className="fs-5 fw-bold">
                Khởi đầu sự nghiệp, tìm việc dễ dàng - Cơ hội nghề nghiệp dành cho sinh viên ngay hôm nay!
              </Marquee>
            }
          />
          <header className="homepage__header">
          </header>

          <div className="banner">
            <Banner />
          </div>
          <div className="top-company">
            <TopCompany />
          </div>
        </div>
        <JobCategory />

        <Card

          size="large"
          title={<Typography.Title level={3} className="mb-0">Việc làm nổi bật</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          <FeaturedJobs />
        </Card>

        <Card
          size="large"
          title={<Typography.Title level={3} className="mb-0">Việc làm đang tuyển gấp</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          <FeaturedJobs />
        </Card>
        <div className="other-items">
          <OrtherCard />
        </div>
      </Flex>
    </BoxContainer>
  );
};

export default HomePage;
