import React from 'react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

const HtmlContent = ({ htmlString }) => (
    <Paragraph ellipsis={{ expandable: true, rows: 20, symbol: "Xem thêm" }}>
        <div className='font-size'
            dangerouslySetInnerHTML={{ __html: htmlString }} />
    </Paragraph>
);

export default HtmlContent;
