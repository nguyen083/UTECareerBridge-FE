import { Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState } from "react";
import TablePost from "./TablePost";

const PostApproval = () => {
    const { TabPane } = Tabs;
    const [activeKey, setActiveKey] = useState('PENDING');

    const handleTabChange = (key) => {
        setActiveKey(key);
    };
    return (
        <>
            <BoxContainer>
                <div className="title1">Duyệt bài đăng</div>
            </BoxContainer>
            <BoxContainer>
                <Tabs size='large' activeKey={activeKey} onChange={handleTabChange}>
                    <TabPane
                        tab="Đang chờ duyệt"
                        key="PENDING"
                    />
                    <TabPane
                        tab="Đã duyệt"
                        key="ACTIVE"
                    />
                    <TabPane
                        tab="Bị từ chối"
                        key="REJECTED"
                    />
                </Tabs>
                <TablePost status={activeKey} />
            </BoxContainer>
        </>
    )
}

export default PostApproval;    