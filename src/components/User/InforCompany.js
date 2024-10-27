import BoxContainer from "../Generate/BoxContainer";
import React from 'react';
import { Flex, Card, Avatar, Button, Typography, Image, Anchor } from 'antd';

const { Title, Text } = Typography;

const InforCompany = () => {
    return (
        <BoxContainer padding="1rem">
            <Card
                style={{ width: '100%', borderRadius: '10px', overflow: 'hidden' }}
                cover={
                    <div style={{ height: 350, background: 'linear-gradient(90deg, #0046b8, #00aaff)' }}>
                        <img
                            src="https://www.vietnamworks.com/_next/image?url=https%3A%2F%2Fimages.vietnamworks.com%2Fcompany-assets%2Fimages%2Fbanner-default-company.png&w=1920&q=75"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                }
            >
                <Flex gap={"1rem"} vertical>
                    <Flex align="center" style={{ marginTop: -50 }} gap={"1rem"}>
                        <Image
                            preview={false}
                            src={'https://images.vietnamworks.com/img/company-default-logo.svg'} // URL ảnh logo
                            height={136}
                            width={136}
                            style={{ border: '3px solid white', borderRadius: "10px", textAlign: "center" }} // Để logo nổi lên giữa
                        />
                        <Flex justify="space-between" style={{ width: "100%" }}>
                            <div>
                                <Title level={4}>
                                    Công ty TNHH Dịch vụ Tư vấn và Công nghệ Sài Gòn
                                </Title>
                                <Text>3 lượt theo dõi</Text>
                            </div>
                            <Button size="large" type="primary">
                                Theo dõi
                            </Button>
                        </Flex>
                    </Flex>
                    <Anchor
                        className="custom-anchor"
                        direction="horizontal"
                        items={[
                            {
                                key: 'part-1',
                                href: '#part-1',
                                title: <Text className="size">Về chúng tôi</Text>,
                            },
                            {
                                key: 'part-2',
                                href: '#part-2',
                                title: <Text className="size">Vị trí đang tuyển dụng</Text>,
                            },
                        ]}
                    />
                    <div>
                        <div
                            id="part-1"
                            style={{
                                width: '100%',
                                height: '100vh',
                                textAlign: 'center',
                                background: 'rgba(0,255,0,0.02)',
                            }}
                        />
                        <div
                            id="part-2"
                            style={{
                                width: '100%',
                                height: '100vh',
                                textAlign: 'center',
                                background: 'rgba(0,0,255,0.02)',
                            }}
                        />
                    </div>
                </Flex>
            </Card>
        </BoxContainer >
    );
}
export default InforCompany;