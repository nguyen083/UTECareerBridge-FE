import { Affix, Button, Flex, message, Typography } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import ViewCV from "../../Student/CV/ViewCV";
import styles from "./ViewDetailApplicant.module.scss";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useParams, useLocation } from "react-router-dom";
import { convertStatus } from "../../../services/apiService";
import { useEffect } from "react";

const { Text } = Typography;
const ViewDetailApplicant = () => {
    const { id } = useParams();
    const location = useLocation();
    useEffect(() => {
        if (location.state?.status === "PENDING") {
            convertStatus(id, "VIEWED");
        }
    }, []);
    const handleApprove = () => {
        convertStatus(id, "APPROVED").then((res) => {
            if (res.status === "OK") {
                message.success(res.message);
            }
        });
    }
    const handleReject = () => {
        convertStatus(id, "REJECTED").then((res) => {
            if (res.status === "OK") {
                message.success(res.message);
            }
        });
    }
    return (
        <Flex vertical gap={20}>
            <Affix offsetTop={80}>
                <BoxContainer className={styles.box_container}>
                    <Flex justify='space-between' align='center'>
                        <Text className="mb-0 title1">Duyệt ứng viên</Text>
                        <Flex gap={10} align='center'>
                            <Button icon={<CheckOutlined />} size="large" type="primary" className={styles.btn_success} onClick={handleApprove}>Duyệt</Button>
                            <Button icon={<CloseOutlined />} size="large" type="primary" danger onClick={handleReject}>Từ chối</Button>
                        </Flex>
                    </Flex>
                </BoxContainer>
            </Affix>
            <ViewCV />
        </Flex>
    )
}
export default ViewDetailApplicant;