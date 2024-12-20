import { Carousel, Card, message, Button, Avatar, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAds } from "../../../services/apiService";
import "./CarouselTopCompnay.scss";
const { Meta } = Card;
const { Text } = Typography;
const CarouselTopCompnay = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);

    const fetchData = async () => {
        getAds().then(res => {
            if (res.status === "OK") {
                setCompanies(res.data.content);
            } else {
                message.error("Lấy dữ liệu thất bại")
            }
        })
    };

    useEffect(() => {
        fetchData();
    }, []);
    return <Card
        title={<Text className="title2">Công ty hàng đầu</Text>}
        className='box_shadow border border-1 carousel-top-company'
    >
        <Carousel
            autoplay
            autoplaySpeed={3000}
            dots={true}
            arrows
            pauseOnHover={true}
            draggable={true}>
            {companies.map((company) => (<Card
                className=' card-company'
                style={{ width: "fit-content" }}
                hoverable
                cover={
                    <div className='text-center'>
                        <Avatar
                            size={200}
                            shape="square"
                            src={company?.employerResponse?.companyLogo}
                            alt={company?.employerResponse?.companyName}
                            loading="lazy"
                        />
                    </div>
                }
            >
                <Meta title={
                    <div className='text-center' style={{ width: "100%" }}>
                        <span className='company-name'>{company?.employerResponse?.companyName}</span>
                    </div>
                } description={
                    <div className="text-center">
                        <Button size='large' onClick={() => {
                            navigate(`/company/${company?.employerResponse?.id}`)
                        }} type="primary">Xem thêm</Button>
                    </div>
                } />

            </Card>))}
        </Carousel>
    </Card>
}

export default CarouselTopCompnay;
