import { useEffect, useRef, useState } from "react";
import {
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Button, Input, Modal, Space, Table, Tooltip, Tag, Empty } from "antd";
import Highlighter from "react-highlight-words";
import {
  deleteJob,
  getJobsByStatus,
  putHideJob,
} from "../../../services/apiService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const TableListJobs = (props) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const fetchData = async (currentPage, pageSize) => {
    setLoading(true);
    const params = {
      jobStatus: props.status,
      page: currentPage - 1,
      limit: pageSize,
    };

    try {
      const res = await getJobsByStatus(params);
      if (res.status === "OK" && res.data) {
        const data = res.data.jobResponses.map((item, index) => {
          return {
            key: item.jobId,
            index: (currentPage - 1) * pageSize + index + 1,
            title: item.jobTitle,
            category: item.jobCategory.jobCategoryName,
            level: item.jobLevel.nameLevel,
            rejectionReason: item.rejectionReason,
            quantity: item.amount,
            deadline: item.jobDeadline,
            createdTime: item.createdAt,
            views: item.views || 0,
          };
        });

        setData(data);
        setPagination({
          current: currentPage,
          pageSize: pageSize,
          total: res.data.totalElements,
        });
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Check if a deadline is near (within 3 days)
  const isDeadlineNear = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = dayjs(deadline, "DD/MM/YYYY");
    const today = dayjs();
    const daysLeft = deadlineDate.diff(today, "day");
    return daysLeft >= 0 && daysLeft <= 3;
  };

  // Check if a deadline has expired
  const isDeadlineExpired = (deadline) => {
    if (!deadline) return false;
    const deadlineDate = dayjs(deadline, "DD/MM/YYYY");
    const today = dayjs();
    return deadlineDate.isBefore(today, "day");
  };

  // Action handlers
  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize, props.status]);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleView = (id) => {
    navigate(`/view/job/${id}`, { state: { status: props.status } });
  };

  const handleEdit = (id) => {
    navigate(`/employer/job/edit/${id}`, { state: { status: props.status } });
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: t("common.notice"),
      content: t("employer.manageJobs.deleteConfirm"),
      centered: true,
      okText: t("common.delete"),
      okButtonProps: { danger: true },
      cancelText: t("common.cancel"),
      onOk() {
        return new Promise((resolve, reject) => {
          deleteJob(id)
            .then((res) => {
              if (res.status === "OK") {
                resolve();
                fetchData(pagination.current, pagination.pageSize);
                if (props.onRefreshStats) {
                  props.onRefreshStats();
                }
              } else {
                reject();
              }
            })
            .catch(reject);
        });
      },
    });
  };

  const handleHide = (id) => {
    const isInactive = props.status === "INACTIVE";
    Modal.confirm({
      title: t("common.notice"),
      content: isInactive
        ? t("employer.manageJobs.showConfirm")
        : t("employer.manageJobs.hideConfirm"),
      okText: isInactive ? t("common.show") : t("common.hide"),
      cancelText: t("common.cancel"),
      centered: true,
      onOk() {
        return new Promise((resolve, reject) => {
          putHideJob(id, isInactive ? "ACTIVE" : "INACTIVE")
            .then((res) => {
              if (res.status === "OK") {
                resolve();
                fetchData(pagination.current, pagination.pageSize);
                if (props.onRefreshStats) {
                  props.onRefreshStats();
                }
              } else {
                reject();
              }
            })
            .catch(reject);
        });
      },
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        className="flex flex-col !min-w-[250px] gap-2 p-1"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={t("employer.manageJobs.search.placeholder")}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="search-input"
        />
        <Space className="search-buttons">
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
          >
            {t("employer.manageJobs.search.search")}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            {t("employer.manageJobs.search.reset")}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  // Different table columns based on job status
  const columns = [
    {
      title: t("admin.userTable.columns.no"),
      dataIndex: "index",
      key: "index",
      width: "5%",
      className: "index-column",
    },
    {
      title: t("admin.post.table.columns.title"),
      dataIndex: "title",
      key: "title",
      className: "title-column",
      ...getColumnSearchProps("title"),
      render: (text) => <span className="job-title">{text}</span>,
    },
    {
      title: t("admin.post.table.columns.category"),
      dataIndex: "category",
      key: "category",
      width: "13%",
      align: "center",
      ...getColumnSearchProps("category"),
      render: (text) => (
        <div className="flex justify-center">
          <Tag className="!w-fit" color="blue">
            {text}
          </Tag>
        </div>
      ),
    },
    {
      title: t("admin.post.table.columns.level"),
      dataIndex: "level",
      key: "level",
      width: "13%",
      align: "center",
      ...getColumnSearchProps("level"),
      render: (text) => (
        <div className="flex justify-center">
          <Tag className="!w-fit" color="purple">
            {text}
          </Tag>
        </div>
      ),
    },
  ];

  // Add different columns based on status
  if (props.status === "REJECTED") {
    columns.push({
      title: t("admin.post.table.columns.rejectedReason"),
      dataIndex: "rejectionReason",
      key: "rejectionReason",
      ellipsis: true,
      width: "20%",
      render: (text) => (
        <Tooltip destroyTooltipOnHide={true} title={text}>
          <span className="rejection-reason">{text || "-"}</span>
        </Tooltip>
      ),
    });
  } else {
    columns.push({
      title: t("admin.post.table.columns.deadline"),
      dataIndex: "deadline",
      key: "deadline",
      align: "right",
      width: "13%",
      ...getColumnSearchProps("deadline"),
      render: (text) => (
        <div className="flex justify-end">
          {isDeadlineExpired(text) ? (
            <Tag color="red">{text} </Tag>
          ) : isDeadlineNear(text) ? (
            <Tag color="orange">{text} </Tag>
          ) : (
            <Tag color="green">{text}</Tag>
          )}
        </div>
      ),
    });
  }

  columns.push({
    title: t("admin.post.table.columns.createdTime"),
    dataIndex: "createdTime",
    key: "createdTime",
    width: "10%",
    align: "center",
    render: (text) => <span className="created-time">{text}</span>,
  });

  columns.push({
    align: "center",
    title: t("admin.post.table.columns.actions") || "Actions",
    key: "action",
    width: "15%",
    render: (_, record) => (
      <Space size="small" className="action-buttons">
        <Tooltip destroyTooltipOnHide={true} title={t("common.view")}>
          <Button
            onClick={() => handleView(record.key)}
            icon={<FileSearchOutlined />}
            className="view-button"
          />
        </Tooltip>

        {props.status !== "REJECTED" && (
          <Tooltip destroyTooltipOnHide={true} title={t("common.edit")}>
            <Button
              onClick={() => handleEdit(record.key)}
              icon={<EditOutlined />}
              type="primary"
              className="edit-button"
            />
          </Tooltip>
        )}

        <Tooltip destroyTooltipOnHide={true} title={t("common.delete")}>
          <Button
            onClick={() => handleDelete(record.key)}
            icon={<DeleteOutlined />}
            danger
            className="delete-button"
          />
        </Tooltip>

        {["ACTIVE", "INACTIVE"].includes(props.status) && (
          <Tooltip
            destroyTooltipOnHide={true}
            title={
              props.status === "INACTIVE"
                ? t("employer.manageJobs.show")
                : t("employer.manageJobs.hide")
            }
          >
            <Button
              onClick={() => handleHide(record.key)}
              icon={
                props.status === "INACTIVE" ? (
                  <EyeOutlined />
                ) : (
                  <EyeInvisibleOutlined />
                )
              }
              className={
                props.status === "INACTIVE" ? "show-button" : "hide-button"
              }
            />
          </Tooltip>
        )}
      </Space>
    ),
  });

  return (
    <Table
      className="jobs-table"
      bordered
      columns={columns}
      dataSource={data}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        showSizeChanger: true,
        total: pagination.total,
      }}
      loading={loading}
      onChange={handleTableChange}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>{t("admin.post.table.noData")}</span>}
          />
        ),
      }}
      scroll={{ x: "max-content" }}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "even-row" : "odd-row"
      }
    />
  );
};

export default TableListJobs;
