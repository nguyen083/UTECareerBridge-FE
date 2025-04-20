import { Layout, Typography, Button, Row, Col, Card, List, Statistic, Space, Image } from "antd"
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
} from "@ant-design/icons"
import { Link } from "react-router-dom"

const { Content } = Layout
const { Title, Text, Paragraph } = Typography

export default function AboutPage() {
  return (
    <Layout>
      <Content>
        {/* Hero Section */}
        <div className="relative py-32 text-center text-white bg-gradient-to-r from-blue-300 to-blue-400">
          <div className="absolute inset-0 opacity-20">
          </div>
          <div className="relative z-10 max-w-3xl px-4 mx-auto">
            <Title level={1} className="mb-6 !text-white">
              Về UTE Career
            </Title>
            <Paragraph className="mb-8 text-xl text-white">
              Kết nối sinh viên Đại học Sư phạm Kỹ thuật TP.HCM với cơ hội nghề nghiệp tốt nhất
            </Paragraph>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        {/* About Section */}
        <div className="py-16">
          <div className="container px-4 mx-auto max-w-7xl">
            <Row gutter={[48, 48]} align="middle">
              <Col xs={24} md={12}>
                <Title level={2} className="mb-6 !text-text-color">
                  Nền tảng kết nối sinh viên và nhà tuyển dụng
                </Title>
                <Paragraph className="mb-6 text-lg text-gray-600">
                  UTE Career là nền tảng kết nối sinh viên, cựu sinh viên trường Đại học Sư phạm Kỹ thuật TP.HCM với các
                  nhà tuyển dụng. Chúng tôi cung cấp các dịch vụ hỗ trợ toàn diện để giúp sinh viên tìm kiếm cơ hội việc
                  làm phù hợp và hỗ trợ doanh nghiệp tìm kiếm ứng viên tiềm năng.
                </Paragraph>
                <Row gutter={[16, 16]}>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <UserOutlined className="text-xl text-blue-500" />
                        <Statistic
                          title="Sinh viên đã tìm được việc làm"
                          value="5,000+"
                          valueStyle={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <BankOutlined className="text-xl text-blue-500" />
                        <Statistic
                          title="Doanh nghiệp đối tác"
                          value="200+"
                          valueStyle={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <TrophyOutlined className="text-xl text-blue-500" />
                        <Statistic
                          title="Sự kiện tuyển dụng mỗi năm"
                          value="50+"
                          valueStyle={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={12}>
                    <Card className="h-full bg-card-color">
                      <Space>
                        <BookOutlined className="text-xl text-blue-500" />
                        <Statistic
                          title="Workshop kỹ năng"
                          value="100+"
                          valueStyle={{ fontSize: "16px", fontWeight: "bold" }}
                        />
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} md={12}>
                <div className="relative overflow-hidden shadow-xl h-96 rounded-xl">
                  <Image
                    src="https://reviewedu.net/wp-content/uploads/2021/08/dh-su-pham-ky-thuat-hcm1.jpg"
                    alt="UTE Career Team"
                    preview={false}
                    className="object-cover opacity-90"
                  />
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Services Section */}
        <div className="py-16 bg-gray-50">
          <div className="container px-4 mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <Title level={2} className="mb-4 !text-text-color">
                Dịch vụ của chúng tôi
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                UTE Career cung cấp các dịch vụ toàn diện cho cả sinh viên và nhà tuyển dụng
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              {/* For Students */}
              <Col xs={24} md={12}>
                <Card className="h-full overflow-hidden shadow-md rounded-xl" bodyStyle={{ padding: 0 }}>
                  <div className="p-6 text-white bg-blue-500">
                    <Title level={3} className="m-0 !text-white">
                      Dành cho sinh viên & cựu sinh viên
                    </Title>
                    <Text className="text-white">Hỗ trợ toàn diện cho hành trình nghề nghiệp của bạn</Text>
                  </div>
                  <div className="p-6">
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          icon: <SearchOutlined />,
                          title: "Tìm kiếm việc làm",
                          description: "Tiếp cận hàng nghìn cơ hội việc làm phù hợp với chuyên ngành của bạn",
                        },
                        {
                          icon: <MessageOutlined />,
                          title: "Tư vấn nghề nghiệp",
                          description:
                            "Nhận tư vấn từ các chuyên gia về định hướng nghề nghiệp và phát triển sự nghiệp",
                        },
                        {
                          icon: <FileTextOutlined />,
                          title: "Hỗ trợ CV",
                          description: "Được hỗ trợ xây dựng và hoàn thiện CV chuyên nghiệp",
                        },
                        {
                          icon: <BarChartOutlined />,
                          title: "Đánh giá năng lực",
                          description: "Tham gia các bài đánh giá để hiểu rõ điểm mạnh và cơ hội phát triển",
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<div className="p-2 mr-4 text-blue-500 bg-blue-100 rounded-full">{item.icon}</div>}
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
                <Card className="h-full overflow-hidden shadow-md rounded-xl" bodyStyle={{ padding: 0 }}>
                  <div className="p-6 text-white bg-indigo-600">
                    <Title level={3} className="m-0 !text-white">
                      Dành cho nhà tuyển dụng
                    </Title>
                    <Text className="text-white">Tiếp cận nguồn ứng viên chất lượng từ HCMUTE</Text>
                  </div>
                  <div className="p-6">
                    <List
                      itemLayout="horizontal"
                      dataSource={[
                        {
                          icon: <EditOutlined />,
                          title: "Đăng tin tuyển dụng",
                          description: "Đăng tin tuyển dụng và tiếp cận hàng nghìn sinh viên và cựu sinh viên",
                        },
                        {
                          icon: <TeamOutlined />,
                          title: "Tìm kiếm ứng viên",
                          description: "Tìm kiếm ứng viên tiềm năng phù hợp với nhu cầu tuyển dụng của doanh nghiệp",
                        },
                        {
                          icon: <ShopOutlined />,
                          title: "Tổ chức tuyển dụng tại trường",
                          description: "Tham gia các sự kiện tuyển dụng trực tiếp tại trường để gặp gỡ ứng viên",
                        },
                        {
                          icon: <BulbOutlined />,
                          title: "Xây dựng thương hiệu",
                          description: "Quảng bá thương hiệu nhà tuyển dụng đến sinh viên và cựu sinh viên",
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <div className="p-2 mr-4 text-indigo-600 bg-indigo-100 rounded-full">{item.icon}</div>
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
                Sự kiện thường xuyên
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                UTE Career tổ chức nhiều sự kiện để kết nối sinh viên với cơ hội nghề nghiệp
              </Paragraph>
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  hoverable
                  cover={
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="UTE Job Fair"
                        
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="m-0 text-white">
                            Ngày hội việc làm UTE Job Fair
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>Tháng 4 và tháng 10 hàng năm</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      Sự kiện tuyển dụng lớn nhất trong năm với sự tham gia của hơn 50 doanh nghiệp và hàng nghìn cơ hội
                      việc làm.
                    </Paragraph>
                    <Link
                      to="/events/job-fair"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      Tìm hiểu thêm <RightOutlined className="ml-1" />
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  hoverable
                  cover={
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Workshop kỹ năng"
                        
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="m-0 text-white">
                            Workshop kỹ năng
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>Hàng tháng</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      Các buổi workshop về kỹ năng mềm và chuyên môn giúp sinh viên chuẩn bị tốt nhất cho hành trình
                      nghề nghiệp.
                    </Paragraph>
                    <Link
                      to="/events/workshops"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      Tìm hiểu thêm <RightOutlined className="ml-1" />
                    </Link>
                  </div>
                </Card>
              </Col>

              <Col xs={24} md={8}>
                <Card
                  className="overflow-hidden transition-shadow shadow-md rounded-xl hover:shadow-xl"
                  bodyStyle={{ padding: 0 }}
                  hoverable
                  cover={
                    <div className="relative h-48">
                      <Image
                        src="/placeholder.svg?height=400&width=600"
                        alt="Hội thảo doanh nghiệp"
                        
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent">
                        <div className="p-6 text-white">
                          <Title level={3} className="m-0 text-white">
                            Hội thảo doanh nghiệp
                          </Title>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4 text-gray-500">
                      <CalendarOutlined className="mr-2" />
                      <Text>Thường xuyên</Text>
                    </div>
                    <Paragraph className="mb-4 text-gray-600">
                      Cơ hội gặp gỡ và tìm hiểu về cơ hội thực tập và việc làm từ các doanh nghiệp đối tác hàng đầu.
                    </Paragraph>
                    <Link
                      to="/events/seminars"
                      className="inline-flex items-center font-medium text-blue-500 hover:text-blue-600"
                    >
                      Tìm hiểu thêm <RightOutlined className="ml-1" />
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
                Quy trình đăng ký
              </Title>
              <Paragraph className="max-w-2xl mx-auto text-gray-600">
                Quy trình đơn giản để bắt đầu sử dụng dịch vụ của UTE Career
              </Paragraph>
            </div>

            <Row gutter={[48, 48]}>
              {/* For Students */}
              <Col xs={24} md={12}>
                <Card className="p-8 shadow-md rounded-xl">
                  <Title level={3} className="flex items-center mb-6">
                    <UserOutlined className="mr-2 text-blue-500" />
                    Dành cho sinh viên & cựu sinh viên
                  </Title>

                  <div className="space-y-8">
                    {[
                      {
                        step: 1,
                        title: "Đăng ký tài khoản",
                        description: "Đăng ký tài khoản trên website với email trường (@student.hcmute.edu.vn)",
                      },
                      {
                        step: 2,
                        title: "Hoàn thiện hồ sơ",
                        description: "Cập nhật thông tin cá nhân, học vấn, kỹ năng và kinh nghiệm",
                      },
                      {
                        step: 3,
                        title: "Tìm kiếm việc làm",
                        description: "Tìm kiếm việc làm phù hợp với chuyên ngành và kỹ năng của bạn",
                      },
                      {
                        step: 4,
                        title: "Ứng tuyển",
                        description: "Ứng tuyển vào các vị trí phù hợp và theo dõi trạng thái ứng tuyển",
                      },
                    ].map((item) => (
                      <div className="flex" key={item.step}>
                        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 font-bold text-white rounded-full bg-card-color0">
                          {item.step}
                        </div>
                        <div>
                          <Text strong className="block mb-2">
                            {item.title}
                          </Text>
                          <Text className="text-gray-600">{item.description}</Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      type="primary"
                      size="large"
                      className="border-blue-500 bg-card-color0 hover:bg-blue-600 hover:border-blue-600"
                    >
                      <Link to="/register/student">Đăng ký ngay</Link>
                    </Button>
                  </div>
                </Card>
              </Col>

              {/* For Employers */}
              <Col xs={24} md={12}>
                <Card className="p-8 shadow-md rounded-xl">
                  <Title level={3} className="flex items-center mb-6">
                    <BankOutlined className="mr-2 text-indigo-600" />
                    Dành cho nhà tuyển dụng
                  </Title>

                  <div className="space-y-8">
                    {[
                      {
                        step: 1,
                        title: "Đăng ký tài khoản doanh nghiệp",
                        description: "Đăng ký tài khoản doanh nghiệp trên website với thông tin chính xác",
                      },
                      {
                        step: 2,
                        title: "Xác minh tài khoản",
                        description: "Tài khoản doanh nghiệp sẽ được xác minh bởi quản trị viên",
                      },
                      {
                        step: 3,
                        title: "Hoàn thiện thông tin doanh nghiệp",
                        description: "Cập nhật thông tin chi tiết về doanh nghiệp và lĩnh vực hoạt động",
                      },
                      {
                        step: 4,
                        title: "Đăng tin tuyển dụng",
                        description: "Đăng tin tuyển dụng và quản lý ứng viên trên hệ thống",
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
                          <Text className="text-gray-600">{item.description}</Text>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Button
                      type="primary"
                      size="large"
                      className="bg-indigo-600 border-indigo-600 hover:bg-indigo-700 hover:border-indigo-700"
                    >
                      <Link to="/register/employer">Đăng ký ngay</Link>
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
            <Card className="overflow-hidden shadow-lg rounded-xl" bodyStyle={{ padding: 0 }}>
              <Row>
                <Col xs={24} md={12}>
                  <div className="p-8 md:p-12">
                    <Title level={2} className="mb-6">
                      Liên hệ với chúng tôi
                    </Title>
                    <Paragraph className="mb-8 text-gray-600">
                      Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi. Đội ngũ UTE Career luôn sẵn
                      sàng hỗ trợ bạn.
                    </Paragraph>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <EnvironmentOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            Địa chỉ
                          </Text>
                          <Text className="text-gray-600">
                            Phòng A1-805, số 1 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP.HCM
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <MailOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            Email
                          </Text>
                          <Text className="text-gray-600">support@utecareer.edu.vn</Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <PhoneOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            Hotline
                          </Text>
                          <Text className="text-gray-600">028.1234.5678</Text>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="p-2 mt-1 mr-4 text-blue-500 bg-blue-100 rounded-full">
                          <ClockCircleOutlined />
                        </div>
                        <div>
                          <Text strong className="block mb-1">
                            Giờ làm việc
                          </Text>
                          <Text className="text-gray-600 whitespace-pre-line">
                            Thứ 2-6: 8h00-17h00
                            <br />
                            Thứ 7: 8h00-12h00
                          </Text>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        type="primary"
                        size="large"
                        className="border-blue-500 bg-card-color0 hover:bg-blue-600 hover:border-blue-600"
                      >
                        <Link to="/contact" className="flex items-center">
                          Gửi tin nhắn
                          <MessageOutlined className="ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className="relative h-96 md:h-auto">
                    <Image
                      src="/placeholder.svg?height=600&width=800"
                      alt="UTE Career Office"
                      
                      className="object-cover"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  )
}
