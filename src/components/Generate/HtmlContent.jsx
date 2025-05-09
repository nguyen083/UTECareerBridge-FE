import { useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
const { Paragraph, Link } = Typography;

const HtmlContent = ({ htmlString}) => {
    const [expanded, setExpanded] = useState(false);
    const { t } = useTranslation();
    return (
        <Paragraph
            ellipsis={{
                expandable: true,
                rows: 100,
                symbol: t('common.seeMore'),
                onExpand: () => setExpanded(true),
                expanded: expanded
            }}
        >
            <div
                dangerouslySetInnerHTML={{ __html: htmlString }}
            />{expanded && (
                <div className="mt-2">
                    <Link onClick={() => setExpanded(false)}>
                        {t('common.collapse')}
                    </Link>
                </div>
            )}
        </Paragraph>

    );
};

export default HtmlContent;