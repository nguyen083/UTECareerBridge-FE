import { Affix, Flex, Typography, Button } from "antd";
import ViewCV from "../../Student/CV/ViewCV";
import BoxContainer from "../../Generate/BoxContainer";
import { CheckOutlined } from '@ant-design/icons';
import "./DetailResume.scss";
const { Text } = Typography;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ModalInterview } from "../Applicant/ViewDetailApplicant";
const DetailResume = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    return (
        <div>
            {/* <Affix Affix offsetTop={80}>
                <BoxContainer className="box_container">
                    <Flex justify='space-between' align='center'>
                        <Text className="mb-0 title1">Duyệt ứng viên</Text>
                        <Flex gap={10} align='center'>
                            <Button size="large" type="primary" className="btn_success" onClick={() => setOpen(true)}>Mời phỏng vấn</Button>
                        </Flex>
                    </Flex>
                </BoxContainer>
            </Affix> */}
            <ViewCV />
            <ModalInterview open={open} setOpen={setOpen} studentId={location.state.datasource.id} />
        </div>
    );
}
export default DetailResume;