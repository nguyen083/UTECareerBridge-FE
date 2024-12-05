import React, { useState } from 'react';
import { Typography } from 'antd';

const { Paragraph, Link } = Typography;

const HtmlContent = ({ htmlString, className = 'font-size' }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Paragraph
            ellipsis={{
                expandable: true,
                rows: 20,
                symbol: "Xem thêm",
                onExpand: () => setExpanded(true),
                expanded: expanded
            }}
        >
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: htmlString }}
            />{expanded && (
                <div className="mt-2">
                    <Link onClick={() => setExpanded(false)}>
                        Thu gọn
                    </Link>
                </div>
            )}
        </Paragraph>

    );
};

export default HtmlContent;