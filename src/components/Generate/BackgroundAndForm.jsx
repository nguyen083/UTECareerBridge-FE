import { Col, Row } from "antd";
import { Outlet } from "react-router-dom";
import "./BackgroundAndForm.scss";
const BackgroundAndForm = () => {
    return (
        <Row className="layout-container">
            <Col span={12} className="sticky-top">
            </Col>
            <Col span={12} >
                <Outlet />
            </Col>
        </Row>
    );
}
export default BackgroundAndForm;