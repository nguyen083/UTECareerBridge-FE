import React from "react";
import { Card, Button } from "antd";
import "./OrtherCard.scss";

const OrtherCard = () => {
  const cards = [
    {
      title: "Tạo CV Ứng Tuyển",
      description:
        "Hồ sơ thể hiện thế mạnh của bản thân thông qua việc đính kèm học vấn, kinh nghiệm, dự án, kỹ năng,... của mình",
      buttonText: "Tạo Profile",
      image: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/welcome/sel-growth/cv-builder-desktop.png", 
    },
    {
      title: "Tham gia sự kiện tuyển dụng",
      description:
        "Tham gia ngày hội tuyển dụng giúp bạn có trải nghiệm cơ hội phỏng vấn cùng với các anh/chị có kinh nghiệm trong cùng lĩnh vực, cũng như tăng thêm cơ hội tìm được việc làm mong muốn.",
      buttonText: "Tham gia ngay",
      image: "https://res.cloudinary.com/utejobhub/image/upload/v1733329165/Green_Geometric_We_re_Hiring_Flyer_Set_rfuuwq.jpg", 
    },
  ];

  return (
    <section className="profile-cards">
      <h2>
        Cùng UTE-Career xây dựng thương hiệu cá nhân
      </h2>
      <div className="profile-cards__container">
        {cards.map((card, index) => (
          <Card key={index} className="profile-cards__card" bordered={false}>
            <div className="profile-cards__content">
              <div className="profile-cards__text">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <Button
                  type="primary"
                  href={card.buttonLink}
                  className="profile-cards__button"
                >
                  {card.buttonText} →
                </Button>
              </div>
              <div className="profile-cards__image">
                <img src={card.image} alt={card.title} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default OrtherCard;
