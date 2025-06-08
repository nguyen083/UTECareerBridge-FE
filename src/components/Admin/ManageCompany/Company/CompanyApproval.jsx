import { Divider, Tabs } from "antd";
import BoxContainer from "../../../Generate/BoxContainer";
import { useState } from "react";
import TableCompany from "./TableCompany";
import { useTranslation } from "react-i18next";

const CompanyApproval = () => {
  const { TabPane } = Tabs;
  const [activeKey, setActiveKey] = useState("PENDING");
  const { t } = useTranslation();

  const handleTabChange = (key) => {
    setActiveKey(key);
  };
  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="title1">{t("admin.companyApproval.title")}</div>
        <Divider />
        <Tabs size="large" activeKey={activeKey} onChange={handleTabChange}>
          <TabPane
            tab={t("admin.companyApproval.tabs.pending")}
            key="PENDING"
          />
          <TabPane
            tab={t("admin.companyApproval.tabs.approved")}
            key="APPROVED"
          />
          <TabPane
            tab={t("admin.companyApproval.tabs.rejected")}
            key="REJECTED"
          />
        </Tabs>
        <TableCompany status={activeKey} />
      </BoxContainer>
    </>
  );
};

export default CompanyApproval;
