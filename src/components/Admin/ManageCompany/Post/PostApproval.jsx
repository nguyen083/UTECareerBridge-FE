import { Tabs, Row, Col, Card, Badge, Statistic, Button, Tooltip } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState, useEffect } from "react";
import TablePost from "./TablePost";
import { useTranslation } from 'react-i18next';
import { FileTextOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { getAllPostByAdmin } from "../../../../services/apiService";

const PostApproval = () => {
    const { t } = useTranslation();
    const [activeKey, setActiveKey] = useState('PENDING');
    const [stats, setStats] = useState({
        pending: 0,
        active: 0,
        rejected: 0,
        total: 0
    });
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Fetch pending count
            const pendingRes = await getAllPostByAdmin({
                status: 'PENDING',
                page: 0,
                limit: 1
            });
            
            // Fetch active count
            const activeRes = await getAllPostByAdmin({
                status: 'ACTIVE',
                page: 0,
                limit: 1
            });
            
            // Fetch rejected count
            const rejectedRes = await getAllPostByAdmin({
                status: 'REJECTED',
                page: 0,
                limit: 1
            });
            
            setStats({
                pending: pendingRes.data?.totalElements || 0,
                active: activeRes.data?.totalElements || 0,
                rejected: rejectedRes.data?.totalElements || 0,
                total: (pendingRes.data?.totalElements || 0) + 
                       (activeRes.data?.totalElements || 0) + 
                       (rejectedRes.data?.totalElements || 0)
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleTabChange = (key) => {
        setActiveKey(key);
    };

    // Card style for consistent appearance
    const cardStyle = {
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.09)',
        height: '100%'
    };

    const items = [
        {
            key: 'PENDING',
            label: (
                <span>
                    <ClockCircleOutlined /> {t('admin.postApproval.tabs.pending')} <Badge count={stats.pending} style={{ backgroundColor: '#faad14' }} />
                </span>
            ),
            children: (
                <div className="tab-content">
                    <p className="text-gray-500 mb-4">{t('admin.manageJobs.pendingDescription')}</p>
                    <TablePost status="PENDING" onUpdateStats={fetchStats} />
                </div>
            )
        },
        {
            key: 'ACTIVE',
            label: (
                <span>
                    <CheckCircleOutlined /> {t('admin.postApproval.tabs.approved')} <Badge count={stats.active} style={{ backgroundColor: '#52c41a' }} />
                </span>
            ),
            children: (
                <div className="tab-content">
                    <p className="text-gray-500 mb-4">{t('admin.manageJobs.activeDescription')}</p>
                    <TablePost status="ACTIVE" onUpdateStats={fetchStats} />
                </div>
            )
        },
        {
            key: 'REJECTED',
            label: (
                <span>
                    <CloseCircleOutlined /> {t('admin.postApproval.tabs.rejected')} <Badge count={stats.rejected} style={{ backgroundColor: '#ff4d4f' }} />
                </span>
            ),
            children: (
                <div className="tab-content">
                    <p className="text-gray-500 mb-4">{t('admin.manageJobs.rejectedDescription')}</p>
                    <TablePost status="REJECTED" onUpdateStats={fetchStats} />
                </div>
            )
        }
    ];

    return (
        <>
            <BoxContainer className="shadow-md mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="title1 mb-0">{t('admin.postApproval.title')}</h1>
                    <div>
                        <Tooltip title={t('admin.dashboard.refresh')}>
                            <Button 
                                icon={<ReloadOutlined />} 
                                onClick={fetchStats}
                                loading={loading}
                                className="mr-2"
                            />
                        </Tooltip>
                    </div>
                </div>
                <p className="text-gray-600 mb-4">{t('admin.manageJobs.description')}</p>
                
                <Row gutter={16} className="mb-4">
                    <Col xs={24} sm={12} md={6}>
                        <Card style={cardStyle}>
                            <Statistic
                                title={t('admin.manageJobs.totalJobs')}
                                value={stats.total}
                                prefix={<FileTextOutlined />}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{...cardStyle, borderLeft: '4px solid #faad14'}}>
                            <Statistic
                                title={t('admin.manageJobs.pendingDescription')}
                                value={stats.pending}
                                valueStyle={{ color: '#faad14' }}
                                prefix={<ClockCircleOutlined />}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{...cardStyle, borderLeft: '4px solid #52c41a'}}>
                            <Statistic
                                title={t('admin.manageJobs.activeDescription')}
                                value={stats.active}
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <Card style={{...cardStyle, borderLeft: '4px solid #ff4d4f'}}>
                            <Statistic
                                title={t('admin.manageJobs.rejectedDescription')}
                                value={stats.rejected}
                                valueStyle={{ color: '#ff4d4f' }}
                                prefix={<CloseCircleOutlined />}
                                loading={loading}
                            />
                        </Card>
                    </Col>
                </Row>
            </BoxContainer>
            
            <BoxContainer className="shadow-md">
                <Tabs
                    activeKey={activeKey}
                    onChange={handleTabChange}
                    size="large"
                    type="card"
                    animated={{ tabPane: true }}
                    className="admin-post-tabs"
                    items={items}
                />
            </BoxContainer>
        </>
    )
}

export default PostApproval;