import { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  List,
  Radio,
  Flex,
  Empty,
  Typography,
  Divider,
  Statistic,
  Card,
  Breadcrumb,
  Tag,
  Button,
} from "antd";
import {
  FilterOutlined,
  SortAscendingOutlined,
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  HomeOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import FilterPanel from "./FilterPanel";
import "./JobPage.scss";
import { useSelector, useDispatch } from "react-redux";
import { searchJob } from "../../../services/apiService";
import { JobCardLarge } from "../../Generate/JobCard";
import CarouselTopCompnay from "./CarouselTopCompnay";
import { useLocation } from "react-router-dom";
import { setKeyword } from "../../../redux/action/webSlice";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { Text, Paragraph } = Typography;

const JobSearchPage = () => {
  const keyword = useSelector((state) => state.web.keyword);
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [sorting, setSorting] = useState("");
  const [filters, setFilters] = useState({
    categoryId: undefined,
    industryId: undefined,
    jobLevelId: undefined,
    skillId: undefined,
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  const sanitizeParams = (params) => {
    const sanitized = {};
    for (const key in params) {
      if (params[key] === undefined) {
        sanitized[key] = "";
      } else {
        sanitized[key] = params[key];
      }
    }
    return sanitized;
  };

  const handleSearch = () => {
    setLoading(true);
    const params = {
      keyword,
      page: currentPage - 1,
      limit: pageSize,
      sorting,
      ...filters,
    };
    const sanitizedParams = sanitizeParams(params);
    searchJob(sanitizedParams)
      .then((res) => {
        setJobs(res.data?.jobResponses || []);
        setTotalElements(res.data?.totalElements || 0);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const handleKeywordSearch = () => {
  //   dispatch(setKeyword(searchKeyword));
  //   setCurrentPage(1);
  // };

  const handleFilterToggle = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleReset = () => {
    setSorting("");
    setFilters({
      categoryId: undefined,
      industryId: undefined,
      jobLevelId: undefined,
      skillId: undefined,
    });
    dispatch(setKeyword(""));
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("location.state", location.state);
    if (location.state?.filters) {
      setFilters((prev) => ({
        ...prev,
        ...location.state.filters,
      }));
    }
    if (location.state?.filters?.jobStatus === "newest") {
      setSorting("newest");
    }
  }, [location.state]);

  useEffect(() => {
    handleSearch();
  }, [keyword, filters, sorting, pageSize, currentPage]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  return (
    <Layout className="search-page-layout">
      <Content className="search-content">
        <div className="search-header">
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> {t("common.home")}
            </Breadcrumb.Item>
            <Breadcrumb.Item>Search</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        <Row gutter={24} className="main-content">
          <Col xs={24} lg={18} className="left-column">
            <div className="search-panel">
              <div className="search-tools">
                <div className="search-toolbar">
                  <div className="filters-toggle">
                    <Button
                      icon={<FilterOutlined />}
                      onClick={handleFilterToggle}
                      type={isFilterVisible ? "primary" : "default"}
                      size="large"
                    >
                      {t("job.search.filters")}
                    </Button>

                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                      className="reset-button"
                      size="large"
                    >
                      {t("job.search.reset")}
                    </Button>
                  </div>

                  <div className="result-stats">
                    <Text>
                      {loading ? (
                        <LoadingOutlined />
                      ) : (
                        <span>
                          {t("job.search.found")}{" "}
                          <strong>{totalElements}</strong>{" "}
                          {t("job.search.jobs")}
                        </span>
                      )}
                    </Text>
                  </div>
                </div>

                {isFilterVisible && (
                  <div className="filter-panel-container">
                    <FilterPanel
                      onValuesChange={setFilters}
                      filters={filters}
                    />
                  </div>
                )}

                <div className="sorting-section">
                  <div className="sorting-title">
                    <SortAscendingOutlined /> {t("job.search.sortBy")}
                  </div>
                  <div className="sort-options">
                    <Radio.Group
                      size="large"
                      value={sorting}
                      onChange={(e) => setSorting(e.target.value)}
                    >
                      <Flex gap={10} className="sorting-buttons">
                        <div className="sort-option">
                          <Radio.Button className="sort-button" value="">
                            {t("job.search.sortOptions.all")}
                          </Radio.Button>
                        </div>
                        <div className="sort-option">
                          <Radio.Button className="sort-button" value="newest">
                            <CalendarOutlined />{" "}
                            {t("job.search.sortOptions.newest")}
                          </Radio.Button>
                        </div>
                        <div className="sort-option">
                          <Radio.Button className="sort-button" value="oldest">
                            <CalendarOutlined rotate={180} />{" "}
                            {t("job.search.sortOptions.oldest")}
                          </Radio.Button>
                        </div>
                        <div className="sort-option">
                          <Radio.Button
                            className="sort-button"
                            value="salary_desc"
                          >
                            <RiseOutlined />{" "}
                            {t("job.search.sortOptions.salaryDesc")}
                          </Radio.Button>
                        </div>
                        <div className="sort-option">
                          <Radio.Button
                            className="sort-button"
                            value="salary_asc"
                          >
                            <FallOutlined />{" "}
                            {t("job.search.sortOptions.salaryAsc")}
                          </Radio.Button>
                        </div>
                      </Flex>
                    </Radio.Group>
                  </div>
                </div>
              </div>

              <Divider className="results-divider">
                <Tag color="blue">{t("job.search.results")}</Tag>
              </Divider>

              <div className="job-listings">
                <List
                  loading={loading}
                  split={false}
                  itemLayout="vertical"
                  size="large"
                  locale={{
                    emptyText: (
                      <Empty description={t("job.search.noResults")} />
                    ),
                  }}
                  pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalElements,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50"],
                    className: "custom-pagination",
                    showTotal: (total) =>
                      `${t("job.search.total")}: ${total} ${t(
                        "job.search.jobs"
                      )}`,
                  }}
                  dataSource={jobs}
                  renderItem={(job) => (
                    <List.Item key={job.jobId} className="job-list-item">
                      <JobCardLarge job={job} />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </Col>

          <Col xs={24} lg={6} className="right-column">
            <div className="sidebar-content">
              <Card className="stats-card" title={t("job.search.statistics")}>
                <Statistic
                  title={t("job.search.totalJobs")}
                  value={totalElements}
                />
                <Divider />
                <Statistic
                  title={t("job.search.currentFilters")}
                  value={
                    Object.values(filters).filter((f) => f !== undefined).length
                  }
                  suffix={`/ ${Object.keys(filters).length}`}
                />
                <Divider />
                <Paragraph type="secondary">
                  {t("job.search.refineSearch")}
                </Paragraph>
              </Card>

              <div className="top-companies-section">
                <CarouselTopCompnay />
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default JobSearchPage;
