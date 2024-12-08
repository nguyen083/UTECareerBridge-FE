import { Card, Typography } from "antd";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useMediaQuery } from "react-responsive";
import "./FeaturedJobs.scss";
import Lable from "../../../constant/Lable";
import { useNavigate } from "react-router-dom";
const { Text } = Typography;
const FeaturedJobs = ({ jobs }) => {

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const navigate = useNavigate();

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

  const handleJobClick = (jobId) => {
    navigate(`/job/${jobId}`);
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
              {jobs.length > 0 && jobs.slice(i * 9, i * 9 + 9).map((job, index) => (
                <div key={index}>
                  <Card
                    bordered={false}
                    className="featured-jobs__item border-item d-flex align-items-stretch"
                    hoverable
                    onClick={() => handleJobClick(job.jobId)}
                  >
                    <div className="card-body">
                      <div className="card-logo">
                        <img src={job?.employerResponse?.companyLogo} alt={job?.employerResponse?.companyName} />
                      </div>
                      <div className="card-details">
                        <Text className="fw-bold f-16 job-title mb-1">{job.jobTitle} {Lable(job.packageId)}</Text>
                        <Text className="f-14 company-name">{job.employerResponse?.companyName}</Text>
                        <div style={{ color: '#ff4d4f', fontSize: 14, margin: '8px 0' }}>
                          {job.jobMinSalary.toLocaleString()} - {job.jobMaxSalary.toLocaleString()} <Text style={{ fontSize: 12 }}>VNĐ/tháng</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ))}
        </Carousel>
      </div >
    </section >
  );
};

export default FeaturedJobs;
