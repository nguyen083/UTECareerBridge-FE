import React from 'react';

const LineEllipsis = ({ children, line }) => {
    const ellipsisStyle = {
        display: '-webkit-box',
        WebkitLineClamp: line,            // Số dòng tối đa là 2
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',

    };

    return (
        <div style={ellipsisStyle}>
            {children}
        </div>
    );
};

export default LineEllipsis;
