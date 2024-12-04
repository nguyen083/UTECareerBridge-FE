import { Card } from "antd";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";
import "./FeaturedJobs.scss";

const FeaturedJobs = () => {
  const jobs = [
    {
      title: "Lập trình viên Frontend",
      company: "FPT Software",
      location: "Hà Nội",
      logo: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    },
    {
      title: "Chuyên viên Marketing",
      company: "VNG Corporation",
      location: "TP. HCM",
      logo: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    },
    {
      title: "Kế toán tổng hợp",
      company: "Vietcombank",
      location: "Hải Phòng",
      logo: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    },
    // Add more jobs
    ...Array.from({ length: 30 }, (_, i) => ({
      title: `Job ${i + 1}`,
      company: `Company ${i + 1}`,
      location: `Location ${i + 1}`,
      logo: "https://res.cloudinary.com/utejobhub/image/upload/v1726158727/company/FPT_Software_logo.png",
    })),
  ];

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1, // Hiển thị 1 slide (3x3)
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="featured-jobs">
      <div className="carousel-customize">
      <Carousel
        responsive={responsive}
        showDots={true}
        infinite={false}
        autoPlay={isMobile}
        autoPlaySpeed={3000}
        keyBoardControl
        containerClass="carousel-container"
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-spacing"
      >
        {Array.from({ length: Math.ceil(jobs.length / 9) }, (_, i) => (
          <div key={i} className="carousel-grid">
            {jobs.slice(i * 9, i * 9 + 9).map((job, index) => (
              <Card
                key={index}
                bordered={false}
                className="featured-jobs__item"
                hoverable
              >
                <div className="card-body">
                  <div className="card-logo">
                    <img src={job.logo} alt={job.company} />
                  </div>
                  <div className="card-details">
                    <p>{job.title}</p>
                    <p>{job.company}</p>
                    <p>{job.location}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </Carousel>
      </div>
    </section>
  );
};

export default FeaturedJobs;
