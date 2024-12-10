import { Button, Flex, Modal } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import CreateEventPage from "./CreateEventPage";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const ListEvent = () => {
    const [open, setOpen] = useState(false);
    return (<>
        <BoxContainer width='100%'>
            <div className='title1'>Quản lý Sự Kiện</div>
        </BoxContainer>
        <BoxContainer width='100%'>
            <Flex justify='end' align='center'> <Button icon={<PlusOutlined />} onClick={() => setOpen(true)}>Tạo sự kiện mới</Button></Flex>
        </BoxContainer>
        <CreateEventPage open={open} setOpen={setOpen} />
    </>
    )
}
export default ListEvent;
