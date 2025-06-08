import { FireOutlined } from "@ant-design/icons";
import { AiFillThunderbolt } from "react-icons/ai";

import { Tag } from "antd";
import { useTranslation } from "react-i18next";

const Lable = (type) => {
    const {t} = useTranslation();
    switch (type) {
        case 4:
            return <Tag className="w-fit text-sm font-normal" icon={<FireOutlined />} color='volcano'> {t('common.hot')}</Tag>
        case 6:
            return <Tag className="w-fit text-sm font-normal" icon={<AiFillThunderbolt />} color='red'> {t('common.urgent')}</Tag >
        default: return null;
    }
}

export default Lable;