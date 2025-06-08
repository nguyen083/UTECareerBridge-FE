import { Button, Divider, Flex, Form, Image, Modal, message } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useState } from "react";
import IconLoading from "../../Generate/IconLoading";
import { useSelector, useDispatch } from "react-redux";
import { updateBusinessCertificate } from "../../../services/apiService";
import { setBusinessCertificate } from "../../../redux/action/employerSlice";
import { UploadImage } from "../../Student/Component/UploadAvatar";
import { useTranslation } from "react-i18next";

const BusinessCertificate = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const businessCertificate = useSelector(
    (state) => state.employer.businessCertificate
  );
  const [change, setChange] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log(values);
    setLoading(true);

    updateBusinessCertificate(values).then((res) => {
      if (res.status === "OK") {
        setLoading(false);
        setChange(false);
        message.success(res.message);
        console.log(res.data);
        dispatch(setBusinessCertificate(res.data));
      } else {
        setLoading(false);
        setChange(false);
        message.error(res.message);
      }
    });
  };

  const onChange = () => {
    Modal.confirm({
      title: t("employer.company.certificate.confirmModal.title"),
      content: t("employer.company.certificate.confirmModal.content"),
      onOk() {
        setChange(true);
      },
      onCancel() {
        form.resetFields();
      },
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      ),
    });
  };

  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="title1">{t("employer.company.certificate.title")}</div>
        <Divider />
        <Flex gap="1rem" align="center">
          <Form
            className="w-full md:w-7/12"
            onChange={onChange}
            form={form}
            onFinish={onFinish}
            layout="vertical"
            size="large"
            initialValues={{ businessCertificate }}
          >
            <Form.Item
              name="businessCertificate"
              label={t("employer.company.certificate.uploadLabel")}
              tooltip={t("employer.company.certificate.uploadTooltip")}
            >
              <UploadImage />
            </Form.Item>

            <Form.Item>
              <Flex align="center" justify="end">
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading || !change}
                >
                  <IconLoading loading={loading} setLoading={setLoading} />{" "}
                  {t("common.save")}
                </Button>
              </Flex>
            </Form.Item>
          </Form>
          <div className="hidden w-5/12 md:block">
            <Flex align="center" justify="center" vertical>
              <div className="mb-1" style={{ fontSize: "1rem" }}>
                {t("employer.company.certificate.previewTitle")}
              </div>
              <Image
                alt={t("employer.company.certificate.previewAlt")}
                src="https://res.cloudinary.com/utejobhub/image/upload/v1727667740/company/tma_technology_group_business_certificate.jpg"
                width="60%"
              />
            </Flex>
          </div>
        </Flex>
      </BoxContainer>
    </>
  );
};

export default BusinessCertificate;
