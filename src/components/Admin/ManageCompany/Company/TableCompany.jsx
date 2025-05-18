import {
  Button,
  Modal,
  Space,
  Table,
  Input,
  Form,
  message,
  Tooltip,
  Card,
} from "antd";
import { useEffect, useRef, useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  SearchOutlined,
  FileProtectOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";
import {
  approveCompany,
  getAllCompany,
  rejectCompany,
} from "../../../../services/apiService";
import { useTranslation } from "react-i18next";

const TableCompany = ({ status }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        className="p-2 bg-white rounded shadow-md"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={t("admin.company.table.search.searchFor", {
            field: t(`admin.company.table.columns.${dataIndex}`),
          })}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          className="block w-full mb-2"
          style={{ marginBottom: 8 }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            className="w-[90px]"
          >
            {t("admin.company.table.search.search")}
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            className="w-[90px]"
          >
            {t("admin.company.table.search.reset")}
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            {t("admin.company.table.search.filter")}
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            {t("admin.company.table.search.close")}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ?.toString()
        .toLowerCase()
        .includes(value.toLowerCase()) || false,
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
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

  const fetchData = async () => {
    setLoading(true);
    const params = {
      page: currentPage - 1,
      limit: pageSize,
      status: status,
    };
    try {
      const response = await getAllCompany(params);
      setData(response.data.employerResponses);
      setTotal(response.data.totalPages * pageSize);
    } catch (error) {
      console.error("Error fetching data", error);
      message.error(t("admin.company.table.error.fetchFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, status]);

  const columns = [
    {
      title: t("admin.company.table.columns.companyName"),
      dataIndex: "companyName",
      key: "companyName",
      ...getColumnSearchProps("companyName"),
      sorter: (a, b) =>
        (a.companyName || "").localeCompare(b.companyName || ""),
      sortDirections: ["descend", "ascend"],
      width: "30%",
      render: (text, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#f0f2f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              marginRight: 12,
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <FileProtectOutlined style={{ fontSize: 18, color: "#1890ff" }} />
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "14px" }}>{text}</div>
            <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
              {record.companyEmail}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: t("admin.company.table.columns.address"),
      dataIndex: "companyAddress",
      key: "address",
      ...getColumnSearchProps("companyAddress"),
      width: "20%",
      ellipsis: true,
    },
    {
      title: t("admin.company.table.columns.phone"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "15%",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: t("admin.company.table.columns.certificate"),
      dataIndex: "businessCertificate",
      key: "businessCertificate",
      width: "15%",
      align: "center",
      render: (text, record) =>
        record.businessCertificate ? (
          <Button
            type="primary"
            ghost
            href={record.businessCertificate}
            target="_blank"
            icon={<EyeOutlined />}
            size="middle"
            className="flex items-center justify-center mx-auto"
          >
            {t("admin.company.table.actions.viewCertificate")}
          </Button>
        ) : (
          <span style={{ color: "#bfbfbf" }}>
            {t("admin.company.table.notAvailable")}
          </span>
        ),
    },
    ...(status === "REJECTED"
      ? [
          {
            key: "rejectedReason",
            title: t("admin.company.table.columns.rejectedReason"),
            dataIndex: "rejectedReason",
            width: "20%",
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                <span style={{ color: "#ff4d4f" }}>{text}</span>
              </Tooltip>
            ),
          },
        ]
      : []),
    {
      key: "actions",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title={t("admin.company.table.actions.view")}>
            <Link to={`/view/company/${record.id}`} target="_blank">
              <Button
                icon={<EyeOutlined className="text-text-color" />}
                shape="circle"
                size="middle"
              />
            </Link>
          </Tooltip>
          {status === "PENDING" && (
            <Tooltip title={t("admin.company.table.actions.approve")}>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                shape="circle"
                size="middle"
                onClick={async () => {
                  try {
                    approveCompany(record.id).then((res) => {
                      if (res.status === "OK") {
                        message.success(res.message);
                        fetchData();
                      } else {
                        message.error(res.message);
                      }
                    });
                  } catch (error) {
                    console.error("Error approving company", error);
                  }
                }}
              />
            </Tooltip>
          )}
          {status === "PENDING" && (
            <Tooltip
              color="red"
              title={t("admin.company.table.actions.reject")}
            >
              <Button
                danger
                shape="circle"
                size="middle"
                onClick={() => {
                  setSelectedCompany(record);
                  setIsModalVisible(true);
                }}
                icon={<CloseOutlined />}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleModalCancel = () => {
    form.resetFields();
    setSelectedCompany(null);
    setIsModalVisible(false);
  };

  const handleModalSubmit = (values) => {
    rejectCompany(selectedCompany.id, values)
      .then((res) => {
        if (res.status === "OK") {
          message.success(res.message);
          fetchData();
        } else {
          message.error(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        handleModalCancel();
      });
  };

  return (
    <div className="company-approval-container">
      <Card
        bordered={false}
        className="mb-4"
        bodyStyle={{ padding: "0" }}
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.03)", borderRadius: "8px" }}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          className="company-table"
          style={{ borderRadius: "8px", overflow: "hidden" }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total, range) =>
              t("admin.company.table.pagination", {
                start: range[0],
                end: range[1],
                total,
              }),
            style: { marginRight: "16px" },
          }}
        />
      </Card>

      <Modal
        centered
        title={
          <div
            style={{ display: "flex", alignItems: "center", padding: "8px 0" }}
          >
            <CloseCircleOutlined
              style={{ color: "#f5222d", marginRight: 12, fontSize: "18px" }}
            />
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              {t("admin.company.table.modal.title")}
            </span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalCancel}
        width={500}
        footer={[
          <Button
            key="cancel"
            onClick={handleModalCancel}
            size="large"
            className="mr-2"
          >
            {t("admin.company.table.modal.cancel")}
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={() => form.submit()}
            size="large"
          >
            {t("admin.company.table.modal.confirm")}
          </Button>,
        ]}
        bodyStyle={{ padding: "20px" }}
      >
        <Form
          form={form}
          onFinish={handleModalSubmit}
          size="large"
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span style={{ fontWeight: 500 }}>
                {t("admin.company.table.modal.rejectReason")}
              </span>
            }
            name="reason"
            placeholder={t("admin.company.table.modal.enterRejectReason")}
            rules={[
              {
                required: true,
                message: t("admin.company.table.modal.pleaseEnterReason"),
              },
            ]}
          >
            <Input.TextArea
              rows={4}
              allowClear
              placeholder={t("admin.company.table.modal.enterRejectReason")}
              style={{ borderRadius: "6px" }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TableCompany;
