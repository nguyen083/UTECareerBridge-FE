import { Button, Flex, List, Image, Card, Typography, Dropdown, Menu, message, Modal, Select, Tag, Empty } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import CreateEventPage from "./CreateEventPage";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { FaFilter } from "react-icons/fa";
import './ListEvent.scss';
import { getAllEvent, deleteEvent } from "../../../services/apiService";
import {  deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary";
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;


const EventList = ({ isFetching, setIsFetching, eventType }) => {
    const { t } = useTranslation();
    const [eventData, setEventData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(4);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(null);

    const fetchEvent = () => {
        setLoading(true);
        getAllEvent({ page: currentPage, size: pageSize, eventType: eventType }).then((res) => {
            setEventData(res.data.eventResponses);
            setTotalItems(res.data.totalPages);
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
            setIsFetching(false);
        });
    }

    useEffect(() => {
        fetchEvent();
    }, [currentPage, pageSize, isFetching === true, eventType]);

    const handlePageChange = (page, size) => {
        setCurrentPage(page - 1);
        setPageSize(size);
    };

    const handleEditEvent = (id) => {
        setOpen(true);
        setItem({ eventId: id });
    }
    const handleDeleteEvent = (item) => {
        Modal.confirm({
            centered: true,
            title: t('admin.event.modal.deleteConfirm.title'),
            content: t('admin.event.modal.deleteConfirm.content'),
            okText: t('admin.event.modal.deleteConfirm.okText'),
            okType: 'danger',
            cancelText: t('common.cancel'),
            onOk() {
                setLoading(true);
                deleteEvent(item.eventId).then((res) => {
                    if (res.status === 'OK') {
                        message.success(res.message);
                        deleteImageFromCloudinaryByLink(item.eventImage).then((status) => {
                           
                            fetchEvent();
                        });
                    } else {
                        message.error(res.message);
                    }
                }).catch((err) => {
                    message.error(err.message);
                }).finally(() => {
                    setLoading(false);
                });
            },
        });
    }

    return (
        <>
            <List
                loading={loading}
                className="list-event"
                split={false}
                locale={{ emptyText: <Empty description={t('admin.event.list.empty')} /> }}
                itemLayout="horizontal"
                dataSource={eventData}
                pagination={{
                    current: currentPage + 1,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    pageSizeOptions: ['4', '8', '16', '32'],
                    total: totalItems * pageSize,
                    onChange: handlePageChange,
                }}
                renderItem={(item) => (
                    <Card
                        size="small"
                        className="shadow card-event">
                        <List.Item
                            className="!py-0"
                            actions={[
                                <Dropdown
                                    key={item.eventId}
                                    overlay={
                                        <Menu>
                                            <Menu.Item key="1" onClick={() => { window.open(`/event-detail/${item.eventId}`, '_blank') }}>
                                                <Button icon={<EyeOutlined />} type="link" style={{ color: 'black' }}>
                                                    {t('admin.event.actions.view')}
                                                </Button>
                                            </Menu.Item>
                                            <Menu.Item key="2">
                                                <Button icon={<EditOutlined />} type="link" color="primary" onClick={() => handleEditEvent(item.eventId)}>
                                                    {t('admin.event.actions.edit')}
                                                </Button>
                                            </Menu.Item>
                                            <Menu.Item key="3" onClick={() => { handleDeleteEvent(item) }}>
                                                <Button icon={<DeleteOutlined />} type="link" danger>
                                                    {t('admin.event.actions.delete')}
                                                </Button>
                                            </Menu.Item>
                                        </Menu>
                                    }
                                    trigger={['click']}
                                >
                                    <MoreOutlined className="text-lg" />
                                </Dropdown>
                            ]}>
                            <List.Item.Meta
                                className="flex"
                                avatar={<Image preview={false} src={item.eventImage} height={110} />}
                                title={
                                    <Flex justify='space-between'>
                                        <Title className="title-event">{item.eventTitle}</Title>
                                    </Flex>
                                }
                                description={
                                    <>
                                    <Text className="font-bold">{t('admin.event.list.eventDate')}: </Text> <Text>{item.eventDate}</Text>
                                    <br />
                                    <Text className="font-bold">{t('admin.event.list.location')}: </Text> <Text>{item.eventLocation}</Text>
                                    <br />
                                    <Tag className="text-sm font-normal w-fit" color="blue">{item.eventType}</Tag>
                                </>
                                }
                            />
                        </List.Item >
                    </Card>
                )}
            />
            <CreateEventPage open={open} setOpen={setOpen} setIsFetching={setIsFetching} item={item} />
        </>
    );
};

const ListEvent = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [eventType, setEventType] = useState(null);
    return (<>
        <BoxContainer width='100%' className="shadow-md">
        <div className='title1'>{t('admin.event.title.manage')}</div>
        </BoxContainer>
        <BoxContainer width='100%' className="shadow-md">
            <Flex gap={20} vertical>
                <Flex justify='end' align='center' gap={10}>
                    <Select
                        size='large'
                        allowClear
                        className="min-w-[200px]"
                        placeholder={t('admin.event.filter.placeholder')}
                        onChange={(value) => setEventType(value)}
                        prefix={<FaFilter color="#1E4F94" style={{ marginRight: 8 }} />}
                    >
                        <Select.Option value="SEMINAR">{t('admin.event.form.fields.eventType.options.seminar')}</Select.Option>
                        <Select.Option value="CONFERENCE">{t('admin.event.form.fields.eventType.options.conference')}</Select.Option>
                        <Select.Option value="WORKSHOP">{t('admin.event.form.fields.eventType.options.workshop')}</Select.Option>
                        <Select.Option value="CAREER_FAIR">{t('admin.event.form.fields.eventType.options.careerFair')}</Select.Option>
                        <Select.Option value="WEBINAR">{t('admin.event.form.fields.eventType.options.webinar')}</Select.Option>
                    </Select>
                    <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>{t('admin.event.actions.create')}</Button>
                </Flex>
                <EventList isFetching={isFetching} setIsFetching={setIsFetching} eventType={eventType} />
            </Flex>
        </BoxContainer>

        <CreateEventPage open={open} setOpen={setOpen} setIsFetching={setIsFetching} />
    </>
    )
}
export default ListEvent;
