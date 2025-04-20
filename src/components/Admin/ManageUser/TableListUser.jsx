import { useState, useEffect } from "react";
import "./TableListUser.scss";
import { Link } from "react-router-dom";
import {
  Table,
  Button,
  Input,
  Space,
  message,
  Tag,
  Tooltip,
  Modal,
  Dropdown,
  Empty,
} from "antd";
import {
  EditOutlined,
  ReloadOutlined,
  DownOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import { getAllUsers, exportUserToPdf } from "../../../services/apiService";
import { useTranslation } from "react-i18next";
const { Search } = Input;

const TableListUser = ({ fetch, userType, additionalColumns = [], onEdit }) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sorting, setSorting] = useState("");
  const [sortField, setSortField] = useState("");
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const statusColors = {
    ACTIVE: "success",
    INACTIVE: "error",
    PENDING: "warning",
    BLOCKED: "error",
  };

  const baseColumns = [
    {
      title: t("admin.userTable.columns.no"),
      dataIndex: "index",
      key: "index",
      width: "5%",
      align: "center",
    },
    {
      title: t("admin.userTable.columns.lastName"),
      dataIndex: "lastName",
      key: "lastName",
      width: "10%",
      align: "center",
    },
    {
      title: t("admin.userTable.columns.firstName"),
      dataIndex: "firstName",
      key: "firstName",
      width: "10%",
      sorter: true,
      align: "center",
      sortDirections: ["ascend", "descend"],
    },
    {
      title: t("admin.userTable.columns.email"),
      dataIndex: "email",
      key: "email",
      align: "center",
      width: "20%",
    },
    {
      title: t("admin.userTable.columns.phone"),
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: t("admin.userTable.columns.dob"),
      dataIndex: "dob",
      key: "dob",
      align: "center",
    },
    {
      title: t("admin.userTable.columns.status"),
      dataIndex: "active",
      key: "active",
      align: "center",
      width: "10%",
      render: (active) => {
        const displayStatus = active
          ? t("admin.userTable.columns.statusValues.active")
          : t("admin.userTable.columns.statusValues.blocked");
        const statusKey = active ? "ACTIVE" : "BLOCKED";
        return (
          <div className="flex items-center justify-center w-full">
            <Tag
              className="text-sm font-normal w-fit"
              color={statusColors[statusKey]}
            >
              {displayStatus}
            </Tag>
          </div>
        );
      },
    },
    {
      key: "actions",
      fixed: "right",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip
            title={t("admin.userTable.tooltips.updateAccount")}
            color="cyan"
          >
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          {userType === "employer" && (
            <Tooltip
              title={t("admin.userTable.tooltips.viewCompany")}
              color="blue"
            >
              <Link to={`/company/${record.key}`} target="_blank">
                <Button icon={<EyeOutlined />} />
              </Link>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const columns = [
    ...baseColumns.slice(0, 2),
    ...additionalColumns,
    ...baseColumns.slice(2),
  ];

  const items = [
    {
      label: t("admin.userTable.sort.newest"),
      key: "newest",
    },
    {
      label: t("admin.userTable.sort.oldest"),
      key: "lastest",
    },
    {
      label: t("admin.userTable.sort.nameAZ"),
      key: "ascName",
    },
    {
      label: t("admin.userTable.sort.nameZA"),
      key: "descName",
    },
  ];

  const handleMenuClick = ({ key }) => {
    let newSortField = key;
    setSortField(key);
    setSorting(newSortField);

    fetchUsers({
      page: pagination.current - 1,
      pageSize: pagination.pageSize,
      sorting: `${newSortField}`,
    });
  };

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);

      const queryParams = {
        role: userType,
        page: params.page || pagination.current - 1,
        size: params.pageSize || pagination.pageSize,
        sorting:
          params.sorting ||
          (sortField && sorting ? `${sortField},${sorting}` : ""),
        keyword: params.keyword || searchText,
        ...params.additionalParams,
      };

      const response = await getAllUsers(queryParams);

      if (response.status === "OK") {
        const dataWithIndex = response.data.userResponses.map((user, idx) => ({
          ...user,
          key: user.userId,
          index: queryParams.page * queryParams.size + idx + 1,
        }));
        setUsers(dataWithIndex);
        setPagination({
          ...pagination,
          total: response.data.totalElements,
          current: params.page || pagination.current,
        });
      } else {
        message.error(t("admin.userTable.loadError"));
      }
    } catch {
      message.error(t("admin.userTable.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetch]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, userType]);

  const handleTableChange = (newPagination, filters, sorter) => {
    const newSorting = sorter.order === "ascend" ? "asc" : "desc";
    setSorting(newSorting);

    fetchUsers({
      page: newPagination.current,
      pageSize: newPagination.pageSize,
      sorting: newSorting,
      additionalParams: {
        ...filters,
      },
    });
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination({ ...pagination, current: 1 });

    fetchUsers({
      keyword: value,
      page: 0,
    });
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const PrintModal = () => (
    <Modal
      title={t("admin.userTable.export.title")}
      open={isPrintModalVisible}
      onCancel={() => setIsPrintModalVisible(false)}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4 p-4">
        <Button
          icon={<FileExcelOutlined />}
          onClick={() => handleExport("excel")}
          loading={exportLoading}
          block
          size="large"
          className="mb-3"
        >
          {t("admin.userTable.export.excel")}
        </Button>
        <Button
          icon={<FilePdfOutlined />}
          onClick={() => handleExport("pdf")}
          loading={exportLoading}
          block
          size="large"
          type="primary"
        >
          {t("admin.userTable.export.pdf")}
        </Button>
      </div>
    </Modal>
  );

  const handleExport = async (type) => {
    try {
      setExportLoading(true);

      const queryParams = {
        role: userType,
        page: pagination.current - 1,
        size: pagination.pageSize,
        sorting: sortField && sorting ? `${sortField},${sorting}` : "createdAt",
        keyword: searchText || "",
      };

      if (type === "pdf") {
        const response = await exportUserToPdf(queryParams);
        const blob =
          response instanceof Blob
            ? response
            : new Blob([response], { type: "application/pdf" });

        if (blob.size === 0) {
          throw new Error("Empty PDF file");
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `users-${new Date().getTime()}.pdf`);

        window.open(url, "_blank");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 100);

        message.success(t("admin.userTable.export.success"));
      }
    } catch (error) {
      console.error(`Error exporting ${type}:`, error);
      message.error(
        t("admin.userTable.export.error", {
          type: type === "excel" ? "Excel" : "PDF",
        })
      );
    } finally {
      setExportLoading(false);
      setIsPrintModalVisible(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Search
            size="large"
            placeholder={t("admin.userTable.search.placeholder")}
            allowClear
            onSearch={handleSearch}
            style={{ width: "400px" }}
            className="search-input"
          />
          <Dropdown
            menu={{
              items,
              onClick: handleMenuClick,
            }}
            trigger={["click"]}
          >
            <Button size="large">
              {t("admin.userTable.search.sort")} <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            icon={<ReloadOutlined />}
            size="large"
            onClick={handleRefresh}
          >
            {t("admin.userTable.search.refresh")}
          </Button>
          <Button size="large" onClick={() => setIsPrintModalVisible(true)}>
            <PrinterOutlined />
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) =>
            t("admin.userTable.search.totalUsers", { total }),
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        locale={{
          emptyText: <Empty description={t("admin.userTable.noData")} />,
        }}
      />
      <PrintModal />
    </div>
  );
};

export default TableListUser;
