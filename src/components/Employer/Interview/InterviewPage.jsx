import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";
import InterviewList from "./InterviewList";
import { Flex } from "antd";

const InterviewPage = () => {
    const { t } = useTranslation();
    return (
        <Flex vertical gap={20}>
        <BoxContainer className="shadow-md">
            <div className="title1">{t('employer.interview.title')}</div>
        </BoxContainer>
            <BoxContainer className="shadow-md">
                <InterviewList />
            </BoxContainer>
        </Flex>
    );
};

export default InterviewPage;
