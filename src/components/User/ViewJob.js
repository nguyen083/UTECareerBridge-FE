import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Button, Space, Image, Typography, Flex, Carousel, Divider, Descriptions, Spin } from 'antd';
import { EnvironmentOutlined, TeamOutlined, ClockCircleOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { FaCalendarAlt, FaInbox, FaUserTie, FaCubes, FaReact, FaUsers, } from "react-icons/fa";
import { getJobById, getSimilarJob } from '../../services/apiService';
import BoxContainer from '../Generate/BoxContainer';
import HtmlContent from '../Generate/HtmlContent';
import BenefitComponent from '../Generate/BenefitComponent';
import BackgroundIcon from '../Generate/BackgroundIcon';
import { JobCardLarge, JobCardSmall } from '../Generate/JobCard';
import { useNavigate, useParams } from 'react-router-dom';
import { ModalApply } from '../Generate/ModalApply';


const { Text, Link } = Typography;
const ViewJob = () => {
    const ref = useRef();
    const [apply, setApply] = useState(false);
    const [company, setCompany] = useState({});
    const [job, setJob] = useState({});
    const [isSaved, setIsSaved] = useState(false);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [similarJobs, setSimilarJobs] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        setLoading(true);
        // Gọi API để lấy thông tin công ty
        getJobById(id).then((res) => {
            if (res.status === 'OK') {
                const job = res.data;
                const company = job.employerResponse;
                setCompany({
                    id: company.id,
                    companyName: company.companyName,
                    companyLogo: company.companyLogo,
                    companyAddress: company.companyAddress,
                    companySize: company.companySize,
                    backgroundImage: company.backgroundImage,
                });
                setJob({
                    jobTitle: job.jobTitle,
                    jobMinSalary: job.jobMinSalary,
                    jobMaxSalary: job.jobMaxSalary,
                    jobDeadline: job.jobDeadline,
                    jobLocation: job.jobLocation,
                    jobDescription: job.jobDescription,
                    jobRequirements: job.jobRequirements,
                    benefitDetails: company.benefitDetails,
                    updatedAt: job.updatedAt, //ngày đăng
                    jobCategory: job.jobCategory.jobCategoryName, //ngành nghề
                    industry: company.industry.industryName, //Lĩnh vực công ty
                    amount: job.amount, //Số lượng tuyển
                    jobLevel: job.jobLevel.nameLevel, //Cấp bậc
                    jobSkills: job.jobSkills.map(skill => skill.skillName).join(', '), //kĩ năng
                    // đã like hay chưa
                });
            }
            setLoading(false);
        });
        getSimilarJob(id).then((res) => {
            if (res.status === 'OK' && res.data !== null) {
                console.log("công việc");
                setSimilarJobs(res.data?.jobResponses);
            }
        });
    }, [id]);

    useEffect(() => {
        setItems([
            {
                key: '1',
                label: <BackgroundIcon lable={"NGÀY ĐĂNG"}><FaCalendarAlt /></BackgroundIcon>,
                children: job.updatedAt,
            },
            {
                key: '2',
                label: <BackgroundIcon lable={"CẤP BẬC"}><FaUserTie /></BackgroundIcon>,
                children: job.jobLevel,
            },
            {
                key: '3',
                label: <BackgroundIcon lable={"NGHÀNH NGHỀ"}><FaInbox /></BackgroundIcon>,
                children: job.jobCategory,
            },

            {
                key: '4',
                label: <BackgroundIcon lable={"KĨ NĂNG"}><FaReact /></BackgroundIcon>,
                children: job.jobSkills,
            },
            {
                key: '5',
                label: <BackgroundIcon lable={"LĨNH VỰC"}><FaCubes /></BackgroundIcon>,
                children: job.industry,
            },
            {
                key: '6',
                label: <BackgroundIcon lable={"SỐ LƯỢNG TUYỂN DỤNG"}><FaUsers /></BackgroundIcon>,
                children: job.amount,
            },
        ]);
    }, [job]);

    const handleSave = () => {
        setIsSaved(!isSaved);
    };
    const handleToCompany = (id) => {
        navigate('/employer/infor-company/' + id);
    }
    const carouselItems = [
        {
            title: "Tham gia thực hiện nhiệm vụ",
            description: "Yêu cầu ứng viên tham gia khảo sát/thử việc hoặc làm nhiệm vụ bằng cách cài đặt các ứng dụng điện thoại.",
            imgSrc: "https://res.cloudinary.com/utejobhub/image/upload/v1726556316/demo/zeklxmv28quelifvcefo.jpg",
        },
        {
            title: "Tham gia thực hiện nhiệm vụ",
            description: "Yêu cầu ứng viên tham gia khảo sát/thử việc hoặc làm nhiệm vụ bằng cách cài đặt các ứng dụng điện thoại.",
            imgSrc: "https://res.cloudinary.com/utejobhub/image/upload/v1726556316/demo/zeklxmv28quelifvcefo.jpg",
        },
    ];
    return (
        <>
            <Flex align='center' justify='center' style={{ height: '100vh', width: "100%" }} hidden={!loading}>
                <Spin spinning={loading} size='large' />
            </Flex>

            <div style={{ padding: '20px' }} hidden={loading}>
                <Row gutter={[8, 8]}>
                    {/* Cột trái - Main content */}
                    <Col xs={24} md={16} lg={18}>
                        <Flex vertical gap={8}>
                            <BoxContainer padding='1rem'>
                                <Flex vertical gap={"1.25rem"}>
                                    <BoxContainer background='#F8F9FA'>
                                        <div className='job-name mb-5'>{job.jobTitle} </div>
                                        <div className='salary mb-3'>Lương: {new Intl.NumberFormat('en-US', { useGrouping: true }).format(job.jobMinSalary)} - {new Intl.NumberFormat('en-US', { useGrouping: true }).format(job.jobMaxSalary)} VNĐ/tháng</div>
                                        <Flex className='mb-3'>
                                            <Text><ClockCircleOutlined className='icon-small' /> Hết hạn ngày: {job.jobDeadline} </Text>
                                            <Divider type='vertical' style={{ height: 'auto' }} />
                                            <Text><EnvironmentOutlined className='icon-small' /> {job.jobLocation} </Text>
                                        </Flex>
                                        <Row gutter={8}>
                                            <Col xs={24} md={18}>
                                                <Button type='primary' style={{ width: "100%" }} size='large' onClick={() => setApply(!apply)}>Nộp đơn</Button>
                                                <ModalApply show={apply} setShow={setApply} company={company} job={job} />
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <Button onClick={handleSave} type={isSaved ? 'primary' : 'default'} ghost={isSaved} style={{ width: "100%" }} size='large'>{isSaved ? <HeartFilled /> : <HeartOutlined />} {isSaved ? "Đã lưu" : "Lưu công việc"}</Button>
                                            </Col>
                                        </Row>
                                    </BoxContainer>
                                    <Flex vertical gap={"1rem"}>
                                        <div className='title2'>
                                            Mô tả công việc
                                        </div>
                                        <HtmlContent htmlString={job.jobDescription} />
                                    </Flex>
                                    <Flex vertical gap={"1rem"}>
                                        <div className='title2'>
                                            Yêu cầu công việc
                                        </div>
                                        <HtmlContent htmlString={job.jobRequirements} />
                                    </Flex>

                                    {job?.benefitDetails?.length !== 0 && <Flex vertical gap={"1rem"}>
                                        <div className='title2'>
                                            Các phúc lợi dành cho bạn
                                        </div>
                                        <Flex vertical gap={"0.5rem"}>
                                            {job?.benefitDetails?.map((benefit) => (
                                                <BenefitComponent key={benefit.benefitId} benefitName={benefit.benefitName} description={benefit.description} benefitIcon={benefit.benefitIcon} />
                                            ))}
                                        </Flex>
                                    </Flex>}
                                    <Flex vertical gap={"1rem"}>
                                        <div className='title2'>
                                            Thông tin làm việc
                                        </div>
                                        <Descriptions items={items} contentStyle={{ paddingLeft: 27 }} column={2} layout='vertical' size='middle' />
                                    </Flex>
                                </Flex>
                            </BoxContainer>
                            {similarJobs && <BoxContainer padding='1rem'>
                                <Flex vertical gap={"0.5rem"}>
                                    <div className='title2'>
                                        Việc làm bạn sẽ thích
                                    </div>
                                    {similarJobs.map((job) => <JobCardLarge job={job} />)}                                </Flex>
                            </BoxContainer>}
                        </Flex>
                    </Col>

                    {/* Cột phải - Sidebar */}
                    <Col xs={24} md={8} lg={6}>
                        <Row gutter={[0, 8]}>

                            <Card
                                style={{ width: "100%", borderRadius: '10px', textAlign: 'center' }}
                                cover={
                                    <div
                                        style={{
                                            backgroundImage: `url(${company.backgroundImage ? company.backgroundImage : 'https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Fcompany-assets%2Fimages%2Fbanner-default-company.png&w=1920&q=75'})`,
                                            backgroundSize: 'cover',
                                            height: 120, // Chiều cao của banner
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    />
                                }
                            >
                                <Flex align='center' vertical style={{ marginTop: -50 }}>
                                    <Image
                                        preview={false}
                                        src={company.companyLogo ? company.companyLogo : 'https://images.vietnamworks.com/img/company-default-logo.svg'} // URL ảnh logo
                                        height={80}
                                        width={80}
                                        style={{ border: '6px solid white', borderRadius: "10px", textAlign: "center", objectFit: 'cover' }} // Để logo nổi lên giữa
                                    />
                                    <Space className='mt-2' direction="vertical" style={{ width: '100%' }}>
                                        <Text onClick={() => handleToCompany(company.id)} strong className='font-size hover-effect'>
                                            {company.companyName}
                                        </Text>

                                        {/* Địa chỉ */}
                                        <Space align="start" style={{ textAlign: "left" }}>
                                            <EnvironmentOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                            <Text>
                                                {company.companyAddress}
                                            </Text>
                                        </Space>

                                        {/* Link */}
                                        {/* <Link href="#" target="_blank">
                                    Xem bản đồ
                                </Link> */}

                                        {/* Thông tin nhân viên */}
                                        <Flex align="start" gap={10}>
                                            <TeamOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                            <Text>{company.companySize}</Text>
                                        </Flex>
                                    </Space>
                                </Flex>
                            </Card>
                            {carouselItems && <Card
                                title={<div className='title2 p-3'>Công ty cùng lĩnh vực</div>}
                                style={{ textAlign: "center", width: "100%" }}
                            >
                                <Carousel
                                    style={{ marginBottom: 10 }}
                                    autoplay
                                    autoplaySpeed={4000}
                                    dots={true}
                                    arrows
                                    pauseOnHover={true}
                                    draggable={true}
                                    ref={ref}
                                >
                                    {carouselItems.map((item, index) => (
                                        <div key={index} >
                                            <div className="carousel-content">
                                                <Image
                                                    className='mx-auto'
                                                    src={item.imgSrc}
                                                    alt={item.title}
                                                    preview={false}
                                                    style={{ maxWidth: "80%", height: "auto", marginBottom: 0, borderRadius: "5px" }}
                                                />
                                                <Text strong className='font-size'>
                                                    {item.title}
                                                </Text>
                                                <p>{item.description}</p>
                                                <Button className='mb-4' onClick={() => { }}>Xem chi tiết</Button>
                                            </div>
                                        </div>
                                    ))}
                                </Carousel>
                            </Card>}
                            {similarJobs && similarJobs.length > 0 && <Card actions={[<Link onClick={() => { }}>Xem thêm</Link>]} title={<div className='title2 p-3 text-center'>Việc làm tương tự</div>}
                                style={{ width: "100%" }} size='small'>
                                <Flex gap={"0.5rem"} vertical>
                                    {similarJobs.map((job) => <JobCardSmall job={job} />)}
                                </Flex>
                            </Card>}
                            {similarJobs && similarJobs.length > 0 && <Card actions={[<Link type='secondary' onClick={() => { }}>Xem thêm</Link>]} title={<div className='title2 p-3 text-center'>Việc làm cùng công ty</div>}
                                style={{ width: "100%", marginBottom: 16 }} size='small'>
                                <Flex gap={"0.5rem"} vertical>
                                    {similarJobs.map((job) => <JobCardSmall job={job} />)}
                                </Flex>
                            </Card>}
                        </Row>
                    </Col>
                </Row>
            </div>
        </>
    );
}
export default ViewJob;