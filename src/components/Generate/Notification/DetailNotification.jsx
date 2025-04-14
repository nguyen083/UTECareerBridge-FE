import { Divider, Flex } from "antd";
import BoxContainer from "../BoxContainer";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import HtmlContent from "../HtmlContent";
import { useEffect, useState } from "react";
import notificationApi from "../../../services/api/notification";
import { useNotificationRead } from "../../../composables/notification";
const DetailNotification = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {id} = useParams();
    const [notification, setNotification] = useState(null);
    const notificationMutation = useNotificationRead();
    useEffect(() => {
        
        const fetchNotification = async () => {
            notificationApi.getNotificationById(id).then(res => {
                setNotification(res.data);
                if(!res.data.read) {
                    notificationMutation.mutate(id);
                }
            })
        }
        fetchNotification();
    }, [id]);
    return (
        <Flex vertical gap={8}>
                <BoxContainer className="shadow">
                    <Flex gap={16} align="center">
                        <ArrowLeftOutlined size={40}onClick={() => navigate(-1)}/>
                    <div className="title1">{t('notification.titleDetail')}</div>
                    </Flex>
            </BoxContainer>
            <BoxContainer className="shadow">
                <span className="text-lg font-bold text-text-color">{notification?.title}</span>
                <div className="w-full text-sm text-right text-gray-500">{new Date(notification?.notificationDate).toLocaleString()}</div>
                <Divider className="my-4"/>
                <HtmlContent htmlString={notification?.content}/>
            </BoxContainer>
        </Flex>
    )
}

export default DetailNotification;
