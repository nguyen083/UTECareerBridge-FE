import { useTranslation } from "react-i18next";
import BoxContainer from "../../Generate/BoxContainer";

const InterviewList = () => {
    const { t } = useTranslation();
    return (
        <>
        <BoxContainer className="shadow-md">
            <div className="title1">{t('employer.interview.title')}</div>
        </BoxContainer>
        <BoxContainer className="shadow-md">

        </BoxContainer>
        </>
    );
};

export default InterviewList;
