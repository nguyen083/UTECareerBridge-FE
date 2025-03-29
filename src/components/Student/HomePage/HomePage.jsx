import { CloseOutlined } from "@ant-design/icons";
import { Card, Typography, Flex, Empty, message } from "antd";
import { useEffect, useState } from "react";
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
import IconChatBot from "../../Generate/ChatBot/Chatbot.jsx";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const [company, setCompany] = useState([]);
  const [jobsUrgent, setJobsUrgent] = useState([]);
  const [jobsNewest, setJobsNewest] = useState([]);
  const fetchJobUrgent = async () => {
    getJobUrgent().then(res => {
      setJobsUrgent(res.data.jobResponses);
    }).catch(err => {
      console.error(err);
    });
  }

  const fetchJobsNewest = async () => {
    getJobsNewest().then(res => {
      setJobsNewest(res.data.jobResponses);
    }).catch(err => {
      console.error(err);
    });
  }
  const fetchAds = async () => {
    getAds().then(res => {
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
    <BoxContainer padding="0 0 1rem 0" width={"100%"} className="mx-auto shadow" borderRadius="0px" background={COLOR.backgroundColor}>
      <IconChatBot />
      <Flex gap={16} vertical className="homepage">
        <div>
          <div className="gradient-background">
            <Alert
              className="border-0 rounded-none "
              style={{ background: COLOR.textColor, color: COLOR.backgroundColor }}
              closable={{ closeIcon: <CloseOutlined style={{ color: COLOR.backgroundColor }} /> }}
             
              message={
                <Marquee pauseOnHover gradient={false} className="text-lg font-bold">
                  {t('marquee')}
                </Marquee>
              }
            />
            <header className="homepage__header">
            </header>

            <div className="w-full">
              <Banner ads={company} />
            </div>
            <div className="top-company">
              <TopCompany companies={company.slice(0, 4)} />
            </div>
          </div>
        </div>
        <JobCategory />

        <Card
          size="large"
          title={<Typography.Title level={3} className="mb-0">{t('newest_jobs')}</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          {jobsNewest.length > 0 ? <FeaturedJobs jobs={jobsNewest} /> : <Empty description="Không tìm thấy việc làm nào" />}
        </Card>

        <Card
          size="large"
          title={<Typography.Title level={3} className="mb-0">{t('urgent_jobs')}</Typography.Title>}
          className="mx-auto customize-card" style={{ width: "80%" }}>
          {jobsUrgent.length > 0 ? <FeaturedJobs jobs={jobsUrgent} /> : <Empty description="Không tìm thấy việc làm nào" />}
        </Card>
        <div className="other-items">
          <OrtherCard />
        </div>
      </Flex>
    </BoxContainer>
  );
};

export default HomePage;
