import { FireOutlined } from "@ant-design/icons";
import { AiFillThunderbolt } from "react-icons/ai";

import { Tag } from "antd";

const Lable = (type) => {
    switch (type) {
        case 4:
            return <Tag icon={<FireOutlined />} color='volcano'> Hot</Tag>
        case 6:
            return <Tag icon={<AiFillThunderbolt />} color='red'> Gấp</Tag >
        default: return null;
    }
}

export default Lable;