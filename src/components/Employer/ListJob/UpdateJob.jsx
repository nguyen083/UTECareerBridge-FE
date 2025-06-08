import {
  Button,
  Col,
  Collapse,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  message,
} from "antd";
import BoxContaier from "../../Generate/BoxContainer";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import CustomizeQuill from "../../Generate/CustomizeQuill";
import { useEffect, useState } from "react";
import {
  getAllJobCategories,
  getAllJobLevels,
  getAllSkills,
  getJobById,
  putJob,
} from "../../../services/apiService";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const format = (value) => {
  if (!value) return "";
  const stringValue = `${value}`;
  const absoluteValue = stringValue.replace("-", "").replace(".", "");
  const formattedValue = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return formattedValue;
};

const UpdateJob = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [levels, setLevels] = useState([]);
  const { id } = useParams();
  const location = useLocation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getJobById(id, location.state.status).then((res) => {
        if (res.status === "OK") {
          const jobData = {
            jobTitle: res.data.jobTitle,
            jobLocation: res.data.jobLocation,
            jobCategoryId: res.data.jobCategory.jobCategoryId,
            jobMinSalary: res.data.jobMinSalary,
            jobMaxSalary: res.data.jobMaxSalary,
            jobDeadline: dayjs(res.data.jobDeadline, "DD/MM/YYYY"),
            amount: res.data.amount,
            jobLevelId: res.data.jobLevel.jobLevelId,
            skillIds: res.data.jobSkills.map((skill) => skill.skillId),
            jobRequirements: res.data.jobRequirements,
            jobDescription: res.data.jobDescription,
          };
          form.setFieldsValue(jobData);
        } else {
          message.error(res.message);
        }
      });
    }
  }, [id, form]);

  const form1 = (
    <BoxContaier>
      <Row gutter={[16]}>
        <Col span={24}>
          <Form.Item
            name="jobTitle"
            label={
              <span>
                {t("employer.job.title")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              { required: true, message: t("employer.job.titleRequired") },
            ]}
            validateFirst
            validateTrigger={["onChange", "onBlur"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            name="jobLocation"
            label={
              <span>
                {t("employer.job.location")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              { required: true, message: t("employer.job.locationRequired") },
            ]}
            validateFirst
            validateTrigger={["onChange", "onBlur"]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item
            name="jobCategoryId"
            label={
              <span>
                {t("employer.job.category")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: t("employer.job.categoryRequired"),
              },
              () => ({
                validator(_, value) {
                  if (value === 0) {
                    return Promise.reject(
                      new Error(t("employer.job.categoryRequired"))
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            validateTrigger={["onChange", "onBlur"]}
          >
            <Select defaultValue={0}>
              <Select.Option value={0}>
                {t("employer.job.categoryPlaceholder")}
              </Select.Option>
              {categories.map((category) => (
                <Select.Option key={category.value} value={category.value}>
                  {category.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            name="jobMinSalary"
            label={
              <span>
                {t("employer.job.minSalary")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              { required: true, message: t("employer.job.minSalaryRequired") },
            ]}
            validateFirst
            validateTrigger={["onChange", "onBlur"]}
          >
            <InputNumber
              addonAfter="VNĐ"
              className="w-full"
              formatter={(value) => format(value)}
              parser={(value) => value.replace(/\s/g, "")}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="jobMaxSalary"
            label={
              <span>
                {t("employer.job.maxSalary")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              { required: true, message: t("employer.job.maxSalaryRequired") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("jobMinSalary") <= value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t("employer.job.salaryError"))
                  );
                },
              }),
            ]}
            validateFirst
            validateTrigger={["onChange", "onBlur"]}
          >
            <InputNumber
              addonAfter="VNĐ"
              className="w-full"
              formatter={(value) => format(value)}
              parser={(value) => value.replace(/\s/g, "")}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="jobDeadline"
            label={
              <span>
                {t("employer.job.deadline")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              {
                required: true,
                message: t("employer.job.deadlineRequired"),
              },
            ]}
            validateTrigger={["onChange"]}
          >
            <DatePicker
              className="w-full"
              format={"DD/MM/YYYY"}
              placeholder={t("employer.job.deadlinePlaceholder")}
            />
          </Form.Item>
        </Col>
      </Row>
    </BoxContaier>
  );
  const form2 = (
    <BoxContaier>
      <Row gutter={[16]}>
        <Col span={6}>
          <Form.Item
            name="amount"
            label={
              <span>
                {t("employer.job.quantity")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              { required: true, message: t("employer.job.quantityRequired") },
            ]}
            validateFirst
            validateTrigger={["onChange", "onBlur"]}
          >
            <InputNumber
              className="w-full"
              formatter={(value) => format(value)}
              parser={(value) => value.replace(/\s/g, "")}
            />
          </Form.Item>
        </Col>
        <Col span={18}>
          <Form.Item
            name="jobLevelId"
            label={
              <span>
                {t("employer.job.level")}{" "}
                <span className="text-red-500"> *</span>
              </span>
            }
            rules={[
              () => ({
                validator(_, value) {
                  if (value === 0) {
                    return Promise.reject(
                      new Error(t("employer.job.levelRequired"))
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Select defaultValue={0}>
              <Select.Option value={0}>
                {t("employer.job.levelPlaceholder")}
              </Select.Option>
              {levels.map((level) => (
                <Select.Option key={level.value} value={level.value}>
                  {level.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="skillIds"
            label={t("employer.job.skills")}
            rules={[
              {
                required: true,
                message: t("employer.job.skillsRequired"),
              },
            ]}
            validateFirst
            validateTrigger={["onBlur", "onChange"]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder={t("employer.job.skillsPlaceholder")}
              options={skills}
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </Col>
        <Form.Item
          name="jobRequirements"
          className="w-full mt-0 "
          label={t("employer.job.requirements")}
        >
          <CustomizeQuill />
        </Form.Item>
        <Form.Item
          name="jobDescription"
          className="w-full mt-0 "
          label={t("employer.job.description")}
        >
          <CustomizeQuill />
        </Form.Item>
      </Row>
    </BoxContaier>
  );
  const itemsCollapse1 = [
    {
      key: "1",
      label: (
        <span className="title2 card-title">{t("employer.job.basicInfo")}</span>
      ),
      children: form1,
    },
  ];
  const itemsCollapse2 = [
    {
      key: "1",
      label: (
        <span className="title2 card-title">
          {t("employer.job.requirementsInfo")}
        </span>
      ),
      children: form2,
    },
  ];
  useEffect(() => {
    getAllJobCategories().then((res) => {
      const filteredOptions = res.data
        .filter((item) => item.active === true)
        .map((item) => {
          return { value: item.jobCategoryId, label: item.jobCategoryName };
        });
      setCategories(filteredOptions);
    });
    getAllJobLevels().then((res) => {
      const filteredOptions = res.data
        .filter((item) => item.active === true)
        .map((item) => {
          return { value: item.jobLevelId, label: item.nameLevel };
        });
      setLevels(filteredOptions);
    });
    getAllSkills().then((res) => {
      const filteredOptions = res.data
        .filter((item) => item.active === true)
        .map((item) => {
          return { value: item.skillId, label: item.skillName };
        });
      setSkills(filteredOptions);
    });
  }, []);

  const updateJob = (values) => {
    putJob(id, values).then((res) => {
      if (res.status === "OK") {
        message.success(res.message);

        navigate("/employer/manage-list-jobs");
      } else {
        message.error(res.message);
      }
    });
  };
  const onFinish = (values) => {
    dayjs.extend(customParseFormat);
    values.jobDeadline = dayjs(values.jobDeadline, "YYYY-MM-DD").format(
      "DD/MM/YYYY"
    );
    console.log(values);
    updateJob(values);
  };
  const onFinishFailed = () => {};
  const onReset = () => {
    navigate("/employer/manage-list-jobs");
  };
  return (
    <>
      <BoxContaier>
        <div className="title1">{t("employer.job.editJob")}</div>
      </BoxContaier>
      <BoxContaier>
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          onReset={onReset}
          requiredMark={false}
          form={form}
          size="large"
          autoComplete="off"
          layout="vertical"
        >
          <Flex vertical gap="middle">
            <Collapse
              collapsible="false"
              expandIconPosition="end"
              defaultActiveKey={["1"]}
              items={itemsCollapse1}
              bordered={false}
            />
            <Collapse
              expandIconPosition="end"
              defaultActiveKey={["1"]}
              items={itemsCollapse2}
              bordered={false}
            />
            <Flex gap="middle" justify="end">
              <Button type="default" htmlType="reset">
                {t("common.cancel")}
              </Button>
              <Button type="primary" htmlType="submit">
                {t("common.save")}
              </Button>
            </Flex>
          </Flex>
        </Form>
      </BoxContaier>
    </>
  );
};

export default UpdateJob;
