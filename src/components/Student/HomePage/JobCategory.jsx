import {
  BankOutlined,
  LaptopOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Carousel } from "antd";
import React, { useRef } from "react";
import "./JobCategory.scss";

const JobCategory = () => {
  const carouselRef = useRef(null);

  const categories = [
    { name: "CNTT", icon: <LaptopOutlined />, jobs: 1200 },
    { name: "Marketing", icon: <UserOutlined />, jobs: 800 },
    { name: "Kế toán", icon: <BankOutlined />, jobs: 450 },
    { name: "Ngân hàng", icon: <BankOutlined />, jobs: 600 },
    { name: "Nhân sự", icon: <UserOutlined />, jobs: 300 },
    { name: "Thiết kế", icon: <LaptopOutlined />, jobs: 750 },
    { name: "Bán hàng", icon: <UserOutlined />, jobs: 900 },
  ];

  const goToPrev = () => {
    carouselRef.current.prev();
  };

  const goToNext = () => {
    carouselRef.current.next();
  };

  return (
    <section className="job-category">
      <h2>Ngành nghề trọng điểm</h2>
      <div className="job-category__carousel-wrapper">
        <Button
          icon={<LeftOutlined />}
          className="job-category__control job-category__control--left"
          onClick={goToPrev}
        />
        <Carousel
          ref={carouselRef}
          dots={false}
          slidesToShow={4}
          slidesToScroll={1} // Cuộn đồng thời 4 card
          infinite={false} // Dừng cuộn khi hết nội dung
          className="job-category__carousel"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          {categories.map((category, index) => (
            <Card
              key={index}
              hoverable
              className="job-category__item"
              style={{ textAlign: "center" }}
            >
              <div className="job-category__icon">{category.icon}</div>
              <div className="job-category__name">{category.name}</div>
              <div className="job-category__jobs">
                {category.jobs} công việc
              </div>
            </Card>
          ))}
        </Carousel>

        <Button
          icon={<RightOutlined />}
          className="job-category__control job-category__control--right"
          onClick={goToNext}
        />
      </div>
    </section>
  );
};

export default JobCategory;
