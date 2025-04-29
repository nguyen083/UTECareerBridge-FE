import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import InterviewList from "./InterviewList";
import { Flex, Tabs } from "antd";
import { CalendarOutlined, UnorderedListOutlined } from "@ant-design/icons";

const InterviewPage = () => {
    const { t } = useTranslation();
    
    const items = [
        {
            key: '1',
            label: (
                <span>
                    <CalendarOutlined /> {t('employer.interview.calendar_view')}
                </span>
            ),
            children: <InterviewList viewMode="calendar" />,
        },
        {
            key: '2',
            label: (
                <span>
                    <UnorderedListOutlined /> {t('employer.interview.list_view')}
                </span>
            ),
            children: <InterviewList viewMode="list" />,
        },
    ];

    return (
        <Flex vertical gap={20}>
            <BoxContainer className="shadow-md">
                <div className="title1">{t('employer.interview.title')}</div>
                <p className="text-gray-500 mt-2">{t('employer.interview.subtitle')}</p>
            </BoxContainer>
            <BoxContainer className="shadow-md p-0">
                <Tabs 
                    defaultActiveKey="1" 
                    items={items}
                    className="interview-tabs"
                    tabBarStyle={{ padding: '0 16px', marginBottom: 0 }}
                />
            </BoxContainer>
        </Flex>
    );
};

export default InterviewPage;
