import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import { JobCardSmall } from "../../Generate/JobCard";
import { useState, useEffect } from "react";
import job from "../../../services/api/job";
import { useSelector } from "react-redux";
import { Alert, Layout, Typography } from "antd";
const { Content } = Layout;
const { Title } = Typography;
const RecommendJob = () => {
    const { t } = useTranslation();
    const [recommendJob, setRecommendJob] = useState([]);
    const userId = useSelector(state => state.user.userId);
    const fetchRecommendJob = async () => {
        const response = await job.getRecommendJob(userId);
        const data = response.map(job => ({
            jobId: job.job_id,
            jobTitle: job.job_title,
            employerResponse: {
                companyLogo: job.logo,
                companyName: job.company_name,
            },
            jobMinSalary: job.job_min_salary,
            jobMaxSalary: job.job_max_salary,
            jobLocation: job.job_location ,
        })  );
        setRecommendJob(data);
    }
    useEffect(() => {
        fetchRecommendJob();
    }, []);
    return (
        <Layout>
            <Content>
        <BoxContainer className="shadow-lg" padding="40px">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Title level={3} className="text-2xl font-bold !text-text-color">{t('student.recommend.title')}</Title>
                </div>
                <Alert className="p-6" message={t('student.recommend.description')} type="info" />
                <div className="flex flex-col gap-2">
                    {recommendJob.map((job) => (
                        <JobCardSmall key={job.jobId} job={job} />
                    ))}
                </div> 
            </div>
        </BoxContainer>
            </Content>
        </Layout>

    )
}

export default RecommendJob;