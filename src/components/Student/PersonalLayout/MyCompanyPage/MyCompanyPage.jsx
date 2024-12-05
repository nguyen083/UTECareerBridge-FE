import { Avatar, Button, Flex, List, Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { Link } from "react-router-dom";
import ListCompany from "./ListCompany";

const MyCompanyPage = () => {

    return (
        <Flex vertical gap={8}>
            <BoxContainer className="box_shadow">
                <div className="title1">Công ty của tôi</div>
            </BoxContainer>
            <BoxContainer className="box_shadow">
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