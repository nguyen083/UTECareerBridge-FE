import "./Footer.scss"
import { Row, Col, Typography, Divider, Space, Flex } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text, Link } = Typography;

const FooterComponent = () => {
    const { t } = useTranslation();
    return (
        <footer style={{ backgroundColor: '#E1EDFC', color: '#fff', padding: '40px 40px' }}>
            <Row gutter={[32, 16]}>
                {/* Cột VietnamWorks */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>Ute Careerbridge</Title>
                    <Space direction="vertical">
                        <Link href="/about" className='link-footer'>{t('employer.job.aboutUteCareerbridge')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.aboutUteinTECH')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.contact')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.faq')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.termsOfUse')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.privacyPolicy')}</Link>
                    </Space>
                </Col>

                {/* Cột Dành cho Nhà tuyển dụng */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>{t('employer.job.forEmployer')}</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>{t('employer.job.postJob')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.searchResume')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.contact')}</Link>
                    </Space>
                </Col>


                {/* Cột Việc làm theo ngành nghề */}
                <Col xs={24} sm={12} md={8}>
                    <Title level={5} style={{ color: '#1E4F94' }}>{t('employer.job.jobsByIndustry')}</Title>
                    <Space direction="vertical">
                        <Link href="#" className='link-footer'>{t('employer.job.accounting')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.banking')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.automotiveTechnology')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.informationTechnology')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.construction')}</Link>
                        <Link href="#" className='link-footer'>{t('employer.job.findJob')}</Link>
                    </Space>
                </Col>
            </Row>

            <Divider style={{ backgroundColor: '#ccc' }} />

            {/* Phần ứng dụng và mạng xã hội */}

            <Flex justify='center'>
                <Space size='small'>
                    <Text style={{ color: '#1E4F94' }}>
                        Copyright ©2024 UTE CAREERBRIDGE
                    </Text>
                </Space>
            </Flex>
        </footer>
    );
};

export default FooterComponent;
