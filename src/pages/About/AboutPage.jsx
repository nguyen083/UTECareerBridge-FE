import {
  Layout,
  Typography,
  Button,
  Row,
  Col,
  Card,
  List,
  Statistic,
  Space,
  Image,
  Skeleton,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BankOutlined,
  TrophyOutlined,
  BookOutlined,
  SearchOutlined,
  MessageOutlined,
  FileTextOutlined,
  BarChartOutlined,
  EditOutlined,
  TeamOutlined,
  ShopOutlined,
  BulbOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAbout } from "../../composables/about";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const AboutPage = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useAbout();
  console.log(data);
  return (
    <Layout>
      <Content>
        {/* Hero Section */}
        <div className="relative py-32 text-center text-white bg-gradient-to-r from-[#f6f6f6cc] to-[#baceeacc] via-[#1a4a83cc]">
          <div className="absolute inset-0 opacity-20"></div>
          <div className="relative z-10 max-w-3xl px-4 mx-auto">
            <Title level={1} className="mb-6 !text-white">
              {t("about.hero.title")}
            </Title>
            <Paragraph className="mb-8 text-xl text-white">
              {t("about.hero.description")}
            </Paragraph>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-200 to-transparent"></div>
        </div>

        {/* About Section */}
        <div className="py-16">
          <div className="container w-3/4 px-4 mx-auto">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} md={12}>
                <Title level={2} className="mb-6 !text-text-color">
                  {t("about.intro.title")}
                </Title>
                <Paragraph className="mb-6 text-lg text-gray-600">
                  {t("about.intro.description")}
                </Paragraph>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <UserOutlined className="text-xl text-text-color-hover" />
                        <Statistic
                          className="ml-4"
                          title={
                            <Title level={5} className="!text-text-color">
                              {t("about.stats.studentsEmployed")}
                            </Title>
                          }
                          valueRender={() =>
                            isLoading ? (
                              <Skeleton paragraph={{ rows: 0 }} active />
                            ) : (
                              <Text className="!text-text-color text-2xl font-bold">
                                5000+
                              </Text>
                            )
                          }
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <BankOutlined className="text-xl text-text-color-hover" />
                        <Statistic
                          className="ml-4"
                          title={
                            <Title level={5} className="!text-text-color">
                              {t("about.stats.partnerCompanies")}
                            </Title>
                          }
                          valueRender={() =>
                            isLoading ? (
                              <Skeleton paragraph={{ rows: 0 }} active />
                            ) : (
                              <Text className="!text-text-color text-2xl font-bold">
                                {data?.data?.countEmployers}
                              </Text>
                            )
                          }
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <TrophyOutlined className="text-xl text-text-color-hover" />
                        <Statistic
                          className="ml-4"
                          title={
                            <Title level={5} className="!text-text-color">
                              {t("about.stats.recruitmentEvents")}
                            </Title>
                          }
                          valueRender={() =>
                            isLoading ? (
                              <Skeleton paragraph={{ rows: 0 }} active />
                            ) : (
                              <Text className="!text-text-color text-2xl font-bold">
                                {data?.data?.eventsByYear}
                              </Text>
                            )
                          }
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <BookOutlined className="text-xl text-text-color-hover" />
                        <Statistic
                          className="ml-4"
                          title={
                            <Title level={5} className="!text-text-color">
                              {t("about.stats.jobCount")}
                            </Title>
                          }
                          valueRender={() =>
                            isLoading ? (
                              <Skeleton paragraph={{ rows: 0 }} active />
                            ) : (
                              <Text className="!text-text-color text-2xl font-bold">
                                {data?.data?.countJob}
                              </Text>
                            )
                          }
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <Image
                  src="https://reviewedu.net/wp-content/uploads/2021/08/dh-su-pham-ky-thuat-hcm1.jpg"
                  alt="UTE Career Team"
                  preview={false}
                  className="object-cover opacity-90 rounded-xl"
                />
              </Col>
            </Row>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <Title level={2} className="mb-4 !text-text-color">
                {t("about.services.title")}
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                {t("about.services.description")}
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {/* For Students */}
              <Col xs={24} md={12}>
                <Card
                  className="h-full overflow-hidden shadow-md rounded-xl"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="p-6 text-white bg-blue-500">
                    <Title level={3} className="m-0 !text-white">
                      {t("about.services.forStudents.title")}
                    </Title>
                    <Text className="text-white">
                      {t("about.services.forStudents.subtitle")}
                    </Text>
                  </div>
                  <div className="p-6">
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          icon: <SearchOutlined />,
                          title: t(
                            "about.services.forStudents.jobSearch.title"
                          ),
                          description: t(
                            "about.services.forStudents.jobSearch.description"
                          ),
                        },
                        {
                          icon: <MessageOutlined />,
                          title: t(
                            "about.services.forStudents.careerCounseling.title"
                          ),
                          description: t(
                            "about.services.forStudents.careerCounseling.description"
                          ),
                        },
                        {
                          icon: <FileTextOutlined />,
                          title: t(
                            "about.services.forStudents.cvSupport.title"
                          ),
                          description: t(
                            "about.services.forStudents.cvSupport.description"
                          ),
                        },
                        {
                          icon: <BarChartOutlined />,
                          title: t(
                            "about.services.forStudents.skillAssessment.title"
                          ),
                          description: t(
                            "about.services.forStudents.skillAssessment.description"
                          ),
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div className="flex items-center justify-center w-10 h-10 p-2 mr-4 text-blue-500 bg-blue-100 rounded-full">
                                {item.icon}
                              </div>
                            }
                            title={<Text strong>{item.title}</Text>}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>

              {/* For Employers */}
              <Col xs={24} md={12}>
                <Card
                  className="h-full overflow-hidden shadow-md rounded-xl"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="p-6 text-white bg-indigo-600">
                    <Title level={3} className="m-0 !text-white">
                      {t("about.services.forEmployers.title")}
                    </Title>
                    <Text className="text-white">
                      {t("about.services.forEmployers.subtitle")}
                    </Text>
                  </div>
                  <div className="p-6">
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          icon: <EditOutlined />,
                          title: t(
                            "about.services.forEmployers.postJobs.title"
                          ),
                          description: t(
                            "about.services.forEmployers.postJobs.description"
                          ),
                        },
                        {
                          icon: <TeamOutlined />,
                          title: t(
                            "about.services.forEmployers.findCandidates.title"
                          ),
                          description: t(
                            "about.services.forEmployers.findCandidates.description"
                          ),
                        },
                        {
                          icon: <ShopOutlined />,
                          title: t(
                            "about.services.forEmployers.campusRecruitment.title"
                          ),
                          description: t(
                            "about.services.forEmployers.campusRecruitment.description"
                          ),
                        },
                        {
                          icon: <BulbOutlined />,
                          title: t(
                            "about.services.forEmployers.branding.title"
                          ),
                          description: t(
                            "about.services.forEmployers.branding.description"
                          ),
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div className="flex items-center justify-center w-10 h-10 p-2 mr-4 text-indigo-600 bg-indigo-100 rounded-full">
                                {item.icon}
                              </div>
                            }
                            title={<Text strong>{item.title}</Text>}
                            description={item.description}
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Events Section */}
        <div className="py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <Title level={2} className="mb-4">
                {t("about.events.title")}
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                {t("about.events.description")}
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div className="relative">
                      <Image
                        preview={false}
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1746286203/admin/event/kycbin8dkmgi4xcluss0.jpg"
                        alt="UTE Job Fair"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="!text-white ">
                            {t("about.events.jobFair.title")}
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>{t("about.events.jobFair.schedule")}</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      {t("about.events.jobFair.description")}
                    </Paragraph>
                    <Link
                      to="/event?eventType=CAREER_FAIR"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      {t("about.events.learnMore")}{" "}
                      <RightOutlined className="ml-1" />
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div className="relative">
                      <Image
                        preview={false}
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1746287581/admin/event/bt4pbdpmcukibjwo5qlx.jpg"
                        alt="Workshop kỹ năng"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="!text-white">
                            {t("about.events.skillsWorkshop.title")}
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>{t("about.events.skillsWorkshop.schedule")}</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      {t("about.events.skillsWorkshop.description")}
                    </Paragraph>
                    <Link
                      to="/event?eventType=WORKSHOP"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      {t("about.events.learnMore")}{" "}
                      <RightOutlined className="ml-1" />
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  cover={
                    <div className="relative">
                      <Image
                        preview={false}
                        src="https://res.cloudinary.com/utejobhub/image/upload/v1746287808/admin/event/v3amqdkjdsfmqrkuef6c.jpg"
                        alt="Hội thảo doanh nghiệp"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="!text-white">
                            {t("about.events.companySeminar.title")}
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>{t("about.events.companySeminar.schedule")}</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      {t("about.events.companySeminar.description")}
                    </Paragraph>
                    <Link
                      to="/event?eventType=SEMINAR"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      {t("about.events.learnMore")}{" "}
                      <RightOutlined className="ml-1" />
                    </Link>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Registration Process */}
        <div className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <Title level={2} className="mb-4">
                {t("about.registration.title")}
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                {t("about.registration.description")}
              </Paragraph>
            </div>

            <Row gutter={[48, 48]}>
              {/* For Students */}
              <Col xs={24} md={12}>
                <Card className="flex flex-col justify-start h-full p-8 shadow-md rounded-xl">
                  <Title level={3} className="flex items-center mb-6">
                    <UserOutlined className="mr-2 text-blue-500" />
                    {t("about.registration.forStudents.title")}
                  </Title>

                  <div className="space-y-8">
                    {[
                      {
                        step: 1,
                        title: t(
                          "about.registration.forStudents.steps.step1.title"
                        ),
                        description: t(
                          "about.registration.forStudents.steps.step1.description"
                        ),
                      },
                      {
                        step: 2,
                        title: t(
                          "about.registration.forStudents.steps.step2.title"
                        ),
                        description: t(
                          "about.registration.forStudents.steps.step2.description"
                        ),
                      },
                      {
                        step: 3,
                        title: t(
                          "about.registration.forStudents.steps.step3.title"
                        ),
                        description: t(
                          "about.registration.forStudents.steps.step3.description"
                        ),
                      },
                      {
                        step: 4,
                        title: t(
                          "about.registration.forStudents.steps.step4.title"
                        ),
                        description: t(
                          "about.registration.forStudents.steps.step4.description"
                        ),
                      },
                    ].map((item) => (
                      <div className="flex" key={item.step}>
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 font-bold text-white bg-blue-500 rounded-full">
                          {item.step}
                        </div>
                        <div>
                          <Text strong className="block mb-2">
                            {item.title}
                          </Text>
                          <Text className="text-gray-600">
                            {item.description}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex self-end justify-center mt-8">
                    <Button
                      type="primary"
                      size="large"
                      className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600 hover:!border-blue-600"
                    >
                      <Link to="/register">
                        {t("about.registration.forStudents.registerNow")}
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Col>

              {/* For Employers */}
              <Col xs={24} md={12}>
                <Card
                  bodyStyle={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                  }}
                  className="flex flex-col h-full p-8 shadow-md rounded-xl"
                >
                  <Title level={3} className="flex items-center mb-6">
                    <BankOutlined className="mr-2 text-indigo-600" />
                    {t("about.registration.forEmployers.title")}
                  </Title>

                  <div className="space-y-8 ">
                    {[
                      {
                        step: 1,
                        title: t(
                          "about.registration.forEmployers.steps.step1.title"
                        ),
                        description: t(
                          "about.registration.forEmployers.steps.step1.description"
                        ),
                      },
                      {
                        step: 2,
                        title: t(
                          "about.registration.forEmployers.steps.step2.title"
                        ),
                        description: t(
                          "about.registration.forEmployers.steps.step2.description"
                        ),
                      },
                      {
                        step: 3,
                        title: t(
                          "about.registration.forEmployers.steps.step3.title"
                        ),
                        description: t(
                          "about.registration.forEmployers.steps.step3.description"
                        ),
                      },
                      {
                        step: 4,
                        title: t(
                          "about.registration.forEmployers.steps.step4.title"
                        ),
                        description: t(
                          "about.registration.forEmployers.steps.step4.description"
                        ),
                      },
                    ].map((item) => (
                      <div className="flex" key={item.step}>
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 font-bold text-white bg-indigo-600 rounded-full">
                          {item.step}
                        </div>
                        <div>
                          <Text strong className="block mb-2">
                            {item.title}
                          </Text>
                          <Text className="text-gray-600">
                            {item.description}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center mt-auto">
                    <Button
                      type="primary"
                      size="large"
                      className="!bg-indigo-600 !border-indigo-600 hover:!bg-indigo-700 hover:!border-indigo-700"
                    >
                      <Link to="/employer/register">
                        {t("about.registration.forEmployers.registerNow")}
                      </Link>
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <Card
              className="overflow-hidden shadow-lg rounded-xl"
              bodyStyle={{ padding: 0 }}
            >
              <Row>
                <Col xs={24} md={12}>
                  <div className="p-8 md:p-12">
                    <Title level={2} className="mb-6">
                      {t("about.contact.title")}
                    </Title>
                    <Paragraph className="mb-8 text-gray-600">
                      {t("about.contact.description")}
                    </Paragraph>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <EnvironmentOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            {t("about.contact.address.title")}
                          </Text>
                          <Text className="text-gray-600">
                            {t("about.contact.address.value")}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <MailOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            {t("about.contact.email.title")}
                          </Text>
                          <Text className="text-gray-600">
                            {t("about.contact.email.value")}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <PhoneOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            {t("about.contact.hotline.title")}
                          </Text>
                          <Text className="text-gray-600">
                            {t("about.contact.hotline.value")}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <ClockCircleOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            {t("about.contact.workingHours.title")}
                          </Text>
                          <Text className="text-gray-600 whitespace-pre-line">
                            {t("about.contact.workingHours.weekdays")}
                            <br />
                            {t("about.contact.workingHours.saturday")}
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      {/* <Button
                        type="primary"
                        size="large"
                        className="border-blue-500 bg-card-color0 hover:bg-blue-600 hover:border-blue-600"
                      >
                        <Link to="/contact" className="flex items-center">
                          {t("about.contact.sendMessage")}
                          <MessageOutlined className="ml-2" />
                        </Link>
                      </Button> */}
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="relative h-full p-8">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5473.913274920506!2d106.76892685683791!3d10.850066035708144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752763f23816ab%3A0x282f711441b6916f!2sHCMC%20University%20of%20Technology%20and%20Education!5e0!3m2!1sen!2s!4v1745585767265!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};
export default AboutPage;
