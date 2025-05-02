import { Divider, Flex, Skeleton } from "antd";
import BoxContainer from "../BoxContainer";
import { useTranslation } from "react-i18next";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import HtmlContent from "../HtmlContent";
import { useEffect } from "react";
import {
  useDetailNotification,
  useNotificationRead,
} from "../../../composables/notification";
import { useSelector } from "react-redux";
const DetailNotification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const role = useSelector((state) => state.user.role);
  const notificationMutation = useNotificationRead();
  const { data: notification, isLoading } = useDetailNotification(id);
  useEffect(() => {
    notificationMutation.mutate(id);
  }, [id]);
  return (
    <Flex vertical gap={8}>
      <BoxContainer className="shadow">
        <Flex gap={16} align="center">
          <ArrowLeftOutlined
            size={40}
            onClick={() => {
              role === "student"
                ? navigate("/notification")
                : navigate("/employer/notification");
            }}
          />
          <div className="!mb-0 title1">{t("notification.titleDetail")}</div>
        </Flex>
      </BoxContainer>
      <BoxContainer className="shadow">
        {isLoading ? (
          <Skeleton paragraph={{ rows: 4 }} active />
        ) : (
          <>
            <span className="text-lg font-bold text-text-color">
              {notification?.title}
            </span>
            <div className="w-full text-sm text-right text-gray-500">
              {new Date(notification?.notificationDate).toLocaleString()}
            </div>
            <Divider className="my-2" />
            <HtmlContent htmlString={notification?.content} />
            <div className="ml-4">
              {notification?.url && (
                <Link
                  to={notification?.url}
                  target="_blank"
                  className="!underline text-text-color-hover text-base"
                >
                  {t("common.viewDetail")}
                </Link>
              )}
            </div>
          </>
        )}
      </BoxContainer>
    </Flex>
  );
};

export default DetailNotification;
