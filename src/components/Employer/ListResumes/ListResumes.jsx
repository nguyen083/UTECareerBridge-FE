import { useEffect, useState } from "react";
import BoxContainer from "../../Generate/BoxContainer";
import { Avatar, Button, Divider, Flex, List, Select, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./ListApplicant.scss";
import {
  getAllApplicantByCategoryId,
  getAllJobCategories,
} from "../../../services/apiService";
import { FaFilter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const { Option } = Select;
const ListApplicant = ({ categoryId }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [datasource, setDatasource] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalApplicants, setTotalApplicants] = useState(0);
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const param = {
      page: currentPage - 1,
      limit: pageSize,
      categoryId,
    };
    getAllApplicantByCategoryId(param).then((res) => {
      if (res.status === "OK") {
        setDatasource(res.data.content);
        setTotalApplicants(res.data.numberOfElements);
      } else {
        setDatasource([]);
        setTotalApplicants(0);
        return;
      }
    });
  }, [categoryId]);
  return (
    <>
      <List
        className="list-applicant"
        split={false}
        dataSource={datasource}
        pagination={{
          align: "end",
          current: currentPage,
          pageSize: pageSize,
          total: totalApplicants,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} ${t("common.of")} ${total} ${t(
              "common.item"
            )}`,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        renderItem={(item) => (
          <List.Item className="!p-3 border rounded-lg shadow">
            <List.Item.Meta
              avatar={
                <Avatar
                  icon={<UserOutlined />}
                  size={70}
                  src={item?.profileImage}
                />
              }
              title={
                <Text className="text-base font-bold">
                  {item?.lastName} {item?.firstName}
                </Text>
              }
              description={
                <>
                  <Text className="text-base">
                    {" "}
                    {t("employer.resumes.studentYear", {
                      year: item?.year,
                    })}
                    ,{" "}
                    {t("employer.resumes.major", { major: item?.categoryName })}
                  </Text>
                  <br />
                  <Text className="text-base">
                    {" "}
                    <span className="font-bold">
                      {t("employer.resumes.email")}:
                    </span>{" "}
                    {item?.email}
                  </Text>
                </>
              }
            />
            <Button
              onClick={() => {
                navigate(`/employer/detail-resume`, {
                  state: { datasource: item },
                });
              }}
              type="default"
              size="large"
            >
              {t("employer.resumes.viewResume")}
            </Button>
          </List.Item>
        )}
      />
    </>
  );
};

const ListResumes = () => {
  const { t } = useTranslation();
  const [listCategory, setListCategory] = useState([]);
  const [categoryId, setCategoryId] = useState(
    useSelector((state) => state.employer.categoryId)
  );
  useEffect(() => {
    getAllJobCategories().then((res) => {
      setListCategory(
        res.data
          .filter((item) => item.active === true)
          .map((item) => ({
            label: item.jobCategoryName,
            value: +item.jobCategoryId,
          }))
      );
    });
  }, []);
  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="pt-4 title1">{t("employer.resumes.jobSeekerList")}</div>
        <Divider />
        <Flex align="center" justify="end">
          <Select
            value={categoryId}
            placeholder={t("employer.resumes.industry")}
            size="large"
            style={{ minWidth: 200 }}
            allowClear
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => setCategoryId(value)}
            prefix={<FaFilter color="#1E4F94" style={{ marginRight: 8 }} />}
          >
            {listCategory.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Flex>
        <ListApplicant categoryId={categoryId} />
      </BoxContainer>
    </>
  );
};
export default ListResumes;
