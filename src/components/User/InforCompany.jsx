import BoxContainer from "../Generate/BoxContainer";
import React, { useEffect, useState } from 'react';
import { Flex, Card, Button, Typography, Image, Anchor, Descriptions, Spin } from 'antd';
import HtmlContent from "../Generate/HtmlContent";
import { useParams } from "react-router-dom";
import { getCompanyById } from "../../services/apiService";
import YouTubeVideo from "../Generate/YouTubeVideo";
import BenefitCard from "../Generate/BenefitComponent";
import JobList from "../Generate/JobList";

const { Title, Text, Link } = Typography;

const isEmpty = (array) => {
    return !array || array.length === 0;
};

const InforCompany = () => {
    const [company, setCompany] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const items = [
        {
            key: '1',
            label: 'Quy mô',
            children: company.companySize,
        },
        {
            key: '2',
            label: 'Lĩnh vực',
            children: company.industry,
        },
        {
            key: '3',
            label: 'Liên hệ',
            children: company.gender ? "Chị " : "Anh " + company.firstName + ' ' + company.lastName,
        },
        {
            key: '4',
            label: 'Số điện thoại',
            children: company.phoneNumber,
        },
        {
            key: '5',
            label: 'Email',
            children: company.companyEmail,
        },
        {
            key: '6',
            label: 'Địa chỉ',
            children: company.companyAddress,
        },
        {
            key: '6',
            label: 'Website',
            children: <Link href={company.companyWebsite} target="_blank">{company.companyWebsite}</Link>,
        },
        {
            key: '8',
            children: <HtmlContent className="font-size-small" htmlString={company.companyDescription} />,
        },

    ];
    useEffect(() => {
        getCompanyById(id).then(res => {
            if (res.status = 'OK') {
                const company = res.data;
                setCompany(
                    {
                        companyName: company.companyName,
                        companyLogo: company.companyLogo,
                        backgroundImage: company.backgroundImage,
                        videoIntroduction: company.videoIntroduction,
                        companySize: company.companySize,
                        industry: company.industry.industryName,
                        benefitDetails: company.benefitDetails,
                        companyWebsite: company.companyWebsite,
                        companyDescription: company.companyDescription,
                        companyAddress: company.companyAddress,
                        phoneNumber: company.phoneNumber,
                        gender: company.gender,
                        companyEmail: company.companyEmail,
                        firstName: company.firstName,
                        lastName: company.lastName,
                    }
                )
                console.log(company);
                setLoading(false);
            }
        });
    }, []);
    return (
        <>
            <Flex align='center' justify='center' style={{ height: '100vh', width: "100%" }} hidden={!loading}>
                <Spin spinning={loading} size='large' />
            </Flex>
            <BoxContainer padding="1rem" hidden={loading}>
                <Card
                    style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}
                    cover={
                        <div style={{ height: 350, background: 'linear-gradient(90deg, #0046b8, #00aaff)' }}>
                            <img
                                src={company.backgroundImage ? company.backgroundImage : "https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Fcompany-assets%2Fimages%2Fbanner-default-company.png&w=1920&q=75"}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    }
                >
                    <Flex gap={"1rem"} vertical>
                        <Flex align="center" style={{ marginTop: -50 }} gap={"1rem"}>
                            <Image
                                preview={false}
                                src={company.companyLogo ? company.companyLogo : 'https://images.vietnamworks.com/img/company-default-logo.svg'} // URL ảnh logo
                                height={136}
                                width={136}
                                style={{
                                    border: '3px solid white',
                                    borderRadius: "10px",
                                    objectFit: 'cover',
                                    display: 'block',
                                    margin: '0 auto' // Để logo nổi lên giữa
                                }}
                            />
                            <Flex justify="space-between" style={{ width: "100%" }}>
                                <div>
                                    <Title level={4}>
                                        {company.companyName}
                                    </Title>
                                    <Text>3 lượt theo dõi</Text>
                                </div>
                                <Button size="large" type="primary">
                                    Theo dõi
                                </Button>
                            </Flex>
                        </Flex>
                        <Anchor
                            targetOffset={60}
                            style={{ backgroundColor: 'white', paddingTop: '1.25rem' }}
                            className="custom-anchor"
                            direction="horizontal"
                            items={[
                                {
                                    key: 'about',
                                    href: '#about',
                                    title: <Text className="size">Về chúng tôi</Text>,
                                },
                                {
                                    key: 'list-job',
                                    href: '#list-job',
                                    title: <Text className="size">Vị trí đang tuyển dụng</Text>,
                                },
                            ]}
                        />
                        <Flex gap={"1rem"} vertical>
                            <div id="about">
                                <BoxContainer padding="1rem">
                                    <Text className="title1">Về chúng tôi</Text>
                                </BoxContainer>
                                <Descriptions labelStyle={{ fontWeight: 550 }} size="middle" items={items} column={1} />
                                <Flex gap={"1rem"} vertical>
                                    <BoxContainer padding="1rem">
                                        <Text className="title1">Video</Text>
                                    </BoxContainer>
                                    <YouTubeVideo link={company.videoIntroduction} />
                                    {!isEmpty(company.benefitDetails) && <Flex gap={"1rem"} vertical>
                                        <BoxContainer padding="1rem">
                                            <Text className="title1">Phúc lợi</Text>
                                        </BoxContainer>
                                        {company.benefitDetails.map((benefit, index) => <BenefitCard key={index} benefitName={benefit.benefitName} description={benefit.description} benefitIcon={benefit.benefitIcon} size="large" />)}
                                    </Flex>}
                                </Flex>
                            </div>
                            <div
                                id="list-job">
                                <BoxContainer padding="1rem">
                                    <Text className="title1">Vị trí đang tuyển dụng</Text>
                                </BoxContainer>
                                <JobList />
                            </div>
                        </Flex>
                    </Flex>
                </Card>
            </BoxContainer >
        </>
    );
}
export default InforCompany;