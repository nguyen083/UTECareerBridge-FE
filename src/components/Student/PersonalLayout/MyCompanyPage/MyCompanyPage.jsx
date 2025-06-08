import { Flex, Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import ListCompany from "./ListCompany";
import { useTranslation } from "react-i18next";

const MyCompanyPage = () => {
    const {t} = useTranslation();
    return (
        <Flex vertical gap={8}>
            <BoxContainer className="shadow">
                <div className="title1">{t('my_company')}</div>
            </BoxContainer>
            <BoxContainer className="shadow">
                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab={t('follow_company')} key="1">
                        <ListCompany />
                    </Tabs.TabPane>
                </Tabs>
            </BoxContainer>

        </Flex>
    )
}
export default MyCompanyPage;