import { CloseOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Card, Typography, Flex } from "antd";
import React, { useEffect, useState } from "react";
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
import { getAds, getJobsNewest, getJobUrgent } from "../../../services/apiService";

const HomePage = () => {

  const [company, setCompany] = useState([]);
  const [jobsUrgent, setJobsUrgent] = useState([]);
  const [jobsNewest, setJobsNewest] = useState([]);
  const fetchJobUrgent = async () => {
    getJobUrgent().then(res => {
      console.log(res.data.jobResponses);
      setJobsUrgent(res.data.jobResponses);
    }).catch(err => {
      console.log(err);
    });
  }

  const fetchJobsNewest = async () => {
    getJobsNewest().then(res => {
      setJobsNewest(res.data.jobResponses);
    }).catch(err => {
      console.log(err);
    });
  }
  const fetchAds = async () => {
    getAds().then(res => {
      console.log(res);
      if (res.status === "OK") {
        setCompany(res.data.content);
      } else {
        message.error("Lấy dữ liệu thất bại")
      }
    })
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAds();
    fetchJobUrgent();
    fetchJobsNewest();
  }, []);
  return (
    <BoxContainer padding="0 0 1rem 0" width={"100%"} className="mx-auto box_shadow" borderRadius="0px" background={COLOR.backgroundColor}>
      <Flex gap={16} vertical className="homepage">
        <div className="gradient-background">
          <Alert
            className="rounded-0 border-0 "
            style={{ background: COLOR.textColor, color: COLOR.backgroundColor }}
            closable={{ closeIcon: <CloseOutlined style={{ color: COLOR.backgroundColor }} /> }}
            // banner
            message={
              <Marquee pauseOnHover gradient={false} className="fs-5 fw-bold">
                Khởi đầu sự nghiệp, tìm việc dễ dàng - Cơ hội nghề nghiệp dành cho bạn ngay hôm nay!
              </Marquee>
            }
          />
          <header className="homepage__header">
          </header>

          <div className="banner">
            <Banner ads={company} />
          </div>
          <div className="top-company">
            <TopCompany companies={company.slice(0, 4)} />
          </div>
        </div>
        <JobCategory />

        <Card

          size="large"
          title={<Typography.Title level={3} className="mb-0">Việc làm mới nhất</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          <FeaturedJobs jobs={jobsNewest} />
        </Card>

        <Card
          size="large"
          title={<Typography.Title level={3} className="mb-0">Việc làm đang tuyển gấp</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          <FeaturedJobs jobs={jobsUrgent} />
        </Card>
        <div className="other-items">
          <OrtherCard />
        </div>
      </Flex>
    </BoxContainer>
  );
};

export default HomePage;
