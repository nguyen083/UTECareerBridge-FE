import { Button, Flex, List, Image, Card, Typography, Dropdown, Menu, message, Modal, Select, Tag, Empty } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import CreateEventPage from "./CreateEventPage";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { FaFilter } from "react-icons/fa";
import './ListEvent.scss';
import { getAllEvent, deleteEvent } from "../../../services/apiService";
import { deleteImageFromCloudinary, deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary";

const { Text, Title } = Typography;


// const eventData = [
//     {
//         eventId: 11,
//         eventTitle: "Hội chợ việc làm cuối năm 2024",
//         eventDescription: "abc",
//         eventDate: "31/12/2024 08:00:00",
//         eventLocation: "Hội trường khu A trường SPKT",
//         eventImage: "https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg",
//         maxParticipants: 1000,
//         currentParticipants: 0,
//         eventType: "SEMINAR",
//         timeline: [
//             { timelineId: 10, timelineTitle: "a", timelineDescription: "a", timelineStart: "08:00:00" },
//             { timelineId: 11, timelineTitle: "b", timelineDescription: "b", timelineStart: "09:00:00" },
//         ],
//     },
//     {
//         eventId: 10,
//         eventTitle: "Ngày Hội Việc Làm Cng Nghệ 2024",
//         eventDescription: "Sự kiện kết nối trực tiếp sinh viên CNTT với các doanh nghiệp hàng đầu, tạo cơ hội việc làm và thực tập",
//         eventDate: "30/09/2024 09:00:00",
//         eventLocation: "Hội Trường Khu A Nhà Trường",
//         eventImage: "https://res.cloudinary.com/utejobhub/image/upload/v1728728442/admin/event/ngay_hoi_viec_lam.jpg",
//         maxParticipants: 900,
//         currentParticipants: 0,
//         eventType: "CAREER_FAIR",
//         timeline: [
//             { timelineId: 7, timelineTitle: "Đăng Ký & Chuẩn Bị", timelineDescription: "Hướng dẫn sinh viên chuẩn bị hồ sơ và CV chuyên nghiệp", timelineStart: "08:00:00" },
//             { timelineId: 8, timelineTitle: "Giới Thiệu Thị Trường Việc Làm", timelineDescription: "Phân tích xu hướng tuyển dụng và kỹ năng cần thiết trong ngành CNTT", timelineStart: "09:00:00" },
//             { timelineId: 9, timelineTitle: "Phiên Phỏng Vấn Trực Tiếp", timelineDescription: "Sinh viên gặp gỡ và phỏng vấn trực tiếp với các nhà tuyển dụng", timelineStart: "10:30:00" },
//         ],
//     },
// ];

const EventList = ({ isFetching, setIsFetching, eventType }) => {
    const [eventData, setEventData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(4); // Kích thước trang mặc định
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState(null);

    const fetchEvent = () => {
        setLoading(true);
        getAllEvent({ page: currentPage, size: pageSize, eventType: eventType }).then((res) => {
            setEventData(res.data.eventResponses);
            setTotalItems(res.data.totalPages); // Giả sử API trả về tổng số mục
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
        setCurrentPage(page - 1); // Ant Design sử dụng chỉ số trang bắt đầu từ 1
        setPageSize(size);
    };

    const handleEditEvent = (id) => {
        setOpen(true);
        setItem({ eventId: id });
    }
    const handleDeleteEvent = (item) => {
        Modal.confirm({
            centered: true,
            title: <span className="f-18">Xác nhận xóa</span>,
            content: <span className="f-16">Bạn có chắc chắn muốn xóa sự kiện này không?</span>,
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setLoading(true);
                deleteEvent(item.eventId).then((res) => {
                    if (res.status === 'OK') {
                        message.success(res.message);
                        deleteImageFromCloudinaryByLink(item.eventImage).then((status) => {
                            status === 200 && message.success("Xóa ảnh thành công!");
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
                locale={{ emptyText: <Empty description="Không tìm thấy sự kiện" /> }}
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
                        className="card-event box_shadow">
                        <List.Item actions={[
                            <Dropdown
                                overlay={
                                    <Menu>
                                        <Menu.Item key="1" onClick={() => { window.open(`/event-detail/${item.eventId}`, '_blank') }}>
                                            <Button icon={<EyeOutlined />} type="link" style={{ color: 'black' }}>Xem chi tiết</Button>
                                        </Menu.Item>
                                        <Menu.Item key="2">
                                            <Button icon={<EditOutlined />} type="link" color="primary" onClick={() => handleEditEvent(item.eventId)}>Chỉnh sửa</Button>
                                        </Menu.Item>
                                        <Menu.Item key="3" onClick={() => { handleDeleteEvent(item) }}>
                                            <Button icon={<DeleteOutlined />} type="link" danger >Xóa</Button>
                                        </Menu.Item>
                                    </Menu>
                                }
                                trigger={['click']}
                            >
                                <MoreOutlined className="f-20 border-1" />
                            </Dropdown>
                        ]}>
                            <List.Item.Meta
                                avatar={<Image preview={false} src={item.eventImage} height={100} />}
                                title={
                                    <Flex justify='space-between'>
                                        <Title className="title-event">{item.eventTitle}</Title>
                                    </Flex>
                                }
                                description={
                                    <>
                                        <Text className="fw-bold">Ngày tổ chức: </Text> <Text>{item.eventDate}</Text>
                                        <br />
                                        <Text className="fw-bold">Địa điểm: </Text> <Text>{item.eventLocation}</Text>
                                        <br />
                                        <Tag color="blue">{item.eventType}</Tag>
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
    const [open, setOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [eventType, setEventType] = useState(null);
    return (<>
        <BoxContainer width='100%' className="box_shadow">
            <div className='title1'>Quản lý Sự Kiện</div>
        </BoxContainer>
        <BoxContainer width='100%' className="box_shadow">
            <Flex gap={20} vertical>
                <Flex justify='end' align='center' gap={10}>
                    <Select
                        size='large'
                        allowClear
                        style={{ width: 200 }}
                        placeholder="Lọc theo loại"
                        onChange={(value) => setEventType(value)}
                        suffixIcon={<FaFilter />}
                    >
                        <Select.Option value="SEMINAR">Hội thảo</Select.Option>
                        <Select.Option value="CONFERENCE">Hội nghị</Select.Option>
                        <Select.Option value="WORKSHOP">Hội thảo chuyên đề</Select.Option>
                        <Select.Option value="CAREER_FAIR">Hội chợ việc làm</Select.Option>
                        <Select.Option value="WEBINAR">Hội thảo trực tuyến</Select.Option>
                        {/* Các loại sự kiện khác có thể thêm vào đây */}
                    </Select>
                    <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>Tạo sự kiện mới</Button>
                </Flex>
                <EventList isFetching={isFetching} setIsFetching={setIsFetching} eventType={eventType} />
            </Flex>
        </BoxContainer>

        <CreateEventPage open={open} setOpen={setOpen} setIsFetching={setIsFetching} />
    </>
    )
}
export default ListEvent;
