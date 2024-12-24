import { Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState } from "react";
import TableCompany from "./TableCompany";


const CompanyApproval = () => {
    const { TabPane } = Tabs;
    const [activeKey, setActiveKey] = useState('PENDING');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <BoxContainer>
                <div className="title1">Duyệt công ty</div>
            </BoxContainer>
            <BoxContainer>
                <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane
                        tab="Đang chờ duyệt"
                        key="PENDING"
                    />
                    <TabPane
                        tab="Đã duyệt"
                        key="APPROVED"
                    />
                    <TabPane
                        tab="Bị từ chối"
                        key="REJECTED"
                    />
                </Tabs>
                <TableCompany status={activeKey} />
            </BoxContainer>
        </>
    )
}

export default CompanyApproval;