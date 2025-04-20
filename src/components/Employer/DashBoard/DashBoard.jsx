import { Card, Col, message, Row, Statistic, Table, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import { useEffect, useState } from "react";
import { SlUserFollowing } from "react-icons/sl";
import { ImUserTie } from "react-icons/im";
import { useTranslation } from "react-i18next";
import { LiaBriefcaseSolid } from "react-icons/lia";
import {
  getCountStudentApplied,
  getJobPackage,
} from "../../../services/apiService";
import { useSelector } from "react-redux";

const { Text } = Typography;

const ListPackage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: t("employer.dashboard.servicePackage.table.packageName"),
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: t("employer.dashboard.servicePackage.table.amount"),
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: t("employer.dashboard.servicePackage.table.expiredAt"),
      dataIndex: "expiredAt",
      key: "expiredAt",
      align: "center",
    },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getJobPackage();
      if (response.status === "OK") {
        setData(
          response.data.map((item) => ({
            packageName: item.packageResponse.packageName,
            amount: item.amount,
            expiredAt: item?.expiredAt.split(" ")[0],
          }))
        );
      } else {
        message.error(response.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <Table
        locale={{
          emptyText: t("employer.dashboard.servicePackage.table.emptyText"),
        }}
        style={{ maxHeight: 350, overflow: "auto" }}
        bordered
        loading={loading}
        dataSource={data}
        pagination={false}
        columns={columns}
      />
    </div>
  );
};

const DashBoard = () => {
  const { t } = useTranslation();
  const { countJob, countFollower } = useSelector((state) => state.employer);
  const [countStudentApplied, setCountStudentApplied] = useState(0);

  useEffect(() => {
    getCountStudentApplied().then((res) => {
      if (res.status === "OK") {
        setCountStudentApplied(res.data);
      } else {
        message.error(res.message);
      }
    });
  }, []);

  return (
    <>
      <BoxContainer className="shadow-md">
        <div className="title1">{t("employer.dashboard.title")}</div>
      </BoxContainer>
      <BoxContainer className="shadow-md">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Card className="shadow">
              <Statistic
                title={
                  <Text>{t("employer.dashboard.stats.followers.title")}</Text>
                }
                value={countFollower || 0}
                prefix={<SlUserFollowing style={{ color: "#52c41a" }} />}
                suffix={
                  <Text>{t("employer.dashboard.stats.followers.unit")}</Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="shadow">
              <Statistic
                title={
                  <Text>{t("employer.dashboard.stats.candidates.title")}</Text>
                }
                value={countStudentApplied || 0}
                prefix={<ImUserTie style={{ color: "#1890ff" }} />}
                suffix={
                  <Text>{t("employer.dashboard.stats.candidates.unit")}</Text>
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card className="shadow">
              <Statistic
                title={<Text>{t("employer.dashboard.stats.jobs.title")}</Text>}
                value={countJob || 0}
                prefix={<LiaBriefcaseSolid style={{ color: "#52c41a" }} />}
                suffix={<Text>{t("employer.dashboard.stats.jobs.unit")}</Text>}
              />
            </Card>
          </Col>
          <Col sm={24} lg={24}>
            <Card
              title={t("employer.dashboard.servicePackage.title")}
              className="shadow"
            >
              <ListPackage />
            </Card>
          </Col>
        </Row>
      </BoxContainer>
    </>
  );
};

export default DashBoard;
