import "./Footer.scss"
import { Row, Col, Typography, Divider, Space, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { 
    FacebookOutlined,
    TwitterOutlined,
    LinkedinOutlined,
    InstagramOutlined,
    GithubOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text, Link, Paragraph } = Typography;

const FooterComponent = () => {
    const { t } = useTranslation();
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <Row gutter={[48, 32]}>
                    {/* Company Information Column */}
                    <Col xs={24} sm={24} md={8} lg={8}>
                        <div className="footer-company-info">
                            <Title level={3} className="footer-logo">UTE CareerBridge</Title>
                            <Paragraph className="footer-description">
                                {t('employer.job.footerDescription') || 'Connecting talented students with career opportunities across industries. Your bridge to professional success.'}
                            </Paragraph>
                            <div className="footer-contact-info">
                                <Space direction="vertical" size="small">
                                    <Flex align="center" gap={12}>
                                        <EnvironmentOutlined className="contact-icon" />
                                        <Text>1 Vo Van Ngan, Thu Duc City, Ho Chi Minh City</Text>
                                    </Flex>
                                    <Flex align="center" gap={12}>
                                        <PhoneOutlined className="contact-icon" />
                                        <Text>(+84) 28 3896 4369</Text>
                                    </Flex>
                                    <Flex align="center" gap={12}>
                                        <MailOutlined className="contact-icon" />
                                        <Text>utecareerbridge@hcmute.edu.vn</Text>
                                    </Flex>
                                </Space>
                            </div>
                        </div>
                    </Col>

                    {/* Quick Links Column */}
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="footer-link-columns">
                            <div className="footer-link-column">
                                <Title level={5} className="footer-title">{t('employer.job.aboutUs')}</Title>
                                <ul className="footer-links">
                                    <li><Link href="/about" className="link-footer">{t('employer.job.aboutUteCareerbridge')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.aboutUteinTECH')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.contact')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.faq')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.termsOfUse')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.privacyPolicy')}</Link></li>
                                </ul>
                            </div>
                            <div className="footer-link-column">
                                <Title level={5} className="footer-title">{t('employer.job.forEmployer')}</Title>
                                <ul className="footer-links">
                                    <li><Link href="#" className="link-footer">{t('employer.job.postJob')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.searchResume')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.contact')}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </Col>

                    {/* Categories & Newsletter Column */}
                    <Col xs={24} sm={12} md={8} lg={8}>
                        <div className="footer-link-columns">
                            <div className="footer-link-column">
                                <Title level={5} className="footer-title">{t('employer.job.jobsByIndustry')}</Title>
                                <ul className="footer-links footer-categories">
                                    <li><Link href="#" className="link-footer">{t('employer.job.accounting')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.banking')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.automotiveTechnology')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.informationTechnology')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.construction')}</Link></li>
                                    <li><Link href="#" className="link-footer">{t('employer.job.findJob')}</Link></li>
                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Divider className="footer-divider" />

                <div className="footer-bottom">
                    <div className="footer-copyright">
                        <Text>Copyright © {new Date().getFullYear()} UTECareerBridge - All Rights Reserved.</Text>
                    </div>
                    <div className="footer-social">
                        <Link href="https://facebook.com" target="_blank" className="social-icon">
                            <FacebookOutlined />
                        </Link>
                        <Link href="https://twitter.com" target="_blank" className="social-icon">
                            <TwitterOutlined />
                        </Link>
                        <Link href="https://linkedin.com" target="_blank" className="social-icon">
                            <LinkedinOutlined />
                        </Link>
                        <Link href="https://instagram.com" target="_blank" className="social-icon">
                            <InstagramOutlined />
                        </Link>
                        <Link href="https://github.com" target="_blank" className="social-icon">
                            <GithubOutlined />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
