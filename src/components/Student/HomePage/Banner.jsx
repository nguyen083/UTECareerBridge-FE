import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Card, Carousel } from "antd";
import React, { useRef } from "react";
import "./Banner.scss";

const ads = [
  {
    id: 1,
    image: "https://res.cloudinary.com/utejobhub/image/upload/v1726149903/company/C_ng_ty_C__ph_n_Gi_o_d_c_____o_t_o_IMAP_Vi_t_Nam__background.png",
    company: "Công ty A",
    link: "/advertisements/company-a",
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    company: "Công ty B",
    link: "/advertisements/company-b",
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    company: "Công ty C",
    link: "/advertisements/company-c",
  },
];

const Banner = () => {
  const carouselRef = useRef(null);

  const handleRedirect = (url) => {
    window.open(url, "_blank"); // Mở trong tab mới.
  };

  const goToPrev = () => {
    carouselRef.current.prev();
  };

  const goToNext = () => {
    carouselRef.current.next();
  };

  return (
    <div className="banner-slider">
      <div className="banner-slider__controls">
        <Button
          shape="circle"
          icon={<LeftOutlined />}
          onClick={goToPrev}
          className="banner-slider__control"
        />
        <Button
          shape="circle"
          icon={<RightOutlined />}
          onClick={goToNext}
          className="banner-slider__control"
        />
      </div>
      <Carousel autoplay ref={carouselRef}>
        {ads.map((ad) => (
          <div key={ad.id}>
            <Card
              className="banner-slider__card"
              hoverable
              cover={
                <img
                  alt={ad.company}
                  src={ad.image}
                  onClick={() => handleRedirect(ad.link)}
                  className="banner-slider__image"
                />
              }
            >
              <div className="banner-wrapper">
                <div
                  className="banner-wrapper__company"
                  onClick={() => handleRedirect(ad.link)}
                >
                  {ad.company}
                </div>
                <Button
                  type="primary"
                  onClick={() => handleRedirect(ad.link)}
                  className="banner-wrapper__button"
                >
                  Tìm hiểu thêm
                </Button>
              </div>
            </Card>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;
