import { Button, Collapse, Drawer, Flex } from "antd";
import { useTranslation } from "react-i18next";
import { Typography } from "antd";
import { IoIosRefresh } from "react-icons/io";
import './ListApplicantDrawer.scss';
import ListApplicant from "./ListApplicant";
import { useRef } from "react";

const { Text } = Typography;

const ListApplicantDrawer = ({open, setSelectedJob, jobId}) => {
    // const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const pendingRef = useRef();
    const viewedRef = useRef();
    const approvedRef = useRef();
    const rejectedRef = useRef();
    
    const handleRefresh = () => {
        pendingRef.current?.fetchData();
        viewedRef.current?.fetchData();
        approvedRef.current?.fetchData();
        rejectedRef.current?.fetchData();
    };
    
    const items = [
        {
          key: '1',
          label: t('employer.applicant.tabs.pending'),
          children: <ListApplicant ref={pendingRef} activeKey="PENDING" jobId={jobId}/>,
        },
        {
          key: '2',
          label: t('employer.applicant.tabs.viewed'),
          children: <ListApplicant ref={viewedRef} activeKey="VIEWED" jobId={jobId}/>,
        },
        {
          key: '3',
          label: t('employer.applicant.tabs.approved'),
          children: <ListApplicant ref={approvedRef} activeKey="APPROVED" jobId={jobId}/>,
        },
        {
          key: '4',
          label: t('employer.applicant.tabs.rejected'),
          children: <ListApplicant ref={rejectedRef} activeKey="REJECTED" jobId={jobId}/>,
        },
    ];

    return (
        <Drawer
        className="list-applicant-drawer"
        width={700}
        closable
        destroyOnClose
        title={<Flex justify='space-between' align='center'><Text>{t('list_applicant')}</Text>
            <Button icon={<IoIosRefresh size={20}/>} type="text" onClick={handleRefresh}>
            </Button>
        </Flex>}
        placement="right"
        open={open}
        // loading={loading}
        onClose={() => setSelectedJob(null)}
      >
        <Collapse items={items} defaultActiveKey={['1', '2', '3', '4']} size="small" expandIconPosition="end"/>
      </Drawer>
    )
}

export default ListApplicantDrawer;
