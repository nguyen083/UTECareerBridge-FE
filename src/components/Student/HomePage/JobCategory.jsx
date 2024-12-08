
import { Button, Card, Carousel } from "antd";
import React, { useRef } from "react";
import "./JobCategory.scss";
import { FaNewspaper, FaMicrochip } from "react-icons/fa6";
import { FaCogs, FaCar, FaCalculator, FaHotel, FaRoute, FaBullhorn, FaLaptopCode, } from "react-icons/fa";
import { BankOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const JobCategory = () => {
  const carouselRef = useRef(null);
  const navigate = useNavigate();

  const categories = [
    { name: "Báo chí/ truyền hình", icon: <FaNewspaper />, key: 4 },
    { name: "Cơ khí / Chế tạo / Tự động hóa", icon: <FaCogs />, key: 11 },
    { name: "Công nghệ Ô tô", icon: <FaCar />, key: 13 },
    { name: "Công nghệ thông tin", icon: <FaLaptopCode />, key: 14 },
    { name: "Điện / Điện tử / Điện lạnh", icon: <FaMicrochip />, key: 19 },
    { name: "Kế toán / Kiểm toán", icon: <FaCalculator />, key: 32 },
    { name: "Khách sạn / Nhà hàng", icon: <FaHotel />, key: 33 },
    { name: "Logistics", icon: <FaRoute />, key: 36 },
    { name: "Marketing / Truyền thông / Quảng cáo", icon: <FaBullhorn />, key: 38 },
    { name: "Ngân hàng / Tài chính", icon: <BankOutlined />, key: 42 },
  ];

  const goToPrev = () => {
    carouselRef.current.prev();
  };

  const goToNext = () => {
    carouselRef.current.next();
  };

  const handleCategoryClick = (key) => {
    navigate(`/search`, { state: { filters: { categoryId: key } } })
  }

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
          slidesToScroll={4} // Cuộn đồng thời 4 card
          infinite={true} // Dừng cuộn khi hết nội dung
          className="job-category__carousel"
          style={{ maxWidth: 1200, margin: "0 auto" }}
        >
          {categories.map((category, index) => (
            <Card
              key={index}
              onClick={() => handleCategoryClick(category.key)}
              hoverable
              className="job-category__item box_shadow"
              style={{ textAlign: "center" }}
            >
              <div className="job-category__icon">{category.icon}</div>
              <div className="job-category__name">{category.name}</div>

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
