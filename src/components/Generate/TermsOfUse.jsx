import { useTranslation } from "react-i18next";
import { Typography, Card, List, Divider, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

const TermsOfUse = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="px-4 mx-auto max-w-7xl md:px-6">
        <Title level={1} className="mb-8 text-center">
          {t("termsOfUse.title")}
        </Title>

        <Card className="shadow-sm">
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Title level={3}>{t("termsOfUse.introduction.title")}</Title>
              <Paragraph>{t("termsOfUse.introduction.content")}</Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.userAgreement.title")}</Title>
              <Paragraph>{t("termsOfUse.userAgreement.content")}</Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>
                {t("termsOfUse.accountResponsibility.title")}
              </Title>
              <Paragraph>
                {t("termsOfUse.accountResponsibility.content")}
              </Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.contentGuidelines.title")}</Title>
              <Paragraph>{t("termsOfUse.contentGuidelines.content")}</Paragraph>
              <List
                className="ml-6"
                itemLayout="horizontal"
                dataSource={[
                  t("termsOfUse.contentGuidelines.item1"),
                  t("termsOfUse.contentGuidelines.item2"),
                  t("termsOfUse.contentGuidelines.item3"),
                  t("termsOfUse.contentGuidelines.item4"),
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>
                {t("termsOfUse.intellectualProperty.title")}
              </Title>
              <Paragraph>
                {t("termsOfUse.intellectualProperty.content")}
              </Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.limitation.title")}</Title>
              <Paragraph>{t("termsOfUse.limitation.content")}</Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.termination.title")}</Title>
              <Paragraph>{t("termsOfUse.termination.content")}</Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.changes.title")}</Title>
              <Paragraph>{t("termsOfUse.changes.content")}</Paragraph>
            </div>

            <Divider className="my-2" />

            <div>
              <Title level={3}>{t("termsOfUse.contactUs.title")}</Title>
              <Paragraph>{t("termsOfUse.contactUs.content")}</Paragraph>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfUse;
