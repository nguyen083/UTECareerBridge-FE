import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import React from "react";
import Banner from "./Banner";
import FeaturedJobs from "./FeaturedJobs";
import "./HomePage.scss";
import JobCategory from "./JobCategory";
import TopCompany from "./TopCompany";
import OrtherCard from "./OtherCard";
const { Search } = Input;

const HomePage = () => {
  const onSearch = (value) => {
    console.log("Search:", value);
  };

  return (
    <div className="homepage">
      <header className="homepage__header">
        <h1>Tìm kiếm việc làm mơ ước</h1>
        <Search
          placeholder="Nhập vị trí hoặc kỹ năng"
          onSearch={onSearch}
          enterButton="Tìm kiếm"
          size="large"
          className="homepage__search"
          prefix={<SearchOutlined style={{ color: "rgb(195, 195, 195)" }} />}
        />
      </header>
      
      <div className="banner">
        <Banner />
      </div>
      <div className="top-company">
        <TopCompany/>
      </div>
      <JobCategory />
      <div>
        <h2>Việc làm nổi bật</h2>
        <FeaturedJobs />
      </div>
      <div>
        <h2>Việc làm nổi bật trong lĩnh vực IT</h2>
        <FeaturedJobs />
      </div>
      <div className="other-items">
        <OrtherCard/>
      </div>
    </div>
  );
};

export default HomePage;
