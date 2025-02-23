import { Avatar, Button, Flex, List, Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { Link } from "react-router-dom";
import ListCompany from "./ListCompany";

const MyCompanyPage = () => {

    return (
        <Flex vertical gap={8}>
            <BoxContainer className="shadow">
                <div className="title1">Công ty của tôi</div>
            </BoxContainer>
            <BoxContainer className="shadow">
                <Tabs defaultActiveKey="1" size="large">
                    <Tabs.TabPane tab="Theo dõi công ty" key="1">
                        <ListCompany />
                    </Tabs.TabPane>
                </Tabs>
            </BoxContainer>

        </Flex>
    )
}
export default MyCompanyPage;