import { CloseOutlined, SearchOutlined, BarsOutlined } from "@ant-design/icons";
import {
  Card,
  Typography,
  Flex,
  Empty,
  message,
  Divider,
  Tooltip,
  Input,
  Button,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import Banner from "./Banner";
import FeaturedJobs from "./FeaturedJobs";
import "./HomePage.scss";
import JobCategory from "./JobCategory";
import TopCompany from "./TopCompany";
import OrtherCard from "./OtherCard";
import BoxContainer from "../../Generate/BoxContainer";
import COLOR from "../../styles/_variables";
import { Alert } from "antd";
import Marquee from "react-fast-marquee";
import {
  getAds,
  getJobsNewest,
  getJobUrgent,
  getAllJobCategories,
} from "../../../services/apiService";
import IconChatBot from "../../Generate/ChatBot/Chatbot.jsx";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setKeyword } from "../../../redux/action/webSlice";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const HomePage = () => {
  const { t } = useTranslation();
  const [company, setCompany] = useState([]);
  const [jobsUrgent, setJobsUrgent] = useState([]);
  const [jobsNewest, setJobsNewest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchJobUrgent = async () => {
    try {
      const res = await getJobUrgent();
      setJobsUrgent(res.data.jobResponses);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchJobsNewest = async () => {
    try {
      const res = await getJobsNewest();
      setJobsNewest(res.data.jobResponses);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAds = async () => {
    try {
      const res = await getAds();
      if (res.status === "OK") {
        setCompany(res.data.content);
      } else {
        message.error(t("failed_to_fetch_data"));
      }
    } catch (error) {
      console.error(error);
      message.error(t("failed_to_fetch_data"));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getAllJobCategories();
      if (res.status === "OK") {
        setCategories(res.data.filter((cat) => cat.active).slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    dispatch(setKeyword(searchValue));
    navigate("/search", {
      state: {
        filters: {
          categoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
        },
      },
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    Promise.all([
      fetchAds(),
      fetchJobUrgent(),
      fetchJobsNewest(),
      fetchCategories(),
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <BoxContainer
      padding="0 0 2rem 0"
      width={"100%"}
      className="mx-auto shadow"
      borderRadius="0px"
      background={COLOR.backgroundColor}
    >
      <IconChatBot />
      <Flex gap={24} vertical className="homepage">
        <div>
          <div className="gradient-background">
            <Alert
              className="border-0 rounded-none"
              style={{
                background: COLOR.textColor,
                color: COLOR.backgroundColor,
              }}
              closable={{
                closeIcon: (
                  <CloseOutlined style={{ color: COLOR.backgroundColor }} />
                ),
              }}
              banner
              message={
                <Marquee
                  pauseOnHover
                  gradient={false}
                  className="text-lg font-bold"
                >
                  {t("marquee")}
                </Marquee>
              }
            />
            <header className="homepage__header fadeInUp-animation">
              <div className="homepage__search">
                <div className="search-container">
                  <div className="search-inputs">
                    <Input
                      size="large"
                      placeholder={t("job.search.placeholder")}
                      prefix={<SearchOutlined className="search-icon" />}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onPressEnter={handleSearch}
                    />
                    <Select
                      size="large"
                      placeholder={
                        <Flex align="center">
                          <BarsOutlined />
                          <span className="ml-2">
                            {t("job.search.category")}
                          </span>
                        </Flex>
                      }
                      style={{ width: "30%" }}
                      onChange={(value) => setSelectedCategory(value)}
                      allowClear
                    >
                      {categories.map((category) => (
                        <Option
                          key={category.jobCategoryId}
                          value={category.jobCategoryId}
                        >
                          {category.jobCategoryName}
                        </Option>
                      ))}
                    </Select>
                    <Button
                      type="primary"
                      size="large"
                      className="search-button"
                      onClick={handleSearch}
                    >
                      {t("job.search.search")}
                    </Button>
                  </div>
                  {/* <div className="popular-searches">
                    <span>{t("job.search.popular")}:</span>
                    {categories.slice(0, 3).map((cat) => (
                      <Button
                        key={cat.jobCategoryId}
                        type="link"
                        size="small"
                        onClick={() => {
                          setSelectedCategory(cat.jobCategoryId);
                          handleSearch();
                        }}
                      >
                        {cat.jobCategoryName}
                      </Button>
                    ))}
                  </div> */}
                </div>
              </div>
            </header>

            <div
              className="w-full fadeInUp-animation"
              style={{ animationDelay: "0.2s" }}
            >
              <Banner ads={company} />
            </div>
            <div
              className="top-company fadeInUp-animation"
              style={{ animationDelay: "0.4s" }}
            >
              <TopCompany companies={company.slice(0, 4)} />
            </div>
          </div>
        </div>

        <div
          className="category-section fadeInUp-animation"
          style={{ animationDelay: "0.5s" }}
        >
          <JobCategory />
        </div>

        <Divider className="my-6">
          <Tooltip title={t("newest_jobs_tooltip")}>
            <Typography.Text className="text-lg font-medium text-blue-800">
              {t("explore_opportunities")}
            </Typography.Text>
          </Tooltip>
        </Divider>

        <Card
          size="large"
          title={
            <div className="flex items-center">
              <Typography.Title level={3} className="mb-0">
                {t("newest_jobs")}
              </Typography.Title>
            </div>
          }
          className="mx-auto customize-card fadeInUp-animation"
          style={{ width: "80%", animationDelay: "0.6s" }}
          loading={loading}
        >
          {jobsNewest.length > 0 ? (
            <FeaturedJobs jobs={jobsNewest} className="job-card" />
          ) : (
            <Empty description={t("no_jobs_found")} />
          )}
        </Card>

        <Card
          size="large"
          title={
            <div className="flex items-center">
              <Typography.Title level={3} className="mb-0">
                {t("urgent_jobs")}
              </Typography.Title>
            </div>
          }
          className="mx-auto customize-card fadeInUp-animation"
          style={{ width: "80%", animationDelay: "0.8s" }}
          loading={loading}
        >
          {jobsUrgent.length > 0 ? (
            <FeaturedJobs jobs={jobsUrgent} className="job-card" />
          ) : (
            <Empty description={t("no_jobs_found")} />
          )}
        </Card>

        <div
          className="other-items fadeInUp-animation"
          style={{ animationDelay: "1s" }}
        >
          <OrtherCard />
        </div>
      </Flex>
    </BoxContainer>
  );
};

export default HomePage;
